import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WaiverRepository } from "./waiver.repository";
import { feeWaiverKeys } from "./waiver.keys";

export function useCreateWaiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WaiverRepository.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feeWaiverKeys.lists(),
      });
    },
  });
}

export function useUpdateWaiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof WaiverRepository.update>[1];
    }) => WaiverRepository.update(id, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: feeWaiverKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: feeWaiverKeys.detail(data.id),
      });
    },
  });
}

export function useDeleteWaiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WaiverRepository.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feeWaiverKeys.lists(),
      });
    },
  });
}
