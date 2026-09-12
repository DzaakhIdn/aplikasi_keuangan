import { CONFIG } from "@/global-config";
import { MessageTemplateView } from "@/sections/administration/view/message-template-view";

const metadata = { title: `Template Pesan - ${CONFIG.appName}` };

export default function MessageTemplatePage() {
  return (
    <>
      <title>{metadata.title}</title>
      <MessageTemplateView />
    </>
  );
}
