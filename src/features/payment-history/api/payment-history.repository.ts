import { supabase } from "@/lib/supabase";

export type PaymentHistoryStatus = "paid" | "canceled";

export type PaymentHistoryRow = {
  id: string;
  invoiceNumber: string;
  createDate: string;
  dueDate: string;
  totalAmount: number;
  sent: string;
  status: PaymentHistoryStatus;
  proofUrl: string | null;
  invoiceTo: {
    name: string;
    company: string;
    phoneNumber: string;
  };
  items: { service: string }[];
};

type RawPaymentHistory = {
  id: string;
  nomor_transaksi: string;
  tanggal_bayar: string;
  total_bayar: number;
  status_pembayaran: "lunas" | "batal";
  bukti_pembayaran_url: string | null;
  siswa?: {
    nis: string;
    nama_lengkap: string;
  } | null;
  pembayaran_detail_keuangan?: {
    nominal_bayar: number;
    tagihan_siswa_keuangan?: {
      tanggal_jatuh_tempo: string | null;
      periode_bulan: number | null;
      periode_tahun: number | null;
      jenis_pembayaran_keuangan?: {
        kode_jenis_pembayaran: string;
        nama_pembayaran: string;
      } | null;
    } | null;
  }[];
};

function mapPaymentHistory(row: RawPaymentHistory): PaymentHistoryRow {
  const details = row.pembayaran_detail_keuangan ?? [];
  const services = details.map((detail) => {
    const payment = detail.tagihan_siswa_keuangan?.jenis_pembayaran_keuangan;
    return payment?.nama_pembayaran ?? "Pembayaran";
  });
  const uniqueServices = [...new Set(services)];
  const firstDueDate = details.find((detail) => detail.tagihan_siswa_keuangan?.tanggal_jatuh_tempo)
    ?.tagihan_siswa_keuangan?.tanggal_jatuh_tempo;

  return {
    id: row.id,
    invoiceNumber: row.nomor_transaksi,
    createDate: row.tanggal_bayar,
    dueDate: firstDueDate ?? row.tanggal_bayar,
    totalAmount: row.total_bayar,
    sent: uniqueServices.join(", ") || "-",
    status: row.status_pembayaran === "batal" ? "canceled" : "paid",
    proofUrl: row.bukti_pembayaran_url,
    invoiceTo: {
      name: row.siswa?.nama_lengkap ?? "Tanpa nama",
      company: row.siswa?.nis ?? "-",
      phoneNumber: row.siswa?.nis ?? "-",
    },
    items: uniqueServices.map((service) => ({ service })),
  };
}

export const PaymentHistoryRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("pembayaran_keuangan")
      .select(
        `
        id,
        nomor_transaksi,
        tanggal_bayar,
        total_bayar,
        status_pembayaran,
        bukti_pembayaran_url,
        siswa:kesiswaan(nis, nama_lengkap),
        pembayaran_detail_keuangan(
          nominal_bayar,
          tagihan_siswa_keuangan(
            tanggal_jatuh_tempo,
            periode_bulan,
            periode_tahun,
            jenis_pembayaran_keuangan(kode_jenis_pembayaran, nama_pembayaran)
          )
        )
        `,
      )
      .in("status_pembayaran", ["lunas", "batal"])
      .order("tanggal_bayar", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as unknown as RawPaymentHistory[]).map(mapPaymentHistory);
  },
};
