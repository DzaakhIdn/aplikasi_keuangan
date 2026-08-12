import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { Iconify } from "@/components/iconify";

import type { ClassPercentageFilters } from "./report-types";

type ReportFilterToolbarProps = {
  filters: ClassPercentageFilters;
  academicYears: string[];
  paymentTypes: string[];
  onChange: (field: keyof ClassPercentageFilters, value: string) => void;
  onReset: () => void;
};

export function ClassPercentageToolbar({
  filters,
  academicYears,
  paymentTypes,
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
            xl: "1fr 1fr 180px 180px auto",
          },
          alignItems: "center",
        }}
      >
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
          select
          label="Kelas"
          value={filters.class}
          onChange={(event) => onChange("paymentType", event.target.value)}
        >
          <MenuItem value="all">Semua Kelas</MenuItem>
          {paymentTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

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
