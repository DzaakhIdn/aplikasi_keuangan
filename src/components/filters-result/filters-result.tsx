import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { Iconify } from "../iconify";

// ----------------------------------------------------------------------

export const chipProps = { size: "small" as const, variant: "soft" as const };

interface FiltersResultProps {
  sx?: any;
  onReset: () => void;
  children: React.ReactNode;
  totalResults: number;
  [key: string]: unknown;
}

export function FiltersResult({
  sx,
  onReset,
  children,
  totalResults,
  ...other
}: FiltersResultProps) {
  return (
    <ResultRoot sx={sx} {...other}>
      <ResultLabel>
        <strong>{totalResults}</strong>
        <span> results found</span>
      </ResultLabel>

      <ResultContent>
        {children}

        <Button
          color="error"
          onClick={onReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </ResultContent>
    </ResultRoot>
  );
}

// ----------------------------------------------------------------------

const ResultRoot = styled("div")``;

const ResultLabel = styled("div")(({ theme }) => ({
  ...theme.typography.body2,
  marginBottom: theme.spacing(1.5),
  "& span": { color: theme.vars.palette.text.secondary },
}));

const ResultContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(1),
}));
