export const paymentHistoryKeys = {
  all: ["payment-history"] as const,
  lists: () => [...paymentHistoryKeys.all, "list"] as const,
};
