import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type TahunAjaran = Database["public"]["Tables"]["tahun_ajaran"]["Row"];

export const TahunAjaranRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("tahun_ajaran")
      .select("id, tahun_ajaran, status")
      .order("id", { ascending: false });

    if (error) throw error;
    return data;
  },
};
