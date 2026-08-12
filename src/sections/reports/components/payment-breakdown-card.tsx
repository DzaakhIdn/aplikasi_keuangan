import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { fCurrency } from "@/utils/format-number";
import { TableNoData } from "@/components/table";

import type { PaymentBreakdown } from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";

export function PaymentBreakdownCard({
  rows,
  loading,
}: {
  rows: PaymentBreakdown[];
  loading: boolean;
}) {
  return (
    <Card sx={{ minWidth: 0, height: "100%" }}>
      <CardHeader
        title="Pembayaran Berdasarkan Jenis"
        subheader="Perbandingan tagihan dan uang yang diterima"
        avatar={
          <ReportSectionIcon
            icon="solar:pie-chart-2-bold-duotone"
            color="info.main"
          />
        }
        sx={{ mb: 2 }}
      />

      <Stack spacing={2.5} sx={{ p: 3, pt: 1 }}>
        {rows.slice(0, 7).map((row) => {
          const percentage = row.total
            ? Math.min((row.paid / row.total) * 100, 100)
            : 0;

          return (
            <Box key={row.name}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between", mb: 0.75 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {row.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Tagihan {fCurrency(row.total)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography variant="subtitle2">
                    {fCurrency(row.paid)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "error.main" }}>
                    Sisa {fCurrency(row.remaining)}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  height: 8,
                  overflow: "hidden",
                  borderRadius: 999,
                  bgcolor: "background.neutral",
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: 1,
                    borderRadius: "inherit",
                    bgcolor: "success.main",
                  }}
                />
              </Box>
            </Box>
          );
        })}

        <TableNoData notFound={!loading && !rows.length} />
      </Stack>
    </Card>
  );
}
