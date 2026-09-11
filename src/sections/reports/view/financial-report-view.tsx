import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";

import { paths } from "@/routes/paths";
import { fDate } from "@/utils/format-time";
import { fCurrency } from "@/utils/format-number";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { financialReportQueries } from "@/features/financial-report/api/financial-report.queries";

import { ClassRecapTable } from "../components/class-recap-table";
import { ReportSummaryCard } from "../components/report-summary-card";
import { ArrearsReportTable } from "../components/arrears-report-table";
import { ReportFilterToolbar } from "../components/report-filter-toolbar";
import { TransactionReportTable } from "../components/transaction-report-table";
import type {
  BillDataRow,
  ClassBreakdown,
  FinancialPaymentRow,
  FinancialReportFilters,
  PaymentBreakdown,
} from "../components/report-types";
import Button from "@mui/material/Button";
import { Iconify } from "@/components/iconify";
import { ChartColumnSingle } from "../components/chart-column-single";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { PaymentSummary } from "../components/payment-summary-report";

// ----------------------------------------------------------------------

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const DEFAULT_FILTERS: FinancialReportFilters = {
  academicYear: "all",
  paymentType: "all",
  cabang: "all",
  startDate: "",
  endDate: "",
};

function uniqueStrings(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((value): value is string => !!value))];
}

function getCabangId(row: BillDataRow) {
  return row.siswa?.cabang_id ?? row.siswa?.cabang?.id ?? "";
}

function getCabangName(row: BillDataRow) {
  return (
    row.siswa?.cabang?.nama_cabang ?? row.siswa?.cabang_id ?? "Tanpa cabang"
  );
}

function isWithinDate(date: string, startDate: string, endDate: string) {
  const value = new Date(date).getTime();
  if (startDate && value < new Date(`${startDate}T00:00:00`).getTime())
    return false;
  if (endDate && value > new Date(`${endDate}T23:59:59`).getTime())
    return false;
  return true;
}

function filterBills(rows: BillDataRow[], filters: FinancialReportFilters) {
  return rows.filter((row) => {
    if (
      filters.academicYear !== "all" &&
      row.tahun_ajaran?.tahun_ajaran !== filters.academicYear
    )
      return false;
    if (
      filters.paymentType !== "all" &&
      row.jenis_pembayaran_keuangan?.nama_pembayaran !== filters.paymentType
    )
      return false;
    if (filters.cabang !== "all" && getCabangId(row) !== filters.cabang)
      return false;
    if (
      (filters.startDate || filters.endDate) &&
      !isWithinDate(row.created_at, filters.startDate, filters.endDate)
    )
      return false;
    return true;
  });
}

function filterPayments(
  rows: FinancialPaymentRow[],
  filters: FinancialReportFilters,
) {
  return rows.filter((row) => {
    if (
      filters.academicYear !== "all" &&
      !row.academicYears.includes(filters.academicYear)
    )
      return false;
    if (
      filters.paymentType !== "all" &&
      !row.paymentTypes.includes(filters.paymentType)
    )
      return false;
    return isWithinDate(row.createDate, filters.startDate, filters.endDate);
  });
}

function formatClassName(row: BillDataRow) {
  const history = row.siswa?.kesiswaan_history?.find(
    (item) => item.tahun_ajaran_id === row.id_tahun_ajaran,
  );
  const kelas =
    history?.kelas?.nama_kelas ?? row.siswa?.kelas?.nama_kelas ?? "Tanpa kelas";
  const rombel =
    history?.rombel?.rombel ?? row.siswa?.rombel?.rombel ?? "Tanpa rombel";
  return `${kelas} / ${rombel}`;
}

function buildPaymentBreakdown(rows: BillDataRow[]): PaymentBreakdown[] {
  return Object.values(
    rows.reduce<Record<string, PaymentBreakdown>>((result, row) => {
      const name =
        row.jenis_pembayaran_keuangan?.nama_pembayaran ?? "Tanpa jenis";
      result[name] ??= { name, total: 0, paid: 0, remaining: 0 };
      result[name].total += row.nominal_tagihan;
      result[name].paid += row.nominal_dibayar;
      result[name].remaining += row.sisa_tagihan;
      return result;
    }, {}),
  ).sort((a, b) => b.total - a.total);
}

