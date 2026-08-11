export const financialReportKeys = {
  all: ["financial-report"] as const,
  overview: () => [...financialReportKeys.all, "overview"] as const,
};
