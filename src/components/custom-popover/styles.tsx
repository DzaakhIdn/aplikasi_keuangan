/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";

export interface ArrowProps {
  size?: number;
  offset?: number;
  placement?: string;
  sx?: any;
}

// ----------------------------------------------------------------------

const centerStyles = {
  hCenter: { left: 0, right: 0, margin: "auto" },
  vCenter: { top: 0, bottom: 0, margin: "auto" },
};

const getRtlPosition = ({
  position,
  isRtl,
  value,
}: {
  position: string;
  isRtl: boolean;
  value: number;
}) => ({
  [position]: isRtl ? "auto" : value,
  [position === "left" ? "right" : "left"]: isRtl ? value : "auto",
});

const createBackgroundStyles = ({
  theme,
  color,
  size,
}: {
  theme: any;
  color: string;
  size: number;
}) => {
  const paletteColor = color === "cyan" ? "info" : "error";

  // Safe access to theme properties with multiple fallbacks
  let colorChannel;
  try {
    colorChannel =
      theme.vars?.palette?.[paletteColor]?.mainChannel ||
      theme.palette?.[paletteColor]?.main ||
      (paletteColor === "info" ? "#00B8D9" : "#FF5630");
  } catch (error) {
    colorChannel = paletteColor === "info" ? "#00B8D9" : "#FF5630";
  }

  let backgroundColor;
  try {
    backgroundColor =
      theme.vars?.palette?.background?.paper ||
      theme.palette?.background?.paper ||
      "#ffffff";
  } catch (error) {
    backgroundColor = "#ffffff";
  }

  return {
    backgroundRepeat: "no-repeat",
    backgroundSize: `${size * 3}px ${size * 3}px`,
    backgroundColor,
    backgroundPosition: color === "cyan" ? "top right" : "bottom left",
    backgroundImage: `linear-gradient(45deg, ${varAlpha(
      colorChannel,
      0.1
    )}, ${varAlpha(colorChannel, 0.1)})`,
  };
};

const arrowDirection = {
  top: { top: 0, rotate: "135deg", translate: "0 -50%" },
  bottom: { bottom: 0, rotate: "-45deg", translate: "0 50%" },
  left: { rotate: "45deg", translate: "-50% 0" },
  right: { rotate: "-135deg", translate: "50% 0" },
};

export const Arrow = styled("span", {
  shouldForwardProp: (prop) =>
    !["size", "placement", "offset", "sx"].includes(prop),
})<ArrowProps>(({ offset = 0, size = 0, theme }) => {
  const isRtl = theme.direction === "rtl";

  const cyanBackgroundStyles = createBackgroundStyles({
    theme,
    color: "cyan",
    size,
  });
  const redBackgroundStyles = createBackgroundStyles({
    theme,
    color: "red",
    size,
  });

  return {
    width: size,
    height: size,
    position: "absolute",
    backdropFilter: "6px",
    borderBottomLeftRadius: size / 4,
    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
    backgroundColor: (() => {
      try {
        return (
          theme.vars?.palette?.background?.paper ||
          theme.palette?.background?.paper ||
          "#ffffff"
        );
      } catch {
        return "#ffffff";
      }
    })(),
    border: `solid 1px ${varAlpha(
      (() => {
        try {
          return (
            theme.vars?.palette?.grey?.["500Channel"] ||
            theme.palette?.grey?.[500] ||
            "#919EAB"
          );
        } catch {
          return "#919EAB";
        }
      })(),
      0.12
    )}`,

    variants: [
      /**
       * @position top*
       */
      {
        props: ({ placement }) => placement?.startsWith("top-"),
        style: { ...arrowDirection.top },
      },
      {
        props: { placement: "top-left" },
        style: {
          ...getRtlPosition({ position: "left", isRtl, value: offset }),
        },
      },
      {
        props: { placement: "top-center" },
        style: { ...centerStyles.hCenter },
      },
      {
        props: { placement: "top-right" },
        style: {
          ...getRtlPosition({ position: "right", isRtl, value: offset }),
          ...cyanBackgroundStyles,
        },
      },
      /**
       * @position bottom*
       */
      {
        props: ({ placement }) => placement?.startsWith("bottom-"),
        style: { ...arrowDirection.bottom },
      },
      {
        props: { placement: "bottom-left" },
        style: {
          ...getRtlPosition({ position: "left", isRtl, value: offset }),
          ...redBackgroundStyles,
        },
      },
      {
        props: { placement: "bottom-center" },
        style: { ...centerStyles.hCenter },
      },
      {
        props: { placement: "bottom-right" },
        style: {
          ...getRtlPosition({ position: "right", isRtl, value: offset }),
        },
      },
      /**
       * @position left*
       */
      {
        props: ({ placement }) => placement?.startsWith("left-"),
        style: {
          ...getRtlPosition({ position: "left", isRtl, value: 0 }),
          ...arrowDirection.left,
        },
      },
      {
        props: { placement: "left-top" },
        style: { top: offset },
      },
      {
        props: { placement: "left-center" },
        style: { ...centerStyles.vCenter, ...redBackgroundStyles },
      },
      {
        props: { placement: "left-bottom" },
        style: { ...redBackgroundStyles, bottom: offset },
      },
      /**
       * @position right*
       */
      {
        props: ({ placement }) => placement?.startsWith("right-"),
        style: {
          ...getRtlPosition({ position: "right", isRtl, value: 0 }),
          ...arrowDirection.right,
        },
      },
      {
        props: { placement: "right-top" },
        style: { ...cyanBackgroundStyles, top: offset },
      },
      {
        props: { placement: "right-center" },
        style: { ...centerStyles.vCenter, ...cyanBackgroundStyles },
      },
      {
        props: { placement: "right-bottom" },
        style: { bottom: offset },
      },
    ],
  };
});
