/**
 * KEDAI NDROJOS — Application Logic (Web Edition v2.0)
 * Single-Page Application tanpa framework.
 * Kompatibel dengan GitHub Pages / Netlify / hosting statis apapun.
 */

// ── State Global ──────────────────────────────────────────────────────────────
let cart = [];
let currentFilterKategori = '';
let currentFilterLaporan  = 'hari';

// ── Navigasi SPA ─────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    navigateTo(item.dataset.page);
  });
});

function navigateTo(pageId) {
  // Update sidebar aktif
  document.querySelectorAll('.nav-item').forEach(n =>
    n.classList.toggle('active', n.dataset.page === pageId)
  );
  // Show page
  document.querySelectorAll('.page').forEach(p =>
    p.classList.toggle('active', p.id === 'page-' + pageId)
  );
  // Update title topbar
  const titles = {
    dashboard: '📊 Dashboard',
    kasir:     '🧾 Kasir Cepat',
    stok:      '📦 Stok & Kulakan',
    supplier:  '🛒 Supplier',
    laporan:   '📈 Laporan Keuangan',
  };
  document.getElementById('topbar-title').textContent = titles[pageId] || 'Kedai Ndrojos';

  // Load halaman yang dikunjungi
  if (pageId === 'dashboard') loadDashboard();
  if (pageId === 'kasir')     loadKasir();
  if (pageId === 'stok')      loadStok();
  if (pageId === 'supplier')  loadSupplier();
  if (pageId === 'laporan')   loadLaporan();

  // Tutup sidebar mobile
  closeSidebar();
}

// ── Sidebar Mobile ────────────────────────────────────────────────────────────
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('show');
}

document.getElementById('btn-menu-toggle').addEventListener('click', openSidebar);
document.getElementById('btn-sidebar-close').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

// ── Toast Notification ────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || ''}</span> ${msg}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3400);
}

// ── Date / Clock Display ──────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const opt = { weekday:'long', day:'2-digit', month:'long', year:'numeric' };
  const tgl  = now.toLocaleDateString('id-ID', opt);
  const jam  = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  document.getElementById('topbar-date').textContent = `📅 ${tgl} • ${jam}`;
}
setInterval(updateClock, 1000);
updateClock();

