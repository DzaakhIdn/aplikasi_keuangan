import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type BillStatus = Database["public"]["Tables"]["tagihan_siswa_keuangan"]["Row"]["status"];

export type BillDataRow = Database["public"]["Tables"]["tagihan_siswa_keuangan"]["Row"] & {
  siswa?: {
    nis: string;
    nama_lengkap: string;
    kelas_id?: string | null;
    rombel_id?: string | null;
  } | null;
  jenis_pembayaran_keuangan?: {
    kode_jenis_pembayaran: string;
    nama_pembayaran: string;
    tipe_pembayaran: "Bulanan" | "Sekali";
  } | null;
  tahun_ajaran?: {
    tahun_ajaran: string;
  } | null;
};

export const BillsDataRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("tagihan_siswa_keuangan")
      .select(
        `
        *,
        siswa:kesiswaan(nis, nama_lengkap, kelas_id, rombel_id),
        jenis_pembayaran_keuangan(kode_jenis_pembayaran, nama_pembayaran, tipe_pembayaran),
        tahun_ajaran(tahun_ajaran)
        `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as unknown as BillDataRow[];
  },
};
