import { CONFIG } from "@/global-config";
import { supabase } from "@/lib/supabase";
import type { Database, Json } from "@/lib/database.types";

export type PaymentStudent = Pick<
  Database["public"]["Tables"]["kesiswaan"]["Row"],
  "id" | "nis" | "nama_lengkap" | "status" | "tahun_ajaran_id" | "kelas_id" | "rombel_id"
>;

export type OutstandingBill = Database["public"]["Tables"]["tagihan_siswa_keuangan"]["Row"] & {
  jenis_pembayaran_keuangan?: {
    id: string;
    kode_jenis_pembayaran: string;
    nama_pembayaran: string;
    tipe_pembayaran: "Bulanan" | "Sekali";
  } | null;
  tahun_ajaran?: {
    id: string;
    tahun_ajaran: string;
  } | null;
};

export type PaymentItemInput = {
  id_tagihan: string;
  nominal_bayar: number;
};

export type DriveUploadResult = {
  fileId: string;
  folderId: string;
  webViewLink: string;
};

export type RecordPaymentInput = {
  id_siswa: string;
  items: PaymentItemInput[];
  metode_pembayaran?: string | null;
  catatan?: string | null;
  id_petugas?: string | null;
  bukti?: DriveUploadResult | null;
};

export const PaymentCounterRepository = {
  async getActiveStudents() {
    const { data, error } = await supabase
      .from("kesiswaan")
      .select("id, nis, nama_lengkap, status, tahun_ajaran_id, kelas_id, rombel_id")
      .eq("status", "aktif")
      .order("nama_lengkap", { ascending: true });

    if (error) throw error;
    return data as PaymentStudent[];
  },

  async syncStudentBills(student: PaymentStudent) {
    const { data, error } = await supabase.rpc("generate_tagihan_siswa_keuangan", {
      p_id_siswa: student.id,
      p_id_tahun_ajaran: null,
      p_mulai_tagihan: null,
    });

    if (error) throw error;
    return data as number;
  },

  async getOutstandingBills(studentId: string) {
    const { data, error } = await supabase
      .from("tagihan_siswa_keuangan")
      .select(
        `
        *,
        jenis_pembayaran_keuangan(
          id,
          kode_jenis_pembayaran,
          nama_pembayaran,
          tipe_pembayaran
        ),
        tahun_ajaran(
          id,
          tahun_ajaran
        )
        `,
      )
      .eq("id_siswa", studentId)
      .in("status", ["belum_lunas", "sebagian"])
      .order("periode_tahun", { ascending: true, nullsFirst: true })
      .order("periode_bulan", { ascending: true, nullsFirst: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as OutstandingBill[];
  },

  async uploadPaymentProof(file: File, student: PaymentStudent, totalBayar: number, bills: OutstandingBill[]) {
    if (!CONFIG.serverUrl) {
      throw new Error(
        "VITE_SERVER_URL belum diisi. Upload Google Drive harus lewat backend/serverless, bukan langsung dari frontend.",
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", student.id);
    formData.append("nis", student.nis);
    formData.append("namaLengkap", student.nama_lengkap);
    formData.append("totalBayar", String(totalBayar));
    formData.append(
      "bills",
      JSON.stringify(
        bills.map((bill) => ({
          id: bill.id,
          periodeBulan: bill.periode_bulan,
          periodeTahun: bill.periode_tahun,
          tahunAjaran: bill.tahun_ajaran?.tahun_ajaran ?? String(bill.periode_tahun ?? "Tanpa Tahun Ajaran"),
          kodeJenisPembayaran: bill.jenis_pembayaran_keuangan?.kode_jenis_pembayaran ?? "TAGIHAN",
          namaJenisPembayaran: bill.jenis_pembayaran_keuangan?.nama_pembayaran ?? bill.id_jenis_pembayaran,
          tipePembayaran: bill.jenis_pembayaran_keuangan?.tipe_pembayaran ?? null,
        })),
      ),
    );

    const response = await fetch(`${CONFIG.serverUrl}/api/google-drive/payment-proof`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Gagal upload bukti pembayaran ke Google Drive.");
    }

    return (await response.json()) as DriveUploadResult;
  },

  async recordPayment(input: RecordPaymentInput) {
    const { data, error } = await supabase.rpc("catat_pembayaran_keuangan", {
      p_id_siswa: input.id_siswa,
      p_items: input.items as unknown as Json,
      p_metode_pembayaran: input.metode_pembayaran ?? null,
      p_catatan: input.catatan ?? null,
      p_id_petugas: input.id_petugas ?? null,
      p_bukti_pembayaran_drive_file_id: input.bukti?.fileId ?? null,
      p_bukti_pembayaran_drive_folder_id: input.bukti?.folderId ?? null,
      p_bukti_pembayaran_url: input.bukti?.webViewLink ?? null,
    });

    if (error) throw error;
    return data as string;
  },
};
