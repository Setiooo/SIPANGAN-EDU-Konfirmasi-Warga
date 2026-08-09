# SIPANGAN EDU — Prototype Aplikasi

Prototype interaktif **SIPANGAN EDU** — lapisan **verifikasi sekolah** dan **transparansi publik** yang berdiri di atas data operasional **SIPGN**.

Dibangun dengan **HTML + CSS + JavaScript murni**. Tanpa proses build, tanpa CDN, tanpa dependensi — tinggal buka `index.html`. Bisa dibuka tanpa internet.

> Catatan: Design System, User Flow, dan Panduan **tidak** ada di dalam app ini. Ketiganya materi proposal yang didokumentasikan terpisah. App ini fokus pada prototype layar aplikasi.

## Arsitektur yang diikuti

```
SIPGN Produksi
│
SIPGN Distribusi
│
SIPGN Penerima Manfaat
│
▼
Data operasional terintegrasi
│
▼
SIPANGAN EDU
├── Ruang PIC sekolah
│   ├── Verifikasi penerimaan
│   ├── Pelaporan ketidaksesuaian
│   └── Pemantauan tindak lanjut
│
└── Portal publik
    ├── Cari kota dan sekolah
    ├── Alokasi dan realisasi porsi
    ├── Ketepatan distribusi
    ├── Status verifikasi
    ├── Statistik laporan
    ├── Status penyelesaian
    ├── Konfirmasi penerimaan warga
    └── Perbandingan konfirmasi warga vs verifikasi PIC
```

**Prinsip utama:** SIPANGAN EDU tidak membuat angka baru. Alokasi porsi, jadwal, dan data penerima manfaat dibaca dari SIPGN. Yang ditambahkan hanya tiga hal: verifikasi sekolah, laporan ketidaksesuaian, dan status tindak lanjutnya.

## Cara Menjalankan

1. Ekstrak folder ini.
2. Buka `index.html` di browser (klik dua kali).
3. Klik layar di sidebar, atau gunakan tombol Sebelumnya/Berikutnya. Tombol dan bottom-nav di dalam app juga bisa diklik.

Bisa juga langsung ke layar tertentu lewat hash, misal `index.html#pub-sekolah`.

## Tampilan Responsif

Di atas preview ada pilihan **HP / Tablet / Laptop** — klik untuk melihat tampilan menyesuaikan ukuran perangkat. Pada layar sempit, sidebar daftar layar berpindah ke atas.

## Dua Ruang, Satu Sumber Data

| Ruang | Akses | Fungsi |
| --- | --- | --- |
| **Ruang PIC sekolah** | Perlu masuk akun (diterbitkan dinas, terhubung NPSN) | Verifikasi penerimaan, pelaporan ketidaksesuaian, pemantauan tindak lanjut |
| **Portal publik** | Terbuka, tanpa akun | Cari kota & sekolah, alokasi & realisasi porsi, ketepatan distribusi, status verifikasi, konfirmasi warga, statistik laporan, status penyelesaian |

Batas peran: PIC hanya dapat memverifikasi sekolahnya sendiri. Portal publik hanya menampilkan angka agregat dan status — tanpa data pribadi siswa.

## Bottom Navigation

- **Ruang PIC sekolah:** Beranda · Kiriman · **Verifikasi** · Tindak Lanjut · Profil
- **Portal publik:** Beranda · Cari · Porsi · Laporan · Info

## Daftar Layar (29)

| Kelompok | Layar |
| --- | --- |
| Pintu masuk | Splash · Alur Data SIPGN · Pilih Ruang · Masuk Ruang PIC |
| Verifikasi penerimaan | Beranda PIC · Daftar Kiriman · Verifikasi Penerimaan · Verifikasi Terkirim |
| Pelaporan ketidaksesuaian | Form Ketidaksesuaian · Unggah Bukti · Laporan Terkirim |
| Pemantauan tindak lanjut | Daftar Tindak Lanjut · Detail Tindak Lanjut |
| Pendukung PIC | Riwayat Verifikasi · Notifikasi · Profil PIC |
| Portal publik | Beranda · Cari Kota dan Sekolah · Detail Wilayah · Alokasi dan Realisasi Porsi · Konfirmasi Penerimaan Warga · Ketepatan Distribusi · Status Verifikasi · Statistik Laporan · Status Penyelesaian · Konfirmasi Warga vs Verifikasi PIC · Info dan Batasan |
| Keadaan sistem | Data Kosong · Gangguan Sinkronisasi |

## Keputusan Desain yang Perlu Dibaca

- **Angka porsi bukan input sekolah.** Jumlah kiriman berasal dari SIPGN; sekolah hanya menyatakan *sesuai* atau *tidak sesuai*, sehingga selisih dapat diaudit.
- **Memilih "Tidak sesuai" otomatis membuka formulir pelaporan** — verifikasi dan pelaporan tersambung, bukan dua menu terpisah.
- **Laporan tidak dapat dihapus.** Riwayat bersifat tetap; perubahan status hanya oleh dapur dan dinas, dan tercatat waktunya.
- **Tenggat baku:** tanggapan 1 × 24 jam, penyelesaian 3 × 24 jam. Laporan yang melewati tenggat naik otomatis ke dinas.
- **Ketepatan hanya dihitung dari kiriman terverifikasi.** Kiriman tanpa verifikasi dihitung terpisah, bukan dianggap tepat.
- **Yang belum selesai tetap ditampilkan di portal publik**, karena bagian inilah yang paling perlu diketahui publik.
- **Konfirmasi warga berdiri sendiri dari verifikasi PIC.** Warga tidak memerlukan akun; kategorinya disamakan dengan laporan PIC agar dua sumber dapat dibandingkan langsung.
- **Selisih di atas 10 poin persen diberi sinyal “Perlu ditinjau”.** Sinyal ini bukan bukti pelanggaran, melainkan prioritas peninjauan bagi dinas.
- **Mode luring.** Bila SIPGN tidak tersinkron, PIC tetap bisa mengisi verifikasi dan mengunggah bukti; data terkirim saat sambungan pulih.

## Deploy ke GitHub Pages

1. Buat repo baru, upload semua isi folder ini (sudah ada `.nojekyll`).
2. Settings → Pages → Source: branch `main`, folder `/root`.
3. Akses di `https://<username>.github.io/<repo>/`.

## Struktur File

```
sipangan-edu/
├── index.html     # kerangka + sidebar daftar layar + design token (CSS)
├── app.js         # semua layar prototype + navigasi + device switcher
├── favicon.png
├── .nojekyll
└── README.md
```

Seluruh angka pada prototype ini adalah **data contoh** untuk keperluan peragaan, bukan data operasional sebenarnya.
