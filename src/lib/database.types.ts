export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      jenis_pembayaran_keuangan: {
        Row: {
          id: string;
          nama_pembayaran: string;
          id_tahun_ajaran: string;
          tipe_pembayaran: "Bulanan" | "Sekali";
          nominal: number;
          status: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nama_pembayaran: string;
          id_tahun_ajaran: string;
          tipe_pembayaran: "Bulanan" | "Sekali";
          nominal: number;
          status: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nama_pembayaran?: string;
          id_tahun_ajaran?: string;
          tipe_pembayaran?: "Bulanan" | "Sekali";
          nominal?: number;
          status?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      keringanan_biaya_keuangan: {
        Row: {
          id: string;
          id_siswa: string;
          id_jenis_pembayaran: string;
          potongan: number;
          keterangan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          id_siswa: string;
          id_jenis_pembayaran: string;
          potongan: number;
          keterangan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          id_siswa?: string;
          id_jenis_pembayaran?: string;
          potongan?: number;
          keterangan?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      tahun_ajaran: {
        Row: {
          id: string;
          tahun_ajaran: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tahun_ajaran: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tahun_ajaran?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      kesiswaan: {
        Row: {
          id: string;
          nis: number;
          nama_lengkap: string;
          status: "aktif" | "nonaktif";
          created_at: string;
        };
      };
    };
  };
};
