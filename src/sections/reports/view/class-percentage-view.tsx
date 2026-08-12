import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/paths";
import Button from "@mui/material/Button";
import { ClassPercentageToolbar } from "../components/class-percentage-toolbar";

export function ClassPercentageView() {
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
        heading="Presentase Per-Kelas"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Laporan" },
          { name: "Presentase Kelas" },
        ]}
        sx={{ mb: { xs: 3, md: 5 }, "@media print": { display: "none" } }}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Export PDF
          </Button>
        }
      />

      <ClassPercentageToolbar
        filters={}
        academicYears={academicYears}
        paymentTypes={paymentTypes}
        onChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
    </DashboardContent>
  );
}
