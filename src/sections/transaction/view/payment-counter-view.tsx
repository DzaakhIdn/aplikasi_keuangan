import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Autocomplete from "@mui/material/Autocomplete";

import { CONFIG } from "@/global-config";
import { paths } from "@/routes/paths";
import { useAuth } from "@/auth/context/auth-context";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { TableHeadCustom, TableNoData } from "@/components/table";
import { paymentCounterQueries } from "@/features/payment-counter/api/payment-counter.queries";
import { PaymentCounterRepository } from "@/features/payment-counter/api/payment-counter.repository";
import {
  useRecordCounterPayment,
  useSyncStudentBills,
} from "@/features/payment-counter/api/payment-counter.mutation";
import type {
  OutstandingBill,
  PaymentStudent,
  PaymentItemInput,
} from "@/features/payment-counter/api/payment-counter.repository";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "select", label: "", width: 48 },
  { id: "jenis", label: "Jenis Pembayaran", width: 240 },
  { id: "periode", label: "Periode", width: 140 },
  { id: "tagihan", label: "Tagihan", width: 140 },
  { id: "potongan", label: "Potongan", width: 140 },
  { id: "dibayar", label: "Sudah Dibayar", width: 140 },
  { id: "sisa", label: "Sisa", width: 140 },
  { id: "nominal", label: "Nominal Bayar", width: 180 },
];

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPeriod(row: OutstandingBill) {
  if (!row.periode_bulan || !row.periode_tahun) return "Sekali Bayar";
  return `${MONTHS[row.periode_bulan - 1]} ${row.periode_tahun}`;
}

// ----------------------------------------------------------------------

