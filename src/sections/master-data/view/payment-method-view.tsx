import { useBoolean, useSetState } from "minimal-shared/hooks";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { paths } from "@/routes/paths";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { Form, FormField } from "@/components/ui/form";
import { paymentQueries } from "@/features/payment-method/api/payments.queries";
import { tahunAjaranQueries } from "@/features/tahun-ajaran/api/tahun-ajaran.queries";
import type { Database } from "@/lib/database.types";

import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";

import { PaymentMethodTableRow } from "../components/payment-method-row";
import { PaymentTableToolbar } from "../components/payment-table-toolbar";
import { PaymentTableFiltersResult } from "../components/payment-table-filters-result";
import {
  useCreatePaymentMethod,
  useDeletePaymentMethod,
  useUpdatePaymentMethod,
} from "@/features/payment-method/api/payment.mutation";

// =======================================================================

export type PaymentMethod =
  Database["public"]["Tables"]["jenis_pembayaran_keuangan"]["Row"];
type PaymentInsert =
  Database["public"]["Tables"]["jenis_pembayaran_keuangan"]["Insert"];
export type PaymentUpdate =
  Database["public"]["Tables"]["jenis_pembayaran_keuangan"]["Update"];

const createPaymentSchema = z.object({
  kode_jenis_pembayaran: z
    .string()
    .min(1, "Kode pembayaran wajib diisi")
    .regex(/^[A-Z0-9_-]+$/, "Kode hanya boleh A-Z, 0-9, underscore, atau strip"),
  nama_pembayaran: z.string().min(1, "Nama Pembayaran wajib diisi"),
  id_tahun_ajaran: z.string().min(1, "Tahun ajaran wajib dipilih"),
  tipe_pembayaran: z.enum(["Bulanan", "Sekali"]),
  nominal: z.number().min(0, "Nominal tidak boleh negatif"),
  tanggal_jatuh_tempo: z
    .number()
    .min(1, "Tanggal minimal 1")
    .max(28, "Tanggal maksimal 28")
    .nullable(),
});

const TABLE_HEAD = [
  { id: "kode_jenis_pembayaran", label: "KODE", width: 120 },
  { id: "nama_pembayaran", label: "NAMA PEMBAYARAN", width: 200 },
  { id: "id_tahun_ajaran", label: "TAHUN AJARAN", width: 120 },
  { id: "tipe_pembayaran", label: "TIPE", width: 120 },
  { id: "nominal", label: "NOMINAL", width: 120 },
  { id: "tanggal_jatuh_tempo", label: "JATUH TEMPO", width: 120 },
  { id: "status", label: "STATUS", width: 100 },
  { id: "actions", label: "", width: 80 },
];

// =======================================================================

