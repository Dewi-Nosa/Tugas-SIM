/**
 * KEDAI NDROJOS — Application Logic
 * Single-Page Application (SPA) tanpa framework.
 */

// ── Navigasi SPA ─────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.page;
    navigateTo(target);
  });
});

function navigateTo(pageId) {
  // Update sidebar aktif
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === pageId));
  // Show page
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + pageId));
  // Update title
  const titles = {
    dashboard: '📊 Dashboard',
    kasir:     '🧾 Kasir Cepat',
    stok:      '📦 Stok & Kulakan',
    laporan:   '📈 Laporan Keuangan',
  };
  document.getElementById('topbar-title').textContent = titles[pageId] || 'Kedai Ndrojos';

  // Load halaman yang dikunjungi
  if (pageId === 'dashboard') loadDashboard();
  if (pageId === 'kasir')     loadKasir();
  if (pageId === 'stok')      loadStok();
  if (pageId === 'laporan')   loadLaporan();

  // Tutup sidebar mobile
  document.getElementById('sidebar').classList.remove('open');
}

// ── Toast Notification ───────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const icons = { success: '✅', danger: '❌', warning: '⚠️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ── Date Display ─────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const opt = { weekday:'long', day:'2-digit', month:'long', year:'numeric' };
  document.getElementById('topbar-date').textContent =
    now.toLocaleDateString('id-ID', opt) + ' • ' +
    now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
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
  document.getElementById('d-jumlah-trx').textContent   = r.jumlahTrx + ' transaksi';
  document.getElementById('d-pengeluaran').textContent  = Rp(r.pengeluaranHariIni);

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
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Semua stok aman 🎉</td></tr>';
  } else {
    r.stokMenipis.forEach(s => {
      const pct = Math.min(100, Math.round((s.jumlah / s.minStok) * 100));
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
    tBody2.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Belum ada transaksi hari ini</td></tr>';
  } else {
    trxList.forEach(t => {
      const badge = t.kasbon
        ? `<span class="badge badge-warning">Kasbon: ${t.kasbon}</span>`
        : `<span class="badge badge-success">Lunas</span>`;
      tBody2.innerHTML += `
        <tr>
          <td>#${String(t.id).padStart(4,'0')}</td>
          <td>${formatDate(t.tanggal)}</td>
          <td>${Rp(t.total)}</td>
          <td>${badge}</td>
        </tr>`;
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  2. KASIR
// ══════════════════════════════════════════════════════════════════════════════
let cart = [];

function loadKasir() {
  renderMenuGrid();
  renderCart();
  document.getElementById('kasir-search').value = '';
}

function renderMenuGrid(keyword = '') {
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = '';
  const menus = DB.get('menu').filter(m =>
    m.nama.toLowerCase().includes(keyword.toLowerCase()) ||
    m.kategori.toLowerCase().includes(keyword.toLowerCase())
  );
  menus.forEach(m => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <div class="menu-emoji">${m.emoji}</div>
      <div class="menu-name">${m.nama}</div>
      <div class="menu-price">${Rp(m.harga)}</div>`;
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

function renderCart() {
  const list = document.getElementById('order-items');
  list.innerHTML = '';
  if (cart.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px">Ketuk menu untuk menambah pesanan</p>';
  } else {
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <div class="order-item-info">
          <div class="order-item-name">${item.emoji} ${item.nama}</div>
          <div class="order-item-price">${Rp(item.harga)} × ${item.qty} = ${Rp(item.harga * item.qty)}</div>
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
  document.getElementById('order-items-count').textContent = cart.length;
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
  } else {
    box.textContent = bayar > 0 ? '⚠ Kurang ' + Rp(total - bayar) : '—';
    wrap.style.borderColor = 'var(--warning)';
  }
}

function bayar() {
  if (cart.length === 0) { toast('Keranjang masih kosong!', 'warning'); return; }
  const total = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  const bayar = parseInt(document.getElementById('input-bayar').value) || 0;
  if (bayar < total) { toast('Uang pembayaran kurang!', 'danger'); return; }
  DB.tambahTransaksi([...cart], total, bayar);
  toast(`Transaksi berhasil! Kembalian ${Rp(bayar - total)}`);
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

// ══════════════════════════════════════════════════════════════════════════════
//  3. STOK & KULAKAN
// ══════════════════════════════════════════════════════════════════════════════
function loadStok() {
  renderStokTable();
  renderSupplierTable();
  renderUtangTable();
}

function renderStokTable(keyword = '') {
  const tbody = document.getElementById('stok-tbody');
  tbody.innerHTML = '';
  const list = DB.get('stok').filter(s =>
    s.nama.toLowerCase().includes(keyword.toLowerCase())
  );
  list.forEach(s => {
    const pct    = Math.min(100, Math.round((s.jumlah / (s.minStok * 3)) * 100));
    const status = s.jumlah <= 0        ? ['badge-danger',  'Habis']
                 : s.jumlah <= s.minStok ? ['badge-warning', 'Menipis']
                 :                         ['badge-success', 'Aman'];
    tbody.innerHTML += `
      <tr>
        <td><strong>${s.nama}</strong></td>
        <td><input type="number" value="${s.jumlah}" min="0" class="form-control"
              style="width:80px;padding:5px 8px"
              onchange="updateStok(${s.id}, this.value)"></td>
        <td>${s.satuan}</td>
        <td>${s.minStok}</td>
        <td>${Rp(s.hargaBeli)}</td>
        <td><span class="badge ${status[0]}">${status[1]}</span></td>
        <td style="width:100px"><div class="progress-wrap"><div class="progress-bar ${status[0].replace('badge-','')}" style="width:${pct}%"></div></div></td>
      </tr>`;
  });
}

function updateStok(id, val) {
  DB.updateStok(id, parseFloat(val));
  renderStokTable();
  toast('Stok diperbarui!');
}

function renderSupplierTable() {
  const tbody = document.getElementById('supplier-tbody');
  tbody.innerHTML = '';
  const stars = r => '⭐'.repeat(r) + '☆'.repeat(5 - r);
  DB.get('supplier').forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${s.nama}</strong></td>
        <td>${s.komoditi}</td>
        <td><a href="tel:${s.telepon}">${s.telepon}</a></td>
        <td style="font-size:12px">${s.hargaNote}</td>
        <td>${stars(s.rating)}</td>
      </tr>`;
  });
}

function renderUtangTable() {
  const tbody = document.getElementById('utang-tbody');
  tbody.innerHTML = '';
  const list = DB.get('utang').filter(u => !u.lunas);
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Tidak ada utang aktif 🎉</td></tr>';
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
  toast('Utang ditandai lunas!');
  renderUtangTable();
  loadDashboard();
}

// ══════════════════════════════════════════════════════════════════════════════
//  4. LAPORAN KEUANGAN
// ══════════════════════════════════════════════════════════════════════════════
function loadLaporan() {
  const trx      = DB.get('transaksi');
  const utang    = DB.get('utang');
  const keluar   = DB.get('pengeluaran');
  const kerugian = DB.get('kerugian');

  const totalMasuk   = trx.filter(t => !t.kasbon).reduce((s,t) => s + t.total, 0);
  const totalKeluar  = keluar.reduce((s,p) => s + p.jumlah, 0);
  const totalPiutang = utang.filter(u => !u.lunas).reduce((s,u) => s + u.jumlah, 0);
  const totalBuang   = kerugian.reduce((s,k) => s + k.jumlah, 0);
  const labaBersih   = totalMasuk - totalKeluar - totalBuang;

  document.getElementById('lap-masuk').textContent   = Rp(totalMasuk);
  document.getElementById('lap-keluar').textContent  = Rp(totalKeluar);
  document.getElementById('lap-piutang').textContent = Rp(totalPiutang);
  document.getElementById('lap-kerugian').textContent= Rp(totalBuang);
  document.getElementById('lap-laba').textContent    = Rp(Math.max(0, labaBersih));
  document.getElementById('lap-laba').style.color    = labaBersih >= 0 ? 'var(--success)' : 'var(--danger)';

  // Tabel riwayat transaksi
  const tbody = document.getElementById('lap-trx-tbody');
  tbody.innerHTML = '';
  trx.slice(0, 30).forEach(t => {
    const jenis = t.kasbon ? `<span class="badge badge-warning">Kasbon</span>` : `<span class="badge badge-success">Tunai</span>`;
    tbody.innerHTML += `
      <tr>
        <td>#${String(t.id).padStart(4,'0')}</td>
        <td>${formatDate(t.tanggal)}</td>
        <td>${t.items.map(i => `${i.nama}×${i.qty}`).join(', ')}</td>
        <td>${Rp(t.total)}</td>
        <td>${jenis}</td>
      </tr>`;
  });
  if (trx.length === 0) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">Belum ada transaksi</td></tr>';

  // Tabel pengeluaran
  const tKeluar = document.getElementById('lap-keluar-tbody');
  tKeluar.innerHTML = '';
  keluar.slice(0, 20).forEach(p => {
    tKeluar.innerHTML += `
      <tr>
        <td>${formatDateOnly(p.tanggal)}</td>
        <td>${p.nama}</td>
        <td>${p.keterangan}</td>
        <td>${Rp(p.jumlah)}</td>
      </tr>`;
  });
  if (keluar.length === 0) tKeluar.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Belum ada pengeluaran</td></tr>';

  // Tabel kerugian
  const tBuang = document.getElementById('lap-kerugian-tbody');
  tBuang.innerHTML = '';
  kerugian.slice(0, 20).forEach(k => {
    tBuang.innerHTML += `
      <tr>
        <td>${formatDateOnly(k.tanggal)}</td>
        <td>${k.nama}</td>
        <td>${k.keterangan}</td>
        <td>${Rp(k.jumlah)}</td>
      </tr>`;
  });
  if (kerugian.length === 0) tBuang.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Belum ada catatan kerugian</td></tr>';
}

function tambahPengeluaran() {
  const nama    = document.getElementById('keluar-nama').value.trim();
  const jumlah  = parseInt(document.getElementById('keluar-jumlah').value);
  const ket     = document.getElementById('keluar-ket').value.trim();
  if (!nama || !jumlah) { toast('Lengkapi nama dan jumlah!', 'warning'); return; }
  DB.tambahPengeluaran(nama, jumlah, ket);
  toast('Pengeluaran dicatat!');
  document.getElementById('keluar-nama').value = '';
  document.getElementById('keluar-jumlah').value = '';
  document.getElementById('keluar-ket').value = '';
  loadLaporan();
}

function tambahKerugian() {
  const nama   = document.getElementById('buang-nama').value.trim();
  const jumlah = parseInt(document.getElementById('buang-jumlah').value);
  const ket    = document.getElementById('buang-ket').value.trim();
  if (!nama || !jumlah) { toast('Lengkapi nama dan jumlah!', 'warning'); return; }
  DB.tambahKerugian(nama, jumlah, ket);
  toast('Kerugian/bahan terbuang dicatat!');
  document.getElementById('buang-nama').value = '';
  document.getElementById('buang-jumlah').value = '';
  document.getElementById('buang-ket').value = '';
  loadLaporan();
}

// ── Mobile Sidebar Toggle ────────────────────────────────────────────────────
document.getElementById('btn-menu-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── Nomor Cepat Bayar ────────────────────────────────────────────────────────
document.querySelectorAll('.quick-pay').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('input-bayar').value = btn.dataset.val;
    hitungKembalian();
  });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
navigateTo('dashboard');
