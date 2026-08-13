import { CONFIG } from "@/global-config";
import { ClassPercentageView } from "@/sections/reports/view";

// ==========================\

const metadata = { title: `Persentase Rombel - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <ClassPercentageView />
    </>
  );
}
