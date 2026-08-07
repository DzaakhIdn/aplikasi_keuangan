import { kebabCase } from "es-toolkit";

export const paths = {
    ROOTS: '/',
    paymentMethod: 'master-data/payment-method',
    feeWaiver: 'master-data/fee-waiver',
    paymentCounter: 'transaction/payment-counter',
    paymentHistory: 'transaction/payment-history',
    createBill: 'bills-management/create-bill',
    billsData: 'bills-management/bills-data',
    financialReports: 'reports/financial-reports',
    classPercentage: 'reports/class-percentage',
    studentArrears: 'reports/student-arrears',
    alumniArrears: 'reports/alumni-arrears',
    canceledTransaction: 'reports/canceled-transaction',
}