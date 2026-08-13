import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { fCurrency } from "@/utils/format-number";
import { Scrollbar } from "@/components/scrollbar";
import { TableHeadCustom, TableNoData } from "@/components/table";

import type { ClassPaymentSummary } from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";

const TABLE_HEAD = [
  { id: "rank", label: "RANK", width: 80 },
  { id: "class", label: "ROMBEL", width: 240 },
  { id: "target", label: "TARGET TAGIHAN", width: 190 },
  { id: "paid", label: "TOTAL TERBAYAR", width: 190 },
  { id: "percentage", label: "PERSENTASE", width: 260 },
];

function percentageColor(percentage: number) {
  return `hsl(${Math.round(Math.min(Math.max(percentage, 0), 100) * 1.2)} 72% 42%)`;
}

export function ClassLeaderboardTable({
  rows,
  loading,
}: {
  rows: ClassPaymentSummary[];
  loading: boolean;
}) {
  return (
    <Card sx={{ minWidth: 0 }}>
      <Stack
        sx={{
          m: 3,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ReportSectionIcon
          icon="solar:cup-star-bold-duotone"
          color="warning.main"
        />
        <Box>
          <Typography variant="h5">Leaderboard Pembayaran Per-Rombel</Typography>
          <Typography variant="body1">Peringkat persentase pembayaran rombel</Typography>
        </Box>
      </Stack>

      <Scrollbar sx={{ width: 1 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHeadCustom headCells={TABLE_HEAD} />
          <TableBody>
            {rows.map((row, index) => {
              const color = percentageColor(row.percentage);

              return (
                <TableRow key={row.name} hover>
                  <TableCell>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        fontWeight: 700,
                        color: index < 3 ? "warning.darker" : "text.secondary",
                        bgcolor:
                          index < 3 ? "warning.lighter" : "background.neutral",
                      }}
                    >
                      {index + 1}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Kelas {row.name}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {row.totalStudents} santri
                    </Typography>
                  </TableCell>
                  <TableCell>{fCurrency(row.total)}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {fCurrency(row.paid)}
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 140,
                          height: 9,
                          borderRadius: 999,
                          bgcolor: "background.neutral",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${row.percentage}%`,
                            height: 1,
                            bgcolor: color,
                            borderRadius: 999,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ minWidth: 52, color }}
                      >
                        {row.percentage.toFixed(1)}%
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableNoData notFound={!loading && !rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}
