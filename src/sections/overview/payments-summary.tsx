import { useState, useCallback } from "react";

import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";

import { fShortenNumber } from "@/utils/format-number";

import { Chart, useChart, ChartSelect, ChartLegends } from "@/components/chart";

// ----------------------------------------------------------------------

export function PaymentsSummary({
  title,
  subheader,
  chart,
  sx = undefined,
  ...other
}) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState("2023");

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: chart.categories },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartColors}
        labels={chart.series[0].data.map((item) => item.name)}
        values={[fShortenNumber(1234), fShortenNumber(6789)]}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="area"
        series={currentSeries?.data}
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}
