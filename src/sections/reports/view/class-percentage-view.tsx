import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { paths } from "@/routes/paths";
import { Iconify } from "@/components/iconify";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { financialReportQueries } from "@/features/financial-report/api/financial-report.queries";

import { GraphClassSummary } from "../components/graph-class-summary";
import { ClassPercentageToolbar } from "../components/class-percentage-toolbar";
import { ClassLeaderboardTable } from "../components/class-leaderboard-table";
import type {
  BillDataRow,
  ClassPaymentSummary,
  ClassPercentageFilters,
} from "../components/report-types";

const DEFAULT_FILTERS: ClassPercentageFilters = {
  academicYear: "all",
  paymentType: "all",
  class: "all",
};

function uniqueStrings(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((value): value is string => !!value))].sort();
}

function getRombelName(row: BillDataRow) {
  return row.siswa?.rombel?.rombel ?? "Tanpa rombel";
}

function buildClassSummary(rows: BillDataRow[]): ClassPaymentSummary[] {
  const groups = rows.reduce<
    Record<string, { total: number; paid: number; remaining: number; students: Record<string, number> }>
  >((result, row) => {
    const name = getRombelName(row);
    result[name] ??= { total: 0, paid: 0, remaining: 0, students: {} };
    result[name].total += row.nominal_tagihan;
    result[name].paid += row.nominal_dibayar;
    result[name].remaining += row.sisa_tagihan;
    result[name].students[row.id_siswa] =
      (result[name].students[row.id_siswa] ?? 0) + row.sisa_tagihan;
    return result;
  }, {});

  return Object.entries(groups)
    .map(([name, group]) => {
      const balances = Object.values(group.students);
      const paidStudents = balances.filter((remaining) => remaining <= 0).length;

      return {
        name,
        total: group.total,
        paid: group.paid,
        remaining: group.remaining,
        paidStudents,
        unpaidStudents: balances.length - paidStudents,
        totalStudents: balances.length,
        percentage: group.total ? Math.min((group.paid / group.total) * 100, 100) : 0,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

export function ClassPercentageView() {
  const { data, isLoading } = useQuery(financialReportQueries.overview());
  const [filters, setFilters] = useState<ClassPercentageFilters>(DEFAULT_FILTERS);
  const bills = data?.bills ?? [];

  const academicYears = uniqueStrings(bills.map((row) => row.tahun_ajaran?.tahun_ajaran));
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
        if (filters.class !== "all" && getRombelName(row) !== filters.class) return false;
        return true;
      }),
    [bills, filters],
  );

  const classSummary = useMemo(() => buildClassSummary(filteredBills), [filteredBills]);

  const handleFilterChange = (field: keyof ClassPercentageFilters, value: string) => {
    setFilters((current) => ({ ...current, [field]: value }));
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
        heading="Persentase Per Kelas"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Laporan" },
          { name: "Persentase Kelas" },
        ]}
        sx={{ mb: { xs: 3, md: 5 }, "@media print": { display: "none" } }}
        action={
          <Button
            variant="contained"
            onClick={() => window.print()}
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Export PDF
          </Button>
        }
      />

      <ClassPercentageToolbar
        filters={filters}
        academicYears={academicYears}
        paymentTypes={paymentTypes}
        classes={classes}
        onChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <GraphClassSummary
        title="Grafik Persentase Per Kelas"
        subheader="Jumlah santri lunas dan belum lunas berdasarkan tagihan"
        chart={{
          colors: ["#16A34A", "#EF4444"],
          categories: classSummary.map((item) => item.name),
          series: [
            {
              name: "Status Pembayaran",
              data: [
                {
                  name: "Sudah Bayar",
                  data: classSummary.map((item) => item.paidStudents),
                },
                {
                  name: "Belum Bayar",
                  data: classSummary.map((item) => item.unpaidStudents),
                },
              ],
            },
          ],
        }}
      />

      <Box sx={{ mt: 3 }}>
        <ClassLeaderboardTable rows={classSummary} loading={isLoading} />
      </Box>
    </DashboardContent>
  );
}
