import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type Siswa = Database["public"]["Tables"]["kesiswaan"]["Row"];

export const KesiswaanRepository = {
  async getAktif() {
    const { data, error } = await supabase
      .from("kesiswaan")
      .select("id, nis, nama_lengkap, status")
      .eq("status", "aktif")
      .order("nama_lengkap", { ascending: true });

    if (error) throw error;
    return data;
  },
};