export function PaymentCounterView() {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<PaymentStudent | null>(
    null,
  );
  const [selectedAmounts, setSelectedAmounts] = useState<
    Record<string, number>
  >({});
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [note, setNote] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const studentsQuery = useQuery(paymentCounterQueries.students());
  const billsQuery = useQuery(
    paymentCounterQueries.bills(selectedStudent?.id ?? null),
  );
  const syncBills = useSyncStudentBills();
  const recordPayment = useRecordCounterPayment();

  const bills = billsQuery.data ?? [];
  const selectedIds = Object.keys(selectedAmounts);
  const totalOutstanding = bills.reduce(
    (total, bill) => total + bill.sisa_tagihan,
    0,
  );
  const totalPayment = selectedIds.reduce(
    (total, id) => total + (selectedAmounts[id] ?? 0),
    0,
  );

  const selectedItems = useMemo<PaymentItemInput[]>(
    () =>
      selectedIds
        .map((id) => ({
          id_tagihan: id,
          nominal_bayar: selectedAmounts[id] ?? 0,
        }))
        .filter((item) => item.nominal_bayar > 0),
    [selectedAmounts, selectedIds],
  );

  const selectedBills = useMemo(
    () => bills.filter((bill) => selectedAmounts[bill.id] !== undefined),
    [bills, selectedAmounts],
  );

  const resetPaymentForm = () => {
    setSelectedAmounts({});
    setPaymentMethod("Tunai");
    setNote("");
    setProofFile(null);
  };

  const handleSelectStudent = (student: PaymentStudent | null) => {
    setSelectedStudent(student);
    resetPaymentForm();
  };

  const handleSyncBills = () => {
    if (!selectedStudent) return;

    syncBills.mutate(selectedStudent, {
      onSuccess: (count) => {
        toast.success(
          count
            ? `${count} tagihan baru dibuat`
            : "Tagihan siswa sudah sinkron",
        );
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  const handleToggleBill = (bill: OutstandingBill) => {
    setSelectedAmounts((prev) => {
      if (prev[bill.id] !== undefined) {
        const next = { ...prev };
        delete next[bill.id];
        return next;
      }

      return { ...prev, [bill.id]: bill.sisa_tagihan };
    });
  };

  const handleChangeAmount = (bill: OutstandingBill, value: number) => {
    const amount = Math.max(0, Math.min(value, bill.sisa_tagihan));
    setSelectedAmounts((prev) => ({ ...prev, [bill.id]: amount }));
  };

  const handleSubmitPayment = async () => {
    if (!selectedStudent) {
      toast.error("Pilih siswa terlebih dahulu");
      return;
    }

    if (!selectedItems.length || totalPayment <= 0) {
      toast.error("Pilih minimal satu tagihan dan isi nominal bayar");
      return;
    }

    if (!proofFile) {
      toast.error("Bukti pembayaran wajib diupload");
      return;
    }

    try {
      setIsProcessing(true);
      const proof = await PaymentCounterRepository.uploadPaymentProof(
        proofFile,
        selectedStudent,
        totalPayment,
        selectedBills,
      );

      await recordPayment.mutateAsync({
        id_siswa: selectedStudent.id,
        items: selectedItems,
        metode_pembayaran: paymentMethod,
        catatan: note || null,
        id_petugas: user?.id ?? null,
        bukti: proof,
      });

      toast.success("Pembayaran berhasil disimpan");
      resetPaymentForm();
      billsQuery.refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan pembayaran",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitting = isProcessing || recordPayment.isPending;

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{ borderTop: "solid 1px rgba(145, 158, 171, 0.12)", pt: 3 }}
    >
      <CustomBreadcrumbs
        heading="Loket Pembayaran"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Kasir & Transaksi" },
          { name: "Loket Pembayaran" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!CONFIG.serverUrl && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Upload bukti ke Google Drive butuh backend/serverless endpoint. Isi{" "}
          <strong>VITE_SERVER_URL</strong> dan sediakan endpoint{" "}
          <strong>/api/google-drive/payment-proof</strong>.
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: "1fr", xl: "minmax(320px, 0.9fr) minmax(0, 1.45fr)" },
          alignItems: "start",
        }}
      >
        <Stack spacing={{ xs: 2, md: 3 }} sx={{ minWidth: 0 }}>
          <Card
            sx={{
              overflow: "hidden",
              color: "common.white",
              background:
                "linear-gradient(135deg, #0F766E 0%, #16A34A 48%, #F59E0B 125%)",
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    display: "grid",
                    borderRadius: 2,
                    placeItems: "center",
                    bgcolor: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Iconify icon="solar:wallet-money-bold-duotone" width={32} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ typography: { xs: "h6", sm: "h5" } }}>Loket Pembayaran</Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: "rgba(255,255,255,0.24)" }} />

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    Dipilih
                  </Typography>
                  <Typography variant="h4" sx={{ typography: { xs: "h5", sm: "h4" } }}>{selectedItems.length}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.72 }}>
                    Total Bayar
                  </Typography>
                  <Typography variant="h4" sx={{ typography: { xs: "h6", sm: "h4" } }} noWrap>
                    {formatCurrency(totalPayment)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>

          <Card>
            {isSubmitting && <LinearProgress />}
            <CardHeader
              title="Data Siswa"
              subheader="Cari siswa aktif untuk melakukan pembayaran"
              sx={{ pb: 1 }}
            />

            <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
              <Autocomplete
                options={studentsQuery.data ?? []}
                loading={studentsQuery.isLoading}
                getOptionLabel={(option) =>
                  `${option.nama_lengkap} - ${option.nis}`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedStudent}
                onChange={(_, value) => handleSelectStudent(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cari siswa"
                    placeholder="Nama lengkap atau NIS"
                  />
                )}
              />

              {selectedStudent && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ alignItems: { sm: "center" } }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {selectedStudent.nama_lengkap}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      NIS: {selectedStudent.nis}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Iconify icon="solar:refresh-bold" />}
                    onClick={handleSyncBills}
                    disabled={syncBills.isPending}
                  >
                    {syncBills.isPending ? "Sinkron..." : "Sinkron Tagihan"}
                  </Button>
                </Stack>
              )}
            </Stack>
          </Card>

          <Card>
            {isSubmitting && <LinearProgress />}
            <CardHeader title="Konfirmasi Pembayaran" sx={{ pb: 1 }} />

            <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Metode Pembayaran"
                  value={paymentMethod}
                  disabled={isSubmitting}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  sx={{ minWidth: { sm: 190 }, flex: 1 }}
                >
                  <MenuItem value="Tunai">Tunai</MenuItem>
                  <MenuItem value="Transfer">Transfer</MenuItem>
                  <MenuItem value="QRIS">QRIS</MenuItem>
                  <MenuItem value="EDC">EDC</MenuItem>
                </TextField>

                <Button
                  component="label"
                  variant={proofFile ? "contained" : "outlined"}
                  color={proofFile ? "success" : "inherit"}
                  disabled={isSubmitting}
                  startIcon={
                    <Iconify
                      icon={
                        proofFile
                          ? "solar:check-circle-bold"
                          : "solar:upload-bold"
                      }
                    />
                  }
                  sx={{ minHeight: 56, flex: 1 }}
                >
                  {proofFile ? "Bukti Siap" : "Upload Bukti"}
                  <input
                    hidden
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(event) =>
                      setProofFile(event.target.files?.[0] ?? null)
                    }
                  />
                </Button>
              </Stack>

              {proofFile && (
                <Alert
                  severity="success"
                  icon={<Iconify icon="solar:file-check-bold" />}
                  sx={{ wordBreak: "break-word" }}
                >
                  {proofFile.name}
                </Alert>
              )}

              <TextField
                label="Catatan"
                value={note}
                disabled={isSubmitting}
                onChange={(event) => setNote(event.target.value)}
                multiline
                rows={3}
              />

              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  bgcolor: "background.neutral",
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Total pembayaran
                </Typography>
                <Typography variant="h3" sx={{ typography: { xs: "h4", sm: "h3" }, wordBreak: "break-word" }}>
                  {formatCurrency(totalPayment)}
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSubmitPayment}
                disabled={
                  isSubmitting ||
                  !selectedStudent ||
                  !selectedItems.length ||
                  !proofFile
                }
                startIcon={<Iconify icon="solar:card-transfer-bold-duotone" />}
              >
                {isSubmitting
                  ? "Mengupload & menyimpan..."
                  : "Simpan Pembayaran"}
              </Button>
            </Stack>
          </Card>
        </Stack>

        <Stack spacing={{ xs: 2, md: 3 }} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            }}
          >
            <SummaryCard
              title="Total Tunggakan"
              value={formatCurrency(totalOutstanding)}
              icon="solar:bill-cross-bold-duotone"
              color="#EF4444"
            />
            <SummaryCard
              title="Tagihan Terpilih"
              value={`${selectedItems.length} item`}
              icon="solar:checklist-minimalistic-bold-duotone"
              color="#0EA5E9"
            />
            <SummaryCard
              title="Nominal Diproses"
              value={formatCurrency(totalPayment)}
              icon="solar:hand-money-bold-duotone"
              color="#22C55E"
            />
          </Box>

          <Card>
            {isSubmitting && <LinearProgress />}
            <CardHeader title="Daftar Tagihan" sx={{ pb: 1 }} />

            <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" }, p: 2, pt: 0 }}>
              {bills.map((bill) => {
                const payment = bill.jenis_pembayaran_keuangan;
                const checked = selectedAmounts[bill.id] !== undefined;

                return (
                  <Box
                    key={bill.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: checked ? "primary.main" : "divider",
                      bgcolor: checked ? "primary.lighter" : "background.paper",
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                        <Checkbox checked={checked} onChange={() => handleToggleBill(bill)} sx={{ p: 0.25 }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ wordBreak: "break-word" }}>
                            {payment?.nama_pembayaran ?? bill.id_jenis_pembayaran}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {payment?.kode_jenis_pembayaran ?? "-"} • {formatPeriod(bill)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "1fr 1fr" }}>
                        <AmountInfo label="Tagihan" value={formatCurrency(bill.nominal_awal)} />
                        <AmountInfo label="Potongan" value={formatCurrency(bill.nominal_potongan)} />
                        <AmountInfo label="Sisa" value={formatCurrency(bill.sisa_tagihan)} />
                      </Box>

                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Nominal bayar"
                        disabled={!checked}
                        value={selectedAmounts[bill.id] ?? ""}
                        onChange={(event) =>
                          handleChangeAmount(
                            bill,
                            parseInt(event.target.value, 10) || 0,
                          )
                        }
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: bill.sisa_tagihan,
                            step: 1000,
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                );
              })}

              <TableNoData
                notFound={
                  !billsQuery.isLoading && !!selectedStudent && !bills.length
                }
              />
              <TableNoData notFound={!selectedStudent} />
            </Stack>

            <Scrollbar sx={{ display: { xs: "none", md: "block" }, width: 1 }}>
                <Table sx={{ minWidth: 1040 }}>
                <TableHeadCustom headCells={TABLE_HEAD} />
                <TableBody>
                  {bills.map((bill) => {
                    const payment = bill.jenis_pembayaran_keuangan;
                    const checked = selectedAmounts[bill.id] !== undefined;

                    return (
                      <TableRow hover key={bill.id} selected={checked}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={checked}
                            onChange={() => handleToggleBill(bill)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {payment?.nama_pembayaran ??
                              bill.id_jenis_pembayaran}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {payment?.kode_jenis_pembayaran ?? "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatPeriod(bill)}</TableCell>
                        <TableCell>
                          {formatCurrency(bill.nominal_awal)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(bill.nominal_potongan)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(bill.nominal_dibayar)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(bill.sisa_tagihan)}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            disabled={!checked}
                            value={selectedAmounts[bill.id] ?? ""}
                            onChange={(event) =>
                              handleChangeAmount(
                                bill,
                                parseInt(event.target.value, 10) || 0,
                              )
                            }
                            slotProps={{
                              htmlInput: {
                                min: 0,
                                max: bill.sisa_tagihan,
                                step: 1000,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableNoData
                    notFound={
                      !billsQuery.isLoading &&
                      !!selectedStudent &&
                      !bills.length
                    }
                  />
                  <TableNoData notFound={!selectedStudent} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>
        </Stack>
      </Box>
    </DashboardContent>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            display: "grid",
            borderRadius: 1.5,
            placeItems: "center",
            color,
            bgcolor: `${color}1A`,
          }}
        >
          <Iconify icon={icon} width={26} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

function AmountInfo({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: "background.neutral", minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
}