export function PaymentMethodView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  const { data: tableData = [], isLoading } = useQuery(paymentQueries.all());
  const { data: tahunAjaranList = [] } = useQuery(tahunAjaranQueries.all());

  const createPaymentMethod = useCreatePaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();
  const updatePaymentMethod = useUpdatePaymentMethod();

  // Close dialog & reset form setelah create berhasil
  const handleAddData = (data: z.infer<typeof createPaymentSchema>) => {
    const payload: PaymentInsert = {
      kode_jenis_pembayaran: data.kode_jenis_pembayaran,
      nama_pembayaran: data.nama_pembayaran,
      id_tahun_ajaran: data.id_tahun_ajaran,
      tipe_pembayaran: data.tipe_pembayaran,
      nominal: data.nominal,
      tanggal_jatuh_tempo: data.tanggal_jatuh_tempo,
      status: true,
    };
    createPaymentMethod.mutate(payload, {
      onSuccess: () => {
        toast.success("Pembayaran berhasil ditambahkan");
        form.reset();
        openDialog.onFalse();
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const filtersState = useSetState({ name: "", status: "all" });
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filtersState;
  const filters = {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  };

  const dataFiltered = applyFilter({
    inputData: tableData as PaymentMethod[],
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      kode_jenis_pembayaran: "",
      nama_pembayaran: "",
      id_tahun_ajaran: "",
      tipe_pembayaran: "Bulanan",
      nominal: 0,
      tanggal_jatuh_tempo: null,
    },
  });

  const canReset = !!currentFilters.name || currentFilters.status !== "all";
  const notFound =
    (!dataFiltered.length && canReset) || (!isLoading && !dataFiltered.length);

  const handleDeleteRow = (id: string) =>
    deletePaymentMethod.mutate(String(id), {
      onSuccess: () => toast.success("Jenis pembayaran berhasil dinonaktifkan"),
      onError: (error: Error) => toast.error(error.message),
    });

  const handleDeleteRows = () => {
    table.selected.forEach((id) => {
      deletePaymentMethod.mutate(id, {
        onError: (error: Error) => toast.error(error.message),
      });
    });
    toast.success("Jenis pembayaran terpilih dinonaktifkan");
    confirmDialog.onFalse();
  };

  return (
    <>
      <DashboardContent
        maxWidth={false}
        sx={{ borderTop: `solid 1px rgba(145, 158, 171, 0.12)`, pt: 3 }}
      >
        <CustomBreadcrumbs
          heading="Jenis Pembayaran"
          links={[
            { name: "Dashboard", href: paths.ROOTS },
            { name: "Master Data" },
            { name: "Jenis Pembayaran" },
          ]}
          action={
            <Button
              onClick={openDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Pembayaran Baru
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ width: "100%", overflow: "hidden" }}>
          <PaymentTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <PaymentTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((r) => String(r.id)),
                )
              }
              action={
                <Tooltip title="Hapus">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((r) => String(r.id)),
                    )
                  }
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row) => (
                      <PaymentMethodTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onUpdateRow={(updated) =>
                          updatePaymentMethod.mutate({
                            id: String(row.id),
                            payload: updated,
                          })
                        }
                        tahunAjaranList={tahunAjaranList}
                      />
                    ))}
                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length,
                    )}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {/* Add Dialog */}
      <Dialog
        open={openDialog.value}
        onClose={openDialog.onFalse}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tambah Pembayaran Baru</DialogTitle>
        <DialogContent>
          <Form {...form}>
            <form
              id="add-payment-form"
              onSubmit={form.handleSubmit(handleAddData)}
              noValidate
            >
              <FormField
                control={form.control}
                name="kode_jenis_pembayaran"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kode Pembayaran"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    autoFocus
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase().replace(/\s+/g, "-"))
                    }
                    error={!!form.formState.errors.kode_jenis_pembayaran}
                    helperText={
                      form.formState.errors.kode_jenis_pembayaran?.message ??
                      "Contoh: SPP, DAFTAR-ULANG, SERAGAM"
                    }
                  />
                )}
              />
              <FormField
                control={form.control}
                name="nama_pembayaran"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nama Pembayaran"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    error={!!form.formState.errors.nama_pembayaran}
                    helperText={form.formState.errors.nama_pembayaran?.message}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="id_tahun_ajaran"
                render={({ field }) => (
                  <TextField
                    select
                    label="Tahun Ajaran"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    error={!!form.formState.errors.id_tahun_ajaran}
                    helperText={form.formState.errors.id_tahun_ajaran?.message}
                  >
                    {tahunAjaranList.map((ta) => (
                      <MenuItem key={ta.id} value={ta.id}>
                        {ta.tahun_ajaran}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormField
                control={form.control}
                name="tipe_pembayaran"
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipe"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  >
                    <MenuItem value="Bulanan">Bulanan</MenuItem>
                    <MenuItem value="Sekali">Sekali</MenuItem>
                  </TextField>
                )}
              />
              <FormField
                control={form.control}
                name="nominal"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nominal"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    type="number"
                    value={field.value || 0}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    error={!!form.formState.errors.nominal}
                    helperText={form.formState.errors.nominal?.message}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="tanggal_jatuh_tempo"
                render={({ field }) => (
                  <TextField
                    label="Tanggal Jatuh Tempo"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(Number.isNaN(value) ? null : value);
                    }}
                    error={!!form.formState.errors.tanggal_jatuh_tempo}
                    helperText={
                      form.formState.errors.tanggal_jatuh_tempo?.message ??
                      "Isi 1-28. Kosongkan jika tidak ada jatuh tempo."
                    }
                    slotProps={{ htmlInput: { min: 1, max: 28 } }}
                  />
                )}
              />
            </form>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={openDialog.onFalse}
            variant="outlined"
            color="inherit"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="add-payment-form"
            variant="contained"
            disabled={createPaymentMethod.isPending}
          >
            {createPaymentMethod.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Hapus"
        content={`Yakin ingin menghapus ${table.selected.length} data?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRows}
            disabled={deletePaymentMethod.isPending}
          >
            {deletePaymentMethod.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        }
      />
    </>
  );
}

// =======================================================================

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: PaymentMethod[];
  comparator: (a: PaymentMethod, b: PaymentMethod) => number;
  filters: { name: string; status: string };
}): PaymentMethod[] {
  const { name, status } = filters;

  const stabilized: [PaymentMethod, number][] = inputData.map((el, i) => [
    el,
    i,
  ]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  let result = stabilized.map((el) => el[0]);

  if (name) {
    result = result.filter((row) =>
      row.nama_pembayaran.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (status !== "all") {
    result = result.filter((row) =>
      status === "aktif" ? row.status === true : row.status === false,
    );
  }

  return result;
}
