import { queryOptions } from "@tanstack/react-query";

import { paymentCounterKeys } from "./payment-counter.keys";
import { PaymentCounterRepository } from "./payment-counter.repository";

export const paymentCounterQueries = {
  students: () =>
    queryOptions({
      queryKey: paymentCounterKeys.students(),
      queryFn: () => PaymentCounterRepository.getActiveStudents(),
    }),

  bills: (studentId: string | null) =>
    queryOptions({
      queryKey: paymentCounterKeys.bills(studentId),
      queryFn: () => PaymentCounterRepository.getOutstandingBills(studentId ?? ""),
      enabled: !!studentId,
    }),
};
