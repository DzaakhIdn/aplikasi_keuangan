import { CONFIG } from "@/global-config";
import { HistoryistView } from "@/sections/transaction/view";

// =====

const metadata = { title: `History Pembayaran - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <HistoryistView />
    </>
  );
}
