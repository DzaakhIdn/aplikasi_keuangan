import { CONFIG } from "@/global-config";
import { ClassPercentageView } from "@/sections/reports/view";

// ==========================\

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <ClassPercentageView />
    </>
  );
}
