import { queryOptions } from "@tanstack/react-query";

import { billsDataKeys } from "./bills-data.keys";
import { BillsDataRepository } from "./bills-data.repository";

export const billsDataQueries = {
  all: () =>
    queryOptions({
      queryKey: billsDataKeys.lists(),
      queryFn: () => BillsDataRepository.getAll(),
    }),
};
