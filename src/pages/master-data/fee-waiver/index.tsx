import { CONFIG } from "@/global-config";
import { FeeWaiverView } from "@/sections/master-data/view";

// =====

const metadata = { title: `Keringanan Biaya - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <FeeWaiverView />
    </>
  );
}
