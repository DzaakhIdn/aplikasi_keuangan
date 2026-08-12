import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";

import { fCurrency } from "@/utils/format-number";
import { Label } from "@/components/label";
import { Scrollbar } from "@/components/scrollbar";
import { Iconify } from "@/components/iconify";
import {
  TableHeadCustom,
  TableNoData,
  useTable,
} from "@/components/table";

import type { BillDataRow } from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";
import Button from "@mui/material/Button";

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

const TABLE_HEAD = [
  { id: "student", label: "SANTRI", width: 230 },
  { id: "type", label: "JENIS PEMBAYARAN", width: 220 },
  { id: "period", label: "PERIODE", width: 130 },
  { id: "bill", label: "TAGIHAN", width: 130 },
  { id: "paid", label: "DIBAYAR", width: 130 },
  { id: "remaining", label: "SISA", width: 130 },
  { id: "status", label: "STATUS", width: 120 },
];

function formatPeriod(row: BillDataRow) {
  if (!row.periode_bulan || !row.periode_tahun) return "Sekali Bayar";
  return `${MONTHS[row.periode_bulan - 1]} ${row.periode_tahun}`;
}

function statusLabel(status: BillDataRow["status"]) {
  const labels = {
    pending: "Pending",
    belum_lunas: "Belum Lunas",
    sebagian: "Sebagian",
    lunas: "Lunas",
    dibebaskan: "Dibebaskan",
    dibatalkan: "Dibatalkan",
  } satisfies Record<BillDataRow["status"], string>;
  return labels[status];
}

function statusColor(status: BillDataRow["status"]) {
  if (status === "pending") return "warning";
  if (status === "sebagian") return "info";
  if (status === "lunas") return "success";
  if (status === "belum_lunas" || status === "dibatalkan") return "error";
  return "default";
}

export function ArrearsReportTable({
  rows,
  loading,
}: {
  rows: BillDataRow[];
  loading: boolean;
}) {
  const table = useTable({ defaultRowsPerPage: 5 });
  const visibleRows = rows.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  return (
    <Card sx={{ minWidth: 0 }}>
      {/* <CardHeader
        title="Santri Belum Lunas"
        subheader={`${rows.length} tagihan masih memiliki sisa pembayaran`}
        sx={{ mb: 3 }}
      /> */}

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
          icon="solar:file-corrupted-bold-duotone"
          color="error.main"
        />
        <Box>
          <Typography variant="h5">Data Santri Belum Lunas</Typography>
          <Typography variant="body1">Data Santri Belum Lunas</Typography>
        </Box>
      </Stack>

      <Stack
        spacing={1.5}
        sx={{ display: { xs: "flex", md: "none" }, p: 2, pt: 0 }}
      >
        {visibleRows.map((row) => (
          <Box
            key={row.id}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <Avatar sx={{ width: 40, height: 40 }}>
                  {(row.siswa?.nama_lengkap ?? "-").charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {row.siswa?.nama_lengkap ?? "-"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {row.siswa?.nis ?? "-"}
                  </Typography>
                </Box>
                <Label variant="soft" color={statusColor(row.status)}>
                  {statusLabel(row.status)}
                </Label>
              </Stack>
              <Typography variant="body2">
                {row.jenis_pembayaran_keuangan?.nama_pembayaran ?? "-"} ·{" "}
                {formatPeriod(row)}
              </Typography>
              <Box
                sx={{ display: "grid", gap: 1, gridTemplateColumns: "1fr 1fr" }}
              >
                <InfoBox
                  label="Tagihan"
                  value={fCurrency(row.nominal_tagihan)}
                />
                <InfoBox label="Sisa" value={fCurrency(row.sisa_tagihan)} />
              </Box>
            </Stack>
          </Box>
        ))}
        <TableNoData notFound={!loading && !rows.length} />
      </Stack>

      <Scrollbar sx={{ display: { xs: "none", md: "block" }, width: 1 }}>
        <Table sx={{ minWidth: 1060 }}>
          <TableHeadCustom headCells={TABLE_HEAD} />
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", minWidth: 0 }}
                  >
                    <Avatar
                      alt={row.siswa.nama_lengkap}
                      sx={{ width: 40, height: 40, flexShrink: 0 }}
                    >
                      {row.siswa?.nama_lengkap.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {row.siswa?.nama_lengkap}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                        noWrap
                      >
                        {row.siswa?.nis}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  {row.jenis_pembayaran_keuangan?.nama_pembayaran ?? "-"}
                </TableCell>
                <TableCell>{formatPeriod(row)}</TableCell>
                <TableCell>{fCurrency(row.nominal_tagihan)}</TableCell>
                <TableCell>{fCurrency(row.nominal_dibayar)}</TableCell>
                <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
                  {fCurrency(row.sisa_tagihan)}
                </TableCell>
                <TableCell>
                  <Label variant="soft" color={statusColor(row.status)}>
                    {statusLabel(row.status)}
                  </Label>
                </TableCell>
              </TableRow>
            ))}
            <TableNoData notFound={!loading && !rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          href="/bills-management/bills-data"
          endIcon={
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={18}
              sx={{ ml: -0.5 }}
            />
          }
        >
          Lihat Data Lengkap
        </Button>
      </Box>
    </Card>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: "background.neutral" }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}
