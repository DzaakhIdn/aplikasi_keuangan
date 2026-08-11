import { supabase } from "@/lib/supabase";
import type { BillDataRow } from "@/features/bills-data/api/bills-data.repository";
import type { PaymentHistoryRow } from "@/features/payment-history/api/payment-history.repository";

type RawPayment = {
  id: string;
  nomor_transaksi: string;
  tanggal_bayar: string;
  total_bayar: number;
  status_pembayaran: "lunas" | "batal";
  metode_pembayaran: string | null;
  bukti_pembayaran_url: string | null;
  siswa?: {
    nis: string;
    nama_lengkap: string;
    kelas_id: string | null;
    rombel_id: string | null;
  } | null;
  pembayaran_detail_keuangan?: {
    nominal_bayar: number;
    tagihan_siswa_keuangan?: {
      tahun_ajaran?: {
        tahun_ajaran: string;
      } | null;
      jenis_pembayaran_keuangan?: {
        kode_jenis_pembayaran: string;
        nama_pembayaran: string;
      } | null;
    } | null;
  }[];
};

export type FinancialPaymentRow = PaymentHistoryRow & {
  academicYears: string[];
  paymentTypes: string[];
  paymentMethod: string | null;
};

function mapPayment(row: RawPayment): FinancialPaymentRow {
  const services = [
    ...new Set(
      (row.pembayaran_detail_keuangan ?? []).map(
        (detail) => detail.tagihan_siswa_keuangan?.jenis_pembayaran_keuangan?.nama_pembayaran ?? "Pembayaran",
      ),
    ),
  ];
  const academicYears = [
    ...new Set(
      (row.pembayaran_detail_keuangan ?? [])
        .map((detail) => detail.tagihan_siswa_keuangan?.tahun_ajaran?.tahun_ajaran)
        .filter((year): year is string => !!year),
    ),
  ];

  return {
    id: row.id,
    invoiceNumber: row.nomor_transaksi,
    createDate: row.tanggal_bayar,
    dueDate: row.tanggal_bayar,
    totalAmount: row.total_bayar,
    sent: services.join(", ") || "-",
    status: row.status_pembayaran === "batal" ? "canceled" : "paid",
    proofUrl: row.bukti_pembayaran_url,
    academicYears,
    paymentTypes: services,
    paymentMethod: row.metode_pembayaran,
    invoiceTo: {
      name: row.siswa?.nama_lengkap ?? "Tanpa nama",
      company: row.siswa?.nis ?? "-",
      phoneNumber: row.siswa?.nis ?? "-",
    },
    items: services.map((service) => ({ service })),
  };
}

export const FinancialReportRepository = {
  async getOverview() {
    const [payments, bills] = await Promise.all([
      supabase
        .from("pembayaran_keuangan")
        .select(
          `
          id,
          nomor_transaksi,
          tanggal_bayar,
          total_bayar,
          status_pembayaran,
          metode_pembayaran,
          bukti_pembayaran_url,
          siswa:kesiswaan(nis, nama_lengkap, kelas_id, rombel_id),
          pembayaran_detail_keuangan(
            nominal_bayar,
            tagihan_siswa_keuangan(
              tahun_ajaran(tahun_ajaran),
              jenis_pembayaran_keuangan(kode_jenis_pembayaran, nama_pembayaran)
            )
          )
          `,
        )
        .order("tanggal_bayar", { ascending: false }),
      supabase
        .from("tagihan_siswa_keuangan")
        .select(
          `
          *,
          siswa:kesiswaan(nis, nama_lengkap, kelas_id, rombel_id),
          jenis_pembayaran_keuangan(kode_jenis_pembayaran, nama_pembayaran, tipe_pembayaran),
          tahun_ajaran(tahun_ajaran)
          `,
        )
        .order("created_at", { ascending: false }),
    ]);

    if (payments.error) throw payments.error;
    if (bills.error) throw bills.error;

    return {
      payments: ((payments.data ?? []) as unknown as RawPayment[]).map(mapPayment),
      bills: (bills.data ?? []) as unknown as BillDataRow[],
    };
  },
};
