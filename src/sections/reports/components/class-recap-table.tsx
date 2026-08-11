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
import { TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from "@/components/table";

import type { ClassBreakdown } from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";

const TABLE_HEAD = [
  { id: "class", label: "KELAS / ROMBEL", width: 240 },
  { id: "bill", label: "TAGIHAN", width: 150 },
  { id: "paid", label: "DIBAYAR", width: 150 },
  { id: "remaining", label: "TUNGGAKAN", width: 150 },
  { id: "percent", label: "PERSENTASE", width: 220 },
];

export function ClassRecapTable({ rows, loading }: { rows: ClassBreakdown[]; loading: boolean }) {
  const table = useTable({ defaultRowsPerPage: 5 });
  const visibleRows = rows.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage);

  return (
    <Card sx={{ minWidth: 0 }}>
      <CardHeader
        title="Rekap Kelas / Rombel"
        subheader="Tingkat pelunasan berdasarkan kelompok santri"
        avatar={<ReportSectionIcon icon="solar:users-group-rounded-bold-duotone" color="warning.main" />}
      />

      <Scrollbar sx={{ width: 1 }}>
        <Table sx={{ minWidth: 820 }}>
          <TableHeadCustom headCells={TABLE_HEAD} />
          <TableBody>
            {visibleRows.map((row) => {
              const percentage = row.total ? Math.min((row.paid / row.total) * 100, 100) : 0;

              return (
                <TableRow key={row.name} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{fCurrency(row.total)}</TableCell>
                  <TableCell>{fCurrency(row.paid)}</TableCell>
                  <TableCell sx={{ color: row.remaining ? "error.main" : "success.main", fontWeight: 600 }}>
                    {fCurrency(row.remaining)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 110, height: 8, borderRadius: 999, bgcolor: "background.neutral", overflow: "hidden" }}>
                        <Box sx={{ width: `${percentage}%`, height: 1, bgcolor: "success.main" }} />
                      </Box>
                      <Typography variant="body2">{percentage.toFixed(1)}%</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableNoData notFound={!loading && !rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={rows.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
