import { lazy, Suspense } from "react";
import { mergeClasses } from "minimal-shared/utils";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { chartClasses } from "./classes";
import { ChartLoading } from "./components";

// ----------------------------------------------------------------------

// Chart types based on ApexCharts
type ChartType =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap";

// Chart props interface
interface ChartProps {
  type: ChartType;
  series: any;
  options?: Record<string, unknown>;
  slotProps?: {
    loading?: SxProps<Theme>;
  };
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

// Dynamic import with lazy loading (Vite)
const DynamicApexChart = lazy(() => import("react-apexcharts"));

export function Chart({
  type,
  series,
  options,
  slotProps,
  className,
  sx,
  ...other
}: ChartProps) {
  return (
    <ChartRoot
      dir="ltr"
      className={mergeClasses([chartClasses.root, className])}
      sx={sx}
      {...other}
    >
      <Suspense
        fallback={
          <ChartLoading type={type} sx={slotProps?.loading} className="" />
        }
      >
        <DynamicApexChart
          type={type}
          series={series}
          options={options}
          width="100%"
          height="100%"
        />
      </Suspense>
    </ChartRoot>
  );
}

// ----------------------------------------------------------------------

const ChartRoot = styled("div")(({ theme }) => ({
  width: "100%",
  flexShrink: 0,
  position: "relative",
  borderRadius: (theme.shape?.borderRadius as number) * 1.5,
}));
