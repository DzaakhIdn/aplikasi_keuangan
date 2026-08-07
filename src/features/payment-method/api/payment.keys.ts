export const paymentKeys = {
    all: ["jenis_pembayaran_keuangan"] as const,

    lists: () =>
    [...paymentKeys.all, "list"] as const,

    list: (filters: unknown) =>
    [...paymentKeys.lists(), filters] as const,

    details: () =>
    [...paymentKeys.all, "details"] as const,

    detail: (id: string) =>
    [...paymentKeys.details(), id] as const
}