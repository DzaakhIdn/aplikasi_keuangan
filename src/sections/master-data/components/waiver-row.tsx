import { useBoolean } from "minimal-shared/hooks";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";

import ListItemText from "@mui/material/ListItemText";
import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { FormField } from "@/components/ui/form";

import type { WaiverType, WaiverUpdate } from "../view/fee-waiver-view";

// ----------------------------------------------------------------------

const updateWaiverSchema = z.object({
  potongan: z.number().min(0, "Potongan tidak boleh negatif"),
  keterangan: z.string().nullable().optional(),
});

interface FeeWaiverTableRowProps {
  row: WaiverType;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: WaiverUpdate) => void;
}

export function FeeWaiverTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: FeeWaiverTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  const form = useForm({
    resolver: zodResolver(updateWaiverSchema),
    mode: "onChange",
    defaultValues: {
      potongan: row.potongan ?? 0,
      keterangan: row.keterangan ?? "",
    },
  });

  const handleCloseDialog = () => {
    form.reset();
    openDialog.onFalse();
  };

  const handleUpdate = (data: z.infer<typeof updateWaiverSchema>) => {
    onUpdateRow?.(data);
    handleCloseDialog();
  };

  // Data dari join
  const siswaName = (row as any).siswa?.nama_lengkap ?? row.id_siswa;
  const siswaNis = (row as any).siswa?.nis ?? "";
  const jenisPembayaran =
    (row as any).biaya_detail?.nama_pembayaran ?? row.id_jenis_pembayaran;
  const kodeJenisPembayaran = (row as any).biaya_detail?.kode_jenis_pembayaran;
  const nominalPembayaran: number | null =
    (row as any).biaya_detail?.nominal ?? null;

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
                "aria-label": `${siswaName} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={siswaName}
            secondary={siswaNis ? `${siswaNis}` : undefined}
            slotProps={{
              primary: { sx: { typography: "body2" } },
              secondary: { sx: { typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={jenisPembayaran}
            secondary={
              nominalPembayaran !== null
                ? `${kodeJenisPembayaran ? `${kodeJenisPembayaran} — ` : ""}${formatCurrency(nominalPembayaran)}`
                : undefined
            }
            slotProps={{
              primary: { sx: { typography: "body2" } },
              secondary: { sx: { typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <Label variant="soft" color="info">
            {formatCurrency(row.potongan)}
          </Label>
        </TableCell>

        <TableCell sx={{ typography: "body2" }}>
          {row.keterangan ?? "-"}
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
        <DialogTitle>Edit Keringanan Biaya</DialogTitle>
        <DialogContent>
          <FormProvider {...form}>
            <form
              id="edit-waiver-form"
              onSubmit={form.handleSubmit(handleUpdate)}
              noValidate
            >
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
                    value={field.value ?? ""}
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
          <Button type="submit" form="edit-waiver-form" variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Hapus Keringanan"
        content={`Yakin ingin menghapus keringanan untuk "${siswaName}"?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Hapus
          </Button>
        }
      />
    </>
  );
}
