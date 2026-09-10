# Aplikasi Keuangan Sekolah

Aplikasi ini mengelola jenis pembayaran, tagihan santri, pembayaran loket, bukti pembayaran Google Drive, riwayat transaksi, laporan keuangan, persentase rombel, dan tunggakan siswa.

## Alur Pembayaran

1. Siapkan tahun ajaran

   Buat data tahun ajaran, misalnya `2025/2026`. Salah satu tahun ajaran harus berstatus `aktif`.

2. Lengkapi `kesiswaan_history`

   Setiap santri yang aktif pada suatu tahun ajaran harus punya record di `kesiswaan_history`. Tabel ini menentukan posisi santri pada tahun ajaran tersebut, seperti kelas, rombel, asrama, cabang, dan status.

3. Buat jenis pembayaran

   Bendahara membuat jenis pembayaran seperti `SPP`, `Daftar Ulang`, `Uang Gedung`, atau `Seragam`. Setiap jenis pembayaran wajib terikat ke satu tahun ajaran.

4. Generate tagihan otomatis

   Saat jenis pembayaran dibuat atau diaktifkan, database otomatis membuat tagihan untuk santri yang aktif pada tahun ajaran tersebut berdasarkan `kesiswaan_history`.

   Syarat santri terkena tagihan:

   ```text
   kesiswaan_history.tahun_ajaran_id = jenis_pembayaran.id_tahun_ajaran
   kesiswaan_history.status = aktif
   kesiswaan.status = aktif
   ```

5. Tipe pembayaran

   Jika tipe pembayaran `Bulanan`, sistem membuat tagihan per bulan sepanjang rentang tahun ajaran. Jika tipe pembayaran `Sekali`, sistem hanya membuat satu tagihan.

6. Keringanan biaya

   Jika santri memiliki keringanan untuk jenis pembayaran tertentu, nominal tagihan dikurangi otomatis.

   ```text
   nominal_tagihan = nominal_jenis_pembayaran - potongan
   ```

7. Cek data tagihan

   Halaman Data Tagihan menampilkan tagihan yang sudah terbentuk, termasuk santri, jenis pembayaran, periode, nominal tagihan, nominal dibayar, sisa, jatuh tempo, dan status.

8. Pembayaran di loket

   Bendahara membuka Loket Pembayaran, mencari santri, sinkron tagihan jika perlu, memilih tagihan, mengisi nominal bayar, memilih metode pembayaran, mengunggah bukti, lalu menyimpan pembayaran.

9. Pembayaran sebagian

   Tagihan bisa dibayar sebagian. Jika belum lunas, status menjadi `sebagian`. Jika sisa tagihan sudah `0`, status menjadi `lunas`.

10. Simpan transaksi

    Pembayaran disimpan ke `pembayaran_keuangan` sebagai header transaksi dan `pembayaran_detail_keuangan` sebagai rincian tagihan yang dibayar.

11. Upload bukti pembayaran

    Bukti pembayaran dikirim ke backend Express, lalu disimpan ke Google Drive. Link bukti disimpan pada transaksi pembayaran.

12. Update status otomatis

    Trigger database menghitung ulang `nominal_dibayar`, `sisa_tagihan`, dan `status` tagihan setelah detail pembayaran berubah.

13. Riwayat dan laporan

    Data pembayaran dan tagihan muncul di Riwayat Pembayaran, Laporan Keuangan, Persentase Rombel, dan Tunggakan Siswa.

## Ringkasan Flow

```text
Tahun ajaran dibuat
        ↓
Data kesiswaan_history dilengkapi
        ↓
Jenis pembayaran dibuat
        ↓
Tagihan otomatis dibuat untuk santri aktif pada tahun ajaran itu
        ↓
Bendahara menerima pembayaran di loket
        ↓
Bukti pembayaran upload ke Google Drive
        ↓
Transaksi tersimpan
        ↓
Status tagihan update otomatis
        ↓
Data muncul di riwayat, laporan, persentase rombel, dan tunggakan siswa
```

## Deploy Singkat

Frontend dan backend dideploy sebagai dua service terpisah.

Frontend:

```text
Dockerfile.frontend
Port 80
```

Backend:

```text
Dockerfile.backend
Port sesuai SERVER_PORT
```
