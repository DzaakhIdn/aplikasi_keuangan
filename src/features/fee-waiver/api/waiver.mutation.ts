import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WaiverRepository } from "./waiver.repository";
import { feeWaiverKeys } from "./waiver.keys";
import { billsDataKeys } from "@/features/bills-data/api/bills-data.keys";
import { paymentCounterKeys } from "@/features/payment-counter/api/payment-counter.keys";
import { financialReportKeys } from "@/features/financial-report/api/financial-report.keys";

function invalidateAffectedBillQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: billsDataKeys.lists() });
  queryClient.invalidateQueries({ queryKey: paymentCounterKeys.all });
  queryClient.invalidateQueries({ queryKey: financialReportKeys.overview() });
}

export function useCreateWaiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WaiverRepository.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feeWaiverKeys.lists(),
      });
      invalidateAffectedBillQueries(queryClient);
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
      invalidateAffectedBillQueries(queryClient);
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
      invalidateAffectedBillQueries(queryClient);
    },
  });
}
