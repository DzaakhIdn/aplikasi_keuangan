import { queryOptions } from "@tanstack/react-query";

import { PaymentRepository } from "./payment.repository";
import { paymentKeys } from "./payment.keys";

export const paymentQueries = {
  all: () =>
    queryOptions({
      queryKey: paymentKeys.lists(),
      queryFn: () => PaymentRepository.getAll(),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: paymentKeys.detail(id),
      queryFn: () => PaymentRepository.getById(id),
    }),
};
