import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { paths } from "@/routes/paths";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import {
  DEFAULT_BILLING_MESSAGE_TEMPLATE,
  getBillingMessageTemplate,
  renderBillingMessage,
  resetBillingMessageTemplate,
  saveBillingMessageTemplate,
} from "@/features/billing-message/message-template";

const PREVIEW_DATA = {
  studentName: "Ahmad Fulan",
  studentNis: "12345",
  bills: [
    { name: "SPP", period: "Juni 2026", amount: 1500000 },
    { name: "Biaya Daftar Ulang", period: "Kelas 10", amount: 2000000 },
  ],
};

export function MessageTemplateView() {
  const [template, setTemplate] = useState(() => getBillingMessageTemplate());
  const preview = useMemo(
    () => renderBillingMessage(template, PREVIEW_DATA),
    [template],
  );

  const handleSave = () => {
    saveBillingMessageTemplate(template);
    toast.success("Template pesan tagihan berhasil disimpan");
  };

  const handleReset = () => {
    resetBillingMessageTemplate();
    setTemplate(DEFAULT_BILLING_MESSAGE_TEMPLATE);
    toast.success("Template pesan tagihan dikembalikan ke default");
  };

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ borderTop: "solid 1px rgba(145, 158, 171, 0.12)", pt: 3 }}
    >
      <CustomBreadcrumbs
        heading="Template Pesan"
        links={[
          { name: "Dashboard", href: paths.ROOTS },
          { name: "Administration" },
          { name: "Template Pesan" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(360px, 0.7fr)" },
        }}
      >
        <Card sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6">Template Pesan Tagihan WhatsApp</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Placeholder yang tersedia: {"{{nama_santri}}"}, {"{{nis}}"}, {"{{rincian_tagihan}}"}, {"{{total_tagihan}}"}.
              </Typography>
            </Box>

            <TextField
              multiline
              minRows={18}
              label="Template pesan"
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
            />

            <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
              <Button color="inherit" onClick={handleReset} startIcon={<Iconify icon="solar:restart-bold" />}>
                Reset Default
              </Button>
              <Button variant="contained" onClick={handleSave} startIcon={<Iconify icon="solar:diskette-bold-duotone" />}>
                Simpan Template
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Preview</Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                bgcolor: "background.neutral",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "inherit",
                typography: "body2",
              }}
            >
              {preview}
            </Box>
          </Stack>
        </Card>
      </Box>
    </DashboardContent>
  );
}
