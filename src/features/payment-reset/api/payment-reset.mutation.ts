import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PaymentResetRepository } from "./payment-reset.repository";

export function useResetPaymentData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PaymentResetRepository.resetPaymentData(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
