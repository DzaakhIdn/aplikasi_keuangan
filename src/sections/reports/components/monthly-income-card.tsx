import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { fCurrency, fShortenNumber } from "@/utils/format-number";
import { Chart, useChart } from "@/components/chart";

import type { MonthlyIncome } from "./report-types";
import { ReportSectionIcon } from "./report-section-icon";

export function MonthlyIncomeCard({ data }: { data: MonthlyIncome[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartOptions = useChart({
    colors: ["#16A34A"],
    xaxis: { categories: data.map((item) => item.month) },
    yaxis: {
      labels: { formatter: (value: number) => fShortenNumber(value) },
    },
    tooltip: {
      y: { formatter: (value: number) => fCurrency(value) },
    },
    plotOptions: {
      bar: {
        columnWidth: "42%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    grid: { padding: { left: 8, right: 8 } },
  });

  return (
    <Card sx={{ minWidth: 0, height: "100%" }}>
      <CardHeader
        title="Tren Pendapatan"
        subheader="Pembayaran berhasil per bulan"
        avatar={<ReportSectionIcon icon="solar:chart-bold-duotone" color="success.main" />}
        action={
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Total periode</Typography>
            <Typography variant="subtitle1">{fCurrency(total)}</Typography>
          </Box>
        }
        sx={{ "& .MuiCardHeader-action": { m: 0, alignSelf: "center" } }}
      />

      <Box sx={{ px: 1.5, pb: 2 }}>
        <Chart
          type="bar"
          series={[{ name: "Pendapatan", data: data.map((item) => item.value) }]}
          options={chartOptions}
          sx={{ height: 320 }}
        />
      </Box>
    </Card>
  );
}
