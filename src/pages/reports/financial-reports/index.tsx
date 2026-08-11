import { CONFIG } from "@/global-config";
import { FinancialReportView } from "@/sections/reports/view";

// ----------------------------------------------------------------------

const metadata = { title: `Laporan Keuangan - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <FinancialReportView />
    </>
  );
}
