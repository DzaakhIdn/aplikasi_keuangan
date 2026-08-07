import { queryOptions } from "@tanstack/react-query";
import { TahunAjaranRepository } from "./tahun-ajaran.repository";

export const tahunAjaranQueries = {
  all: () =>
    queryOptions({
      queryKey: ["tahun_ajaran"],
      queryFn: () => TahunAjaranRepository.getAll(),
    }),
};
