import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type PaymentInsert =
  Database["public"]["Tables"]["jenis_pembayaran_keuangan"]["Insert"];
type PaymentUpdate =
  Database["public"]["Tables"]["jenis_pembayaran_keuangan"]["Update"];

export const PaymentRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("jenis_pembayaran_keuangan")
      .select(
        `
        id,
        kode_jenis_pembayaran,
        nama_pembayaran,
        id_tahun_ajaran,
        tipe_pembayaran,
        nominal,
        tanggal_jatuh_tempo,
        status,
        created_at,
        updated_at
        `,
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("jenis_pembayaran_keuangan")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload: PaymentInsert) {
    const { data, error } = await supabase
      .from("jenis_pembayaran_keuangan")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, payload: PaymentUpdate) {
    const { data, error } = await supabase
      .from("jenis_pembayaran_keuangan")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("jenis_pembayaran_keuangan")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
