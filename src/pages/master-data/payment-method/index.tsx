import { CONFIG } from "@/global-config";
import { PaymentMethodView } from "@/sections/master-data/view";

// =====

const metadata = { title: `Jenis Pembayaran - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <PaymentMethodView />
    </>
  );
}
