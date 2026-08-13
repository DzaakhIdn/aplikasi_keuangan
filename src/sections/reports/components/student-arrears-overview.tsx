import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { fDate } from "@/utils/format-time";
import { fCurrency } from "@/utils/format-number";
import { Label } from "@/components/label";
import { Scrollbar } from "@/components/scrollbar";
import { TableHeadCustom, TableNoData } from "@/components/table";

import { MONTHS, type BillDataRow, type StudentArrearsSummary } from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";

const TABLE_HEAD = [
  { id: "student", label: "SANTRI", width: 260 },
  { id: "rombel", label: "ROMBEL", width: 150 },
  { id: "target", label: "TOTAL TAGIHAN", width: 170 },
  { id: "remaining", label: "TOTAL TUNGGAKAN", width: 180 },
  { id: "progress", label: "PROGRES PEMBAYARAN", width: 250 },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getPeriod(row: BillDataRow) {
  if (!row.periode_bulan || !row.periode_tahun) return "Sekali bayar";
  return `${MONTHS[row.periode_bulan - 1]} ${row.periode_tahun}`;
}

function statusLabel(status: string) {
  if (status === "sebagian") return "Sebagian";
  if (status === "pending") return "Pending";
  return "Belum lunas";
}

export function StudentArrearsOverview({
  rows,
  loading,
  selected,
  onSelect,
}: {
  rows: StudentArrearsSummary[];
  loading: boolean;
  selected?: StudentArrearsSummary;
  onSelect: (id: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        alignItems: "start",
        gridTemplateColumns: { xs: "1fr", xl: selected ? "minmax(0, 1.45fr) minmax(360px, 0.55fr)" : "1fr" },
      }}
    >
      <Card sx={{ minWidth: 0 }}>
        <CardHeader
          title="Daftar Santri Menunggak"
          subheader="Klik nama santri untuk melihat rincian tunggakan"
          avatar={<ReportSectionIcon icon="solar:users-group-rounded-bold-duotone" color="error.main" />}
        />

        <Scrollbar sx={{ width: 1 }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover selected={selected?.id === row.id}>
                  <TableCell>
                    <Button
                      color="inherit"
                      onClick={() => onSelect(row.id)}
                      sx={{ p: 0, justifyContent: "flex-start", textAlign: "left", textTransform: "none" }}
                    >
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar sx={{ width: 40, height: 40 }}>{getInitials(row.name)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2">{row.name}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            NIS {row.nis}
                          </Typography>
                        </Box>
                      </Stack>
                    </Button>
                  </TableCell>
                  <TableCell>{row.rombel}</TableCell>
                  <TableCell>{fCurrency(row.total)}</TableCell>
                  <TableCell sx={{ color: "error.main", fontWeight: 700 }}>
                    {fCurrency(row.remaining)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 140, height: 9, overflow: "hidden", borderRadius: 999, bgcolor: "background.neutral" }}>
                        <Box
                          sx={{
                            width: `${row.percentage}%`,
                            height: 1,
                            borderRadius: 999,
                            bgcolor: row.percentage >= 75 ? "success.main" : row.percentage >= 40 ? "warning.main" : "error.main",
                          }}
                        />
                      </Box>
                      <Typography variant="subtitle2" sx={{ minWidth: 48 }}>
                        {row.percentage.toFixed(1)}%
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              <TableNoData notFound={!loading && !rows.length} />
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>

      {selected && (
        <Card sx={{ minWidth: 0 }}>
          <CardHeader title="Detail Tunggakan" subheader={`${selected.bills.length} tagihan belum selesai`} />

          <Stack direction="row" spacing={2} sx={{ px: 3, pb: 3, alignItems: "center" }}>
            <Avatar sx={{ width: 52, height: 52 }}>{getInitials(selected.name)}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>{selected.name}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                NIS {selected.nis} · {selected.rombel}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, px: 3, pb: 3 }}>
            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "background.neutral" }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Total tagihan</Typography>
              <Typography variant="subtitle2">{fCurrency(selected.total)}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "error.lighter" }}>
              <Typography variant="caption" sx={{ color: "error.dark" }}>Sisa tunggakan</Typography>
              <Typography variant="subtitle2" sx={{ color: "error.darker" }}>{fCurrency(selected.remaining)}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Scrollbar sx={{ maxHeight: 480 }}>
            <Stack divider={<Divider sx={{ borderStyle: "dashed" }} />} sx={{ px: 3 }}>
              {selected.bills.map((bill) => (
                <Stack key={bill.id} direction="row" spacing={2} sx={{ py: 2, justifyContent: "space-between" }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {bill.jenis_pembayaran_keuangan?.nama_pembayaran ?? "Tagihan"}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {getPeriod(bill)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.disabled" }}>
                      Jatuh tempo {bill.tanggal_jatuh_tempo ? fDate(bill.tanggal_jatuh_tempo) : "-"}
                    </Typography>
                  </Box>
                  <Stack spacing={0.75} sx={{ flexShrink: 0, alignItems: "flex-end" }}>
                    <Typography variant="subtitle2" sx={{ color: "error.main" }}>
                      {fCurrency(bill.sisa_tagihan)}
                    </Typography>
                    <Label color={bill.status === "pending" ? "warning" : "error"}>
                      {statusLabel(bill.status)}
                    </Label>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Scrollbar>
        </Card>
      )}
    </Box>
  );
}
