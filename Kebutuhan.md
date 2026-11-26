# 📋 Dokumen Kebutuhan Sistem Informasi Manajemen — Kedai Ndrojos

> **Objek Usaha / Mitra**: Kedai Ndrojos (Usaha Kuliner, berdiri 22 Oktober 2020)  
> **Lokasi**: Tegal Gentan VI, RT.002/RW.017, Dukuh, Margoagung, Kec. Seyegan, Kabupaten Sleman, Daerah Istimewa Yogyakarta  
> **Sumber Acuan**:
> - [`mitra,masalah, dan proses saat ini.md`](./mitra,masalah,%20dan%20proses%20saat%20ini.md)
> - [`Proses Baru dan Target.md`](./Proses%20Baru%20dan%20Target.md)

---

## 1. Latar Belakang dan Tujuan Sistem

Kedai Ndrojos saat ini masih menjalankan kegiatan operasional secara manual, meliputi pencatatan pesanan, perhitungan transaksi dengan kalkulator/ingatan, pengecekan persediaan bahan makanan langsung ke dapur serta *stock opname* berkala, pencatatan keuangan (kasir, utang pelanggan, pengeluaran, kerugian), dan pembelian bahan baku ke pemasok.

Ketika jumlah pembeli meningkat, proses manual tersebut menimbulkan perlambatan pelayanan, risiko pesanan terlewat, kesalahan perhitungan harga dan uang kembalian, ketidakefisienan pemantauan stok, serta pencatatan keuangan yang belum terintegrasi.

**Tujuan Sistem Informasi Manajemen Kedai Ndrojos** adalah menyatukan pengelolaan **transaksi penjualan, alur pesanan ke dapur, persediaan bahan makanan, pembelian bahan baku dan pemasok, serta pencatatan keuangan** ke dalam satu sistem terintegrasi.

---

## 2. Pemetaan Masalah ke Kebutuhan Sistem

| No | Permasalahan & Akar Masalah Saat Ini | Kebutuhan Solusi pada Sistem Baru |
|---|---|---|
| 1 | Pencatatan pesanan dan perhitungan harga/kembalian masih manual (lambat saat ramai, berisiko salah hitung atau pesanan terlewat). | **Modul Kasir & Transaksi** dengan pencatatan pesanan digital, perhitungan total dan kembalian otomatis, serta penerusan pesanan ke bagian dapur. |
| 2 | Pengecekan stok harus langsung ke dapur dan mengandalkan *stock opname* berkala sehingga informasi stok tidak otomatis. | **Modul Manajemen Stok & Notifikasi Stok** untuk memantau persediaan secara langsung, memperbarui stok dari pemakaian/pembelian, dan memberi peringatan batas minimum. |
| 3 | Pencatatan keuangan (kasir, pengeluaran, utang pelanggan, laporan kerugian) belum terintegrasi. | **Modul Pencatatan Keuangan & Laporan** yang otomatis merekam penjualan sebagai pemasukan, mencatat pengeluaran dan utang pelanggan, serta menyusun laporan laba/rugi. |
| 4 | Pengelolaan pemasok belum optimal (membutuhkan alternatif pemasok lebih murah atau menyediakan layanan antar). | **Modul Manajemen Pemasok & Pembelian Bahan Baku** untuk membandingkan harga/layanan pemasok dan mencatat kebutuhan serta transaksi kulakan. |

---

## 3. Pengguna dan Entitas Terkait

1. **Penjual / Kasir / Pemilik Kedai**:
   - Menginput pesanan pembeli, menerima pembayaran, dan memproses transaksi.
   - Mengelola stok awal, pemakaian bahan produksi, daftar belanja, dan pembelian ke pemasok.
   - Mengelola data pemasok, pengeluaran operasional, utang pelanggan, serta memantau laporan keuangan.
2. **Bagian Dapur**:
   - Menerima informasi pesanan yang diteruskan dari sistem kasir untuk disiapkan.
   - Berkoordinasi terkait penggunaan bahan makanan untuk produksi.
3. **Entitas Eksternal (Non-Pengguna Langsung)**:
   - **Pembeli / Pelanggan**: Menyampaikan pesanan dan melakukan pembayaran (termasuk pencatatan utang pelanggan bila belum lunas).
   - **Pemasok (*Supplier*)**: Sumber pengadaan bahan baku dengan data harga dan layanan antar yang dicatat untuk perbandingan.

