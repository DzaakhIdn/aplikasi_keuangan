import { CONFIG } from "@/global-config";
import { PaymentCounterView } from "@/sections/transaction/view";

// ----------------------------------------------------------------------

const metadata = { title: `Loket Pembayaran - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <PaymentCounterView />
    </>
  );
}
