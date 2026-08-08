import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type FeeWaiverInsert =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Insert"];
type FeeWaiverUpdate =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Update"];

function createListQuery() {
  return supabase.from("keringanan_biaya_keuangan").select(`
    id,
    id_siswa,
    id_jenis_pembayaran,
    potongan,
    keterangan,
    created_at,
    biaya_detail:jenis_pembayaran_keuangan(id, nama_pembayaran, nominal),
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
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("keringanan_biaya_keuangan")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
