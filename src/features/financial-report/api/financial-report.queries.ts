import { queryOptions } from "@tanstack/react-query";

import { financialReportKeys } from "./financial-report.keys";
import { FinancialReportRepository } from "./financial-report.repository";

export const financialReportQueries = {
  overview: () =>
    queryOptions({
      queryKey: financialReportKeys.overview(),
      queryFn: () => FinancialReportRepository.getOverview(),
    }),
};
