import { paths } from "@/routes/paths";

// import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

const ICONS = {
  dashboard: <Iconify icon="solar:home-angle-bold-duotone" />,
  overview: <Iconify icon="solar:chart-bold-duotone" />,
  registant: <Iconify icon="solar:users-group-rounded-bold-duotone" />,
  file: <Iconify icon="solar:file-check-bold-duotone" />,
  finance: <Iconify icon="custom:invoice-duotone" />,
  payments: <Iconify icon="solar:card-bold-duotone" />,
  invoices: <Iconify icon="solar:bill-list-bold-duotone" />,
  settings: <Iconify icon="solar:settings-bold-duotone" />,
  information: <Iconify icon="solar:info-circle-bold-duotone" />,
  admin: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
  users: <Iconify icon="solar:user-plus-bold" />,
  notebook: <Iconify icon="solar:notebook-bold-duotone" />,
  inbox: <Iconify icon="solar:inbox-in-bold-duotone" />,
  template: <Iconify icon="solar:chat-round-line-bold-duotone" />,
  wallet: <Iconify icon="solar:wallet-bold-duotone" />,
  history: <Iconify icon="solar:card-transfer-bold-duotone" />,
  bill: <Iconify icon="solar:bill-list-bold-duotone" />,
  pen: <Iconify icon="solar:pen-new-square-bold-duotone" />,
  piechart: <Iconify icon="solar:pie-chart-2-bold-duotone" />,
  barchart: <Iconify icon="solar:chart-bold-duotone" />,
  overdue: <Iconify icon="solar:bill-cross-bold-duotone" />,
  alumni: <Iconify icon="solar:square-academic-cap-bold-duotone" />,
  money: <Iconify icon="solar:hand-money-bold-duotone" />,
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: "Overview",
    items: [{ title: "Overview", path: "/", icon: ICONS.dashboard }],
  },
  {
    subheader: "KASIR & TRANSAKSI",
    items: [
      {
        title: "Loket Pembayaran",
        path: paths.paymentCounter,
        icon: ICONS.wallet,
      },
      {
        title: "Riwayat Transaksi",
        path: paths.paymentHistory,
        icon: ICONS.history,
      },
    ],
  },
  {
    subheader: "MASTER DATA",
    items: [
      {
        title: "Jenis Pembayaran",
        path: paths.paymentMethod,
        icon: ICONS.payments,
      },
      {
        title: "Keringanan Biaya",
        path: paths.feeWaiver,
        icon: ICONS.money,
      },
    ],
  },
  {
    subheader: "MANAJEMEN TAGIHAN",
    items: [
      {
        title: "Buat Tagihan",
        path: "",
        icon: ICONS.pen,
      },
      {
        title: "Data Tagihan",
        path: paths.billsData,
        icon: ICONS.bill,
      },
    ],
  },
  {
    subheader: "LAPORAN",
    items: [
      {
        title: "Laporan Keuangan",
        path: paths.financialReports,
        icon: ICONS.piechart,
      },
      {
        title: "Persentase Kelas",
        path: paths.classPercentage,
        icon: ICONS.barchart,
      },
      {
        title: "Tunggakan Siswa",
        path: paths.studentArrears,
        icon: ICONS.registant,
      },
      {
        title: "Tunggakan Alumni",
        path: "",
        icon: ICONS.alumni,
      },
      {
        title: "Transaksi Dibatalkan",
        path: "",
        icon: ICONS.overdue,
      },
    ],
  },
  {
    subheader: "Administration",
    items: [
      {
        title: "Admin",
        path: "",
        icon: ICONS.admin,
        children: [
          { title: "Pengguna", path: "" },
          { title: "Setting", path: "" },
        ],
        allowedRoles: ["admin", "admin_ikhwan", "admin_akhwat"],
        caption: "Only admin can see this item.",
      },
    ],
  },
];
