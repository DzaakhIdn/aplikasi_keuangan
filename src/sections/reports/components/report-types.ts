import type { BillDataRow } from "@/features/bills-data/api/bills-data.repository";
import type { FinancialPaymentRow } from "@/features/financial-report/api/financial-report.repository";

export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export type FinancialReportFilters = {
  academicYear: string;
  paymentType: string;
  startDate: string;
  endDate: string;
};

export type ClassPercentageFilters = {
  class: string;
  paymentType: string;
  academicYear: string;
};

export type StudentArrearsFilters = {
  class: string;
  paymentType: string;
  academicYear: string;
  months: string;
};

export type MonthlyIncome = {
  month: string;
  value: number;
};

export type PaymentBreakdown = {
  name: string;
  total: number;
  paid: number;
  remaining: number;
};

export type ClassBreakdown = PaymentBreakdown;

export type ClassPaymentSummary = PaymentBreakdown & {
  paidStudents: number;
  unpaidStudents: number;
  totalStudents: number;
  percentage: number;
};

export type StudentArrearsSummary = {
  id: string;
  nis: string;
  name: string;
  rombel: string;
  total: number;
  paid: number;
  remaining: number;
  percentage: number;
  bills: BillDataRow[];
};

export type { BillDataRow, FinancialPaymentRow };
