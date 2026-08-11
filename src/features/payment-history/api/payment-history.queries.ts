import { queryOptions } from "@tanstack/react-query";

import { paymentHistoryKeys } from "./payment-history.keys";
import { PaymentHistoryRepository } from "./payment-history.repository";

export const paymentHistoryQueries = {
  all: () =>
    queryOptions({
      queryKey: paymentHistoryKeys.lists(),
      queryFn: () => PaymentHistoryRepository.getAll(),
    }),
};
