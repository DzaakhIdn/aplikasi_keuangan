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
import Autocomplete from "@mui/material/Autocomplete";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "@/routes/paths";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { Form, FormField } from "@/components/ui/form";
import { waiverQueries } from "@/features/fee-waiver/api/waiver.queries";
import { paymentQueries } from "@/features/payment-method/api/payments.queries";
import { kesiswaanQueries } from "@/features/kesiswaan/api/kesiswaan.queries";
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

import { FeeWaiverTableRow } from "../components/waiver-row";
import { PaymentTableToolbar } from "../components/payment-table-toolbar";
import { PaymentTableFiltersResult } from "../components/payment-table-filters-result";
import {
  useCreateWaiver,
  useUpdateWaiver,
  useDeleteWaiver,
} from "@/features/fee-waiver/api/waiver.mutation";

// =======================================================================

export type WaiverType =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Row"];
type WaiverInsert =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Insert"];
export type WaiverUpdate =
  Database["public"]["Tables"]["keringanan_biaya_keuangan"]["Update"];

const createWaiverSchema = z.object({
  id_siswa: z.string().min(1, "Siswa wajib dipilih"),
  id_jenis_pembayaran: z.string().min(1, "Jenis pembayaran wajib dipilih"),
  potongan: z.number().min(0, "Potongan tidak boleh negatif"),
  keterangan: z.string().optional(),
});

const TABLE_HEAD = [
  { id: "nama_siswa", label: "NAMA SANTRI", width: 200 },
  { id: "id_jenis_tagihan", label: "JENIS TAGIHAN", width: 160 },
  { id: "potongan", label: "POTONGAN", width: 120 },
  { id: "keterangan", label: "KETERANGAN", width: 160 },
  { id: "actions", label: "", width: 80 },
];

// =======================================================================

export function FeeWaiverView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  const { data: tableData = [], isLoading } = useQuery(waiverQueries.all());
  const { data: paymentMethodList = [] } = useQuery(paymentQueries.all());
  const { data: siswaList = [] } = useQuery(kesiswaanQueries.aktif());

  const createWaiver = useCreateWaiver();
  const deleteWaiver = useDeleteWaiver();
  const updateWaiver = useUpdateWaiver();

  const handleAddData = (data: z.infer<typeof createWaiverSchema>) => {
    const payload: WaiverInsert = {
      id_siswa: data.id_siswa,
      id_jenis_pembayaran: data.id_jenis_pembayaran,
      potongan: data.potongan,
      keterangan: data.keterangan || null,
    };
    createWaiver.mutate(payload, {
      onSuccess: () => {
        toast.success("Keringanan berhasil ditambahkan");
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
    inputData: tableData as unknown as WaiverType[],
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const form = useForm<z.infer<typeof createWaiverSchema>>({
    resolver: zodResolver(createWaiverSchema),
    defaultValues: {
      id_siswa: "",
      id_jenis_pembayaran: "",
      potongan: 0,
      keterangan: "",
    },
  });

  const canReset = !!currentFilters.name || currentFilters.status !== "all";
  const notFound =
    (!dataFiltered.length && canReset) || (!isLoading && !dataFiltered.length);

  const handleDeleteRow = (id: string) => deleteWaiver.mutate(id);

  const handleDeleteRows = () => {
    table.selected.forEach((id) => deleteWaiver.mutate(id));
    confirmDialog.onFalse();
  };

  return (
    <>
      <DashboardContent
        maxWidth={false}
        sx={{ borderTop: `solid 1px rgba(145, 158, 171, 0.12)`, pt: 3 }}
      >
        <CustomBreadcrumbs
          heading="Keringanan Biaya"
          links={[
            { name: "Dashboard", href: paths.ROOTS },
            { name: "Master Data" },
            { name: "Keringanan Biaya" },
          ]}
          action={
            <Button
              onClick={openDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tambah Keringanan
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
                  dataFiltered.map((r) => r.id),
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
                      dataFiltered.map((r) => r.id),
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
                      <FeeWaiverTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onUpdateRow={(updated) =>
                          updateWaiver.mutate({ id: row.id, payload: updated })
                        }
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
        <DialogTitle>Tambah Keringanan Baru</DialogTitle>
        <DialogContent>
          <Form {...form}>
            <form
              id="add-waiver-form"
              onSubmit={form.handleSubmit(handleAddData)}
              noValidate
            >
              <FormField
                control={form.control}
                name="id_siswa"
                render={({ field }) => (
                  <Autocomplete
                    options={siswaList}
                    getOptionLabel={(option) =>
                      `${option.nama_lengkap} — ${option.nis}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={siswaList.find((s) => s.id === field.value) ?? null}
                    onChange={(_, newValue) =>
                      field.onChange(newValue?.id ?? "")
                    }
                    onBlur={field.onBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nama Santri"
                        margin="dense"
                        error={!!form.formState.errors.id_siswa}
                        helperText={form.formState.errors.id_siswa?.message}
                        placeholder="Cari nama atau NIS..."
                      />
                    )}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="id_jenis_pembayaran"
                render={({ field }) => (
                  <TextField
                    select
                    label="Jenis Pembayaran"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    error={!!form.formState.errors.id_jenis_pembayaran}
                    helperText={
                      form.formState.errors.id_jenis_pembayaran?.message
                    }
                  >
                    {paymentMethodList.map((pm) => (
                      <MenuItem key={pm.id} value={pm.id}>
                        {pm.kode_jenis_pembayaran} — {pm.nama_pembayaran} —{" "}
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(pm.nominal)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <FormField
                control={form.control}
                name="potongan"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Potongan"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    type="number"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10) || 0)
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">Rp</InputAdornment>
                        ),
                      },
                      htmlInput: { min: 0, step: 1000 },
                    }}
                    error={!!form.formState.errors.potongan}
                    helperText={form.formState.errors.potongan?.message}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Keterangan"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    multiline
                    rows={3}
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
            form="add-waiver-form"
            variant="contained"
            disabled={createWaiver.isPending}
          >
            {createWaiver.isPending ? "Menyimpan..." : "Simpan"}
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
            disabled={deleteWaiver.isPending}
          >
            {deleteWaiver.isPending ? "Menghapus..." : "Hapus"}
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
}: {
  inputData: WaiverType[];
  comparator: (a: WaiverType, b: WaiverType) => number;
  filters: { name: string; status: string };
}): WaiverType[] {
  const stabilized: [WaiverType, number][] = inputData.map((el, i) => [el, i]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}
