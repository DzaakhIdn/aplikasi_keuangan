import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type FeeWaiverInsert =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Insert"];
type FeeWaiverUpdate =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Update"];

type WaiverTarget = {
  id_siswa: string;
  id_jenis_pembayaran: string;
};

function createListQuery() {
  return supabase.from("keringanan_biaya_keuangan").select(`
    id,
    id_siswa,
    id_jenis_pembayaran,
    potongan,
    keterangan,
    created_at,
    updated_at,
    biaya_detail:jenis_pembayaran_keuangan(id, kode_jenis_pembayaran, nama_pembayaran, nominal),
    siswa:kesiswaan(id, nis, nama_lengkap)
  `);
}

export const WaiverRepository = {
  async getAll() {
    const { data, error } = await createListQuery().order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await createListQuery().eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async create(payload: FeeWaiverInsert) {
    const { data, error } = await supabase
      .from("keringanan_biaya_keuangan")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    await syncExistingBills({
      id_siswa: data.id_siswa,
      id_jenis_pembayaran: data.id_jenis_pembayaran,
    });
    return data;
  },

  async update(id: string, payload: FeeWaiverUpdate) {
    const { data, error } = await supabase
      .from("keringanan_biaya_keuangan")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await syncExistingBills({
      id_siswa: data.id_siswa,
      id_jenis_pembayaran: data.id_jenis_pembayaran,
    });
    return data;
  },

  async remove(id: string) {
    const { data: existing, error: existingError } = await supabase
      .from("keringanan_biaya_keuangan")
      .select("id_siswa, id_jenis_pembayaran")
      .eq("id", id)
      .single();

    if (existingError) throw existingError;

    const { error } = await supabase
      .from("keringanan_biaya_keuangan")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await syncExistingBills(existing);
  },
};

async function syncExistingBills(target: WaiverTarget) {
  const { data: waivers, error: waiverError } = await supabase
    .from("keringanan_biaya_keuangan")
    .select("potongan")
    .eq("id_siswa", target.id_siswa)
    .eq("id_jenis_pembayaran", target.id_jenis_pembayaran);

  if (waiverError) throw waiverError;

  const totalPotongan = (waivers ?? []).reduce(
    (total, row) => total + Number(row.potongan ?? 0),
    0,
  );

  const { data: bills, error: billError } = await supabase
    .from("tagihan_siswa_keuangan")
    .select("id, nominal_awal, nominal_dibayar")
    .eq("id_siswa", target.id_siswa)
    .eq("id_jenis_pembayaran", target.id_jenis_pembayaran);

  if (billError) throw billError;

  await Promise.all(
    (bills ?? []).map((bill) => {
      const nominalAwal = Number(bill.nominal_awal ?? 0);
      const nominalDibayar = Number(bill.nominal_dibayar ?? 0);
      const maxPotongan = Math.max(nominalAwal - nominalDibayar, 0);
      const nominalPotongan = Math.min(totalPotongan, maxPotongan);
      const nominalTagihan = nominalAwal - nominalPotongan;
      const sisaTagihan = Math.max(nominalTagihan - nominalDibayar, 0);
      const status =
        sisaTagihan <= 0
          ? "lunas"
          : nominalDibayar > 0
            ? "sebagian"
            : "belum_lunas";

      return supabase
        .from("tagihan_siswa_keuangan")
        .update({
          nominal_potongan: nominalPotongan,
          nominal_tagihan: nominalTagihan,
          sisa_tagihan: sisaTagihan,
          status,
        })
        .eq("id", bill.id)
        .then(({ error }) => {
          if (error) throw error;
        });
    }),
  );
}
