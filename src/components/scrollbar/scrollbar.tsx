import SimpleBar from "simplebar-react";
import { mergeClasses } from "minimal-shared/utils";
import type { ReactNode } from "react";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { scrollbarClasses } from "./classes";
import "./styles.css";

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
  fillContent = false,
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
  ...(fillContent
    ? {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }
    : {
        display: "block",
      }),
  ...(fillContent && {
    "& .simplebar-wrapper": {
      flex: "1 1 auto",
      minHeight: 0,
    },
    "& .simplebar-mask": {
      minHeight: 0,
    },
    "& .simplebar-offset": {
      minHeight: 0,
    },
    "& .simplebar-content-wrapper": {
      minHeight: 0,
    },
    "& .simplebar-content": {
      display: "flex",
      flex: "1 1 auto",
      minHeight: "100%",
      flexDirection: "column",
    },
  }),
}));
