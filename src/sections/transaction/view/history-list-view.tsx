// @ts-nocheck
import { useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useSetState } from "minimal-shared/hooks";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { useTheme } from "@mui/material/styles";

import { paths } from "@/routes/paths";

import { fIsAfter, fIsBetween } from "@/utils/format-time";

import { DashboardContent } from "@/layouts/dashboard";

import { Label } from "@/components/label";
import { Scrollbar } from "@/components/scrollbar";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paymentHistoryQueries } from "@/features/payment-history/api/payment-history.queries";
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from "@/components/table";

import { InvoiceTableRow } from "../history-table-row";
import { InvoiceTableToolbar } from "../history-table-toolbar";
import { InvoiceTableFiltersResult } from "../history-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "invoiceNumber", label: "NAMA SANTRI" },
  { id: "createDate", label: "TANGGAL BAYAR" },
  { id: "dueDate", label: "JATUH TEMPO" },
  { id: "price", label: "JUMLAH BAYAR" },
  { id: "jenisPembayaran", label: "JENIS PEMBAYARAN", align: "center" },
  { id: "status", label: "STATUS" },
];

// ----------------------------------------------------------------------

export function HistoryistView() {
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: "createDate" });
  const { data: tableData = [], isLoading } = useQuery(paymentHistoryQueries.all());

  const filters = useSetState({
    name: "",
    service: [],
    status: "all",
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.name ||
    currentFilters.service.length > 0 ||
    currentFilters.status !== "all" ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || (!isLoading && !dataFiltered.length);

  const getInvoiceLength = (status) =>
    tableData.filter((item) => item.status === status).length;

  const TABS: {
    value: string;
    label: string;
    color: "default" | "success" | "warning" | "error";
    count: number;
  }[] = [
    {
      value: "all",
      label: "All",
      color: "default",
      count: tableData.length,
    },
    {
      value: "paid",
      label: "Lunas",
      color: "success",
      count: getInvoiceLength("paid"),
    },
    {
      value: "canceled",
      label: "Batal",
      color: "error",
      count: getInvoiceLength("canceled"),
    },
  ];

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table],
  );

  return (
    <>
      <DashboardContent
        maxWidth={false}
        sx={{ borderTop: `solid 1px rgba(145, 158, 171, 0.12)`, pt: 3 }}
      >
        <CustomBreadcrumbs
          heading="Riwayat Pembayaran"
          links={[
            { name: "Dashboard", href: paths.ROOTS },
            { name: "Kasir & Transaksi", href: "" },
            { name: "Riwayat Pembayaran" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey["500Channel"], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" ||
                        tab.value === currentFilters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              services: [...new Set(tableData.flatMap((row) => row.items.map((item) => item.service)))],
            }}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={false}
                        onSelectRow={() => undefined}
                        onDeleteRow={() => undefined}
                        editHref={""}
                        detailsHref={row.proofUrl ?? ""}
                        readOnly
                      />
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ invoiceNumber, invoiceTo }) =>
      [
        invoiceNumber,
        invoiceTo.name,
        invoiceTo.company,
        invoiceTo.phoneNumber,
      ].some((field) => field?.toLowerCase().includes(name.toLowerCase())),
    );
  }

  if (status !== "all") {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service)),
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) =>
        fIsBetween(invoice.createDate, startDate, endDate),
      );
    }
  }

  return inputData;
}
