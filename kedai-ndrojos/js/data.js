/**
 * KEDAI NDROJOS — Data Layer
 * Semua data disimpan di localStorage agar persisten.
 * Ekspor: DB (objek utama), serta helper Rp() dan formatDate()
 */

const STORAGE_KEY = 'kedaiNdrojosData';

// ── Default / Seed Data ──────────────────────────────────────────────────────
const DEFAULT_DATA = {
  // Menu yang dijual
  menu: [
    { id: 1, nama: 'Nasi Goreng Spesial', harga: 15000, emoji: '🍳', kategori: 'Nasi', stokBahan: ['Nasi', 'Telur', 'Minyak Goreng'] },
    { id: 2, nama: 'Mie Goreng',          harga: 12000, emoji: '🍜', kategori: 'Mie',  stokBahan: ['Mie', 'Telur', 'Minyak Goreng'] },
    { id: 3, nama: 'Ayam Goreng',         harga: 18000, emoji: '🍗', kategori: 'Lauk', stokBahan: ['Ayam', 'Minyak Goreng'] },
    { id: 4, nama: 'Tempe Goreng',        harga: 5000,  emoji: '🫘', kategori: 'Lauk', stokBahan: ['Tempe', 'Minyak Goreng'] },
    { id: 5, nama: 'Sayur Asem',          harga: 8000,  emoji: '🥦', kategori: 'Sayur', stokBahan: ['Sayuran'] },
    { id: 6, nama: 'Tahu Goreng',         harga: 4000,  emoji: '🧊', kategori: 'Lauk', stokBahan: ['Tahu', 'Minyak Goreng'] },
    { id: 7, nama: 'Es Teh Manis',        harga: 5000,  emoji: '🧋', kategori: 'Minum', stokBahan: ['Teh', 'Gula', 'Es Batu'] },
    { id: 8, nama: 'Es Jeruk',            harga: 7000,  emoji: '🍊', kategori: 'Minum', stokBahan: ['Jeruk', 'Gula', 'Es Batu'] },
    { id: 9, nama: 'Air Putih',           harga: 2000,  emoji: '💧', kategori: 'Minum', stokBahan: [] },
    { id:10, nama: 'Nasi Putih',          harga: 4000,  emoji: '🍚', kategori: 'Nasi', stokBahan: ['Nasi'] },
  ],

  // Stok bahan dapur
  stok: [
    { id: 1, nama: 'Nasi',          satuan: 'kg',  jumlah: 20,  minStok: 5,   hargaBeli: 12000 },
    { id: 2, nama: 'Telur',         satuan: 'butir', jumlah: 60, minStok: 20, hargaBeli: 2000  },
    { id: 3, nama: 'Minyak Goreng', satuan: 'liter', jumlah: 8,  minStok: 2,  hargaBeli: 17000 },
    { id: 4, nama: 'Mie',           satuan: 'bungkus', jumlah: 30, minStok:10, hargaBeli: 2500 },
    { id: 5, nama: 'Ayam',          satuan: 'kg',  jumlah: 5,   minStok: 2,   hargaBeli: 38000 },
    { id: 6, nama: 'Tempe',         satuan: 'papan', jumlah: 10, minStok: 4,  hargaBeli: 5000  },
    { id: 7, nama: 'Tahu',          satuan: 'potong', jumlah: 24, minStok: 10, hargaBeli: 1000 },
    { id: 8, nama: 'Sayuran',       satuan: 'kg',  jumlah: 3,   minStok: 1,   hargaBeli: 8000  },
    { id: 9, nama: 'Teh',           satuan: 'bungkus', jumlah: 15, minStok: 5, hargaBeli: 2000 },
    { id:10, nama: 'Gula',          satuan: 'kg',  jumlah: 4,   minStok: 1,   hargaBeli: 15000 },
    { id:11, nama: 'Es Batu',       satuan: 'bungkus', jumlah: 5, minStok: 2, hargaBeli: 2000  },
    { id:12, nama: 'Jeruk',         satuan: 'kg',  jumlah: 2,   minStok: 1,   hargaBeli: 15000 },
  ],

  // Daftar supplier / kulakan
  supplier: [
    { id: 1, nama: 'Pak Budi — Pasar Pagi', telepon: '081234567890', komoditi: 'Sayuran, Tahu, Tempe', hargaNote: 'Harga bersaing, ada antar min 50rb', rating: 5 },
    { id: 2, nama: 'Toko Sembako Murah',    telepon: '082345678901', komoditi: 'Beras, Minyak, Gula, Teh', hargaNote: 'Harga grosir, bayar setelah 3 hari', rating: 4 },
    { id: 3, nama: 'Distributor Mie Jaya',  telepon: '083456789012', komoditi: 'Mie, Bumbu',           hargaNote: 'Antar gratis min 10 dus', rating: 4 },
    { id: 4, nama: 'UD Ayam Segar',         telepon: '084567890123', komoditi: 'Ayam potong',          hargaNote: 'Pesan H-1, harga fluktuatif', rating: 3 },
  ],

  // Transaksi kasir
  transaksi: [],

  // Utang/Kasbon pelanggan
  utang: [],

  // Pengeluaran / kulakan
  pengeluaran: [],

  // Bahan terbuang / kerugian
  kerugian: [],

  // Nomor struk terakhir
  lastStrukNo: 0,
};

