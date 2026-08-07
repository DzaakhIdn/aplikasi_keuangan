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
