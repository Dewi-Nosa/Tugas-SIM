# 🍳 Kedai Ndrojos — Sistem Operasional Web

Aplikasi kasir dan manajemen operasional **Kedai Ndrojos** versi web — modern, responsif, dan siap deploy ke GitHub Pages, Netlify, atau hosting statis apapun.

## ✨ Fitur Utama

| Modul | Deskripsi |
|---|---|
| **📊 Dashboard** | Ringkasan omzet, laba, stok menipis, dan transaksi terbaru hari ini |
| **🧾 Kasir Cepat** | POS dengan grid menu, filter kategori, search, hitung kembalian otomatis |
| **📦 Stok & Kulakan** | Kelola stok bahan dapur, tambah stok cepat (kulakan), kasbon/utang pelanggan |
| **🛒 Supplier** | Daftar pemasok dengan link telepon & WhatsApp langsung |
| **📈 Laporan Keuangan** | Filter per hari/minggu/bulan/semua, export CSV, riwayat transaksi |

## 🚀 Cara Pakai

### Buka Langsung di Browser
1. Buka file `kedai-ndrojos/index.html` di browser
2. Atau deploy ke GitHub Pages / Netlify

### Via GitHub Pages
1. Aktifkan GitHub Pages dari branch `coba-web`
2. Set Source ke folder `/ (root)` atau `/kedai-ndrojos`
3. Akses di `https://dewi-nosa.github.io/Tugas-SIM/kedai-ndrojos/`

## 📁 Struktur File

```
kedai-ndrojos/
├── index.html          ← Entry point SPA
├── css/
│   └── style.css       ← Modern responsive stylesheet
├── js/
│   ├── data.js         ← Data layer (menu, stok, supplier) + localStorage
│   └── app.js          ← Logika aplikasi (kasir, stok, laporan, supplier)
└── README.md
```

## 📱 Responsif

- **Desktop** — Layout sidebar + konten dua kolom
- **Tablet** — Sidebar slide-over, konten satu kolom
- **Mobile** — Fully mobile-first, tombol besar, kasir grid 3 kolom

## 🗄 Data & Penyimpanan

Semua data disimpan di **localStorage** browser sehingga:
- Tidak memerlukan server/backend
- Data persisten meski browser ditutup
- Berjalan 100% offline setelah pertama kali dibuka

> **Catatan:** Karena menggunakan localStorage, data tidak sinkron antar perangkat/browser berbeda.

## 🛒 Menu Default Kedai Ndrojos

| Menu | Harga | Kategori |
|---|---|---|
| Nasi Goreng Spesial | Rp 15.000 | Nasi |
| Mie Goreng | Rp 12.000 | Mie |
| Ayam Goreng | Rp 18.000 | Lauk |
| Tempe Goreng | Rp 5.000 | Lauk |
| Sayur Asem | Rp 8.000 | Sayur |
| Tahu Goreng | Rp 4.000 | Lauk |
| Es Teh Manis | Rp 5.000 | Minum |
| Es Jeruk | Rp 7.000 | Minum |
| Air Putih | Rp 2.000 | Minum |
| Nasi Putih | Rp 4.000 | Nasi |

---
Berdiri sejak 22 Oktober 2020 🎉 | v2.0 Web Edition
