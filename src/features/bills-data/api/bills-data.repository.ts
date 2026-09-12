import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type BillStatus =
  Database["public"]["Tables"]["tagihan_siswa_keuangan"]["Row"]["status"];

export type BillDataRow =
  Database["public"]["Tables"]["tagihan_siswa_keuangan"]["Row"] & {
    siswa?: {
      id: string;
      nis: string;
      nama_lengkap: string;
      kelas_id?: string | null;
      rombel_id?: string | null;
      cabang_id?: string | null;
      cabang?: {
        id: string;
        cabang: string;
      } | null;
      kelas?: {
        nama_kelas: string;
      } | null;
      rombel?: {
        rombel: string;
        kelas: string;
      } | null;
      kesiswaan_history?: {
        tahun_ajaran_id: string;
        status: string | null;
        kelas?: {
          nama_kelas: string;
        } | null;
        rombel?: {
          rombel: string;
          kelas: string;
        } | null;
      }[];
      kesiswaan_wali?: {
        hubungan: string;
        is_primary: boolean | null;
        wali_santri?: {
          id: string;
          nama_ayah: string | null;
          no_hp_ayah: string | null;
          nama_ibu: string | null;
          no_hp_ibu: string | null;
          nama_wali: string | null;
          no_hp_wali: string | null;
        } | null;
      }[];
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
        siswa:kesiswaan(
          id,
          nis,
          nama_lengkap,
          kelas_id,
          rombel_id,
          cabang_id,
          cabang:cabang(id, cabang),
          kelas:kelas(nama_kelas),
          rombel:rombel(rombel, kelas),
          kesiswaan_history(
            tahun_ajaran_id,
            status,
            kelas:kelas(nama_kelas),
            rombel:rombel(rombel, kelas)
          ),
          kesiswaan_wali(
            hubungan,
            is_primary,
            wali_santri(
              id,
              nama_ayah,
              no_hp_ayah,
              nama_ibu,
              no_hp_ibu,
              nama_wali,
              no_hp_wali
            )
          )
        ),
        jenis_pembayaran_keuangan(kode_jenis_pembayaran, nama_pembayaran, tipe_pembayaran),
        tahun_ajaran(tahun_ajaran)
        `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as unknown as BillDataRow[];
  },
};
