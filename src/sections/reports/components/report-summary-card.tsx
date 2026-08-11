import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from "@/components/iconify";

type ReportSummaryCardProps = {
  title: string;
  value: string;
  caption: string;
  icon: string;
  color: string;
};

export function ReportSummaryCard({ title, value, caption, icon, color }: ReportSummaryCardProps) {
  return (
    <Card sx={{ p: 2.5, minWidth: 0, height: "100%" }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            display: "grid",
            flexShrink: 0,
            borderRadius: 2,
            placeItems: "center",
            color,
            bgcolor: `${color}18`,
          }}
        >
          <Iconify icon={icon} width={28} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ my: 0.5, wordBreak: "break-word" }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {caption}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