---

## 4. Kebutuhan Fungsional (*Functional Requirements*)

### FR-01: Fitur Kasir dan Transaksi
1. **FR-01.1** Sistem harus dapat mencatat daftar pesanan makanan/minuman yang disampaikan pembeli ke dalam sistem.
2. **FR-01.2** Sistem harus menghitung total harga pesanan secara otomatis berdasarkan item dan jumlah yang dipesan.
3. **FR-01.3** Sistem harus meneruskan data pesanan yang sudah diinput ke bagian dapur untuk disiapkan agar tidak ada pesanan yang terlewat.
4. **FR-01.4** Sistem harus memungkinkan penjual memasukkan nominal uang yang dibayarkan pembeli setelah makanan selesai disiapkan.
5. **FR-01.5** Sistem harus menghitung uang kembalian secara otomatis.
6. **FR-01.6** Sistem harus menyimpan seluruh data dan riwayat transaksi penjualan.

### FR-02: Fitur Manajemen Stok Bahan Makanan
1. **FR-02.1** Sistem harus menyediakan fitur input data awal persediaan bahan makanan.
2. **FR-02.2** Sistem harus menampilkan jumlah persediaan bahan makanan yang tersedia sehingga dapat dipantau tanpa harus selalu memeriksa langsung ke dapur.
3. **FR-02.3** Sistem harus mendukung pencatatan dan pembaruan penggunaan bahan makanan untuk kegiatan produksi.
4. **FR-02.4** Sistem harus memperbarui jumlah stok secara otomatis berdasarkan data penggunaan bahan makanan dan penambahan stok dari pembelian.
5. **FR-02.5** Sistem harus mendukung penyesuaian data stok hasil *stock opname* berkala agar stok di sistem tetap sesuai dengan kondisi fisik.

### FR-03: Fitur Notifikasi Stok
1. **FR-03.1** Sistem harus memungkinkan penetapan batas minimum (*minimum stock threshold*) untuk setiap bahan makanan.
2. **FR-03.2** Sistem harus memberikan notifikasi/peringatan otomatis ketika jumlah persediaan bahan makanan mencapai atau berada di bawah batas minimum agar tidak terjadi kehabisan bahan.

### FR-04: Fitur Manajemen Pemasok
1. **FR-04.1** Sistem harus dapat menyimpan dan mengelola data pemasok (*supplier*) bahan baku.
2. **FR-04.2** Sistem harus mencatat informasi harga bahan baku dari masing-masing pemasok serta informasi layanan yang tersedia (seperti ketersediaan layanan antar).
3. **FR-04.3** Sistem harus membantu membandingkan harga dan layanan antar-pemasok agar kedai dapat memilih pemasok yang lebih efisien dari sisi biaya produksi maupun waktu.

### FR-05: Fitur Pembelian Bahan Baku
1. **FR-05.1** Sistem harus membantu penjual membuat daftar bahan makanan yang perlu dibeli kembali (*daftar kulakan*) berdasarkan informasi ketersediaan stok dan notifikasi stok minimum.
2. **FR-05.2** Sistem harus dapat mencatat transaksi pembelian bahan baku kepada pemasok.
3. **FR-05.3** Sistem harus menghubungkan pencatatan pembelian bahan baku dengan penambahan jumlah stok di Modul Manajemen Stok serta pencatatan pengeluaran di Modul Pencatatan Keuangan.

### FR-06: Fitur Pencatatan Keuangan
1. **FR-06.1** Sistem harus mencatat setiap transaksi penjualan yang selesai secara otomatis sebagai data pemasukan.
2. **FR-06.2** Sistem harus menyediakan pencatatan data pengeluaran, meliputi pembelian bahan baku dan biaya operasional kedai lainnya.
3. **FR-06.3** Sistem harus menyediakan pencatatan dan pemantauan utang pelanggan (transaksi pelanggan yang pembayarannya belum dilunasi) beserta status pelunasannya.
4. **FR-06.4** Sistem harus menyimpan dan mengelompokkan seluruh data pemasukan, pengeluaran, utang pelanggan, serta kerugian secara terstruktur.

