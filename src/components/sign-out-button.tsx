import { useAuth } from "@/auth/context/auth-context";
import { signOut } from "@/auth/context/supabase/action";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { toast } from "@/components/snackbar";
import { useState } from "react";

// ----------------------------------------------------------------------

interface SignOutButtonProps {
  onClose?: () => void;
  sx?: SxProps<Theme>;
}

export function SignOutButton({
  onClose,
  sx,
  ...other
}: SignOutButtonProps & Omit<ButtonProps, "onClick">) {
  const { loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await signOut();
      toast.success("berhasil logout!");
    } catch (error) {
      toast.error("gagal logout");
      console.error(error);
    } finally {
      setSigningOut(false);
      onClose?.();
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      color="error"
      onClick={handleLogout}
      disabled={loading || signingOut}
      sx={sx}
      {...other}
    >
      {signingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}
