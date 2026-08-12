import { useTheme, alpha as hexAlpha } from "@mui/material/styles";

import { fCurrency, fShortenNumber } from "@/utils/format-number";
import { Chart, useChart } from "@/components/chart";

// ----------------------------------------------------------------------

export function ChartColumnSingle({ chart }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    hexAlpha(theme.palette.primary.dark, 0.8),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    yaxis: {
      labels: { formatter: (value) => fShortenNumber(value) },
    },
    tooltip: {
      y: {
        formatter: (value) => fCurrency(value),
        title: { formatter: () => "" },
      },
    },
    plotOptions: { bar: { columnWidth: "40%" } },
  });

  return (
    <Chart
      type="bar"
      series={chart.series}
      options={chartOptions}
      sx={{ height: 320 }}
    />
  );
}