### FR-07: Fitur Laporan
1. **FR-07.1** Sistem harus menyajikan laporan penjualan berdasarkan data transaksi kasir.
2. **FR-07.2** Sistem harus menyajikan laporan persediaan bahan makanan (stok tersedia, stok menipis, penggunaan, dan pembelian).
3. **FR-07.3** Sistem harus menyajikan laporan pemasukan dan pengeluaran yang terkelompok.
4. **FR-07.4** Sistem harus menyajikan laporan utang pelanggan yang belum dan sudah dibayarkan.
5. **FR-07.5** Sistem harus menyajikan laporan kondisi keuangan usaha yang menampilkan keuntungan atau kerugian Kedai Ndrojos.

---

## 5. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)

| Kategori | Kode | Deskripsi Kebutuhan |
|---|---|---|
| **Kecepatan & Efisiensi** | **NFR-01** | Proses input pesanan, perhitungan total, penerusan ke dapur, dan perhitungan kembalian harus berjalan cepat agar pelayanan tetap lancar meskipun pembeli datang bersamaan. |
| **Akurasi** | **NFR-02** | Perhitungan total harga, uang kembalian, pembaruan jumlah stok, serta rekap pemasukan/pengeluaran/laba-rugi harus dilakukan otomatis dan akurat tanpa mengandalkan ingatan atau kalkulator manual. |
| **Integrasi Data** | **NFR-03** | Data antar proses (kasir, dapur, stok, pembelian pemasok, dan keuangan) harus saling terhubung dalam satu sistem sehingga tidak perlu pencatatan ulang secara terpisah. |
| **Kemudahan Penggunaan (*Usability*)** | **NFR-04** | Antarmuka sistem harus sederhana dan mudah dipahami oleh penjual/pemilik kedai serta bagian dapur dalam aktivitas operasional harian. |
| **Keandalan Data** | **NFR-05** | Seluruh catatan pesanan, transaksi, stok, utang pelanggan, dan keuangan harus tersimpan dengan aman agar tidak ada pesanan yang terlewat atau data yang hilang. |

---

## 6. Kebutuhan Data Utama

Untuk mendukung seluruh kebutuhan fungsional di atas, sistem memerlukan pengelolaan entitas data berikut:
1. **Data Menu & Harga**: Nama menu/makanan/minuman dan harga jual.
2. **Data Transaksi Penjualan**: ID/nomor transaksi, waktu transaksi, daftar item pesanan, jumlah, total harga, nominal bayar, uang kembalian, status pesanan dapur, dan status pembayaran.
3. **Data Bahan Makanan & Stok**: Nama bahan makanan, satuan, jumlah stok saat ini, batas minimum stok, serta riwayat pemakaian produksi dan penambahan stok.
4. **Data Pemasok**: Nama pemasok, kontak/alamat, daftar bahan dan harga yang ditawarkan, serta informasi layanan (termasuk layanan antar).
5. **Data Pembelian Bahan Baku**: Tanggal pembelian, pemasok terkait, daftar & jumlah bahan yang dibeli, dan total biaya pembelian.
6. **Data Keuangan & Utang Pelanggan**: Catatan pemasukan (otomatis dari penjualan), catatan pengeluaran (bahan baku & operasional), catatan kerugian, serta data utang pelanggan (nama pelanggan, nominal utang, tanggal, dan status pelunasan).

---

## 7. Target Keberhasilan Sistem

Keberhasilan implementasi Sistem Informasi Manajemen Kedai Ndrojos diukur berdasarkan target yang ditetapkan pada rancangan proses baru:
1. **Pelayanan lebih cepat dan akurat**: Berkurangnya kesalahan perhitungan harga serta uang kembalian, dan tidak ada lagi pesanan yang terlewat saat kedai ramai.
2. **Pemantauan stok efisien**: Penjual dapat mengetahui jumlah persediaan secara langsung melalui sistem dan menerima peringatan sebelum bahan habis, tanpa selalu mengecek fisik ke dapur.
3. **Pengadaan bahan baku lebih optimal**: Tersedia daftar belanja berbasis stok dan perbandingan harga/layanan antar-pemasok untuk menghemat waktu dan biaya produksi.
4. **Keuangan terintegrasi dan transparan**: Pemasukan, pengeluaran, utang pelanggan, serta kondisi keuntungan atau kerugian kedai tercatat rapi dan dapat dilihat sewaktu-waktu melalui laporan sistem.
