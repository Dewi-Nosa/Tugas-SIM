# Kedai Ndrojos — Sistem Operasional 🍳

Aplikasi web prototipe sistem operasional untuk **Kedai Ndrojos**, warung makan yang berdiri sejak **22 Oktober 2020**.

## 🚀 Cara Menjalankan

Cukup buka file `index.html` di browser — tidak perlu instalasi apapun!

```bash
# Klik dua kali file index.html, atau jalankan:
start index.html   # Windows
```

## ✨ Fitur Utama

### 📊 Dashboard
- Ringkasan omzet hari ini & estimasi laba bersih
- Peringatan stok bahan menipis secara real-time
- Total catatan utang/kasbon pelanggan
- Transaksi terbaru

### 🧾 Kasir Cepat (POS)
- Grid menu dengan pencarian instan
- Keranjang pesanan interaktif (tambah/kurangi qty)
- **Kalkulator kembalian otomatis** — cegah salah hitung
- Tombol nominal cepat (5rb, 10rb, 20rb, 50rb, 100rb)
- Simpan pesanan sebagai **Kasbon/Utang Pelanggan**
- Pengurangan stok otomatis saat transaksi

### 📦 Stok & Kulakan
- Daftar stok bahan dapur lengkap dengan indikator level
- Edit jumlah stok langsung dari tabel
- Daftar kasbon/utang pelanggan aktif + tombol lunas
- Daftar supplier/kulakan untuk membandingkan harga

### 📈 Laporan Keuangan
- Ringkasan pemasukan, pengeluaran, piutang, kerugian
- Laba bersih kumulatif
- Input pengeluaran/kulakan harian
- Input bahan terbuang/kerugian
- Riwayat semua transaksi

## 🗂️ Struktur File

```
kedai-ndrojos/
├── index.html          # Halaman utama (SPA)
├── css/
│   └── style.css       # Stylesheet
├── js/
│   ├── data.js         # Data layer (localStorage)
│   └── app.js          # Logika aplikasi
└── README.md
```

## 💾 Penyimpanan Data

Semua data disimpan di **localStorage** browser — tidak perlu database atau server.
Data persisten selama tidak dibersihkan cache browser.

## 🔮 Rencana Pengembangan

- [ ] Ekspor laporan ke Excel/PDF
- [ ] Multi-kasir / multi-user
- [ ] Mode offline (PWA)
- [ ] Notifikasi WhatsApp untuk stok menipis
- [ ] Grafik penjualan harian/bulanan
- [ ] Manajemen menu (tambah/edit/hapus)

## 📅 Riwayat Versi

| Versi | Tanggal | Keterangan |
|-------|---------|------------|
| v1.0  | Nov 2026 | Kerangka awal — 4 modul utama |

---
*Dibuat dengan ❤️ untuk Kedai Ndrojos*
