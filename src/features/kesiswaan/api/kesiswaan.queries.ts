import { queryOptions } from "@tanstack/react-query";
import { KesiswaanRepository } from "./kesiswaan.repository";

export const kesiswaanQueries = {
  aktif: () =>
    queryOptions({
      queryKey: ["kesiswaan", "aktif"],
      queryFn: () => KesiswaanRepository.getAktif(),
    }),
};
