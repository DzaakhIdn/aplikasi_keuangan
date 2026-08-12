import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { fDate } from "@/utils/format-time";
import { fCurrency } from "@/utils/format-number";
import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { TableHeadCustom, TableNoData, useTable } from "@/components/table";

import type { FinancialPaymentRow } from "./report-types";
import Checkbox from "@mui/material/Checkbox";

const TABLE_HEAD = [
  { id: "", label: "", width: 20 },
  { id: "student", label: "SANTRI", width: 230 },
  { id: "type", label: "JENIS PEMBAYARAN", width: 220 },
  { id: "amount", label: "TOTAL", width: 140 },
  { id: "status", label: "STATUS", width: 100 },
  { id: "proof", label: "BUKTI", width: 70 },
];

export function TransactionReportTable({
  rows,
  loading,
}: {
  rows: FinancialPaymentRow[];
  loading: boolean;
}) {
  const table = useTable({ defaultRowsPerPage: 5 });
  const visibleRows = rows.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  return (
    <Card sx={{ minWidth: 0 }}>
      <CardHeader
        title={"Riwayat Transaksi"}
        subheader={`${rows.length} riwayat transaksi bulan ini`}
        sx={{ mb: 3 }}
      />

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
                  {row.invoiceTo.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {row.invoiceTo.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {row.invoiceNumber}
                  </Typography>
                </Box>
                <Label
                  variant="soft"
                  color={row.status === "paid" ? "success" : "error"}
                >
                  {row.status === "paid" ? "Lunas" : "Batal"}
                </Label>
              </Stack>

              <Box
                sx={{ display: "grid", gap: 1, gridTemplateColumns: "1fr 1fr" }}
              >
                <InfoBox label="Tanggal" value={fDate(row.createDate)} />
                <InfoBox label="Total" value={fCurrency(row.totalAmount)} />
                <InfoBox label="Jenis" value={row.sent} />
                <InfoBox label="Metode" value={row.paymentMethod ?? "-"} />
              </Box>

              {row.proofUrl && (
                <IconButton
                  component="a"
                  href={row.proofUrl}
                  target="_blank"
                  rel="noopener"
                  sx={{ alignSelf: "flex-end" }}
                >
                  <Iconify icon="solar:file-check-bold" />
                </IconButton>
              )}
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
                  <Checkbox
                    checked={table.selected.includes(row.id)}
                    onClick={() => table.onSelectRow(row.id)}
                    slotProps={{
                      input: {
                        id: `${row.id}-checkbox`,
                        "aria-label": `${row.id} checkbox`,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", minWidth: 0 }}
                  >
                    <Avatar
                      alt={row.invoiceTo.name}
                      sx={{ width: 40, height: 40, flexShrink: 0 }}
                    >
                      {row.invoiceTo.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {row.invoiceTo.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                        noWrap
                      >
                        {row.invoiceTo.company}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{row.sent}</TableCell>
                <TableCell>{fCurrency(row.totalAmount)}</TableCell>
                <TableCell>
                  <Label
                    variant="soft"
                    color={row.status === "paid" ? "success" : "error"}
                  >
                    {row.status === "paid" ? "Lunas" : "Batal"}
                  </Label>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      row.proofUrl
                        ? "Buka bukti transaksi"
                        : "Bukti belum tersedia"
                    }
                  >
                    <span>
                      <IconButton
                        component="a"
                        href={row.proofUrl ?? undefined}
                        target="_blank"
                        rel="noopener"
                        disabled={!row.proofUrl}
                      >
                        <Iconify icon="solar:file-check-bold" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            <TableNoData notFound={!loading && !rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>

      {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          href="/transaction/payment-history"
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
    <Box
      sx={{
        p: 1.25,
        minWidth: 0,
        borderRadius: 1.5,
        bgcolor: "background.neutral",
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
  );
}
