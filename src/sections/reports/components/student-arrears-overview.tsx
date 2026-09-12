import { Fragment } from "react";
import { AnimatePresence, motion } from "motion/react";

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
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from "@/components/table";

import {
  MONTHS,
  type BillDataRow,
  type StudentArrearsSummary,
} from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";

const TABLE_HEAD = [
  { id: "student", label: "SANTRI", width: 260 },
  { id: "rombel", label: "ROMBEL", width: 150 },
  { id: "target", label: "TOTAL TAGIHAN", width: 170 },
  { id: "remaining", label: "TOTAL TUNGGAKAN", width: 180 },
  { id: "progress", label: "PROGRES PEMBAYARAN", width: 250 },
];

const BILL_DETAIL_GRID = {
  display: "grid",
  gap: 1,
  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)", xl: "1fr 1fr" },
};

const EXPAND_TRANSITION = { duration: 0.24, ease: [0.4, 0, 0.2, 1] as const };

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

function getPaymentType(row: BillDataRow) {
  const type = row.jenis_pembayaran_keuangan?.tipe_pembayaran;
  return type ? ` · ${type}` : "";
}

function BillDetailItem({ bill }: { bill: BillDataRow }) {
  return (
    <Stack spacing={1.5} sx={{ py: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between" }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {bill.jenis_pembayaran_keuangan?.nama_pembayaran ?? "Tagihan"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {getPeriod(bill)} ·{" "}
            {bill.tahun_ajaran?.tahun_ajaran ?? "Tanpa tahun ajaran"}
            {getPaymentType(bill)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            Kode {bill.jenis_pembayaran_keuangan?.kode_jenis_pembayaran ?? "-"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            Jatuh tempo{" "}
            {bill.tanggal_jatuh_tempo ? fDate(bill.tanggal_jatuh_tempo) : "-"}
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

      <Box sx={BILL_DETAIL_GRID}>
        <Box sx={{ p: 1.25, borderRadius: 1, bgcolor: "background.neutral" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Tagihan
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", fontWeight: 700 }}
          >
            {fCurrency(bill.nominal_tagihan)}
          </Typography>
        </Box>
        <Box sx={{ p: 1.25, borderRadius: 1, bgcolor: "background.neutral" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Dibayar
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", fontWeight: 700 }}
          >
            {fCurrency(bill.nominal_dibayar)}
          </Typography>
        </Box>
        <Box sx={{ p: 1.25, borderRadius: 1, bgcolor: "background.neutral" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Potongan
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", fontWeight: 700 }}
          >
            {fCurrency(bill.nominal_potongan)}
          </Typography>
        </Box>
        <Box sx={{ p: 1.25, borderRadius: 1, bgcolor: "error.lighter" }}>
          <Typography variant="caption" sx={{ color: "error.dark" }}>
            Sisa
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", fontWeight: 700, color: "error.darker" }}
          >
            {fCurrency(bill.sisa_tagihan)}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
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
  const table = useTable({ defaultRowsPerPage: 10 });
  const visibleRows = rows.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        alignItems: "start",
        gridTemplateColumns: {
          xs: "1fr",
          xl: selected ? "minmax(0, 1.45fr) minmax(360px, 0.55fr)" : "1fr",
        },
      }}
    >
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
            icon="solar:users-group-rounded-bold-duotone"
            color="warning.main"
          />
          <Box>
            <Typography variant="h5">
              Daftar rincian tunggakan pembayaran siswa
            </Typography>
            <Typography variant="body1">
              Klik nama siswa untuk melihat rincian tunggakan nya
            </Typography>
          </Box>
        </Stack>

        <Scrollbar sx={{ width: 1 }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {visibleRows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    hover
                    selected={selected?.id === row.id}
                    onClick={() => onSelect(row.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Button
                        color="inherit"
                        component="span"
                        sx={{
                          p: 0,
                          justifyContent: "flex-start",
                          textAlign: "left",
                          textTransform: "none",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {getInitials(row.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {row.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
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
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Box
                          sx={{
                            width: 140,
                            height: 9,
                            overflow: "hidden",
                            borderRadius: 999,
                            bgcolor: "background.neutral",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${row.percentage}%`,
                              height: 1,
                              borderRadius: 999,
                              bgcolor:
                                row.percentage >= 75
                                  ? "success.main"
                                  : row.percentage >= 40
                                    ? "warning.main"
                                    : "error.main",
                            }}
                          />
                        </Box>
                        <Typography variant="subtitle2" sx={{ minWidth: 48 }}>
                          {row.percentage.toFixed(1)}%
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  <AnimatePresence initial={false}>
                    {selected?.id === row.id && (
                      <TableRow>
                        <TableCell
                          colSpan={TABLE_HEAD.length}
                          sx={{ p: 0, bgcolor: "background.neutral" }}
                        >
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={EXPAND_TRANSITION}
                            style={{ overflow: "hidden" }}
                          >
                            <Box sx={{ px: 3, py: 2 }}>
                              <Stack
                                direction="row"
                                spacing={1.5}
                                sx={{ mb: 1, alignItems: "center" }}
                              >
                                <Typography variant="subtitle2">
                                  Rincian Tunggakan
                                </Typography>
                                <Label color="error">
                                  {row.bills.length} tagihan
                                </Label>
                              </Stack>
                              <Stack
                                divider={
                                  <Divider sx={{ borderStyle: "dashed" }} />
                                }
                              >
                                {row.bills.map((bill) => (
                                  <BillDetailItem key={bill.id} bill={bill} />
                                ))}
                              </Stack>
                            </Box>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </Fragment>
              ))}
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

      {selected && (
        <Card sx={{ minWidth: 0 }}>
          <CardHeader
            title="Detail Tunggakan"
            subheader={`${selected.bills.length} tagihan belum selesai`}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{ px: 3, pb: 3, alignItems: "center" }}
          >
            <Avatar sx={{ width: 52, height: 52 }}>
              {getInitials(selected.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {selected.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                NIS {selected.nis} · {selected.rombel}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              px: 3,
              pb: 3,
            }}
          >
            <Box
              sx={{ p: 2, borderRadius: 1.5, bgcolor: "background.neutral" }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Total tagihan
              </Typography>
              <Typography variant="subtitle2">
                {fCurrency(selected.total)}
              </Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "error.lighter" }}>
              <Typography variant="caption" sx={{ color: "error.dark" }}>
                Sisa tunggakan
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "error.darker" }}>
                {fCurrency(selected.remaining)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Scrollbar sx={{ maxHeight: 520 }}>
            <Stack
              divider={<Divider sx={{ borderStyle: "dashed" }} />}
              sx={{ px: 3 }}
            >
              {selected.bills.map((bill) => (
                <BillDetailItem key={bill.id} bill={bill} />
              ))}
            </Stack>
          </Scrollbar>
        </Card>
      )}
    </Box>
  );
}
