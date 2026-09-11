import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "@/routes/paths";
import { fDate } from "@/utils/format-time";
import { fCurrency } from "@/utils/format-number";
import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from "@/components/table";
import { billsDataQueries } from "@/features/bills-data/api/bills-data.queries";
import type {
  BillDataRow,
  BillStatus,
} from "@/features/bills-data/api/bills-data.repository";
import { InvoiceAnalytic } from "../invoice-analytic";

// ----------------------------------------------------------------------

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

const TABLE_HEAD = [
  { id: "siswa", label: "SANTRI", width: 240 },
  { id: "jenis", label: "JENIS PEMBAYARAN", width: 220 },
  { id: "periode", label: "PERIODE", width: 140 },
  { id: "tagihan", label: "TAGIHAN", width: 140 },
  { id: "dibayar", label: "DIBAYAR", width: 140 },
  { id: "sisa", label: "SISA", width: 140 },
  { id: "jatuh_tempo", label: "JATUH TEMPO", width: 140 },
  { id: "status", label: "STATUS", width: 130 },
  { id: "actions", label: "", width: 80 },
];

const STATUS_OPTIONS: {
  value: "all" | BillStatus;
  label: string;
  color: "default" | "success" | "warning" | "error" | "info";
}[] = [
  { value: "all", label: "Semua", color: "default" },
  { value: "pending", label: "Pending", color: "warning" },
  { value: "belum_lunas", label: "Belum Lunas", color: "error" },
  { value: "sebagian", label: "Sebagian", color: "info" },
  { value: "lunas", label: "Lunas", color: "success" },
  { value: "dibebaskan", label: "Dibebaskan", color: "default" },
  { value: "dibatalkan", label: "Dibatalkan", color: "error" },
];

function formatPeriod(row: BillDataRow) {
  if (!row.periode_bulan || !row.periode_tahun) return "Sekali Bayar";
  return `${MONTHS[row.periode_bulan - 1]} ${row.periode_tahun}`;
}

function getStatusConfig(status: BillStatus) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status) ?? STATUS_OPTIONS[0]
  );
}

function filterBills(
  rows: BillDataRow[],
  keyword: string,
  status: "all" | BillStatus,
) {
  let result = rows;

  if (status !== "all") {
    result = result.filter((row) => row.status === status);
  }

  if (keyword) {
    const value = keyword.toLowerCase();
    result = result.filter((row) =>
      [
        row.siswa?.nama_lengkap,
        row.siswa?.nis,
        row.jenis_pembayaran_keuangan?.kode_jenis_pembayaran,
        row.jenis_pembayaran_keuangan?.nama_pembayaran,
        row.tahun_ajaran?.tahun_ajaran,
      ].some((field) => field?.toLowerCase().includes(value)),
    );
  }

  return result;
}

function getUniqueOptions(
  rows: BillDataRow[],
  getValue: (row: BillDataRow) => string | undefined,
) {
  return [...new Set(rows.map(getValue).filter(Boolean))] as string[];
}

function getClassName(row: BillDataRow) {
  const history = row.siswa?.kesiswaan_history?.find(
    (item) => item.tahun_ajaran_id === row.id_tahun_ajaran,
  );
  return (
    history?.kelas?.nama_kelas ?? row.siswa?.kelas?.nama_kelas ?? "Tanpa kelas"
  );
}

function getCabangId(row: BillDataRow) {
  return row.siswa?.cabang_id ?? row.siswa?.cabang?.id ?? "";
}

function getCabangName(row: BillDataRow) {
  return (
    row.siswa?.cabang?.nama_cabang ?? row.siswa?.cabang_id ?? "Tanpa cabang"
  );
}

// ----------------------------------------------------------------------