// ── Database Object ──────────────────────────────────────────────────────────
const DB = {
  _data: null,

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._data = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
    } catch {
      this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    // Merge keys jika ada field baru di DEFAULT_DATA (upgrades)
    for (const key of Object.keys(DEFAULT_DATA)) {
      if (!(key in this._data)) this._data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
    }
    return this;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
    return this;
  },

  get(key)        { return this._data[key]; },
  set(key, value) { this._data[key] = value; this.save(); },

  // ── Transaksi ──
  tambahTransaksi(items, totalBayar, uangDiterima, namaKasbon = null) {
    this._data.lastStrukNo++;
    const trx = {
      id:        this._data.lastStrukNo,
      tanggal:   new Date().toISOString(),
      items,
      total:     totalBayar,
      bayar:     uangDiterima,
      kembalian: uangDiterima - totalBayar,
      kasbon:    namaKasbon,
    };
    this._data.transaksi.unshift(trx);

    // Kurangi stok otomatis (simulasi sederhana: -1 per unit bahan)
    for (const item of items) {
      const menuDef = this._data.menu.find(m => m.id === item.id);
      if (!menuDef) continue;
      for (const bahan of (menuDef.stokBahan || [])) {
        const s = this._data.stok.find(x => x.nama === bahan);
        if (s) {
          s.jumlah = Math.max(0, s.jumlah - (0.1 * item.qty)); // -0.1 per qty (estimasi)
        }
      }
    }

    // Jika kasbon, catat ke daftar utang
    if (namaKasbon) {
      this._data.utang.push({
        id:      Date.now(),
        pelanggan: namaKasbon,
        jumlah:  totalBayar,
        tanggal: new Date().toISOString(),
        lunas:   false,
        trxId:   trx.id,
      });
    }

    this.save();
    return trx;
  },

  lunaskanUtang(id) {
    const u = this._data.utang.find(x => x.id === id);
    if (u) { u.lunas = true; u.tanggalLunas = new Date().toISOString(); }
    this.save();
  },

  tambahPengeluaran(nama, jumlah, keterangan = '') {
    this._data.pengeluaran.unshift({ id: Date.now(), tanggal: new Date().toISOString(), nama, jumlah, keterangan });
    this.save();
  },

  tambahKerugian(nama, jumlah, keterangan = '') {
    this._data.kerugian.unshift({ id: Date.now(), tanggal: new Date().toISOString(), nama, jumlah, keterangan });
    this.save();
  },

  // ── Stok ──
  updateStok(id, jumlahBaru) {
    const s = this._data.stok.find(x => x.id === id);
    if (s) { s.jumlah = jumlahBaru; this.save(); }
  },

  // ── Ringkasan Hari Ini ──
  ringkasanHariIni() {
    const hari = new Date().toDateString();
    const trxHariIni = this._data.transaksi.filter(t => new Date(t.tanggal).toDateString() === hari && !t.kasbon);
    const omzet = trxHariIni.reduce((s, t) => s + t.total, 0);
    const pengeluaranHariIni = this._data.pengeluaran
      .filter(p => new Date(p.tanggal).toDateString() === hari)
      .reduce((s, p) => s + p.jumlah, 0);
    const totalUtang = this._data.utang.filter(u => !u.lunas).reduce((s, u) => s + u.jumlah, 0);
    const stokMenipis = this._data.stok.filter(s => s.jumlah <= s.minStok);
    const estimasiLaba = omzet * 0.35 - pengeluaranHariIni; // estimasi margin 35%
    return { omzet, pengeluaranHariIni, totalUtang, stokMenipis, estimasiLaba, jumlahTrx: trxHariIni.length };
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function Rp(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatDateOnly(isoStr) {
  return new Date(isoStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

DB.load();