// ══════════════════════════════════════════════════════════════════════════════
//  1. DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function loadDashboard() {
  const r = DB.ringkasanHariIni();

  document.getElementById('d-omzet').textContent        = Rp(r.omzet);
  document.getElementById('d-laba').textContent         = Rp(Math.max(0, r.estimasiLaba));
  document.getElementById('d-utang').textContent        = Rp(r.totalUtang);
  document.getElementById('d-stok-menipis').textContent = r.stokMenipis.length;
  document.getElementById('d-jumlah-trx').textContent   = r.jumlahTrx + ' transaksi hari ini';
  document.getElementById('d-pengeluaran').textContent  = 'pengeluaran: ' + Rp(r.pengeluaranHariIni);

  // Peringatan stok menipis
  const alertBox = document.getElementById('d-stok-alert');
  if (r.stokMenipis.length > 0) {
    alertBox.style.display = 'flex';
    document.getElementById('d-stok-alert-text').textContent =
      r.stokMenipis.map(s => `${s.nama} (sisa ${s.jumlah} ${s.satuan})`).join(', ');
  } else {
    alertBox.style.display = 'none';
  }

  // Tabel stok menipis
  const tbody = document.getElementById('d-stok-tabel');
  tbody.innerHTML = '';
  if (r.stokMenipis.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:20px">Semua stok aman 🎉</td></tr>';
  } else {
    r.stokMenipis.forEach(s => {
      const pct = s.minStok > 0 ? Math.min(100, Math.round((s.jumlah / s.minStok) * 100)) : 0;
      const cls = s.jumlah === 0 ? 'danger' : 'warning';
      tbody.innerHTML += `
        <tr>
          <td><strong>${s.nama}</strong></td>
          <td>${s.jumlah} ${s.satuan}</td>
          <td>${s.minStok} ${s.satuan}</td>
          <td style="width:120px">
            <div class="progress-wrap"><div class="progress-bar ${cls}" style="width:${pct}%"></div></div>
          </td>
        </tr>`;
    });
  }

  // Transaksi terakhir
  const tBody2 = document.getElementById('d-trx-tabel');
  tBody2.innerHTML = '';
  const trxList = DB.get('transaksi').slice(0, 8);
  if (trxList.length === 0) {
    tBody2.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:20px">Belum ada transaksi 📭</td></tr>';
  } else {
    trxList.forEach(t => {
      const badge = t.kasbon
        ? `<span class="badge badge-warning">Kasbon: ${t.kasbon}</span>`
        : `<span class="badge badge-success">Lunas</span>`;
      tBody2.innerHTML += `
        <tr>
          <td>#${String(t.id).padStart(4,'0')}</td>
          <td>${formatDate(t.tanggal)}</td>
          <td><strong>${Rp(t.total)}</strong></td>
          <td>${badge}</td>
        </tr>`;
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  2. KASIR CEPAT (POS)
// ══════════════════════════════════════════════════════════════════════════════
function loadKasir() {
  buildKategoriFilter();
  renderMenuGrid();
  renderCart();
  document.getElementById('kasir-search').value = '';
}

/** Buat tombol filter kategori dari data menu */
function buildKategoriFilter() {
  const bar = document.getElementById('kategori-filter');
  const menus = DB.get('menu');
  const kategoriSet = [...new Set(menus.map(m => m.kategori))].sort();

  bar.innerHTML = `<button class="filter-chip ${currentFilterKategori === '' ? 'active' : ''}" data-kategori="">Semua</button>`;
  kategoriSet.forEach(k => {
    bar.innerHTML += `<button class="filter-chip ${currentFilterKategori === k ? 'active' : ''}" data-kategori="${k}">${k}</button>`;
  });

  bar.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentFilterKategori = chip.dataset.kategori;
      bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderMenuGrid(document.getElementById('kasir-search').value);
    });
  });
}

function renderMenuGrid(keyword = '') {
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = '';
  const menus = DB.get('menu').filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(keyword.toLowerCase()) ||
                        m.kategori.toLowerCase().includes(keyword.toLowerCase());
    const matchKat    = !currentFilterKategori || m.kategori === currentFilterKategori;
    return matchSearch && matchKat;
  });

  if (menus.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:28px;color:var(--text-muted);font-size:13px">
      Tidak ada menu ditemukan 🔍</div>`;
    return;
  }

  menus.forEach(m => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <span class="menu-emoji">${m.emoji}</span>
      <div class="menu-name">${m.nama}</div>
      <div class="menu-price">${Rp(m.harga)}</div>
      <div class="menu-kategori">${m.kategori}</div>`;
    div.addEventListener('click', () => addToCart(m));
    grid.appendChild(div);
  });
}

