import { fCurrency } from "@/utils/format-number";

export const BILLING_MESSAGE_TEMPLATE_STORAGE_KEY = "billing-message-template";

export const DEFAULT_BILLING_MESSAGE_TEMPLATE = `Assalāmu'alaikum warahmatullāhi wabarakātuh 🌿

Mohon izin Abu/Ummu, kami mengirimkan pengingat bahwa tagihan biaya pendidikan ananda {{nama_santri}} sudah bisa ditunaikan 💳.
berikut rinciannya :
{{rincian_tagihan}}
*- Total keseluruhan : {{total_tagihan}}*

Pembayaran dapat ditransfer melalui:

🏦 Bank : BSI
💳 No. Rek : 7239459948
       a.n. SMA IT HSI

📱 Konfirmasi setelah transfer:
No. Bendahara : 08973101101 (Ust. Alan)

Jazakumullāhu khairan atas perhatian dan kerjasamanya 🤝✨
Semoga Allah memberkahi keluarga Abu/Ummu 🤲❤️`;

export type BillingMessageBill = {
  name: string;
  period: string;
  amount: number;
};

export type BillingMessageData = {
  studentName: string;
  studentNis: string;
  bills: BillingMessageBill[];
};

export function getBillingMessageTemplate() {
  if (typeof window === "undefined") return DEFAULT_BILLING_MESSAGE_TEMPLATE;
  return (
    window.localStorage.getItem(BILLING_MESSAGE_TEMPLATE_STORAGE_KEY) ??
    DEFAULT_BILLING_MESSAGE_TEMPLATE
  );
}

export function saveBillingMessageTemplate(template: string) {
  window.localStorage.setItem(BILLING_MESSAGE_TEMPLATE_STORAGE_KEY, template);
}

export function resetBillingMessageTemplate() {
  window.localStorage.removeItem(BILLING_MESSAGE_TEMPLATE_STORAGE_KEY);
}

export function renderBillingMessage(template: string, data: BillingMessageData) {
  const total = data.bills.reduce((sum, bill) => sum + bill.amount, 0);
  const details = data.bills
    .map((bill) => `- ${bill.name}${bill.period ? ` ${bill.period}` : ""} : ${fCurrency(bill.amount)}`)
    .join("\n");

  return template
    .replaceAll("{{nama_santri}}", data.studentName)
    .replaceAll("{{nis}}", data.studentNis)
    .replaceAll("{{rincian_tagihan}}", details || "- Tidak ada tagihan")
    .replaceAll("{{total_tagihan}}", fCurrency(total));
}

export function normalizeWhatsAppNumber(value: string | null | undefined) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function createWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