function buildClassBreakdown(rows: BillDataRow[]): ClassBreakdown[] {
  return Object.values(
    rows.reduce<Record<string, ClassBreakdown>>((result, row) => {
      const name = formatClassName(row);
      result[name] ??= { name, total: 0, paid: 0, remaining: 0 };
      result[name].total += row.nominal_tagihan;
      result[name].paid += row.nominal_dibayar;
      result[name].remaining += row.sisa_tagihan;
      return result;
    }, {}),
  ).sort((a, b) => b.remaining - a.remaining);
}

function buildStudentStatusSummary(rows: BillDataRow[]) {
  const labels: Record<string, string> = {
    pending: "Pending",
    belum_lunas: "Belum lunas",
    sebagian: "Sebagian",
    lunas: "Lunas",
    dibebaskan: "Dibebaskan",
    dibatalkan: "Dibatalkan",
  };
  const colors: Record<string, string> = {
    lunas: "#16A34A",
    sebagian: "#F59E0B",
    pending: "#D97706",
    belum_lunas: "#EF4444",
    dibebaskan: "#0284C7",
    dibatalkan: "#64748B",
  };
  const order = [
    "lunas",
    "sebagian",
    "pending",
    "belum_lunas",
    "dibebaskan",
    "dibatalkan",
  ];
  const studentsByStatus = rows.reduce<Record<string, Set<string>>>(
    (result, row) => {
      result[row.status] ??= new Set();
      result[row.status].add(row.id_siswa);
      return result;
    },
    {},
  );

  const series = order
    .map((status) => ({
      label: labels[status],
      value: studentsByStatus[status]?.size ?? 0,
      color: colors[status],
    }))
    .filter((item) => item.value > 0);

  return series.length ? series : [{ label: "Tidak ada data", value: 0 }];
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ----------------------------------------------------------------------

export function FinancialReportView() {
  const { data, isLoading } = useQuery(financialReportQueries.overview());
  const [filters, setFilters] =
    useState<FinancialReportFilters>(DEFAULT_FILTERS);

  const payments = data?.payments ?? [];
  const bills = data?.bills ?? [];
  const academicYears = uniqueStrings(
    bills.map((row) => row.tahun_ajaran?.tahun_ajaran),
  );
  const paymentTypes = uniqueStrings(
    bills.map((row) => row.jenis_pembayaran_keuangan?.nama_pembayaran),
  );
  const cabangs = useMemo(() => {
    const map = new Map<string, string>();
    bills.forEach((row) => {
      const id = getCabangId(row);
      if (!id) return;
      if (!map.has(id)) map.set(id, getCabangName(row));
    });
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bills]);

  const filteredBills = useMemo(
    () => filterBills(bills, filters),
    [bills, filters],
  );
  const filteredPayments = useMemo(
    () => filterPayments(payments, filters),
    [filters, payments],
  );
  const successfulPayments = filteredPayments.filter(
    (row) => row.status === "paid",
  );
  const arrearsRows = filteredBills.filter(
    (row) =>
      row.sisa_tagihan > 0 &&
      ["pending", "belum_lunas", "sebagian"].includes(row.status),
  );

  const totalIncome = successfulPayments.reduce(
    (total, row) => total + row.totalAmount,
    0,
  );
  const totalBills = filteredBills.reduce(
    (total, row) => total + row.nominal_tagihan,
    0,
  );
  const totalArrears = arrearsRows.reduce(
    (total, row) => total + row.sisa_tagihan,
    0,
  );
  const pendingAmount = filteredBills
    .filter((row) => row.status === "pending")
    .reduce((total, row) => total + row.nominal_tagihan, 0);
  const unpaidStudents = new Set(arrearsRows.map((row) => row.id_siswa)).size;

  const monthlyIncome = MONTHS.map((month, index) => ({
    month,
    value: successfulPayments
      .filter((row) => new Date(row.createDate).getMonth() === index)
      .reduce((total, row) => total + row.totalAmount, 0),
  }));
  const paymentBreakdown = buildPaymentBreakdown(filteredBills);
  const classBreakdown = buildClassBreakdown(filteredBills);
  const studentStatusSummary = buildStudentStatusSummary(filteredBills);

  const handleFilterChange = (
    field: keyof FinancialReportFilters,
    value: string,
  ) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleExport = () => {
    downloadCsv("laporan-keuangan.csv", [
      [
        "No Transaksi",
        "Tanggal",
        "Santri",
        "NIS",
        "Jenis Pembayaran",
        "Metode",
        "Total",
        "Status",
        "Bukti",
      ],
      ...filteredPayments.map((row) => [
        row.invoiceNumber,
        fDate(row.createDate),
        row.invoiceTo.name,
        row.invoiceTo.company,
        row.sent,
        row.paymentMethod ?? "-",
        String(row.totalAmount),
        row.status === "paid" ? "Lunas" : "Batal",
        row.proofUrl ?? "",
      ]),
    ]);
  };

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        borderTop: "solid 1px rgba(145, 158, 171, 0.12)",
        pt: 3,
        "@media print": { px: 0, pt: 0 },
      }}
    >
      <CustomBreadcrumbs
        heading="Laporan Keuangan"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Laporan" },
          { name: "Laporan Keuangan" },
        ]}
        sx={{ mb: { xs: 3, md: 5 }, "@media print": { display: "none" } }}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => {}}
              variant="outlined"
              startIcon={<Iconify icon="solar:export-bold" />}
            >
              Export Excel
            </Button>
            <Button
              onClick={() => {}}
              variant="contained"
              startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
            >
              Export PDF
            </Button>
          </Box>
        }
      />

      <Box sx={{ "@media print": { display: "none" } }}>
        <ReportFilterToolbar
          filters={filters}
          academicYears={academicYears}
          paymentTypes={paymentTypes}
          cabangs={cabangs}
          onChange={handleFilterChange}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          mb: 3,
        }}
      >
        <ReportSummaryCard
          title="Total Uang Masuk"
          value={fCurrency(totalIncome)}
          caption={`${successfulPayments.length} transaksi berhasil`}
          icon="solar:wallet-money-bold-duotone"
          color="#16A34A"
        />
        <ReportSummaryCard
          title="Total Tagihan"
          value={fCurrency(totalBills)}
          caption={`${filteredBills.length} tagihan tercatat`}
          icon="solar:bill-list-bold-duotone"
          color="#0284C7"
        />
        <ReportSummaryCard
          title="Total Tunggakan"
          value={fCurrency(totalArrears)}
          caption={`${unpaidStudents} santri belum lunas`}
          icon="solar:bill-cross-bold-duotone"
          color="#DC2626"
        />
        <ReportSummaryCard
          title="Pending Verifikasi"
          value={fCurrency(pendingAmount)}
          caption="Menunggu pemeriksaan bendahara"
          icon="solar:sort-by-time-bold-duotone"
          color="#D97706"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.55fr) minmax(320px, 0.75fr)",
          },
          mb: 3,
          alignItems: "stretch",
        }}
      >
        <Card>
          <CardHeader
            title={"Analisa Bulanan"}
            subheader={"Analisa bulanan"}
            sx={{ mb: 3 }}
          />
          <ChartColumnSingle
            chart={{
              categories: MONTHS,
              series: [
                {
                  name: "Pendapatan",
                  data: monthlyIncome.map((item) => item.value),
                },
              ],
            }}
          />
        </Card>
        <PaymentSummary
          title="Status Pembayaran Santri"
          subheader="Jumlah santri berdasarkan status tagihan"
          chart={{
            colors: studentStatusSummary.map((item) => item.color),
            series: studentStatusSummary,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.35fr) minmax(360px, 0.65fr)",
          },
          mb: 3,
          alignItems: "start",
        }}
      >
        <TransactionReportTable rows={filteredPayments} loading={isLoading} />
        <ClassRecapTable rows={classBreakdown} loading={isLoading} />
      </Box>

      <ArrearsReportTable rows={arrearsRows} loading={isLoading} />
    </DashboardContent>
  );
}
