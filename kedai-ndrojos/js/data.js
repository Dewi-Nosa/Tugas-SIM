/**
 * KEDAI NDROJOS — Data Layer
 * Semua data disimpan di localStorage agar persisten.
 * Ekspor: DB (objek utama), serta helper Rp() dan formatDate()
 */

const STORAGE_KEY = 'kedaiNdrojosData';

// ── Default / Seed Data ──────────────────────────────────────────────────────
const DEFAULT_DATA = {
  // Menu yang dijual (sesuai tangkapan layar GoFood Kedai Ndrojos)
  menu: [
    // 1. Ayam Geprek (Dengan Nasi)
    { id: 1,  nama: 'Ayam Geprek + Nasi',             harga: 20000, emoji: '🍗', kategori: 'Ayam Geprek', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 2,  nama: 'Prekkar + Nasi',                 harga: 23000, emoji: '🔥', kategori: 'Ayam Geprek', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 3,  nama: 'Prekju + Nasi',                  harga: 26000, emoji: '🧀', kategori: 'Ayam Geprek', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Keju Parut', 'Sayuran'] },
    { id: 4,  nama: 'Mie Goreng Ayam Geprek + Nasi',  harga: 27000, emoji: '🍜', kategori: 'Ayam Geprek', stokBahan: ['Nasi', 'Ayam', 'Mie', 'Minyak Goreng', 'Sayuran'] },
    { id: 5,  nama: 'Prekju Mozarrella + Nasi',       harga: 30000, emoji: '🍕', kategori: 'Ayam Geprek', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Keju Mozarella', 'Sayuran'] },

    // 2. Ayam Penyet (Dengan Nasi & Paket)
    { id: 6,  nama: 'Pehu Penyet + Nasi',             harga: 17000, emoji: '🫘', kategori: 'Ayam Penyet', stokBahan: ['Nasi', 'Tahu', 'Tempe', 'Minyak Goreng', 'Sayuran'] },
    { id: 7,  nama: 'Ayam Penyet Kecil + Nasi',       harga: 23000, emoji: '🍗', kategori: 'Ayam Penyet', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 8,  nama: 'Ayam Penyet Besar + Nasi',       harga: 25000, emoji: '🍖', kategori: 'Ayam Penyet', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 9,  nama: 'Ayam Penyet Kecil + Teh',        harga: 26000, emoji: '🧋', kategori: 'Ayam Penyet', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Teh', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 10, nama: 'Ayam Penyet Besar + Teh',        harga: 29000, emoji: '🧋', kategori: 'Ayam Penyet', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Teh', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 11, nama: 'Ayam Penyet Besar + Nutrisari',  harga: 29000, emoji: '🍊', kategori: 'Ayam Penyet', stokBahan: ['Nasi', 'Ayam', 'Tahu', 'Tempe', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },

    // 3. Ayam Rempah, Kremes, Bakar & Steak (Dengan Nasi)
    { id: 12, nama: 'Pehu Rempah + Nasi',             harga: 18000, emoji: '🌿', kategori: 'Ayam Rempah & Kremes', stokBahan: ['Nasi', 'Tahu', 'Tempe', 'Rempah & Kremesan', 'Minyak Goreng', 'Sayuran'] },
    { id: 13, nama: 'Ayam Rempah Kecil + Nasi',       harga: 24000, emoji: '🌿', kategori: 'Ayam Rempah & Kremes', stokBahan: ['Nasi', 'Ayam', 'Rempah & Kremesan', 'Minyak Goreng', 'Sayuran'] },
    { id: 14, nama: 'Ayam Rempah Besar + Nasi',       harga: 27000, emoji: '🌿', kategori: 'Ayam Rempah & Kremes', stokBahan: ['Nasi', 'Ayam', 'Rempah & Kremesan', 'Minyak Goreng', 'Sayuran'] },
    { id: 15, nama: 'Pehu Kremes + Nasi',             harga: 18000, emoji: '✨', kategori: 'Ayam Rempah & Kremes', stokBahan: ['Nasi', 'Tahu', 'Tempe', 'Rempah & Kremesan', 'Minyak Goreng', 'Sayuran'] },
    { id: 16, nama: 'Ayam Kremes Kecil + Nasi',       harga: 24000, emoji: '✨', kategori: 'Ayam Rempah & Kremes', stokBahan: ['Nasi', 'Ayam', 'Tahu', 'Tempe', 'Rempah & Kremesan', 'Minyak Goreng', 'Sayuran'] },
    { id: 17, nama: 'Ayam Kremes Besar + Nasi',       harga: 27000, emoji: '✨', kategori: 'Ayam Rempah & Kremes', stokBahan: ['Nasi', 'Ayam', 'Tahu', 'Tempe', 'Rempah & Kremesan', 'Minyak Goreng', 'Sayuran'] },
    { id: 18, nama: 'Ayam Bakar + Nasi',              harga: 24000, emoji: '🍖', kategori: 'Bakar & Steak', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 19, nama: 'Steak Ayam+Nasi',                harga: 24000, emoji: '🍽️', kategori: 'Bakar & Steak', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Sayuran'] },

    // 4. Paket Hemat & Paket Nutrisari
    { id: 20, nama: 'Paket Teh',                      harga: 25000, emoji: '🍱', kategori: 'Paket Hemat', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Teh', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 21, nama: 'Paket Jeruk',                    harga: 25000, emoji: '🍱', kategori: 'Paket Hemat', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Jeruk', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 22, nama: 'Prekkar + Minum',                harga: 28000, emoji: '🍱', kategori: 'Paket Hemat', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Teh', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 23, nama: 'Paket Keju Teh',                 harga: 30000, emoji: '🧀', kategori: 'Paket Hemat', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Keju Parut', 'Teh', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 24, nama: 'Paket Mie Teh',                  harga: 31000, emoji: '🍜', kategori: 'Paket Hemat', stokBahan: ['Nasi', 'Ayam', 'Mie', 'Minyak Goreng', 'Teh', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 25, nama: 'Pehu Penyet + Nutrisari',        harga: 21000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Tahu', 'Tempe', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 26, nama: 'Ayam Geprek + Nutrisari',        harga: 25000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 27, nama: 'Prekkar + Nutrisari',            harga: 28000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 28, nama: 'Ayam Penyet + Nutrisari',        harga: 30000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Ayam', 'Tahu', 'Tempe', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 29, nama: 'Mie Goreng Ayam Geprek + Nutrisari', harga: 31000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Ayam', 'Mie', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },
    { id: 30, nama: 'Ayam Rempah Besar + Nutrisari',  harga: 31000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Ayam', 'Rempah & Kremesan', 'Tahu', 'Tempe', 'Minyak Goreng', 'Nutrisari', 'Gula', 'Es Batu'] },
    { id: 31, nama: 'Prekju Mozarella + Nutrisari',   harga: 35000, emoji: '🥤', kategori: 'Paket Nutrisari', stokBahan: ['Nasi', 'Ayam', 'Minyak Goreng', 'Keju Mozarella', 'Nutrisari', 'Gula', 'Es Batu', 'Sayuran'] },

    // 5. Tanpa Nasi (Lauk Saja)
    { id: 32, nama: 'Ayam Geprek',                    harga: 18000, emoji: '🍗', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 33, nama: 'Ayam Geprek Bakar',              harga: 20000, emoji: '🔥', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Minyak Goreng', 'Sayuran'] },
    { id: 34, nama: 'Ayam Geprek Keju',               harga: 23000, emoji: '🧀', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Minyak Goreng', 'Keju Parut', 'Sayuran'] },
    { id: 35, nama: 'Ayam Penyet Besar',              harga: 23000, emoji: '🍖', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Tahu', 'Tempe', 'Minyak Goreng', 'Sayuran'] },
    { id: 36, nama: 'Ayam Rempah Besar',              harga: 24000, emoji: '🌿', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Rempah & Kremesan', 'Tahu', 'Tempe', 'Minyak Goreng'] },
    { id: 37, nama: 'Mie Goreng Ayam Geprek',         harga: 24000, emoji: '🍜', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Mie', 'Minyak Goreng', 'Sayuran'] },
    { id: 38, nama: 'Ayam Geprek Mozarella',          harga: 28000, emoji: '🍕', kategori: 'Tanpa Nasi', stokBahan: ['Ayam', 'Minyak Goreng', 'Keju Mozarella'] },

    // 6. Menu Tambahan
    { id: 39, nama: 'Nasi Putih',                     harga: 5500,  emoji: '🍚', kategori: 'Tambahan', stokBahan: ['Nasi'] },
    { id: 40, nama: 'Terong Goreng',                  harga: 8000,  emoji: '🍆', kategori: 'Tambahan', stokBahan: ['Terong', 'Minyak Goreng'] },
    { id: 41, nama: 'Mie Goreng',                     harga: 9000,  emoji: '🍜', kategori: 'Tambahan', stokBahan: ['Mie', 'Minyak Goreng'] },

    // 7. Minuman (Panas / Dingin)
    { id: 42, nama: 'Nutrisari (Panas / Dingin)',     harga: 6000,  emoji: '🍊', kategori: 'Minuman', stokBahan: ['Nutrisari', 'Gula', 'Es Batu'] },
    { id: 43, nama: 'Teh (Panas / Dingin)',           harga: 6000,  emoji: '🍵', kategori: 'Minuman', stokBahan: ['Teh', 'Gula', 'Es Batu'] },
    { id: 44, nama: 'Jeruk (Panas / Dingin)',         harga: 6000,  emoji: '🍋', kategori: 'Minuman', stokBahan: ['Jeruk', 'Gula', 'Es Batu'] },
    { id: 45, nama: 'Hi - Lo (Panas / Dingin)',       harga: 7500,  emoji: '🥛', kategori: 'Minuman', stokBahan: ['Hi-Lo', 'Gula', 'Es Batu'] },
    { id: 46, nama: 'Kopi (Panas / Dingin)',          harga: 7500,  emoji: '☕', kategori: 'Minuman', stokBahan: ['Kopi', 'Gula', 'Es Batu'] },
    { id: 47, nama: 'Susu Putih / Coklat (Panas / Dingin)', harga: 7500, emoji: '🍫', kategori: 'Minuman', stokBahan: ['Susu', 'Gula', 'Es Batu'] },
    { id: 48, nama: 'Jeruk Nipis (Panas / Dingin)',   harga: 8000,  emoji: '🍈', kategori: 'Minuman', stokBahan: ['Jeruk Nipis', 'Gula', 'Es Batu'] },
    { id: 49, nama: 'Lemon Tea (Panas / Dingin)',     harga: 9000,  emoji: '🧊', kategori: 'Minuman', stokBahan: ['Teh', 'Jeruk Nipis', 'Gula', 'Es Batu'] },
  ],

  // Stok bahan dapur
  stok: [
    { id: 1,  nama: 'Nasi',              satuan: 'kg',      jumlah: 20, minStok: 5,  hargaBeli: 12000 },
    { id: 2,  nama: 'Ayam',              satuan: 'kg',      jumlah: 10, minStok: 3,  hargaBeli: 38000 },
    { id: 3,  nama: 'Minyak Goreng',     satuan: 'liter',   jumlah: 10, minStok: 3,  hargaBeli: 17000 },
    { id: 4,  nama: 'Sayuran',           satuan: 'kg',      jumlah: 4,  minStok: 1,  hargaBeli: 8000  },
    { id: 5,  nama: 'Tahu',              satuan: 'potong',  jumlah: 30, minStok: 10, hargaBeli: 1000  },
    { id: 6,  nama: 'Tempe',             satuan: 'papan',   jumlah: 12, minStok: 4,  hargaBeli: 5000  },
    { id: 7,  nama: 'Mie',               satuan: 'bungkus', jumlah: 30, minStok: 10, hargaBeli: 3000  },
    { id: 8,  nama: 'Terong',            satuan: 'kg',      jumlah: 4,  minStok: 1,  hargaBeli: 8000  },
    { id: 9,  nama: 'Keju Parut',        satuan: 'pack',    jumlah: 5,  minStok: 2,  hargaBeli: 14000 },
    { id: 10, nama: 'Keju Mozarella',    satuan: 'pack',    jumlah: 4,  minStok: 1,  hargaBeli: 28000 },
    { id: 11, nama: 'Rempah & Kremesan', satuan: 'pack',    jumlah: 8,  minStok: 2,  hargaBeli: 10000 },
    { id: 12, nama: 'Teh',               satuan: 'bungkus', jumlah: 15, minStok: 5,  hargaBeli: 2000  },
    { id: 13, nama: 'Jeruk',             satuan: 'kg',      jumlah: 3,  minStok: 1,  hargaBeli: 15000 },
    { id: 14, nama: 'Jeruk Nipis',       satuan: 'kg',      jumlah: 2,  minStok: 1,  hargaBeli: 14000 },
    { id: 15, nama: 'Nutrisari',         satuan: 'sachet',  jumlah: 40, minStok: 10, hargaBeli: 1500  },
    { id: 16, nama: 'Hi-Lo',             satuan: 'sachet',  jumlah: 20, minStok: 5,  hargaBeli: 2500  },
    { id: 17, nama: 'Kopi',              satuan: 'sachet',  jumlah: 25, minStok: 8,  hargaBeli: 2000  },
    { id: 18, nama: 'Susu',              satuan: 'kaleng',  jumlah: 6,  minStok: 2,  hargaBeli: 12000 },
    { id: 19, nama: 'Gula',              satuan: 'kg',      jumlah: 5,  minStok: 2,  hargaBeli: 15000 },
    { id: 20, nama: 'Es Batu',           satuan: 'bungkus', jumlah: 10, minStok: 3,  hargaBeli: 2000  },
  ],

  // Daftar supplier / kulakan
  supplier: [
    { id: 1, nama: 'Pak Budi — Pasar Pagi', telepon: '081234567890', komoditi: 'Sayuran, Tahu, Tempe, Terong', hargaNote: 'Harga bersaing, ada antar min 50rb', rating: 5 },
    { id: 2, nama: 'Toko Sembako Murah',    telepon: '082345678901', komoditi: 'Beras, Minyak, Gula, Teh, Nutrisari', hargaNote: 'Harga grosir, bayar setelah 3 hari', rating: 4 },
    { id: 3, nama: 'Distributor Mie Jaya',  telepon: '083456789012', komoditi: 'Mie, Bumbu, Keju', hargaNote: 'Antar gratis min 10 dus', rating: 4 },
    { id: 4, nama: 'UD Ayam Segar',         telepon: '084567890123', komoditi: 'Ayam potong', hargaNote: 'Pesan H-1, harga fluktuatif', rating: 3 },
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

    // Kurangi stok otomatis (simulasi sederhana: -0.1 per unit bahan per qty)
    for (const item of items) {
      const menuDef = this._data.menu.find(m => m.id === item.id);
      if (!menuDef) continue;
      for (const bahan of (menuDef.stokBahan || [])) {
        const s = this._data.stok.find(x => x.nama === bahan);
        if (s) {
          s.jumlah = Math.max(0, s.jumlah - (0.1 * item.qty));
        }
      }
    }

    // Jika kasbon, catat ke daftar utang
    if (namaKasbon) {
      this._data.utang.push({
        id:        Date.now(),
        pelanggan: namaKasbon,
        jumlah:    totalBayar,
        tanggal:   new Date().toISOString(),
        lunas:     false,
        trxId:     trx.id,
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
    const estimasiLaba = omzet * 0.35 - pengeluaranHariIni;
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
