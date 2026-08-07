export const feeWaiverKeys = {
    all: ["keringanan_biaya_keuangan"] as const,

    lists: () =>
    [...feeWaiverKeys.all, "list"] as const,

    list: (filters: unknown) =>
    [...feeWaiverKeys.lists(), filters] as const,

    details: () =>
    [...feeWaiverKeys.all, "details"] as const,

    detail: (id: string) =>
    [...feeWaiverKeys.details(), id] as const
}