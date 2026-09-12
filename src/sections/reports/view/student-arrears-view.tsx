import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { paths } from "@/routes/paths";
import { fCurrency } from "@/utils/format-number";
import { Iconify } from "@/components/iconify";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { financialReportQueries } from "@/features/financial-report/api/financial-report.queries";

import { ReportSummaryCard } from "../components/report-summary-card";
import { StudentArrearsToolbar } from "../components/student-arrears-toolbar";
import { StudentArrearsOverview } from "../components/student-arrears-overview";
import {
  MONTHS,
  type BillDataRow,
  type StudentArrearsFilters,
  type StudentArrearsSummary,
} from "../components/report-types";

const DEFAULT_FILTERS: StudentArrearsFilters = {
  academicYear: "all",
  paymentType: "all",
  class: "all",
  months: "all",
};

function uniqueStrings(values: (string | null | undefined)[]) {
  return [
    ...new Set(values.filter((value): value is string => !!value)),
  ].sort();
}

function getRombelName(row: BillDataRow) {
  const history = row.siswa?.kesiswaan_history?.find(
    (item) => item.tahun_ajaran_id === row.id_tahun_ajaran,
  );
  return history?.rombel?.rombel ?? row.siswa?.rombel?.rombel ?? "Tanpa rombel";
}

function buildStudentArrears(rows: BillDataRow[]): StudentArrearsSummary[] {
  const groups = rows.reduce<Record<string, StudentArrearsSummary>>(
    (result, row) => {
      if (row.sisa_tagihan <= 0) return result;

      result[row.id_siswa] ??= {
        id: row.id_siswa,
        nis: row.siswa?.nis ?? "-",
        name: row.siswa?.nama_lengkap ?? "Tanpa nama",
        rombel: getRombelName(row),
        total: 0,
        paid: 0,
        remaining: 0,
        percentage: 0,
        bills: [],
      };
      result[row.id_siswa].total += row.nominal_tagihan;
      result[row.id_siswa].paid += row.nominal_dibayar;
      result[row.id_siswa].remaining += row.sisa_tagihan;
      result[row.id_siswa].bills.push(row);
      return result;
    },
    {},
  );

  return Object.values(groups)
    .map((student) => ({
      ...student,
      percentage: student.total
        ? Math.min((student.paid / student.total) * 100, 100)
        : 0,
      bills: student.bills.sort((a, b) =>
        String(a.tanggal_jatuh_tempo ?? a.created_at).localeCompare(
          String(b.tanggal_jatuh_tempo ?? b.created_at),
        ),
      ),
    }))
    .sort((a, b) => b.remaining - a.remaining);
}

export function StudentArrearsView() {
  const { data, isLoading } = useQuery(financialReportQueries.overview());
  const [filters, setFilters] =
    useState<StudentArrearsFilters>(DEFAULT_FILTERS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const bills = data?.bills ?? [];

  const academicYears = uniqueStrings(
    bills.map((row) => row.tahun_ajaran?.tahun_ajaran),
  );
  const paymentTypes = uniqueStrings(
    bills.map((row) => row.jenis_pembayaran_keuangan?.nama_pembayaran),
  );
  const classes = uniqueStrings(bills.map(getRombelName));

  const filteredBills = useMemo(
    () =>
      bills.filter((row) => {
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
        if (filters.class !== "all" && getRombelName(row) !== filters.class)
          return false;
        if (
          filters.months !== "all" &&
          row.periode_bulan !== MONTHS.indexOf(filters.months) + 1
        )
          return false;
        return true;
      }),
    [bills, filters],
  );

  const students = useMemo(
    () => buildStudentArrears(filteredBills),
    [filteredBills],
  );
  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );
  const totalArrears = students.reduce(
    (total, student) => total + student.remaining,
    0,
  );
  const totalBills = students.reduce(
    (total, student) => total + student.bills.length,
    0,
  );

  const handleFilterChange = (
    field: keyof StudentArrearsFilters,
    value: string,
  ) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setSelectedStudentId(undefined);
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
        heading="Data Tunggakan Siswa"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Laporan" },
          { name: "Tunggakan Siswa" },
        ]}
        sx={{ mb: { xs: 3, md: 5 }, "@media print": { display: "none" } }}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="solar:export-bold" />}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              onClick={() => window.print()}
              startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
            >
              Export PDF
            </Button>
          </Box>
        }
      />

      <StudentArrearsToolbar
        filters={filters}
        classes={classes}
        academicYears={academicYears}
        paymentTypes={paymentTypes}
        months={MONTHS}
        onChange={handleFilterChange}
        onReset={() => {
          setFilters(DEFAULT_FILTERS);
          setSelectedStudentId(undefined);
        }}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          mb: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
      >
        <ReportSummaryCard
          title="Total Tunggakan"
          value={fCurrency(totalArrears)}
          caption="Sisa seluruh tagihan belum lunas"
          icon="solar:bill-cross-bold-duotone"
          color="#DC2626"
        />
        <ReportSummaryCard
          title="Santri Menunggak"
          value={String(students.length)}
          caption="Santri unik dengan sisa tagihan"
          icon="solar:users-group-rounded-bold-duotone"
          color="#D97706"
        />
        <ReportSummaryCard
          title="Tagihan Belum Selesai"
          value={String(totalBills)}
          caption="Rincian tagihan yang masih tersisa"
          icon="solar:document-text-bold-duotone"
          color="#0284C7"
        />
      </Box>

      <StudentArrearsOverview
        rows={students}
        loading={isLoading}
        selected={selectedStudent}
        onSelect={(id) =>
          setSelectedStudentId((current) => (current === id ? undefined : id))
        }
      />
    </DashboardContent>
  );
}