export function InvoiceListView() {
  const theme = useTheme();
  const table = useTable();
  const { data = [], isLoading } = useQuery(billsDataQueries.all());
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"all" | BillStatus>("all");
  const [paymentType, setPaymentType] = useState("all");
  const [academicYear, setAcademicYear] = useState("all");
  const [className, setClassName] = useState("all");
  const [cabang, setCabang] = useState("all");

  const paymentTypeOptions = useMemo(
    () =>
      getUniqueOptions(
        data,
        (row) => row.jenis_pembayaran_keuangan?.nama_pembayaran,
      ),
    [data],
  );
  const academicYearOptions = useMemo(
    () => getUniqueOptions(data, (row) => row.tahun_ajaran?.tahun_ajaran),
    [data],
  );
  const classOptions = useMemo(
    () => getUniqueOptions(data, getClassName),
    [data],
  );
  const cabangOptions = useMemo(() => {
    const map = new Map<string, string>();
    data.forEach((row) => {
      const id = getCabangId(row);
      if (!id) return;
      if (!map.has(id)) map.set(id, getCabangName(row));
    });
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);
  const filteredData = useMemo(() => {
    let result = filterBills(data, keyword, status);

    if (paymentType !== "all") {
      result = result.filter(
        (row) => row.jenis_pembayaran_keuangan?.nama_pembayaran === paymentType,
      );
    }

    if (academicYear !== "all") {
      result = result.filter(
        (row) => row.tahun_ajaran?.tahun_ajaran === academicYear,
      );
    }

    if (className !== "all") {
      result = result.filter((row) => getClassName(row) === className);
    }

    if (cabang !== "all") {
      result = result.filter((row) => getCabangId(row) === cabang);
    }

    return result;
  }, [academicYear, cabang, className, data, keyword, paymentType, status]);
  const visibleRows = filteredData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );
  const paidRows = filteredData.filter((row) => row.status === "lunas");
  const totalPaidSuccess = paidRows.reduce(
    (total, row) => total + row.nominal_dibayar,
    0,
  );
  const totalSisa = filteredData.reduce(
    (total, row) => total + row.sisa_tagihan,
    0,
  );
  const getStatusRows = (value: BillStatus) =>
    data.filter((row) => row.status === value);
  const getStatusAmount = (value: BillStatus) =>
    getStatusRows(value).reduce((total, row) => total + row.nominal_tagihan, 0);
  const getStatusPercent = (value: BillStatus) =>
    data.length ? (getStatusRows(value).length / data.length) * 100 : 0;

  const handleChangeStatus = (
    _event: React.SyntheticEvent,
    value: "all" | BillStatus,
  ) => {
    setStatus(value);
    table.onResetPage();
  };

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ borderTop: "solid 1px rgba(145, 158, 171, 0.12)", pt: 3 }}
    >
      <CustomBreadcrumbs
        heading="Data Tagihan"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Manajemen Tagihan" },
          { name: "Data Tagihan" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Scrollbar sx={{ width: 1, minHeight: 108 }}>
          <Stack
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: "dashed" }}
              />
            }
            sx={{ py: 2, flexDirection: "row" }}
          >
            <InvoiceAnalytic
              title="Total Berhasil"
              total={paidRows.length}
              percent={
                filteredData.length
                  ? (paidRows.length / filteredData.length) * 100
                  : 0
              }
              price={totalPaidSuccess}
              icon="solar:bill-list-bold-duotone"
              color={theme.vars.palette.info.main}
            />
            <InvoiceAnalytic
              title="Lunas"
              total={getStatusRows("lunas").length}
              percent={getStatusPercent("lunas")}
              price={getStatusAmount("lunas")}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.success.main}
            />
            <InvoiceAnalytic
              title="Pending"
              total={getStatusRows("pending").length}
              percent={getStatusPercent("pending")}
              price={getStatusAmount("pending")}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.vars.palette.warning.main}
            />
            <InvoiceAnalytic
              title="Sebagian"
              total={getStatusRows("sebagian").length}
              percent={getStatusPercent("sebagian")}
              price={getStatusAmount("sebagian")}
              icon="solar:wallet-money-bold-duotone"
              color={theme.vars.palette.info.main}
            />
            <InvoiceAnalytic
              title="Sisa"
              total={filteredData.length}
              percent={100}
              price={totalSisa}
              icon="solar:bill-cross-bold-duotone"
              color={theme.vars.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

      <Card>
        <Tabs
          value={status}
          onChange={handleChangeStatus}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2.5, borderBottom: "1px solid", borderColor: "divider" }}
        >
          {STATUS_OPTIONS.map((item) => (
            <Tab
              key={item.value}
              value={item.value}
              label={item.label}
              iconPosition="end"
              icon={
                <Label
                  variant={item.value === status ? "filled" : "soft"}
                  color={item.color}
                >
                  {item.value === "all"
                    ? data.length
                    : data.filter((row) => row.status === item.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <Box
          sx={{
            p: 2.5,
            gap: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 180px 180px 180px",
              xl: "1fr 180px 180px 180px 180px",
            },
          }}
        >
          <TextField
            fullWidth
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              table.onResetPage();
            }}
            placeholder="Cari nama santri, NIS, jenis pembayaran, atau tahun ajaran..."
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

          <TextField
            select
            label="Cabang"
            value={cabang}
            onChange={(event) => {
              setCabang(event.target.value);
              table.onResetPage();
            }}
          >
            <MenuItem value="all">Semua cabang</MenuItem>
            {cabangOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Jenis Pembayaran"
            value={paymentType}
            onChange={(event) => {
              setPaymentType(event.target.value);
              table.onResetPage();
            }}
          >
            <MenuItem value="all">Semua jenis</MenuItem>
            {paymentTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Tahun Ajaran"
            value={academicYear}
            onChange={(event) => {
              setAcademicYear(event.target.value);
              table.onResetPage();
            }}
          >
            <MenuItem value="all">Semua tahun</MenuItem>
            {academicYearOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Kelas"
            value={className}
            onChange={(event) => {
              setClassName(event.target.value);
              table.onResetPage();
            }}
          >
            <MenuItem value="all">Semua kelas</MenuItem>
            {classOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Stack
          spacing={1.5}
          sx={{ display: { xs: "flex", md: "none" }, p: 2, pt: 0 }}
        >
          {visibleRows.map((row) => (
            <BillMobileCard
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelect={() => table.onSelectRow(row.id)}
            />
          ))}
          <TableNoData notFound={!isLoading && !filteredData.length} />
        </Stack>

        <Box sx={{ position: "relative" }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={filteredData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                filteredData.map((row) => row.id),
              )
            }
            action={
              <Tooltip title="Aksi massal belum tersedia">
                <IconButton color="primary">
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Tooltip>
            }
          />

          <TableContainer
            sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 1180 }}>
              <TableHeadCustom
                headCells={TABLE_HEAD}
                rowCount={filteredData.length}
                numSelected={table.selected.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    filteredData.map((row) => row.id),
                  )
                }
              />
              <TableBody>
                {visibleRows.map((row) => {
                  const statusConfig = getStatusConfig(row.status);

                  return (
                    <TableRow hover key={row.id}>
                      <TableCell padding="checkbox">
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
                        <StudentCell row={row} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {row.jenis_pembayaran_keuangan?.nama_pembayaran ??
                            "-"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {row.jenis_pembayaran_keuangan
                            ?.kode_jenis_pembayaran ?? "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatPeriod(row)}</TableCell>
                      <TableCell>{fCurrency(row.nominal_tagihan)}</TableCell>
                      <TableCell>{fCurrency(row.nominal_dibayar)}</TableCell>
                      <TableCell>{fCurrency(row.sisa_tagihan)}</TableCell>
                      <TableCell>
                        {row.tanggal_jatuh_tempo
                          ? fDate(row.tanggal_jatuh_tempo)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Label variant="soft" color={statusConfig.color}>
                          {statusConfig.label}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <BillActions row={row} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableNoData notFound={!isLoading && !filteredData.length} />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={filteredData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function BillMobileCard({
  row,
  selected,
  onSelect,
}: {
  row: BillDataRow;
  selected: boolean;
  onSelect: () => void;
}) {
  const statusConfig = getStatusConfig(row.status);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ minWidth: 0, alignItems: "center" }}
          >
            <Checkbox checked={selected} onChange={onSelect} sx={{ p: 0.25 }} />
            <StudentCell row={row} />
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", flexShrink: 0 }}
          >
            <Label variant="soft" color={statusConfig.color}>
              {statusConfig.label}
            </Label>
            <BillActions row={row} />
          </Stack>
        </Stack>

        <Box>
          <Typography variant="body2">
            {row.jenis_pembayaran_keuangan?.nama_pembayaran ?? "-"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {row.jenis_pembayaran_keuangan?.kode_jenis_pembayaran ?? "-"} •{" "}
            {formatPeriod(row)}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "1fr 1fr" }}>
          <AmountInfo label="Tagihan" value={fCurrency(row.nominal_tagihan)} />
          <AmountInfo label="Dibayar" value={fCurrency(row.nominal_dibayar)} />
          <AmountInfo label="Sisa" value={fCurrency(row.sisa_tagihan)} />
          <AmountInfo
            label="Jatuh Tempo"
            value={
              row.tanggal_jatuh_tempo ? fDate(row.tanggal_jatuh_tempo) : "-"
            }
          />
        </Box>
      </Stack>
    </Box>
  );
}

function StudentCell({ row }: { row: BillDataRow }) {
  const name = row.siswa?.nama_lengkap ?? "-";
  const nis = row.siswa?.nis ?? "-";

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "center", minWidth: 0 }}
    >
      <Avatar alt={name} sx={{ width: 40, height: 40, flexShrink: 0 }}>
        {name.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {name}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>
          {nis}
        </Typography>
      </Box>
    </Stack>
  );
}

function BillActions({ row }: { row: BillDataRow }) {
  return (
    <IconButton
      onClick={() => undefined}
      aria-label={`Aksi tagihan ${row.siswa?.nama_lengkap ?? row.id}`}
    >
      <Iconify icon="eva:more-vertical-fill" />
    </IconButton>
  );
}

function AmountInfo({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        bgcolor: "background.neutral",
        minWidth: 0,
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
