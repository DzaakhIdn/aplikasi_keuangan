import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";

import "./index.css";
import App from "./App";
import { authRoutes } from "./auth/routes";
import { AuthenticatedHome } from "./auth/authenticated-home";
import { DashboardLayout } from "./layouts/dashboard";
import OverviewAppPage from "./pages";
import PaymentMethodPage from "./pages/master-data/payment-method";
import FeeWaiverPage from "./pages/master-data/fee-waiver";
import PaymentHistoryPage from "./pages/transaction/payment-history";
import PaymentCounterPage from "./pages/transaction/payment-counter";
import BillsDataPage from "./pages/bills-management/bills-data";
import FinancialReportPage from "./pages/reports/financial-reports";
import ClassPercentagePage from "./pages/reports/class-percentage";
import StudentArrearsPage from "./pages/reports/student-arrears";
import MessageTemplatePage from "./pages/administration/message-template";

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    children: [
      {
        element: (
          <AuthenticatedHome>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </AuthenticatedHome>
        ),
        children: [
          { index: true, element: <OverviewAppPage /> },
          {
            path: "master-data/payment-method",
            element: <PaymentMethodPage />,
          },
          {
            path: "master-data/fee-waiver",
            element: <FeeWaiverPage />,
          },
          {
            path: "transaction/payment-counter",
            element: <PaymentCounterPage />,
          },
          {
            path: "transaction/payment-history",
            element: <PaymentHistoryPage />,
          },
          {
            path: "bills-management/bills-data",
            element: <BillsDataPage />,
          },
          {
            path: "reports/financial-reports",
            element: <FinancialReportPage />,
          },
          {
            path: "reports/class-percentage",
            element: <ClassPercentagePage />,
          },
          {
            path: "reports/student-arrears",
            element: <StudentArrearsPage />,
          },
          {
            path: "administration/message-template",
            element: <MessageTemplatePage />,
          },
        ],
      },
      ...authRoutes,
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element with id "root" was not found.');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
