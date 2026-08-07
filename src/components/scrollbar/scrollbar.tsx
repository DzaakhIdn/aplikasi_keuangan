import SimpleBar from "simplebar-react";
import { mergeClasses } from "minimal-shared/utils";
import type { ReactNode } from "react";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { scrollbarClasses } from "./classes";

// ----------------------------------------------------------------------

interface ScrollbarSlotProps {
  wrapperSx?: SxProps<Theme>;
  contentWrapperSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

interface ScrollbarProps
  extends Omit<
    React.ComponentProps<typeof SimpleBar>,
    "sx" | "className" | "ref"
  > {
  sx?: SxProps<Theme>;
  ref?: React.ComponentProps<typeof SimpleBar>["ref"];
  children?: ReactNode;
  className?: string;
  slotProps?: ScrollbarSlotProps;
  fillContent?: boolean;
}

export function Scrollbar({
  sx,
  ref,
  children,
  className,
  slotProps,
  fillContent = true,
  ...other
}: ScrollbarProps) {
  return (
    <ScrollbarRoot
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      fillContent={fillContent}
      className={mergeClasses([scrollbarClasses.root, className])}
      sx={[
        {
          "& .simplebar-wrapper": slotProps?.wrapperSx,
          "& .simplebar-content-wrapper": slotProps?.contentWrapperSx,
          "& .simplebar-content": slotProps?.contentSx,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </ScrollbarRoot>
  );
}

// ----------------------------------------------------------------------

interface ScrollbarRootProps {
  fillContent?: boolean;
}

const ScrollbarRoot = styled(SimpleBar, {
  shouldForwardProp: (prop) => !["fillContent", "sx"].includes(prop as string),
})<ScrollbarRootProps>(({ fillContent }) => ({
  minWidth: 0,
  minHeight: 0,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  ...(fillContent && {
    "& .simplebar-content": {
      display: "flex",
      flex: "1 1 auto",
      minHeight: "100%",
      flexDirection: "column",
    },
  }),
}));