function addToCart(menu) {
  const existing = cart.find(c => c.id === menu.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...menu, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  document.getElementById('input-bayar').value = '';
  renderCart();
  toast('Keranjang dikosongkan', 'warning');
}

function renderCart() {
  const list = document.getElementById('order-items');
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = `<div class="order-empty">
      <span class="empty-icon">🛒</span>
      Ketuk menu untuk menambah pesanan
    </div>`;
  } else {
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <div class="order-item-info">
          <div class="order-item-name">${item.emoji} ${item.nama}</div>
          <div class="order-item-price">${Rp(item.harga)} × ${item.qty} = <strong>${Rp(item.harga * item.qty)}</strong></div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>`;
      list.appendChild(div);
    });
  }

  const total = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  document.getElementById('order-total').textContent = Rp(total);
  document.getElementById('order-items-count').textContent = cart.reduce((s,c) => s+c.qty, 0);
  hitungKembalian();
}

function hitungKembalian() {
  const total  = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  const bayar  = parseInt(document.getElementById('input-bayar').value) || 0;
  const kembal = bayar - total;
  const box    = document.getElementById('kembalian-value');
  const wrap   = document.getElementById('kembalian-box');
  if (bayar >= total && total > 0) {
    box.textContent = Rp(kembal);
    wrap.style.borderColor = kembal === 0 ? 'var(--success)' : 'var(--primary)';
    wrap.style.background  = kembal === 0 ? 'var(--success-bg)' : 'var(--primary-light)';
  } else {
    box.textContent = bayar > 0 ? '⚠ Kurang ' + Rp(total - bayar) : '—';
    wrap.style.borderColor = bayar > 0 ? 'var(--warning)' : 'var(--border)';
    wrap.style.background  = 'var(--primary-light)';
  }
}

function bayar() {
  if (cart.length === 0) { toast('Keranjang masih kosong!', 'warning'); return; }
  const total = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  const bayar = parseInt(document.getElementById('input-bayar').value) || 0;
  if (bayar < total) { toast('Uang pembayaran kurang!', 'danger'); return; }

  DB.tambahTransaksi([...cart], total, bayar);
  toast(`✅ Transaksi berhasil! Kembalian ${Rp(bayar - total)}`);
  cart = [];
  document.getElementById('input-bayar').value = '';
  renderCart();
}

function simpanKasbon() {
  if (cart.length === 0) { toast('Keranjang masih kosong!', 'warning'); return; }
  const nama = document.getElementById('kasbon-nama').value.trim();
  if (!nama) { toast('Masukkan nama pelanggan!', 'warning'); return; }
  const total = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  DB.tambahTransaksi([...cart], total, 0, nama);
  toast(`Kasbon ${nama} sebesar ${Rp(total)} disimpan ✅`);
  cart = [];
  document.getElementById('input-bayar').value = '';
  document.getElementById('kasbon-nama').value = '';
  renderCart();
  document.getElementById('modal-kasbon').classList.remove('open');
}

// Quick Pay buttons
document.querySelectorAll('.quick-pay').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('input-bayar').value = btn.dataset.val;
    hitungKembalian();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  3. STOK & KULAKAN
// ══════════════════════════════════════════════════════════════════════════════
function loadStok() {
  renderStokTable();
  renderUtangTable();
  populateKulakanDropdown();
}

function renderStokTable(keyword = '') {
  const tbody = document.getElementById('stok-tbody');
  tbody.innerHTML = '';
  const list = DB.get('stok').filter(s =>
    s.nama.toLowerCase().includes(keyword.toLowerCase())
  );
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:20px">Tidak ada bahan ditemukan</td></tr>';
    return;
  }
  list.forEach(s => {
    const pct    = s.minStok > 0 ? Math.min(100, Math.round((s.jumlah / (s.minStok * 3)) * 100)) : 100;
    const status = s.jumlah <= 0        ? ['badge-danger',  'Habis']
                 : s.jumlah <= s.minStok ? ['badge-warning', 'Menipis']
                 :                         ['badge-success', 'Aman'];
    const barCls = status[0].replace('badge-', '');
    tbody.innerHTML += `
      <tr>
        <td><strong>${s.nama}</strong></td>
        <td><input type="number" value="${s.jumlah}" min="0" class="form-control"
              style="width:85px;padding:6px 10px"
              onchange="updateStok(${s.id}, this.value)"></td>
        <td>${s.satuan}</td>
        <td>${s.minStok}</td>
        <td>${Rp(s.hargaBeli)}</td>
        <td><span class="badge ${status[0]}">${status[1]}</span></td>
        <td style="width:110px"><div class="progress-wrap"><div class="progress-bar ${barCls}" style="width:${pct}%"></div></div></td>
      </tr>`;
  });
}

function updateStok(id, val) {
  DB.updateStok(id, parseFloat(val));
  renderStokTable();
  toast('Stok diperbarui!');
}

function populateKulakanDropdown() {
  const sel = document.getElementById('kulakan-bahan');
  if (!sel) return;
  sel.innerHTML = '';
  DB.get('stok').forEach(s => {
    sel.innerHTML += `<option value="${s.id}">${s.nama} (sisa: ${s.jumlah} ${s.satuan})</option>`;
  });
}

function tambahKulakan() {
  const bahanId = parseInt(document.getElementById('kulakan-bahan').value);
  const jumlah  = parseFloat(document.getElementById('kulakan-jumlah').value);
  const harga   = parseInt(document.getElementById('kulakan-harga').value) || 0;
  const ket     = document.getElementById('kulakan-ket').value.trim();

  if (!jumlah || jumlah <= 0) { toast('Masukkan jumlah yang valid!', 'warning'); return; }

  const stokItem = DB.get('stok').find(s => s.id === bahanId);
  if (!stokItem) return;

  // Update stok
  DB.updateStok(bahanId, stokItem.jumlah + jumlah);

  // Catat pengeluaran jika ada harga
  if (harga > 0) {
    DB.tambahPengeluaran(`Kulakan: ${stokItem.nama} +${jumlah} ${stokItem.satuan}`, harga, ket);
  }

  toast(`Stok ${stokItem.nama} ditambah ${jumlah} ${stokItem.satuan} ✅`);
  document.getElementById('kulakan-jumlah').value = '';
  document.getElementById('kulakan-harga').value  = '';
  document.getElementById('kulakan-ket').value    = '';
  renderStokTable();
  populateKulakanDropdown();
}

function renderUtangTable() {
  const tbody = document.getElementById('utang-tbody');
  tbody.innerHTML = '';
  const list = DB.get('utang').filter(u => !u.lunas);
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:20px">Tidak ada utang aktif 🎉</td></tr>';
    return;
  }
  list.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${u.pelanggan}</strong></td>
        <td>${Rp(u.jumlah)}</td>
        <td>${formatDateOnly(u.tanggal)}</td>
        <td><button class="btn btn-success btn-sm" onclick="lunaskanUtang(${u.id})">✅ Lunas</button></td>
      </tr>`;
  });
}

