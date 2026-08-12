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
import { FeeWaiverView } from "./sections/master-data/view";
import { HistoryistView } from "./sections/transaction/view";
import PaymentCounterPage from "./pages/transaction/payment-counter";
import { InvoiceListView } from "./sections/bills-management/view/invoice-list-view";
import FinancialReportPage from "./pages/reports/financial-reports";
import { ClassPercentageView } from "./sections/reports/view";

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
            element: <FeeWaiverView />,
          },
          {
            path: "transaction/payment-counter",
            element: <PaymentCounterPage />,
          },
          {
            path: "transaction/payment-history",
            element: <HistoryistView />,
          },
          {
            path: "bills-management/bills-data",
            element: <InvoiceListView />,
          },
          {
            path: "reports/financial-reports",
            element: <FinancialReportPage />,
          },
          {
            path: "reports/class-percentage",
            element: <ClassPercentageView />,
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
