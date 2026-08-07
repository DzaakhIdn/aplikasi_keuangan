import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PaymentRepository } from "./payment.repository";
import { paymentKeys } from "./payment.keys";

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PaymentRepository.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.lists(),
      });
    },
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof PaymentRepository.update>[1];
    }) => PaymentRepository.update(id, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(data.id),
      });
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PaymentRepository.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.lists(),
      });
    },
  });
}
