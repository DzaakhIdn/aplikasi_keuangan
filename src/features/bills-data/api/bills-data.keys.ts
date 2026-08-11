export const billsDataKeys = {
  all: ["bills-data"] as const,
  lists: () => [...billsDataKeys.all, "list"] as const,
};
