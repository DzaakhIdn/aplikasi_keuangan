import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { type SxProps, type Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function TableEmptyRows({ emptyRows, height, sx, ...other }: {
  emptyRows: number;
  height?: number;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={[
        () => ({
          ...(height && { height: height * emptyRows }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}
