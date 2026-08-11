import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentCounterKeys } from "./payment-counter.keys";
import { PaymentCounterRepository } from "./payment-counter.repository";
import type { PaymentStudent, RecordPaymentInput } from "./payment-counter.repository";

export function useSyncStudentBills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (student: PaymentStudent) => PaymentCounterRepository.syncStudentBills(student),
    onSuccess: (_data, student) => {
      queryClient.invalidateQueries({ queryKey: paymentCounterKeys.bills(student.id) });
    },
  });
}

export function useRecordCounterPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RecordPaymentInput) => PaymentCounterRepository.recordPayment(input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: paymentCounterKeys.bills(input.id_siswa) });
    },
  });
}
