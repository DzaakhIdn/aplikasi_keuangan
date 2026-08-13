import { useCallback, type ChangeEvent } from "react";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

interface TrackTableToolbarProps {
  filters: any;
  academicYears?: { id: string; tahun_ajaran: string }[];
  onResetPage: () => void;
}

export function PaymentTableToolbar({
  filters,
  academicYears,
  onResetPage,
}: TrackTableToolbarProps) {

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: any) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterAcademicYear = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ academicYear: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: "flex",
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-end", md: "center" },
        }}
      >
        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {academicYears && (
            <TextField
              select
              label="Tahun Ajaran"
              value={currentFilters.academicYear ?? "all"}
              onChange={handleFilterAcademicYear}
              sx={{ minWidth: { xs: 1, md: 220 } }}
            >
              <MenuItem value="all">Semua tahun ajaran</MenuItem>
              {academicYears.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.tahun_ajaran}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            fullWidth
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
