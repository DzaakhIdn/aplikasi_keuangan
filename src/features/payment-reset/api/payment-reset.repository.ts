import { supabase } from "@/lib/supabase";

export type ResetPaymentDataResult = {
  pembayaran_detail_keuangan: number;
  pembayaran_keuangan: number;
  tagihan_siswa_keuangan: number;
};

export const PaymentResetRepository = {
  async resetPaymentData() {
    const { data, error } = await supabase.rpc("reset_data_pembayaran_keuangan");

    if (error) throw error;
    return data as ResetPaymentDataResult;
  },
};
