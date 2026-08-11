import Box from "@mui/material/Box";

import { Iconify } from "@/components/iconify";

export function ReportSectionIcon({ icon, color = "primary.main" }: { icon: string; color?: string }) {
  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        display: "grid",
        borderRadius: 1.5,
        placeItems: "center",
        color,
        bgcolor: "background.neutral",
      }}
    >
      <Iconify icon={icon} width={24} />
    </Box>
  );
}
