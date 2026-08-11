export const paymentCounterKeys = {
  all: ["payment-counter"] as const,
  students: () => [...paymentCounterKeys.all, "students"] as const,
  bills: (studentId: string | null) => [...paymentCounterKeys.all, "bills", studentId] as const,
};
