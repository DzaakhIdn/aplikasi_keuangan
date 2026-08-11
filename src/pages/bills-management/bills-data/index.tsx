import { CONFIG } from "@/global-config";
import { InvoiceListView } from "@/sections/bills-management/view/invoice-list-view";

// =====

const metadata = { title: `Data Tagihan - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <InvoiceListView />
    </>
  );
}
