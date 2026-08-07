"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";

import { Label } from "./label";
import { Iconify } from "./iconify";
import { Scrollbar } from "./scrollbar";
import { AnimateBorder } from "./animate/animate-border";
import { AccountButton } from "./account-button";
import { SignOutButton } from "./sign-out-button";
import { useAuth } from "@/auth/context/auth-context";
// ----------------------------------------------------------------------

interface AdminUser {
  id: string;
  username?: string;
  nama_lengkap?: string;
  email?: string;
  role: string;
}

// ----------------------------------------------------------------------

interface MenuOption {
  label: string;
  href: string;
  icon: React.ReactNode;
  info?: string;
}

interface AccountDrawerProps {
  data: MenuOption[];
  sx?: SxProps<Theme>;
}

export function AccountDrawer({
  data = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Iconify icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: "Admin Settings",
      href: "/dashboard/admin/settings",
      icon: <Iconify icon="solar:settings-bold-duotone" />,
    },
    {
      label: "User Management",
      href: "/dashboard/admin/users",
      icon: <Iconify icon="solar:users-group-rounded-bold" />,
    },
    {
      label: "Pengumuman",
      href: "/dashboard/admin/pengumuman",
      icon: <Iconify icon="mingcute:announcement-line" />,
    },
  ],
  sx,
  ...other
}: AccountDrawerProps) {
  const [open, setOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  const { user } = useAuth();

  // Fetch complete admin user data
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch("/api/dashboard/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setAdminUser({
            id: userData.id,
            username: userData.username,
            nama_lengkap: userData.nama_lengkap,
            email: userData.email,
            role: userData.role,
          });
        } else {
          // Fallback to basic user data
          setAdminUser({
            id: user.id,
            username: user.email || "admin",
            nama_lengkap: "Administrator",
            email: user.email,
            role: user.role,
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        // Use basic user data as fallback
        setAdminUser({
          id: user.id,
          username: user.email || "admin",
          nama_lengkap: "Administrator",
          email: user.email,
          role: user.role,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: "6px", width: 96, height: 96, borderRadius: "50%" }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: "primary.main" } },
      }}
    >
      <Avatar
        sx={{
          width: "100%",
          height: "100%",
          border: "2px solid",
          borderColor: "primary.main",
          bgcolor: "background.paper",
        }}
      >
        {adminUser?.nama_lengkap?.charAt(0).toUpperCase() ||
          adminUser?.username?.charAt(0).toUpperCase() ||
          "A"}
      </Avatar>
    </AnimateBorder>
  );

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          "& li": { p: 0 },
        }),
      ]}
    >
      {data.map((option) => (
        <MenuItem key={option.label}>
          <Link
            href={option.href}
            color="inherit"
            underline="none"
            onClick={onClose}
            sx={{
              p: 1,
              width: 1,
              display: "flex",
              typography: "body2",
              alignItems: "center",
              color: "text.secondary",
              "& svg": { width: 24, height: 24 },
              "&:hover": { color: "text.primary" },
            }}
          >
            {option.icon}

            <Box component="span" sx={{ ml: 2 }}>
              {option.label}
            </Box>

            {option.info && (
              <Label color="error" sx={{ ml: 1 }}>
                {option.info}
              </Label>
            )}
          </Link>
        </MenuItem>
      ))}
    </MenuList>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={undefined}
        displayName={
          adminUser?.nama_lengkap ||
          adminUser?.username ||
          user?.email ||
          "Admin"
        }
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: "absolute",
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {adminUser?.nama_lengkap ||
                adminUser?.username ||
                "Administrator"}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
              noWrap
            >
              {adminUser?.email || adminUser?.username || "admin@system"}
            </Typography>
          </Box>

          <Box sx={{ p: 2.5, display: "flex", justifyContent: "center" }}>
            <Label
              variant="filled"
              color={
                (adminUser?.role === "admin" && "error") ||
                (adminUser?.role === "panitia" && "warning") ||
                "default"
              }
            >
              {adminUser?.role?.toUpperCase() || "ADMIN"}
            </Label>
          </Box>

          {renderList()}

          <Box sx={{ px: 2.5, py: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.neutral",
                border: "1px dashed",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                System Status
              </Typography>
              <Typography variant="caption" sx={{ color: "success.main" }}>
                ● All systems operational
              </Typography>
            </Box>
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
