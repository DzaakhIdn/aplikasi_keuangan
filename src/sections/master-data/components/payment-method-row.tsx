import { useBoolean } from "minimal-shared/hooks";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { FormField } from "@/components/ui/form";

import type { PaymentMethod, PaymentUpdate } from "../view/payment-method-view";

// ----------------------------------------------------------------------

const updatePaymentSchema = z.object({
  nama_pembayaran: z.string().min(1, "Nama pembayaran wajib diisi"),
  id_tahun_ajaran: z.string().min(1, "Tahun ajaran wajib dipilih"),
  tipe_pembayaran: z.enum(["Bulanan", "Sekali"]),
  nominal: z.number().min(0, "Nominal tidak boleh negatif"),
  status: z.boolean(),
});

interface PaymentMethodTableRowProps {
  row: PaymentMethod;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: PaymentUpdate) => void;
  tahunAjaranList?: { id: string; tahun_ajaran: string }[];
}

export function PaymentMethodTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
  tahunAjaranList = [],
}: PaymentMethodTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  const form = useForm({
    resolver: zodResolver(updatePaymentSchema),
    mode: "onChange",
    defaultValues: {
      nama_pembayaran: "",
      id_tahun_ajaran: "",
      tipe_pembayaran: "Bulanan" as const,
      nominal: 0,
      status: true,
    },
  });

  useEffect(() => {
    if (openDialog.value && row) {
      form.reset({
        nama_pembayaran: row.nama_pembayaran,
        id_tahun_ajaran: row.id_tahun_ajaran,
        tipe_pembayaran: row.tipe_pembayaran,
        nominal: row.nominal,
        status: row.status,
      });
    }
  }, [openDialog.value, row.id]);

  const handleCloseDialog = () => {
    form.reset();
    openDialog.onFalse();
  };

  const handleUpdate = (data: z.infer<typeof updatePaymentSchema>) => {
    onUpdateRow?.(data);
    handleCloseDialog();
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                "aria-label": `${row.nama_pembayaran} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell sx={{ typography: "body2" }}>
          {row.nama_pembayaran}
        </TableCell>

        <TableCell sx={{ typography: "body2" }}>
          {tahunAjaranList.find((ta) => ta.id === row.id_tahun_ajaran)
            ?.tahun_ajaran ?? row.id_tahun_ajaran}
        </TableCell>

        <TableCell>
          <Label variant="soft" color="info">
            {row.tipe_pembayaran}
          </Label>
        </TableCell>

        <TableCell sx={{ typography: "body2" }}>
          {formatCurrency(row.nominal)}
        </TableCell>

        <TableCell>
          <Label variant="soft" color={row.status ? "success" : "error"}>
            {row.status ? "Aktif" : "Nonaktif"}
          </Label>
        </TableCell>

        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color={openDialog.value ? "inherit" : "info"}
                onClick={openDialog.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hapus" placement="top" arrow>
              <IconButton
                color={confirmDialog.value ? "inherit" : "error"}
                onClick={confirmDialog.onTrue}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog.value}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Pembayaran</DialogTitle>
        <DialogContent>
          <FormProvider {...form}>
            <form
              id="edit-payment-form"
              onSubmit={form.handleSubmit(handleUpdate)}
              noValidate
            >
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
                    autoFocus
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
                name="status"
                render={({ field }) => (
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Aktif"
                  />
                )}
              />
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
          >
            Batal
          </Button>
          <Button type="submit" form="edit-payment-form" variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Hapus Pembayaran"
        content={`Yakin ingin menghapus "${row.nama_pembayaran}"?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  );
}
