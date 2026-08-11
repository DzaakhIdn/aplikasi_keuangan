import { queryOptions } from "@tanstack/react-query";

import { WaiverRepository } from "./waiver.repository";
import { feeWaiverKeys } from "./waiver.keys";

export const waiverQueries = {
  all: () =>
    queryOptions({
      queryKey: feeWaiverKeys.lists(),
      queryFn: () => WaiverRepository.getAll(),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: feeWaiverKeys.detail(id),
      queryFn: () => WaiverRepository.getById(id),
    }),
};
