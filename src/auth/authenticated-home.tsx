import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { authPaths } from "./paths";
import { useAuth } from "./context/auth-context";

export function AuthenticatedHome({ children }: PropsWithChildren) {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) return <Navigate replace to={authPaths.signIn} />;

  return <>{children}</>;
}
