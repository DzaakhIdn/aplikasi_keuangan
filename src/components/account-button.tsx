import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import type { IconButtonProps } from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface AccountButtonProps extends Omit<IconButtonProps, "sx"> {
  photoURL?: string;
  displayName?: string;
  sx?: SxProps<Theme>;
}

export function AccountButton({
  photoURL,
  displayName,
  sx,
  ...other
}: AccountButtonProps) {
  return (
    <IconButton
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Avatar src={photoURL} alt={displayName} sx={{ width: 40, height: 40 }}>
        {displayName?.charAt(0).toUpperCase()}
      </Avatar>
    </IconButton>
  );
}
