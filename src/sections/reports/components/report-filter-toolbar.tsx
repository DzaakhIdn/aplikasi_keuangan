import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { Iconify } from "@/components/iconify";

import type { FinancialReportFilters } from "./report-types";

type ReportFilterToolbarProps = {
  filters: FinancialReportFilters;
  academicYears: string[];
  paymentTypes: string[];
  cabangs: string[];
  onChange: (field: keyof FinancialReportFilters, value: string) => void;
  onReset: () => void;
};

export function ReportFilterToolbar({
  filters,
  academicYears,
  paymentTypes,
  cabangs,
  onChange,
  onReset,
}: ReportFilterToolbarProps) {
  const canReset = Object.values(filters).some(
    (value) => value && value !== "all",
  );

  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            xl: "1fr 1fr 1fr 180px 180px auto",
          },
          alignItems: "center",
        }}
      >
        <TextField
          select
          label="Cabang"
          value={filters.cabang}
          onChange={(event) => onChange("cabang", event.target.value)}
        >
          <MenuItem value="all">Semua cabang</MenuItem>
          {cabangs.map((cabang) => (
            <MenuItem key={cabang} value={cabang}>
              {cabang}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Tahun Ajaran"
          value={filters.academicYear}
          onChange={(event) => onChange("academicYear", event.target.value)}
        >
          <MenuItem value="all">Semua tahun ajaran</MenuItem>
          {academicYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Jenis Pembayaran"
          value={filters.paymentType}
          onChange={(event) => onChange("paymentType", event.target.value)}
        >
          <MenuItem value="all">Semua jenis pembayaran</MenuItem>
          {paymentTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Dari Tanggal"
          type="date"
          value={filters.startDate}
          onChange={(event) => onChange("startDate", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Sampai Tanggal"
          type="date"
          value={filters.endDate}
          onChange={(event) => onChange("endDate", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: { xl: "flex-end" },
          }}
        >
          {canReset && (
            <Button
              color="error"
              onClick={onReset}
              startIcon={<Iconify icon="solar:restart-bold" />}
            >
              Reset
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
