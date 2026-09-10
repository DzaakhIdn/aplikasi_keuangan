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
          kode_jenis_pembayaran: string;
          nama_pembayaran: string;
          id_tahun_ajaran: string;
          tipe_pembayaran: "Bulanan" | "Sekali";
          nominal: number;
          tanggal_jatuh_tempo: number | null;
          status: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kode_jenis_pembayaran: string;
          nama_pembayaran: string;
          id_tahun_ajaran: string;
          tipe_pembayaran: "Bulanan" | "Sekali";
          nominal: number;
          tanggal_jatuh_tempo?: number | null;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kode_jenis_pembayaran?: string;
          nama_pembayaran?: string;
          id_tahun_ajaran?: string;
          tipe_pembayaran?: "Bulanan" | "Sekali";
          nominal?: number;
          tanggal_jatuh_tempo?: number | null;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_siswa: string;
          id_jenis_pembayaran: string;
          potongan: number;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_siswa?: string;
          id_jenis_pembayaran?: string;
          potongan?: number;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      tagihan_siswa_keuangan: {
        Row: {
          id: string;
          id_siswa: string;
          id_jenis_pembayaran: string;
          id_tahun_ajaran: string;
          periode_bulan: number | null;
          periode_tahun: number | null;
          nominal_awal: number;
          nominal_potongan: number;
          nominal_tagihan: number;
          nominal_dibayar: number;
          sisa_tagihan: number;
          tanggal_jatuh_tempo: string | null;
          status: "pending" | "belum_lunas" | "sebagian" | "lunas" | "dibebaskan" | "dibatalkan";
          keterangan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_siswa: string;
          id_jenis_pembayaran: string;
          id_tahun_ajaran: string;
          periode_bulan?: number | null;
          periode_tahun?: number | null;
          nominal_awal: number;
          nominal_potongan?: number;
          nominal_tagihan: number;
          nominal_dibayar?: number;
          sisa_tagihan: number;
          tanggal_jatuh_tempo?: string | null;
          status?: "pending" | "belum_lunas" | "sebagian" | "lunas" | "dibebaskan" | "dibatalkan";
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_siswa?: string;
          id_jenis_pembayaran?: string;
          id_tahun_ajaran?: string;
          periode_bulan?: number | null;
          periode_tahun?: number | null;
          nominal_awal?: number;
          nominal_potongan?: number;
          nominal_tagihan?: number;
          nominal_dibayar?: number;
          sisa_tagihan?: number;
          tanggal_jatuh_tempo?: string | null;
          status?: "pending" | "belum_lunas" | "sebagian" | "lunas" | "dibebaskan" | "dibatalkan";
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      pembayaran_keuangan: {
        Row: {
          id: string;
          nomor_transaksi: string;
          id_siswa: string;
          tanggal_bayar: string;
          total_bayar: number;
          status_pembayaran: "lunas" | "batal";
          metode_pembayaran: string | null;
          bukti_pembayaran_drive_file_id: string | null;
          bukti_pembayaran_drive_folder_id: string | null;
          bukti_pembayaran_url: string | null;
          id_petugas: string | null;
          catatan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nomor_transaksi?: string;
          id_siswa: string;
          tanggal_bayar?: string;
          total_bayar: number;
          status_pembayaran?: "lunas" | "batal";
          metode_pembayaran?: string | null;
          bukti_pembayaran_drive_file_id?: string | null;
          bukti_pembayaran_drive_folder_id?: string | null;
          bukti_pembayaran_url?: string | null;
          id_petugas?: string | null;
          catatan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nomor_transaksi?: string;
          id_siswa?: string;
          tanggal_bayar?: string;
          total_bayar?: number;
          status_pembayaran?: "lunas" | "batal";
          metode_pembayaran?: string | null;
          bukti_pembayaran_drive_file_id?: string | null;
          bukti_pembayaran_drive_folder_id?: string | null;
          bukti_pembayaran_url?: string | null;
          id_petugas?: string | null;
          catatan?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      pembayaran_detail_keuangan: {
        Row: {
          id: string;
          id_pembayaran: string;
          id_tagihan: string;
          nominal_bayar: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          id_pembayaran: string;
          id_tagihan: string;
          nominal_bayar: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          id_pembayaran?: string;
          id_tagihan?: string;
          nominal_bayar?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      tahun_ajaran: {
        Row: {
          id: string;
          tahun_ajaran: string;
          status: "aktif" | "nonaktif";
          tanggal_mulai: string | null;
          tanggal_selesai: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tahun_ajaran: string;
          is_active?: boolean | null;
          tanggal_mulai?: string | null;
          tanggal_berakhir?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tahun_ajaran?: string;
          is_active?: boolean | null;
          tanggal_mulai?: string | null;
          tanggal_berakhir?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      kesiswaan: {
        Row: {
          id: string;
          nis: string;
          nisn: string | null;
          nama_lengkap: string;
          kelas_id: string | null;
          rombel_id: string | null;
          asrama_id: string | null;
          angkatan_id: string | null;
          cabang_id: string | null;
          alamat_domisili: string | null;
          tanggal_keluar: string | null;
          tahun_ajaran_id: string | null;
          status: "aktif" | "nonaktif" | "alumni" | "lulus" | "pindah" | "keluar" | "cuti" | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
    };
    Functions: {
      generate_tagihan_siswa_keuangan: {
        Args: {
          p_id_siswa: string;
          p_id_tahun_ajaran?: string | null;
          p_id_jenis_pembayaran?: string | null;
          p_mulai_tagihan?: string | null;
        };
        Returns: number;
      };
      generate_tagihan_tahun_ajaran_keuangan: {
        Args: { p_id_tahun_ajaran: string; p_id_jenis_pembayaran?: string | null };
        Returns: number;
      };
      hapus_jenis_pembayaran_keuangan: {
        Args: { p_id_jenis_pembayaran: string };
        Returns: Json;
      };
      catat_pembayaran_keuangan: {
        Args: {
          p_id_siswa: string;
          p_items: Json;
          p_metode_pembayaran?: string | null;
          p_catatan?: string | null;
          p_id_petugas?: string | null;
          p_bukti_pembayaran_drive_file_id?: string | null;
          p_bukti_pembayaran_drive_folder_id?: string | null;
          p_bukti_pembayaran_url?: string | null;
        };
        Returns: string;
      };
    };
  };
};