function lunaskanUtang(id) {
  DB.lunaskanUtang(id);
  toast('Utang ditandai lunas! 🎉');
  renderUtangTable();
  loadDashboard();
}

// ══════════════════════════════════════════════════════════════════════════════
//  4. SUPPLIER
// ══════════════════════════════════════════════════════════════════════════════
function loadSupplier() {
  renderSupplierCards();
}

function renderSupplierCards() {
  const container = document.getElementById('supplier-cards');
  if (!container) return;
  container.innerHTML = '';
  const suppliers = DB.get('supplier');

  if (suppliers.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:32px">
      Belum ada supplier. Klik "Tambah Supplier" untuk menambah.
    </div>`;
    return;
  }

  const stars = r => '⭐'.repeat(r) + '☆'.repeat(Math.max(0, 5 - r));
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px';

  suppliers.forEach(s => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border-light)';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
        <strong style="font-size:14px">${s.nama}</strong>
        <span style="font-size:16px">${stars(s.rating)}</span>
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px">
        🏷 ${s.komoditi}
      </div>
      <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:10px">
        📝 ${s.hargaNote}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a href="tel:${s.telepon}" class="btn btn-outline btn-sm">📞 ${s.telepon}</a>
        <a href="https://wa.me/62${s.telepon.replace(/^0/,'')}" target="_blank" rel="noopener" class="btn btn-success btn-sm">💬 WhatsApp</a>
      </div>`;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function tambahSupplier() {
  const nama     = document.getElementById('sup-nama').value.trim();
  const telp     = document.getElementById('sup-telp').value.trim();
  const komoditi = document.getElementById('sup-komoditi').value.trim();
  const note     = document.getElementById('sup-note').value.trim();
  const rating   = parseInt(document.getElementById('sup-rating').value);

  if (!nama || !telp) { toast('Nama dan telepon wajib diisi!', 'warning'); return; }

  const suppliers = DB.get('supplier');
  const newSup = {
    id:        Date.now(),
    nama,
    telepon:   telp,
    komoditi,
    hargaNote: note,
    rating,
  };
  suppliers.push(newSup);
  DB.set('supplier', suppliers);

  toast('Supplier berhasil ditambahkan! ✅');
  document.getElementById('sup-nama').value = '';
  document.getElementById('sup-telp').value = '';
  document.getElementById('sup-komoditi').value = '';
  document.getElementById('sup-note').value = '';
  document.getElementById('modal-supplier').classList.remove('open');
  renderSupplierCards();
}

// ══════════════════════════════════════════════════════════════════════════════
//  5. LAPORAN KEUANGAN
// ══════════════════════════════════════════════════════════════════════════════
function setFilterLaporan(filter, el) {
  currentFilterLaporan = filter;
  document.querySelectorAll('#page-laporan .filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  loadLaporan();
}

function getDateRange() {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (currentFilterLaporan === 'hari') {
    return { from: today, to: new Date(today.getTime() + 86400000) };
  }
  if (currentFilterLaporan === 'minggu') {
    return { from: new Date(today.getTime() - 7 * 86400000), to: new Date(today.getTime() + 86400000) };
  }
  if (currentFilterLaporan === 'bulan') {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date(today.getTime() + 86400000) };
  }
  return null; // semua
}

function inRange(isoStr, range) {
  if (!range) return true;
  const d = new Date(isoStr);
  return d >= range.from && d < range.to;
}

function loadLaporan() {
  const range    = getDateRange();
  const allTrx   = DB.get('transaksi');
  const allUtang = DB.get('utang');
  const allKeluar = DB.get('pengeluaran');
  const allKerugian = DB.get('kerugian');

  const trx      = allTrx.filter(t => inRange(t.tanggal, range));
  const keluar   = allKeluar.filter(p => inRange(p.tanggal, range));
  const kerugian = allKerugian.filter(k => inRange(k.tanggal, range));

  const totalMasuk   = trx.filter(t => !t.kasbon).reduce((s,t) => s + t.total, 0);
  const totalKeluar  = keluar.reduce((s,p) => s + p.jumlah, 0);
  const totalPiutang = allUtang.filter(u => !u.lunas).reduce((s,u) => s + u.jumlah, 0);
  const totalBuang   = kerugian.reduce((s,k) => s + k.jumlah, 0);
  const labaBersih   = totalMasuk - totalKeluar - totalBuang;

  document.getElementById('lap-masuk').textContent    = Rp(totalMasuk);
  document.getElementById('lap-keluar').textContent   = Rp(totalKeluar);
  document.getElementById('lap-piutang').textContent  = Rp(totalPiutang);
  document.getElementById('lap-kerugian').textContent = Rp(totalBuang);

  const labaEl = document.getElementById('lap-laba');
  labaEl.textContent  = Rp(Math.abs(labaBersih));
  labaEl.style.color  = labaBersih >= 0 ? 'var(--success)' : 'var(--danger)';
  if (labaBersih < 0) labaEl.textContent = '-' + Rp(Math.abs(labaBersih));

  // Tabel riwayat transaksi
  const tbody = document.getElementById('lap-trx-tbody');
  tbody.innerHTML = '';
  const trxShow = trx.slice(0, 50);
  if (trxShow.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:20px">Belum ada transaksi pada periode ini</td></tr>';
  } else {
    trxShow.forEach(t => {
      const jenis = t.kasbon
        ? `<span class="badge badge-warning">Kasbon: ${t.kasbon}</span>`
        : `<span class="badge badge-success">Tunai</span>`;
      tbody.innerHTML += `
        <tr>
          <td>#${String(t.id).padStart(4,'0')}</td>
          <td>${formatDate(t.tanggal)}</td>
          <td style="max-width:200px;font-size:12px">${t.items.map(i => `${i.nama}×${i.qty}`).join(', ')}</td>
          <td><strong>${Rp(t.total)}</strong></td>
          <td>${jenis}</td>
        </tr>`;
    });
  }

  // Tabel pengeluaran
  const tKeluar = document.getElementById('lap-keluar-tbody');
  tKeluar.innerHTML = '';
  if (keluar.length === 0) {
    tKeluar.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:16px">Belum ada pengeluaran</td></tr>';
  } else {
    keluar.slice(0, 30).forEach(p => {
      tKeluar.innerHTML += `
        <tr>
          <td>${formatDateOnly(p.tanggal)}</td>
          <td>${p.nama}</td>
          <td>${p.keterangan}</td>
          <td>${Rp(p.jumlah)}</td>
        </tr>`;
    });
  }

  // Tabel kerugian
  const tBuang = document.getElementById('lap-kerugian-tbody');
  tBuang.innerHTML = '';
  if (kerugian.length === 0) {
    tBuang.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:16px">Belum ada catatan kerugian</td></tr>';
  } else {
    kerugian.slice(0, 30).forEach(k => {
      tBuang.innerHTML += `
        <tr>
          <td>${formatDateOnly(k.tanggal)}</td>
          <td>${k.nama}</td>
          <td>${k.keterangan}</td>
          <td>${Rp(k.jumlah)}</td>
        </tr>`;
    });
  }
}

function tambahPengeluaran() {
  const nama   = document.getElementById('keluar-nama').value.trim();
  const jumlah = parseInt(document.getElementById('keluar-jumlah').value);
  const ket    = document.getElementById('keluar-ket').value.trim();
  if (!nama || !jumlah || jumlah <= 0) { toast('Lengkapi nama dan jumlah!', 'warning'); return; }
  DB.tambahPengeluaran(nama, jumlah, ket);
  toast('Pengeluaran dicatat! 💾');
  document.getElementById('keluar-nama').value   = '';
  document.getElementById('keluar-jumlah').value = '';
  document.getElementById('keluar-ket').value    = '';
  loadLaporan();
}

function tambahKerugian() {
  const nama   = document.getElementById('buang-nama').value.trim();
  const jumlah = parseInt(document.getElementById('buang-jumlah').value);
  const ket    = document.getElementById('buang-ket').value.trim();
  if (!nama || !jumlah || jumlah <= 0) { toast('Lengkapi nama dan jumlah!', 'warning'); return; }
  DB.tambahKerugian(nama, jumlah, ket);
  toast('Kerugian/bahan terbuang dicatat! 🗑️');
  document.getElementById('buang-nama').value   = '';
  document.getElementById('buang-jumlah').value = '';
  document.getElementById('buang-ket').value    = '';
  loadLaporan();
}

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV() {
  const range  = getDateRange();
  const trx    = DB.get('transaksi').filter(t => inRange(t.tanggal, range));
  if (trx.length === 0) { toast('Tidak ada data untuk di-export!', 'warning'); return; }

  const rows = [['No Struk', 'Tanggal', 'Item', 'Total', 'Bayar', 'Kembalian', 'Status']];
  trx.forEach(t => {
    rows.push([
      '#' + String(t.id).padStart(4,'0'),
      formatDate(t.tanggal),
      t.items.map(i => `${i.nama} x${i.qty}`).join(' | '),
      t.total,
      t.bayar,
      t.kembalian,
      t.kasbon ? `Kasbon: ${t.kasbon}` : 'Tunai',
    ]);
  });

  const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob   = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  a.href       = url;
  a.download   = `Kedai-Ndrojos-Transaksi-${new Date().toLocaleDateString('id-ID').replace(/\//g,'-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Data berhasil di-export! 📥');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
navigateTo('dashboard');
