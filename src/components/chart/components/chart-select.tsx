/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "minimal-shared/utils";
import { usePopover } from "minimal-shared/hooks";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ButtonBase from "@mui/material/ButtonBase";

import { Iconify } from "../../iconify";
import { CustomPopover } from "../../custom-popover";

// ----------------------------------------------------------------------

export function ChartSelect({
  options,
  value,
  onChange,
  slotProps,
  ...other
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  slotProps?: {
    button?: any;
    popover?: any;
  };
  [key: string]: unknown;
}) {
  const { open, anchorEl, onClose, onOpen } = usePopover();

  // Safety check for options
  if (!options || !Array.isArray(options) || options.length === 0) {
    return null;
  }

  // Safety check for value
  const safeValue = value && options.includes(value) ? value : options[0];

  const renderMenuActions = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      {...slotProps?.popover}
    >
      <MenuList>
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === safeValue}
            onClick={() => {
              onClose();
              onChange(option);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <ButtonBase
        onClick={onOpen}
        {...slotProps?.button}
        sx={[
          (theme) => ({
            pr: 1,
            pl: 1.5,
            gap: 1.5,
            height: 34,
            borderRadius: 1,
            typography: "subtitle2",
            border: `solid 1px ${varAlpha(
              theme.vars?.palette?.grey?.["500Channel"] ||
                theme.palette.grey[500],
              0.24
            )}`,
          }),
          ...(Array.isArray(slotProps?.button?.sx)
            ? slotProps?.button?.sx ?? []
            : [slotProps?.button?.sx]),
        ]}
        {...other}
      >
        {safeValue}

        <Iconify
          width={16}
          icon={
            open ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"
          }
        />
      </ButtonBase>

      {renderMenuActions()}
    </>
  );
}
