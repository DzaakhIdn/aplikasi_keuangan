import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { DashboardContent } from "@/layouts/dashboard";

import { WidgetSummary } from "../widget-summary";
import { PaymentsSummary } from "../payments-summary";
import { RecentTransitions } from "../recent-transitions";
import { _mock } from "@/_mock";
import Typography from "@mui/material/Typography";

export function OverviewView() {
  const _bankingRecentTransitions = [
    {
      id: _mock.id(2),
      name: _mock.fullName(2),
      avatarUrl: _mock.image.avatar(2),
      type: "Income",
      message: "Receive money from",
      category: "Annette black",
      date: _mock.time(2),
      status: "progress",
      amount: _mock.number.price(2),
    },
    {
      id: _mock.id(3),
      name: _mock.fullName(3),
      avatarUrl: _mock.image.avatar(3),
      type: "Expenses",
      message: "Payment for",
      category: "Courtney henry",
      date: _mock.time(3),
      status: "completed",
      amount: _mock.number.price(3),
    },
    {
      id: _mock.id(4),
      name: _mock.fullName(4),
      avatarUrl: _mock.image.avatar(4),
      type: "Receive",
      message: "Payment for",
      category: "Theresa webb",
      date: _mock.time(4),
      status: "failed",
      amount: _mock.number.price(4),
    },
    {
      id: _mock.id(5),
      name: null,
      avatarUrl: null,
      type: "Expenses",
      message: "Payment for",
      category: "Fast food",
      date: _mock.time(5),
      status: "completed",
      amount: _mock.number.price(5),
    },
    {
      id: _mock.id(6),
      name: null,
      avatarUrl: null,
      type: "Expenses",
      message: "Payment for",
      category: "Fitness",
      date: _mock.time(6),
      status: "progress",
      amount: _mock.number.price(6),
    },
  ];
  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
        pt: 3,
        mb: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Keuangan HSI BS</Typography>
        <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
          Website analisa keuangan HSI Boarding School
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <WidgetSummary
            title="Total santri"
            percent={100}
            total={1234}
            color={"skyblue"}
            icon="solar:users-group-two-rounded-bold-duotone"
            sx={{ background: "linear-gradient(to right, #f9f9f9, #f9f9f9)" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <WidgetSummary
            title="Pembayaran hari ini"
            percent={100}
            total={1234}
            color={"green"}
            icon="solar:wallet-money-bold-duotone"
            sx={{ background: "linear-gradient(to right, #f9f9f9, #f9f9f9)" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <WidgetSummary
            title="Total tunggakan"
            percent={100}
            total={1234}
            color={"red"}
            icon="solar:bill-cross-bold-duotone"
            sx={{ background: "linear-gradient(to right, #f9f9f9, #f9f9f9)" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <WidgetSummary
            title="Pendapatan bulan ini"
            percent={100}
            total={1234}
            color={"blueviolet"}
            icon="solar:money-bag-bold-duotone"
            sx={{ background: "linear-gradient(to right, #f9f9f9, #f9f9f9)" }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <PaymentsSummary
            title="Statistik Keuangan"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              series: [
                {
                  name: "2022",
                  data: [
                    {
                      name: "Pendapatan",
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: "Tunggakan",
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  name: "2023",
                  data: [
                    {
                      name: "Pendapatan",
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: "Tunggakan",
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>

      <RecentTransitions
        title="Aktifitas Terbaru"
        sx={{ mt: 3 }}
        subheader=""
        tableData={_bankingRecentTransitions}
        headCells={[
          { id: "description", label: "Description" },
          { id: "date", label: "Date" },
          { id: "amount", label: "Amount" },
          { id: "status", label: "Status" },
          { id: "" },
        ]}
      />
    </DashboardContent>
  );
}
