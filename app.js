/* =====================================================================
   SIPANGAN EDU — Prototype Aplikasi

   Arsitektur yang diikuti:
     SIPGN Produksi → SIPGN Distribusi → SIPGN Penerima Manfaat
        → Data operasional terintegrasi
        → SIPANGAN EDU
             ├─ Ruang PIC sekolah
             │    ├─ Verifikasi penerimaan
             │    ├─ Pelaporan ketidaksesuaian
             │    └─ Pemantauan tindak lanjut
             └─ Portal publik
                  ├─ Cari kota dan sekolah
                  ├─ Alokasi dan realisasi porsi
                  ├─ Ketepatan distribusi
                  ├─ Status verifikasi
                  ├─ Statistik laporan
                  └─ Status penyelesaian

   SIPANGAN EDU tidak membuat angka baru. Angka alokasi, jadwal, dan
   penerima manfaat dibaca dari SIPGN; yang ditambahkan hanyalah
   verifikasi sekolah, laporan ketidaksesuaian, dan tindak lanjutnya.
   ===================================================================== */

/* ---------------- Ikon (SVG inline, tanpa CDN) ---------------- */
const P = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  truck:'<path d="M2 7h11v9H2z"/><path d="M13 10h4l4 3v3h-8z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
  check:'<path d="m4 12.5 5 5L20 6.5"/>',
  checkc:'<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.6 2.6L16 9.4"/>',
  alert:'<path d="M12 3.5 21.5 20h-19z"/><path d="M12 9.5v4.5"/><path d="M12 17.2h.01"/>',
  clip:'<path d="M8 4h8v3H8z"/><path d="M6 6h2m8 0h2v15H6V6"/><path d="M9.5 12h6M9.5 16h4"/>',
  user:'<circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20c1.4-3.6 4.2-5.2 7.5-5.2s5.9 1.6 7.5 5.2"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 20v-6M12.5 20V8.5M17 20v-9"/>',
  pin:'<path d="M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  cam:'<path d="M3 8h4l1.6-2h6.8L17 8h4v11H3z"/><circle cx="12" cy="13.2" r="3.4"/>',
  up:'<path d="M12 17V5"/><path d="m7 10 5-5 5 5"/><path d="M4.5 19.5h15"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  left:'<path d="m14.5 5.5-7 6.5 7 6.5"/>',
  right:'<path d="m9.5 5.5 7 6.5-7 6.5"/>',
  bell:'<path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10z"/><path d="M10 18.5a2.2 2.2 0 0 0 4 0"/>',
  shield:'<path d="M12 3.2 19 6v6c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V6z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
  db:'<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  school:'<path d="M12 3 3 7.5 12 12l9-4.5z"/><path d="M6.5 10v6c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-6"/>',
  food:'<path d="M6 3v8a2 2 0 0 0 4 0V3"/><path d="M8 11v10"/><path d="M16 21v-7c-1.7 0-3-1.4-3-3.2 0-2.8 1.4-6.3 3-7.8 1.6 1.5 3 5 3 7.8 0 1.8-1.3 3.2-3 3.2z"/>',
  x:'<path d="m6 6 12 12M18 6 6 18"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4.5h-4.5"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><path d="M12 8h.01"/>',
  file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h4"/>',
  lock:'<path d="M6 11h12v10H6z"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>',
  mail:'<path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.4 2.6 14.6 0 17-2.6-2.4-2.6-14.6 0-17z"/>',
  arrow:'<path d="M4.5 12h15"/><path d="m14 6.5 5.5 5.5L14 17.5"/>',
  cal:'<path d="M4 6h16v15H4z"/><path d="M4 10h16"/><path d="M8.5 3.5V6M15.5 3.5V6"/>',
  pct:'<path d="m6 18 12-12"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/>',
  inbox:'<path d="M3 13 5.5 5h13L21 13v7H3z"/><path d="M3 13h5l1 2.5h6l1-2.5h5"/>',
  off:'<path d="M3 4l18 18"/><path d="M8.5 14.8A5 5 0 0 1 12 13.5c1.3 0 2.5.5 3.5 1.3"/><path d="M12 19.5h.01"/><path d="M5 11.3A11 11 0 0 1 9 9.2"/><path d="M19 11.3a11 11 0 0 0-4.6-2.3"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  eye:'<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  users:'<circle cx="9" cy="8.5" r="3.2"/><path d="M2.5 20c1.2-3.2 3.6-4.7 6.5-4.7s5.3 1.5 6.5 4.7"/><path d="M16.5 6.2a3.2 3.2 0 0 1 0 6"/><path d="M18 15.6c2 .6 3.2 2 3.8 4.4"/>',
  hourglass:'<path d="M7 3h10"/><path d="M7 21h10"/><path d="M7 3c0 4 5 5.5 5 9s-5 5-5 9"/><path d="M17 3c0 4-5 5.5-5 9s5 5 5 9"/>'
};
const ic = (n, s = 20, sw = 1.8) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------------- Helper komponen ---------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const btn = (label, { kind = 'pri', icon = '', go = '', sm = false } = {}) =>
  `<button class="tap btn ${kind}${sm ? ' sm' : ''}"${go ? ` onclick="go('${go}')"` : ''}>${icon ? ic(icon, sm ? 15 : 18) : ''}${esc(label)}</button>`;

const field = (lab, ph, { icon = '', help = '', err = '', ta = false, val = '', type = 'text' } = {}) => `
  <label class="field">
    ${lab ? `<span class="lab">${esc(lab)}</span>` : ''}
    <span class="inbox${ta ? ' ta' : ''}${err ? ' err' : ''}">
      ${icon ? `<span style="color:var(--ink-soft)">${ic(icon, 17)}</span>` : ''}
      ${ta ? `<textarea placeholder="${esc(ph)}">${esc(val)}</textarea>`
           : `<input type="${type}" placeholder="${esc(ph)}" value="${esc(val)}">`}
    </span>
    ${err ? `<span class="err">${ic('alert', 13)}${esc(err)}</span>`
         : help ? `<span class="help">${esc(help)}</span>` : ''}
  </label>`;

const selectField = (lab, opts, { icon = '', help = '' } = {}) => `
  <label class="field">
    <span class="lab">${esc(lab)}</span>
    <span class="inbox">${icon ? `<span style="color:var(--ink-soft)">${ic(icon, 17)}</span>` : ''}
      <select>${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></span>
    ${help ? `<span class="help">${esc(help)}</span>` : ''}
  </label>`;

const badge = (t, k = 'neu') => `<span class="badge ${k}"><i></i>${esc(t)}</span>`;
const card = (inner, extra = '') => `<div class="card ${extra}">${inner}</div>`;
const note = (title, body, k = 'n', icon = 'info') =>
  `<div class="note ${k}">${ic(icon, 17)}<div><b>${esc(title)}</b>${esc(body)}</div></div>`;
const stat = (v, l, wide = false) => `<div class="stat${wide ? ' wide' : ''}"><b>${esc(v)}</b><span>${esc(l)}</span></div>`;
const meter = (pct, k = '') => `<div class="meter"><i class="${k}" style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
const hbar = (nm, pct, val) =>
  `<div class="bar-h"><span class="nm">${esc(nm)}</span><span class="tr"><i style="width:${pct}%"></i></span><span class="vl">${esc(val)}</span></div>`;

const topbar = (title, { sub = '', back = true, action = '', long = false } = {}) => `
  <div class="topbar${long ? ' long' : ''}">
    ${back ? `<button class="tap back" onclick="prevScreen()" aria-label="Kembali">${ic('left', 18)}</button>` : ''}
    <div class="tt"><h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>
    ${action}
  </div>`;

const li = (title, sub, { icon = 'file', tone = '', right = '', go = '' } = {}) =>
  `<button class="tap li"${go ? ` onclick="go('${go}')"` : ''}>
    <span class="ico ${tone}">${ic(icon, 18)}</span>
    <span class="tx"><b>${esc(title)}</b><span>${esc(sub)}</span></span>
    <span class="rt">${right || ic('right', 16)}</span>
  </button>`;

/* ---------------- Bottom navigation (2 ruang) ---------------- */
const NAV = {
  pic: [['pic-beranda', 'Beranda', 'home'], ['pic-kiriman', 'Kiriman', 'truck'],
        ['pic-verifikasi', 'Verifikasi', 'check'], ['pic-tindak', 'Pantauan', 'hourglass'],
        ['pic-profil', 'Profil', 'user']],
  pub: [['pub-beranda', 'Beranda', 'globe'], ['pub-cari', 'Cari', 'search'],
        ['pub-sekolah', 'Porsi', 'food'], ['pub-statistik', 'Laporan', 'chart'],
        ['pub-info', 'Info', 'info']]
};
const navbar = (role, active) => {
  const tabs = NAV[role] || [];
  return `<div class="bottomnav ${role === 'pub' ? 'pubnav' : 'picnav'}"><div class="g">${tabs.map(([k, l, i], idx) => {
    const on = k === active;
    if (idx === 2 && role === 'pic')
      return `<button class="tap ctr${on ? ' on' : ''}" onclick="go('${k}')"><span class="fab">${ic(i, 20)}</span><span>${l}</span></button>`;
    return `<button class="tap${on ? ' on' : ''}" onclick="go('${k}')">${ic(i, 19)}<span>${l}</span></button>`;
  }).join('')}</div></div>`;
};
const wrap = (body, role = '', active = '') => `<div class="scr">${body}${role ? navbar(role, active) : ''}</div>`;

/* ---------------- Data contoh (berasal dari SIPGN) ---------------- */
const SEKOLAH = {
  nama: 'SDN Kranggan 1', kota: 'Kota Mojokerto', pic: 'Ibu Sri Wahyuni',
  siswa: 412, alokasi: 412, realisasi: 405, dapur: 'SPPG Dapur Kranggan'
};
const KOTA = [
  { n: 'Kota Mojokerto', s: 128, al: 41250, re: 40410, tepat: 96.4, lap: 37, sel: 89 },
  { n: 'Kabupaten Jombang', s: 344, al: 98700, re: 95120, tepat: 92.1, lap: 121, sel: 74 },
  { n: 'Kota Surabaya', s: 612, al: 187400, re: 184900, tepat: 97.2, lap: 96, sel: 91 },
  { n: 'Kabupaten Sidoarjo', s: 401, al: 121300, re: 114800, tepat: 88.7, lap: 158, sel: 63 }
];

/* ===================== LAYAR ===================== */
const S = {};

/* ---- A. Pintu masuk ---- */
S['splash'] = () => `
  <div class="scr splashbg" style="background:var(--primary);color:#fff">
    <div class="center">
      <div class="mark"><img src="logo.png" alt="Maskot SIPANGAN EDU" /></div>
      <h2 style="font-size:28px;letter-spacing:-.02em">SIPANGAN EDU</h2>
      <p style="color:rgba(255,255,255,.88);max-width:260px">Verifikasi sekolah dan transparansi publik untuk penyaluran Makan Bergizi Gratis.</p>
      <div class="pill" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.16);padding:6px 12px;border-radius:999px;font-size:11px;font-weight:600;margin-top:18px">
        ${ic('db', 14)} Terhubung data operasional SIPGN
      </div>
      <div class="acts">${btn('Mulai', { icon: 'arrow', go: 'arsitektur' })}</div>
    </div>
  </div>`;

S['arsitektur'] = () => wrap(`
  ${topbar('Dari mana datanya?', { sub: 'Posisi SIPANGAN EDU dalam ekosistem', back: true })}
  <div class="body">
    ${note('SIPANGAN EDU tidak membuat angka sendiri', 'Alokasi, jadwal, dan data penerima manfaat dibaca dari SIPGN. Yang ditambahkan adalah verifikasi sekolah dan keterbukaan hasilnya.', 'g', 'info')}
    <div class="card">
      <div class="tl">
        <div class="step"><span class="dot ok">${ic('check', 12, 2.6)}</span><b>SIPGN Produksi</b><span>Dapur menyiapkan menu dan jumlah porsi harian.</span></div>
        <div class="step"><span class="dot ok">${ic('check', 12, 2.6)}</span><b>SIPGN Distribusi</b><span>Porsi dikirim ke sekolah dengan jadwal dan armada tercatat.</span></div>
        <div class="step"><span class="dot ok">${ic('check', 12, 2.6)}</span><b>SIPGN Penerima Manfaat</b><span>Daftar sekolah dan jumlah siswa penerima.</span></div>
        <div class="step"><span class="dot now">${ic('db', 12, 2.2)}</span><b>Data operasional terintegrasi</b><span>Ketiga sumber disatukan menjadi satu acuan angka.</span></div>
        <div class="step"><span class="dot ok">${ic('shield', 12, 2.2)}</span><b>SIPANGAN EDU</b><span>Ruang PIC sekolah untuk verifikasi &amp; laporan, dan Portal publik untuk transparansi.</span></div>
      </div>
    </div>
    ${btn('Lanjut pilih ruang', { icon: 'arrow', go: 'peran' })}
  </div>`);

S['peran'] = () => wrap(`
  ${topbar('Pilih ruang', { sub: 'Dua pintu, satu sumber data', back: true })}
  <div class="body">
    <button class="tap card" style="width:100%;text-align:left;display:block" onclick="go('login')">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="ico" style="width:44px;height:44px;flex:0 0 44px;border-radius:13px;display:grid;place-items:center;background:var(--primary-light);color:var(--primary)">${ic('school', 22)}</span>
        <div style="flex:1;min-width:0"><h3>Ruang PIC sekolah</h3><p class="lead">Perlu masuk akun. Verifikasi penerimaan, pelaporan ketidaksesuaian, pemantauan tindak lanjut.</p></div>
        ${ic('right', 18)}
      </div>
    </button>
    <button class="tap card" style="width:100%;text-align:left;display:block" onclick="go('pub-beranda')">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="ico" style="width:44px;height:44px;flex:0 0 44px;border-radius:13px;display:grid;place-items:center;background:#E0F2FE;color:#1B5E9F">${ic('globe', 22)}</span>
        <div style="flex:1;min-width:0"><h3>Portal publik</h3><p class="lead">Terbuka tanpa masuk akun. Cari kota dan sekolah, lihat porsi, ketepatan, dan status laporan.</p></div>
        ${ic('right', 18)}
      </div>
    </button>
    ${note('Batas peran', 'PIC hanya dapat memverifikasi sekolahnya sendiri. Portal publik hanya menampilkan angka agregat dan status, tanpa data pribadi siswa.', 'n', 'lock')}
  </div>`);

S['login'] = () => wrap(`
  ${topbar('Masuk Ruang PIC', { sub: 'Akun diterbitkan dinas, terhubung NPSN', back: true })}
  <div class="body">
    <div class="markrow">
      <img src="logo.png" alt="" />
      <div><b>Ruang PIC sekolah</b><span>Verifikasi penerimaan, pelaporan, dan tindak lanjut</span></div>
    </div>
    ${field('NPSN atau email PIC', 'pic.sdnkranggan1@sekolah.id', { icon: 'mail', val: 'pic.sdnkranggan1@sekolah.id' })}
    ${field('Kata sandi', 'Masukkan kata sandi', { icon: 'lock', type: 'password', val: '••••••••', help: 'Satu akun mewakili satu satuan pendidikan.' })}
    ${btn('Masuk', { icon: 'arrow', go: 'pic-beranda' })}
    <div style="height:10px"></div>
    ${btn('Buka portal publik saja', { kind: 'out', icon: 'globe', go: 'pub-beranda' })}
    <p class="tiny" style="margin-top:14px;text-align:center">Lupa kata sandi? Hubungi admin dinas pendidikan kota atau kabupaten.</p>
  </div>`);

/* ---- B. Ruang PIC sekolah ---- */
S['pic-beranda'] = () => wrap(`
  <div class="hero">
    <p class="eyebrow">Ruang PIC sekolah</p>
    <h2>${esc(SEKOLAH.nama)}</h2>
    <p>${esc(SEKOLAH.kota)} · PIC ${esc(SEKOLAH.pic)}</p>
    <span class="pill">${ic('db', 13)} Data SIPGN tersinkron 09:12</span>
  </div>
  <div class="body">
    ${note('1 kiriman menunggu verifikasi', 'Batas verifikasi hari ini pukul 13.00. Kiriman yang tidak diverifikasi tercatat sebagai belum terkonfirmasi.', 'a', 'clock')}
    <div class="stats">
      ${stat(SEKOLAH.alokasi, 'Porsi dialokasikan hari ini')}
      ${stat(SEKOLAH.realisasi, 'Porsi diterima menurut kiriman')}
      ${stat('96,4%', 'Ketepatan 30 hari')}
      ${stat('2', 'Laporan sedang ditindaklanjuti')}
    </div>
    <p class="eyebrow" style="margin:16px 0 8px">Tugas hari ini</p>
    <div class="list">
      ${li('Verifikasi penerimaan', 'Kiriman 09:05 · 405 porsi · menu ayam dan sayur', { icon: 'check', tone: '', right: badge('Menunggu', 'wait'), go: 'pic-verifikasi' })}
      ${li('Lapor ketidaksesuaian', 'Jumlah, mutu, keterlambatan, atau menu tidak sesuai', { icon: 'alert', tone: 'am', go: 'pic-lapor' })}
      ${li('Pemantauan tindak lanjut', '2 laporan berjalan · 1 melewati tenggat', { icon: 'hourglass', tone: 'neu', go: 'pic-tindak' })}
    </div>
    <p class="eyebrow" style="margin:16px 0 8px">Jadwal dari SIPGN Distribusi</p>
    ${card(`<div class="kv">
      <dt>Dapur</dt><dd>${esc(SEKOLAH.dapur)}</dd>
      <dt>Jadwal tiba</dt><dd>09.00 – 09.30 WIB</dd>
      <dt>Menu</dt><dd>Nasi, ayam bumbu kuning, tumis buncis, pisang</dd>
      <dt>Siswa penerima</dt><dd>${SEKOLAH.siswa} siswa</dd>
    </div>`, 'tight')}
  </div>`, 'pic', 'pic-beranda');

S['pic-kiriman'] = () => wrap(`
  ${topbar('Kiriman', { sub: 'Dibaca dari SIPGN Distribusi', back: false, action: `<button class="tap back" onclick="go('pic-notif')" aria-label="Notifikasi">${ic('bell', 18)}</button>` })}
  <div class="body">
    <div class="chips"><button class="chip on">Hari ini</button><button class="chip">7 hari</button><button class="chip">Bulan ini</button></div>
    <div class="list">
      ${li('Senin, 3 Agu · 09.05', '405 dari 412 porsi · tiba tepat waktu', { icon: 'truck', right: badge('Menunggu', 'wait'), go: 'pic-verifikasi' })}
      ${li('Jumat, 31 Jul · 09.12', '412 dari 412 porsi · sesuai', { icon: 'truck', right: badge('Terverifikasi', 'ok'), go: 'pic-riwayat' })}
      ${li('Kamis, 30 Jul · 10.48', '380 dari 412 porsi · terlambat 78 menit', { icon: 'truck', tone: 'dg', right: badge('Dilaporkan', 'bad'), go: 'pic-tindak-detail' })}
      ${li('Rabu, 29 Jul · 09.02', '412 dari 412 porsi · sesuai', { icon: 'truck', right: badge('Terverifikasi', 'ok'), go: 'pic-riwayat' })}
    </div>
    ${note('Angka porsi bukan input sekolah', 'Jumlah kiriman berasal dari SIPGN. Sekolah menyatakan sesuai atau tidak sesuai, sehingga selisih dapat diaudit.', 'n', 'db')}
  </div>`, 'pic', 'pic-kiriman');

S['pic-verifikasi'] = () => wrap(`
  ${topbar('Verifikasi penerimaan', { sub: 'Kiriman 3 Agu 2026 · 09.05 WIB' })}
  <div class="body">
    ${card(`<div class="kv">
      <dt>Nomor kiriman</dt><dd>SIPGN-DST-260803-0147</dd>
      <dt>Dapur</dt><dd>${esc(SEKOLAH.dapur)}</dd>
      <dt>Porsi tercatat</dt><dd>405 porsi</dd>
      <dt>Alokasi</dt><dd>412 porsi</dd>
      <dt>Menu</dt><dd>Nasi, ayam bumbu kuning, tumis buncis, pisang</dd>
    </div>`)}
    ${note('Selisih 7 porsi', 'Jumlah yang dikirim lebih kecil dari alokasi. Bila benar kurang, tandai tidak sesuai agar masuk pelaporan.', 'a', 'alert')}
    ${card(`<h3 style="margin-bottom:4px">Daftar periksa</h3>
      <p class="lead" style="margin-bottom:6px">Semua butir wajib ditinjau sebelum verifikasi dikirim.</p>
      <div class="check"><input type="checkbox" id="c1" checked><label for="c1">Jumlah porsi dihitung ulang saat serah terima<small>Tercatat 405, dihitung 405</small></label></div>
      <div class="check"><input type="checkbox" id="c2" checked><label for="c2">Kemasan tertutup, tidak rusak, tidak bocor</label></div>
      <div class="check"><input type="checkbox" id="c3" checked><label for="c3">Makanan masih hangat dan tidak berbau menyimpang</label></div>
      <div class="check"><input type="checkbox" id="c4"><label for="c4">Menu sesuai daftar dari dapur<small>Tumis buncis diganti tumis kangkung</small></label></div>
      <div class="check"><input type="checkbox" id="c5" checked><label for="c5">Waktu tiba sesuai jadwal 09.00–09.30</label></div>`)}
    ${field('Catatan PIC (opsional)', 'mis. 7 porsi kurang, menu sayur diganti', { ta: true })}
    <div class="btnrow">
      ${btn('Sesuai', { kind: 'pri', icon: 'checkc', go: 'pic-verifikasi-ok' })}
      ${btn('Tidak sesuai', { kind: 'dgr', icon: 'alert', go: 'pic-lapor' })}
    </div>
    <p class="tiny" style="margin-top:12px">Memilih <b>Tidak sesuai</b> otomatis membuka formulir pelaporan ketidaksesuaian.</p>
  </div>`, 'pic', 'pic-verifikasi');

S['pic-verifikasi-ok'] = () => wrap(`
  <div class="center">
    <div class="blob">${ic('checkc', 54, 1.7)}</div>
    <h2>Verifikasi terkirim</h2>
    <p>Penerimaan 405 porsi pada 3 Agu 09.05 tercatat sesuai. Status ini langsung tampil di portal publik sebagai sekolah terverifikasi.</p>
    ${card(`<div class="kv"><dt>Kode bukti</dt><dd>VRF-260803-0147</dd><dt>Waktu</dt><dd>3 Agu 2026 09.41</dd><dt>Diverifikasi</dt><dd>${esc(SEKOLAH.pic)}</dd></div>`, 'tight')}
    <div class="acts">
      ${btn('Kembali ke beranda', { icon: 'home', go: 'pic-beranda' })}
      ${btn('Lihat di portal publik', { kind: 'out', icon: 'globe', go: 'pub-verifikasi' })}
    </div>
  </div>`, 'pic', 'pic-verifikasi');

S['pic-lapor'] = () => wrap(`
  ${topbar('Lapor ketidaksesuaian', { sub: 'Kiriman SIPGN-DST-260803-0147' })}
  <div class="body">
    ${note('Laporan bukan aduan anonim', 'Laporan terhubung ke nomor kiriman dan akun PIC, sehingga dapat ditindaklanjuti dapur dan dinas.', 'n', 'info')}
    <label class="field"><span class="lab">Jenis ketidaksesuaian</span>
      <div class="radios">
        <label><input type="radio" name="jn" checked>Jumlah kurang</label>
        <label><input type="radio" name="jn">Mutu makanan</label>
        <label><input type="radio" name="jn">Menu berbeda</label>
        <label><input type="radio" name="jn">Keterlambatan</label>
        <label><input type="radio" name="jn">Tidak ada kiriman</label>
      </div>
    </label>
    ${field('Jumlah porsi bermasalah', '7', { icon: 'food', type: 'number', val: '7', help: 'Alokasi 412 porsi, tercatat dikirim 405 porsi.' })}
    <label class="field"><span class="lab">Tingkat dampak</span>
      <div class="radios">
        <label><input type="radio" name="dm">Ringan</label>
        <label><input type="radio" name="dm" checked>Sedang</label>
        <label><input type="radio" name="dm">Berat</label>
      </div>
      <span class="help">Berat dipakai bila ada dugaan risiko kesehatan siswa.</span>
    </label>
    ${field('Uraian kejadian', 'Jelaskan apa yang terjadi, siapa yang menerima, dan tindakan sementara di sekolah', { ta: true, val: '7 porsi kurang sehingga sebagian siswa kelas 6 belum menerima. Tumis buncis diganti tumis kangkung tanpa pemberitahuan.' })}
    ${btn('Lanjut unggah bukti', { icon: 'arrow', go: 'pic-bukti' })}
  </div>`, 'pic', 'pic-verifikasi');

S['pic-bukti'] = () => wrap(`
  ${topbar('Unggah bukti', { sub: 'Minimal satu foto agar laporan dapat diproses' })}
  <div class="body">
    ${card(`<div style="display:flex;gap:10px">
      <div style="flex:1;border:1px dashed var(--line);border-radius:12px;background:#F8FAFC;min-height:104px;display:grid;place-items:center;color:var(--ink-soft);text-align:center;padding:10px;font-size:12px">${ic('cam', 26)}<br>Foto porsi diterima</div>
      <div style="flex:1;border:1px solid var(--primary);border-radius:12px;background:var(--primary-light);min-height:104px;display:grid;place-items:center;color:var(--primary);text-align:center;padding:10px;font-size:12px;font-weight:600">${ic('checkc', 26)}<br>foto-serahterima.jpg</div>
    </div>
    <p class="tiny" style="margin-top:10px">Foto disimpan bersama waktu dan lokasi perangkat sebagai penanda keaslian. Wajah siswa sebaiknya tidak diambil.</p>`)}
    ${field('Nama penerima di sekolah', 'mis. Ibu Sri Wahyuni', { icon: 'user', val: 'Sri Wahyuni' })}
    ${field('Nama pengantar', 'Sesuai surat jalan dapur', { icon: 'truck', val: 'Bagus Prasetyo' })}
    <div class="check" style="border-top:1px solid #F1F5F9;padding-top:14px"><input type="checkbox" id="pk" checked><label for="pk">Saya menyatakan keterangan ini benar<small>Laporan palsu dapat berakibat pencabutan akses PIC.</small></label></div>
    ${btn('Kirim laporan', { icon: 'up', go: 'pic-lapor-ok' })}
  </div>`, 'pic', 'pic-verifikasi');

S['pic-lapor-ok'] = () => wrap(`
  <div class="center">
    <div class="blob" style="background:#FEF3C7;color:#92400E">${ic('clip', 52, 1.7)}</div>
    <h2>Laporan terkirim</h2>
    <p>Nomor laporan <b>LP-260803-0092</b> diteruskan ke ${esc(SEKOLAH.dapur)} dan dinas pendidikan kota.</p>
    ${card(`<div class="tl">
      <div class="step"><span class="dot ok">${ic('check', 12, 2.6)}</span><b>Terkirim</b><span>3 Agu 09.48 oleh PIC sekolah</span></div>
      <div class="step"><span class="dot now">${ic('clock', 12, 2.2)}</span><b>Menunggu tanggapan dapur</b><span>Tenggat 1 x 24 jam · sisa 22 jam</span></div>
      <div class="step"><span class="dot">${ic('clock', 12, 2.2)}</span><b>Verifikasi dinas</b><span>Bila tenggat terlampaui, laporan naik otomatis</span></div>
    </div>`)}
    <div class="acts">
      ${btn('Pantau tindak lanjut', { icon: 'hourglass', go: 'pic-tindak' })}
      ${btn('Kembali ke beranda', { kind: 'out', icon: 'home', go: 'pic-beranda' })}
    </div>
  </div>`, 'pic', 'pic-verifikasi');

S['pic-tindak'] = () => wrap(`
  ${topbar('Pemantauan tindak lanjut', { sub: 'Laporan sekolah ini', back: false })}
  <div class="body">
    <div class="stats">
      ${stat('2', 'Sedang berjalan')}${stat('1', 'Melewati tenggat')}
      ${stat('11', 'Selesai 30 hari')}${stat('3,2 hari', 'Rata-rata penyelesaian')}
    </div>
    <div class="chips"><button class="chip on">Berjalan</button><button class="chip">Selesai</button><button class="chip">Ditolak</button></div>
    <div class="list">
      ${li('LP-260803-0092 · Jumlah kurang', '7 porsi · menunggu tanggapan dapur · sisa 22 jam', { icon: 'clock', tone: 'am', right: badge('Berjalan', 'wait'), go: 'pic-tindak-detail' })}
      ${li('LP-260730-0081 · Keterlambatan', 'Terlambat 78 menit · tenggat terlampaui 2 hari', { icon: 'alert', tone: 'dg', right: badge('Terlambat', 'bad'), go: 'pic-tindak-detail' })}
      ${li('LP-260722-0064 · Mutu makanan', 'Selesai · dapur mengganti pemasok sayur', { icon: 'checkc', right: badge('Selesai', 'ok'), go: 'pic-riwayat' })}
    </div>
    ${note('Tidak ada laporan yang bisa dihapus', 'Riwayat laporan bersifat tetap. Perubahan status hanya dilakukan pihak dapur dan dinas, dan tercatat waktunya.', 'n', 'shield')}
  </div>`, 'pic', 'pic-tindak');

S['pic-tindak-detail'] = () => wrap(`
  ${topbar('LP-260730-0081', { sub: 'Keterlambatan · dampak sedang' })}
  <div class="body">
    ${note('Tenggat terlampaui 2 hari', 'Laporan otomatis dinaikkan ke dinas pendidikan kota dan tampil sebagai belum selesai di portal publik.', 'r', 'alert')}
    ${card(`<div class="kv">
      <dt>Kiriman</dt><dd>SIPGN-DST-260730-0119</dd>
      <dt>Jadwal tiba</dt><dd>09.00 – 09.30</dd>
      <dt>Tiba nyata</dt><dd>10.48 (terlambat 78 menit)</dd>
      <dt>Porsi</dt><dd>380 dari 412</dd>
      <dt>Pelapor</dt><dd>${esc(SEKOLAH.pic)}</dd>
    </div>`)}
    ${card(`<h3 style="margin-bottom:10px">Perjalanan laporan</h3>
    <div class="tl">
      <div class="step"><span class="dot ok">${ic('check', 12, 2.6)}</span><b>Laporan terkirim</b><span>30 Jul 11.02 · PIC sekolah</span></div>
      <div class="step"><span class="dot ok">${ic('check', 12, 2.6)}</span><b>Dibaca dapur</b><span>30 Jul 13.20 · SPPG Dapur Kranggan</span></div>
      <div class="step"><span class="dot ok">${ic('file', 12, 2.2)}</span><b>Tanggapan pertama</b><span>31 Jul 08.15 · “Armada mengalami kerusakan, sedang diganti.”</span></div>
      <div class="step"><span class="dot now">${ic('alert', 12, 2.2)}</span><b>Menunggu perbaikan terukur</b><span>Tenggat 1 Agu terlampaui · dinaikkan ke dinas 2 Agu 09.00</span></div>
      <div class="step"><span class="dot">${ic('checkc', 12, 2.2)}</span><b>Penyelesaian</b><span>Belum ada</span></div>
    </div>`)}
    <div class="btnrow">
      ${btn('Tambah catatan', { kind: 'out', icon: 'clip' })}
      ${btn('Tandai selesai', { kind: 'gray', icon: 'checkc' })}
    </div>
    <p class="tiny" style="margin-top:10px">Sekolah hanya dapat menandai selesai bila perbaikan sudah benar-benar diterima.</p>
  </div>`, 'pic', 'pic-tindak');

S['pic-riwayat'] = () => wrap(`
  ${topbar('Riwayat verifikasi', { sub: '30 hari terakhir · SDN Kranggan 1' })}
  <div class="body">
    ${card(`<h3>Rekap bulan ini</h3><p class="lead">28 hari sekolah aktif</p>
      ${hbar('Sesuai', 89, '25')}${hbar('Tidak sesuai', 7, '2')}${hbar('Belum verifikasi', 4, '1')}`)}
    <div class="list">
      ${li('1 Agu · 412 porsi', 'Sesuai · tiba 09.06', { icon: 'checkc', right: badge('Sesuai', 'ok') })}
      ${li('31 Jul · 412 porsi', 'Sesuai · tiba 09.12', { icon: 'checkc', right: badge('Sesuai', 'ok') })}
      ${li('30 Jul · 380 porsi', 'Keterlambatan 78 menit · LP-260730-0081', { icon: 'alert', tone: 'dg', right: badge('Dilaporkan', 'bad'), go: 'pic-tindak-detail' })}
      ${li('29 Jul · 412 porsi', 'Sesuai · tiba 09.02', { icon: 'checkc', right: badge('Sesuai', 'ok') })}
      ${li('28 Jul · —', 'Tidak ada verifikasi masuk', { icon: 'clock', tone: 'neu', right: badge('Kosong', 'neu') })}
    </div>
  </div>`, 'pic', 'pic-kiriman');

S['pic-notif'] = () => wrap(`
  ${topbar('Notifikasi', { sub: '3 baru' })}
  <div class="body">
    <div class="list">
      ${li('Kiriman tiba', 'SIPGN mencatat kiriman 09.05. Segera verifikasi.', { icon: 'truck', right: badge('Baru', 'info'), go: 'pic-verifikasi' })}
      ${li('Tenggat tindak lanjut terlampaui', 'LP-260730-0081 dinaikkan ke dinas pendidikan kota.', { icon: 'alert', tone: 'dg', right: badge('Baru', 'info'), go: 'pic-tindak-detail' })}
      ${li('Menu berubah', 'Dapur mengubah menu sayur untuk 4 Agu.', { icon: 'food', tone: 'am', right: badge('Baru', 'info') })}
      ${li('Laporan selesai', 'LP-260722-0064 ditutup setelah pemasok sayur diganti.', { icon: 'checkc', go: 'pic-tindak' })}
    </div>
  </div>`, 'pic', 'pic-beranda');

S['pic-profil'] = () => wrap(`
  ${topbar('Profil', { back: false })}
  <div class="body">
    ${card(`<div style="display:flex;align-items:center;gap:12px">
      <span style="width:52px;height:52px;flex:0 0 52px;border-radius:50%;background:var(--primary-light);color:var(--primary);display:grid;place-items:center">${ic('user', 26)}</span>
      <div style="flex:1;min-width:0"><h3>${esc(SEKOLAH.pic)}</h3><p class="lead">PIC ${esc(SEKOLAH.nama)} · NPSN 20548112</p></div>
      ${badge('Aktif', 'ok')}
    </div>`)}
    <div class="list">
      ${li('Data sekolah', `${SEKOLAH.siswa} siswa · ${esc(SEKOLAH.kota)}`, { icon: 'school' })}
      ${li('Dapur pemasok', esc(SEKOLAH.dapur), { icon: 'food' })}
      ${li('Sumber data', 'SIPGN Produksi, Distribusi, Penerima Manfaat', { icon: 'db', go: 'arsitektur' })}
      ${li('Halaman publik sekolah ini', 'Lihat yang dilihat orang tua siswa', { icon: 'globe', go: 'pub-sekolah' })}
      ${li('Pusat bantuan', 'Panduan verifikasi dan pelaporan', { icon: 'info' })}
      ${li('Keluar akun', 'Kembali ke pilihan ruang', { icon: 'lock', tone: 'neu', go: 'peran' })}
    </div>
    <p class="tiny">Versi prototype 1.0 · data contoh, bukan data operasional sebenarnya.</p>
  </div>`, 'pic', 'pic-profil');

/* ---- C. Portal publik ---- */
S['pub-beranda'] = () => wrap(`
  <div class="hero" style="background:#1B5E9F">
    <p class="eyebrow">Portal publik</p>
    <h2>Transparansi Makan Bergizi Gratis</h2>
    <p>Angka alokasi dan realisasi porsi berasal dari SIPGN, status verifikasi berasal dari PIC sekolah.</p>
    <span class="pill">${ic('refresh', 13)} Diperbarui 3 Agu 2026, 09.30</span>
  </div>
  <div class="body">
    <div class="stats">
      ${stat('1.485', 'Sekolah terpantau')}
      ${stat('448.650', 'Porsi dialokasikan bulan ini')}
      ${stat('93,8%', 'Ketepatan distribusi nasional')}
      ${stat('412', 'Laporan sekolah masuk')}
    </div>
    <p class="eyebrow" style="margin:16px 0 8px">Telusuri</p>
    <div class="list">
      ${li('Cari kota dan sekolah', 'Mulai dari wilayah, lanjut ke satuan pendidikan', { icon: 'search', go: 'pub-cari' })}
      ${li('Alokasi dan realisasi porsi', 'Berapa dijanjikan, berapa benar-benar diterima', { icon: 'food', go: 'pub-sekolah' })}
      ${li('Ketepatan distribusi', 'Jumlah, waktu, dan menu yang sesuai', { icon: 'pct', go: 'pub-ketepatan' })}
      ${li('Status verifikasi', 'Sekolah mana yang sudah mengonfirmasi', { icon: 'checkc', go: 'pub-verifikasi' })}
      ${li('Konfirmasi warga', 'Bandingkan konfirmasi publik dengan verifikasi PIC', { icon: 'users', go: 'pub-konfirmasi-banding' })}
      ${li('Statistik laporan', 'Jenis ketidaksesuaian yang paling sering', { icon: 'chart', go: 'pub-statistik' })}
      ${li('Status penyelesaian', 'Laporan selesai, berjalan, dan terlambat', { icon: 'hourglass', go: 'pub-penyelesaian' })}
    </div>
    ${note('Tanpa data pribadi', 'Portal ini hanya menampilkan angka agregat dan status. Nama siswa, alamat, dan identitas pribadi tidak pernah ditampilkan.', 'n', 'lock')}
  </div>`, 'pub', 'pub-beranda');

S['pub-cari'] = () => wrap(`
  ${topbar('Cari kota dan sekolah', { back: false })}
  <div class="body">
    ${field('', 'Cari kota, kabupaten, atau nama sekolah', { icon: 'search', val: 'Mojokerto' })}
    <div class="chips"><button class="chip on">Semua</button><button class="chip">SD/MI</button><button class="chip">SMP/MTs</button><button class="chip">SMA/SMK</button></div>
    <p class="eyebrow" style="margin:4px 0 8px">Wilayah</p>
    <div class="list">
      ${KOTA.map(k => li(k.n, `${k.s} sekolah · ketepatan ${String(k.tepat).replace('.', ',')}% · ${k.lap} laporan`,
        { icon: 'pin', right: badge(k.tepat >= 95 ? 'Baik' : k.tepat >= 90 ? 'Cukup' : 'Perlu perhatian', k.tepat >= 95 ? 'ok' : k.tepat >= 90 ? 'wait' : 'bad'), go: 'pub-kota' })).join('')}
    </div>
    <p class="eyebrow" style="margin:4px 0 8px">Sekolah dicari terbanyak</p>
    <div class="list">
      ${li('SDN Kranggan 1', 'Kota Mojokerto · 412 siswa', { icon: 'school', go: 'pub-sekolah' })}
      ${li('SMPN 3 Mojokerto', 'Kota Mojokerto · 688 siswa', { icon: 'school', go: 'pub-sekolah' })}
      ${li('MI Al-Hidayah Jombang', 'Kabupaten Jombang · 236 siswa', { icon: 'school', go: 'pub-sekolah' })}
    </div>
  </div>`, 'pub', 'pub-cari');

S['pub-kota'] = () => wrap(`
  ${topbar('Kota Mojokerto', { sub: '128 sekolah · 41.250 porsi bulan ini' })}
  <div class="body">
    <div class="stats">
      ${stat('41.250', 'Porsi dialokasikan')}${stat('40.410', 'Porsi terealisasi')}
      ${stat('96,4%', 'Ketepatan distribusi')}${stat('37', 'Laporan sekolah')}
    </div>
    ${card(`<h3>Realisasi terhadap alokasi</h3><p class="lead">40.410 dari 41.250 porsi · 97,9%</p>${meter(97.9)}
      <p class="tiny">Selisih 840 porsi tersebar pada 9 sekolah dan seluruhnya sudah dilaporkan.</p>`)}
    ${card(`<h3 style="margin-bottom:6px">Kecamatan</h3>
      ${hbar('Prajurit Kulon', 98, '98%')}${hbar('Magersari', 96, '96%')}${hbar('Kranggan', 94, '94%')}`)}
    <p class="eyebrow" style="margin:14px 0 8px">Sekolah di wilayah ini</p>
    <div class="list">
      ${li('SDN Kranggan 1', '412 siswa · 98,3% ketepatan', { icon: 'school', right: badge('Terverifikasi', 'ok'), go: 'pub-sekolah' })}
      ${li('SDN Wates 2', '318 siswa · 95,1% ketepatan', { icon: 'school', right: badge('Terverifikasi', 'ok'), go: 'pub-sekolah' })}
      ${li('SMPN 3 Mojokerto', '688 siswa · 91,4% ketepatan', { icon: 'school', right: badge('Menunggu', 'wait'), go: 'pub-sekolah' })}
      ${li('MI Al-Falah', '204 siswa · belum ada verifikasi 3 hari', { icon: 'school', tone: 'dg', right: badge('Belum', 'bad'), go: 'pub-verifikasi' })}
    </div>
  </div>`, 'pub', 'pub-cari');

S['pub-sekolah'] = () => wrap(`
  ${topbar('SDN Kranggan 1', { sub: 'Kota Mojokerto · 412 siswa penerima' })}
  <div class="body">
    <p class="eyebrow" style="margin-bottom:8px">Alokasi dan realisasi porsi</p>
    <div class="stats">
      ${stat('11.536', 'Porsi dialokasikan bulan ini')}${stat('11.342', 'Porsi diterima terverifikasi')}
      ${stat('194', 'Porsi selisih')}${stat('98,3%', 'Realisasi terhadap alokasi')}
    </div>
    ${card(`<h3>Realisasi harian, 14 hari terakhir</h3><p class="lead">Garis penuh berarti seluruh alokasi diterima</p>
      ${hbar('1 Agu', 100, '412')}${hbar('31 Jul', 100, '412')}${hbar('30 Jul', 92, '380')}${hbar('29 Jul', 100, '412')}${hbar('28 Jul', 0, '0')}${hbar('25 Jul', 98, '405')}`)}
    ${card(`<h3 style="margin-bottom:8px">Rincian bulan ini</h3><div class="kv">
      <dt>Dapur pemasok</dt><dd>SPPG Dapur Kranggan</dd>
      <dt>Hari sekolah</dt><dd>28 hari</dd>
      <dt>Hari sesuai</dt><dd>25 hari</dd>
      <dt>Hari bermasalah</dt><dd>2 hari</dd>
      <dt>Tanpa verifikasi</dt><dd>1 hari</dd>
    </div>`)}
    <div class="list">
      ${li('Ketepatan distribusi sekolah ini', 'Jumlah, waktu, dan menu', { icon: 'pct', go: 'pub-ketepatan' })}
      ${li('Konfirmasi penerimaan Anda', 'Tanpa akun · data independen dari verifikasi PIC', { icon: 'users', tone: 'am', go: 'pub-konfirmasi' })}
      ${li('Status verifikasi harian', 'Siapa mengonfirmasi dan kapan', { icon: 'checkc', go: 'pub-verifikasi' })}
      ${li('Laporan sekolah ini', '4 laporan · 3 selesai', { icon: 'clip', go: 'pub-penyelesaian' })}
    </div>
    ${note('Selisih bukan otomatis berarti pelanggaran', 'Hari libur, siswa tidak masuk, dan perubahan jumlah kelas juga menimbulkan selisih. Baca catatan pada tiap laporan.', 'n', 'info')}
  </div>`, 'pub', 'pub-sekolah');

let citizenChoice = '';

function setCitizenChoice(choice) {
  citizenChoice = choice;
  const yes = document.getElementById('citizenYes');
  const no = document.getElementById('citizenNo');
  const field = document.getElementById('citizenIssue');
  const feedback = document.getElementById('citizenFeedback');
  if (!yes || !no || !field) return;
  yes.classList.toggle('selected', choice === 'sesuai');
  no.classList.toggle('selected', choice === 'tidak');
  yes.setAttribute('aria-pressed', String(choice === 'sesuai'));
  no.setAttribute('aria-pressed', String(choice === 'tidak'));
  field.hidden = choice !== 'tidak';
  if (feedback) feedback.hidden = true;
}

function submitCitizenConfirmation() {
  const feedback = document.getElementById('citizenFeedback');
  const submit = document.getElementById('citizenSubmit');
  if (!feedback || !submit) return;
  feedback.hidden = false;
  if (!citizenChoice) {
    feedback.className = 'note a confirm-feedback';
    feedback.innerHTML = `${ic('alert', 17)}<div><b>Pilih jawaban terlebih dahulu</b>Nyatakan apakah kiriman sesuai atau tidak sesuai dengan yang Anda terima.</div>`;
    return;
  }
  feedback.className = 'note g confirm-feedback';
  feedback.innerHTML = `${ic('checkc', 17)}<div><b>Konfirmasi berhasil dicatat</b>Terima kasih. Data Anda masuk sebagai konfirmasi warga independen.</div>`;
  submit.disabled = true;
  submit.innerHTML = `${ic('checkc', 18)} Konfirmasi terkirim`;
}

S['pub-konfirmasi'] = () => wrap(`
  ${topbar('Konfirmasi penerimaan Anda', { sub: 'Bantu kami memastikan data ini akurat', long: true })}
  <div class="body">
    <p class="eyebrow" style="margin-bottom:8px">Ringkasan kiriman terbaru</p>
    ${card(`<div class="shipment-summary">
      <span class="stamp">${ic('food', 22)}</span>
      <div><b>412 porsi · 3 Agu 2026</b><span>SDN Kranggan 1 · alokasi menurut SIPGN</span></div>
    </div>`, 'tight')}
    ${card(`<h3 style="margin-bottom:4px">Apakah kiriman ini sesuai dengan yang Anda terima?</h3>
      <p class="lead">Pilih satu jawaban berdasarkan penerimaan terakhir.</p>
      <div class="confirm-choices" role="group" aria-label="Konfirmasi penerimaan">
        <button id="citizenYes" class="tap confirm-choice yes" aria-pressed="false" onclick="setCitizenChoice('sesuai')">${ic('checkc', 24)}<span>Sesuai yang saya terima</span></button>
        <button id="citizenNo" class="tap confirm-choice no" aria-pressed="false" onclick="setCitizenChoice('tidak')">${ic('alert', 24)}<span>Tidak sesuai</span></button>
      </div>
      <div id="citizenIssue" class="conditional-field" hidden>
        ${selectField('Jenis masalah (opsional)', ['Jumlah kurang', 'Mutu makanan', 'Menu berbeda', 'Keterlambatan', 'Tidak ada kiriman'], { icon: 'alert', help: 'Daftar ini sama dengan formulir laporan PIC agar data dapat disandingkan langsung.' })}
      </div>`)}
    <p class="tiny" style="margin:2px 2px 14px">Konfirmasi Anda dicatat sebagai data independen dari verifikasi PIC. Tidak memerlukan akun.</p>
    <div id="citizenFeedback" class="confirm-feedback" hidden></div>
    <button id="citizenSubmit" class="tap btn pri" onclick="submitCitizenConfirmation()">${ic('check', 18)} Kirim konfirmasi</button>
  </div>`, 'pub', 'pub-cari');

S['pub-ketepatan'] = () => wrap(`
  ${topbar('Ketepatan distribusi', { sub: 'Kota Mojokerto · Juli–Agustus 2026' })}
  <div class="body">
    ${card(`<h3>Ketepatan gabungan</h3><p class="lead">Rata-rata tiga dimensi di bawah</p>
      <div style="font-family:var(--display);font-size:38px;font-weight:700;letter-spacing:-.02em;line-height:1.05;margin-top:6px">96,4%</div>
      ${meter(96.4)}<p class="tiny">Naik 1,8 poin dibanding bulan sebelumnya.</p>`)}
    ${card(`<h3 style="margin-bottom:4px">Ketepatan jumlah</h3><p class="lead">Porsi diterima sama dengan alokasi</p>${meter(97.9)}<p class="tiny">97,9% · 840 porsi selisih dari 41.250</p>`)}
    ${card(`<h3 style="margin-bottom:4px">Ketepatan waktu</h3><p class="lead">Tiba di dalam rentang jadwal</p>${meter(94.2, 'am')}<p class="tiny">94,2% · keterlambatan terbanyak pada hari Senin</p>`)}
    ${card(`<h3 style="margin-bottom:4px">Ketepatan menu</h3><p class="lead">Menu sesuai daftar dapur</p>${meter(97.1)}<p class="tiny">97,1% · penggantian tersering pada komponen sayur</p>`)}
    ${note('Cara menghitung', 'Ketepatan dihitung hanya dari kiriman yang sudah diverifikasi sekolah. Kiriman tanpa verifikasi dihitung terpisah, bukan dianggap tepat.', 'g', 'info')}
    ${btn('Lihat status verifikasi', { kind: 'out', icon: 'checkc', go: 'pub-verifikasi' })}
  </div>`, 'pub', 'pub-sekolah');

S['pub-verifikasi'] = () => wrap(`
  ${topbar('Status verifikasi', { sub: 'Konfirmasi penerimaan oleh PIC sekolah' })}
  <div class="body">
    <div class="stats">
      ${stat('1.352', 'Sekolah terverifikasi hari ini')}${stat('98', 'Menunggu verifikasi')}
      ${stat('35', 'Belum verifikasi 3 hari')}${stat('91,0%', 'Cakupan verifikasi')}
    </div>
    ${card(`<h3 style="margin-bottom:6px">Sebaran status hari ini</h3>
      ${hbar('Terverifikasi', 91, '91%')}${hbar('Menunggu', 6, '6%')}${hbar('Belum', 3, '3%')}
      <p class="tiny" style="margin-top:6px">Sekolah berstatus belum verifikasi tidak berarti makanan tidak datang — artinya belum ada konfirmasi tercatat.</p>`)}
    <div class="chips"><button class="chip on">Semua</button><button class="chip">Terverifikasi</button><button class="chip">Menunggu</button><button class="chip">Belum</button></div>
    <div class="list">
      ${li('SDN Kranggan 1', 'Diverifikasi 3 Agu 09.41 · 405 porsi sesuai', { icon: 'checkc', right: badge('Terverifikasi', 'ok'), go: 'pub-sekolah' })}
      ${li('SDN Wates 2', 'Diverifikasi 3 Agu 09.20 · 318 porsi sesuai', { icon: 'checkc', right: badge('Terverifikasi', 'ok') })}
      ${li('SMPN 3 Mojokerto', 'Kiriman tercatat 09.15, konfirmasi belum masuk', { icon: 'clock', tone: 'am', right: badge('Menunggu', 'wait') })}
      ${li('MI Al-Falah', 'Tidak ada konfirmasi sejak 31 Jul', { icon: 'alert', tone: 'dg', right: badge('Belum', 'bad') })}
    </div>
  </div>`, 'pub', 'pub-sekolah');

S['pub-statistik'] = () => wrap(`
  ${topbar('Statistik laporan', { sub: 'Ketidaksesuaian yang dilaporkan sekolah', back: false })}
  <div class="body">
    <div class="chips"><button class="chip">7 hari</button><button class="chip on">30 hari</button><button class="chip">Semester</button></div>
    <div class="stats">
      ${stat('412', 'Laporan masuk')}${stat('1.485', 'Sekolah terpantau')}
      ${stat('27,7%', 'Sekolah pernah melapor')}${stat('3,4 hari', 'Rata-rata penyelesaian')}
    </div>
    ${card(`<h3 style="margin-bottom:6px">Jenis ketidaksesuaian</h3>
      ${hbar('Keterlambatan', 100, '148')}${hbar('Jumlah kurang', 78, '116')}${hbar('Menu berbeda', 51, '76')}${hbar('Mutu makanan', 34, '51')}${hbar('Tidak ada kiriman', 14, '21')}`)}
    ${card(`<h3 style="margin-bottom:6px">Wilayah dengan laporan terbanyak</h3>
      ${KOTA.slice().sort((a, b) => b.lap - a.lap).map(k => hbar(k.n.replace('Kabupaten ', 'Kab. ').replace('Kota ', ''), Math.round(k.lap / 158 * 100), String(k.lap))).join('')}
      <p class="tiny" style="margin-top:6px">Banyak laporan dapat berarti masalah nyata, atau justru sekolah yang aktif melapor.</p>`)}
    ${card(`<h3 style="margin-bottom:6px">Tingkat dampak</h3>${hbar('Ringan', 62, '184')}${hbar('Sedang', 100, '196')}${hbar('Berat', 17, '32')}`)}
    ${btn('Lihat status penyelesaian', { kind: 'out', icon: 'hourglass', go: 'pub-penyelesaian' })}
  </div>`, 'pub', 'pub-statistik');

S['pub-penyelesaian'] = () => wrap(`
  ${topbar('Status penyelesaian', { sub: 'Apa yang terjadi setelah sekolah melapor' })}
  <div class="body">
    <div class="stats">
      ${stat('318', 'Laporan selesai')}${stat('61', 'Sedang berjalan')}
      ${stat('33', 'Melewati tenggat')}${stat('77,2%', 'Tingkat penyelesaian')}
    </div>
    ${card(`<h3 style="margin-bottom:6px">Sebaran status</h3>
      ${hbar('Selesai', 77, '318')}${hbar('Berjalan', 15, '61')}${hbar('Terlambat', 8, '33')}
      ${meter(77.2)}<p class="tiny">Tenggat baku: tanggapan 1 x 24 jam, penyelesaian 3 x 24 jam.</p>`)}
    ${card(`<h3 style="margin-bottom:6px">Tingkat penyelesaian per wilayah</h3>
      ${KOTA.map(k => hbar(k.n.replace('Kabupaten ', 'Kab. ').replace('Kota ', ''), k.sel, k.sel + '%')).join('')}`)}
    <p class="eyebrow" style="margin:14px 0 8px">Contoh laporan yang sudah ditutup</p>
    <div class="list">
      ${li('Mutu sayur menurun · MI Al-Hidayah', 'Selesai 4 hari · dapur mengganti pemasok sayur', { icon: 'checkc', right: badge('Selesai', 'ok') })}
      ${li('Jumlah kurang 24 porsi · SDN Wates 2', 'Selesai 1 hari · porsi susulan dikirim sore', { icon: 'checkc', right: badge('Selesai', 'ok') })}
      ${li('Keterlambatan 78 menit · SDN Kranggan 1', 'Berjalan 4 hari · melewati tenggat, dinaikkan ke dinas', { icon: 'alert', tone: 'dg', right: badge('Terlambat', 'bad') })}
    </div>
    ${note('Yang belum selesai tetap ditampilkan', 'Laporan yang melewati tenggat tidak disembunyikan. Justru bagian inilah yang paling perlu diketahui publik.', 'a', 'eye')}
  </div>`, 'pub', 'pub-statistik');

const CONFIRM_SCHOOLS = [
  { nama: 'MI Al-Falah', kota: 'Kota Mojokerto', pic: 94.8, warga: 72.4, total: 84 },
  { nama: 'SMPN 3 Mojokerto', kota: 'Kota Mojokerto', pic: 96.1, warga: 82.6, total: 143 },
  { nama: 'SDN Wates 2', kota: 'Kota Mojokerto', pic: 97.3, warga: 89.9, total: 126 },
  { nama: 'SDN Kranggan 1', kota: 'Kota Mojokerto', pic: 96.4, warga: 91.2, total: 187 }
].sort((a, b) => Math.abs(b.pic - b.warga) - Math.abs(a.pic - a.warga));

const comparisonCard = (s, featured = false) => {
  const gap = Math.abs(s.pic - s.warga);
  const review = gap > 10;
  return `<div class="compare-card">
    <div class="compare-head"><div><h3>${esc(s.nama)}</h3><p>${esc(s.kota)}${featured ? ' · contoh sekolah' : ''}</p></div>${review ? badge('Perlu ditinjau', 'wait') : ''}</div>
    <div class="compare-grid">
      <div class="compare-col"><b>${String(s.pic.toFixed(1)).replace('.', ',')}%</b><span>Verifikasi PIC</span><small>sesuai</small></div>
      <div class="compare-col"><b>${String(s.warga.toFixed(1)).replace('.', ',')}%</b><span>Konfirmasi warga</span><small>${s.total} konfirmasi</small></div>
    </div>
    <div class="gap-line"><span>Selisih dua sumber</span><b>${String(gap.toFixed(1)).replace('.', ',')} poin persen</b></div>
  </div>`;
};

S['pub-konfirmasi-banding'] = () => wrap(`
  ${topbar('Konfirmasi warga vs verifikasi PIC', { sub: 'Dua sumber, satu sekolah', back: false, long: true })}
  <div class="body">
    <div class="chips"><button class="chip on">30 hari</button><button class="chip">Semester</button><button class="chip">Semua wilayah</button></div>
    <p class="eyebrow" style="margin-bottom:8px">Sekolah contoh</p>
    ${comparisonCard({ nama: 'SDN Kranggan 1', kota: 'Kota Mojokerto', pic: 96.4, warga: 91.2, total: 187 }, true)}
    <p class="eyebrow" style="margin:16px 0 8px">Selisih terbesar</p>
    ${CONFIRM_SCHOOLS.map(s => comparisonCard(s)).join('')}
    ${note('Sinyal untuk ditinjau', 'Selisih besar antara dua sumber bukan bukti pelanggaran, tapi jadi sinyal prioritas peninjauan bagi dinas.', 'a', 'info')}
  </div>`, 'pub', 'pub-cari');

S['pub-info'] = () => wrap(`
  ${topbar('Info dan batasan', { back: false })}
  <div class="body">
    ${card(`<h3>Sumber data</h3><p class="lead">Seluruh angka pada portal ini berasal dari dua lapis.</p>
      <div class="tl" style="margin-top:12px">
        <div class="step"><span class="dot ok">${ic('db', 12, 2.2)}</span><b>SIPGN</b><span>Produksi, Distribusi, dan Penerima Manfaat — alokasi porsi, jadwal, jumlah siswa.</span></div>
        <div class="step"><span class="dot ok">${ic('shield', 12, 2.2)}</span><b>SIPANGAN EDU</b><span>Verifikasi PIC sekolah, laporan ketidaksesuaian, dan status tindak lanjutnya.</span></div>
      </div>`)}
    ${card(`<h3 style="margin-bottom:8px">Batasan yang perlu diketahui</h3>
      <div class="check" style="border-bottom:1px solid #F1F5F9"><span>${ic('info', 17)}</span><span>Angka ketepatan hanya dihitung dari kiriman yang sudah diverifikasi sekolah.<small>Kiriman tanpa verifikasi dilaporkan terpisah.</small></span></div>
      <div class="check" style="border-bottom:1px solid #F1F5F9"><span>${ic('info', 17)}</span><span>Selisih porsi tidak selalu berarti pelanggaran.<small>Siswa tidak masuk dan hari libur ikut menimbulkan selisih.</small></span></div>
      <div class="check"><span>${ic('info', 17)}</span><span>Data diperbarui satu kali per jam.<small>Kejadian pagi ini mungkin belum tampil.</small></span></div>`)}
    <div class="list">
      ${li('Alur data lengkap', 'SIPGN → data terintegrasi → SIPANGAN EDU', { icon: 'db', go: 'arsitektur' })}
      ${li('Masuk sebagai PIC sekolah', 'Untuk verifikasi dan pelaporan', { icon: 'school', go: 'login' })}
      ${li('Contoh keadaan data kosong', 'Tampilan bila belum ada laporan', { icon: 'inbox', tone: 'neu', go: 'kosong' })}
      ${li('Contoh gangguan sinkronisasi', 'Tampilan bila data SIPGN tidak terbaca', { icon: 'off', tone: 'dg', go: 'galat' })}
    </div>
    <p class="tiny">Prototype 1.0 · seluruh angka adalah data contoh untuk keperluan peragaan.</p>
  </div>`, 'pub', 'pub-info');

/* ---- D. Keadaan sistem ---- */
S['kosong'] = () => wrap(`
  ${topbar('Statistik laporan', { sub: 'Kabupaten contoh' })}
  <div class="center">
    <div class="blob neu">${ic('inbox', 52, 1.6)}</div>
    <h2>Belum ada laporan</h2>
    <p>Belum ada laporan ketidaksesuaian pada rentang waktu ini. Bila menurut kamu seharusnya ada, coba ubah rentang waktu atau wilayah.</p>
    <div class="acts">
      ${btn('Ubah rentang waktu', { icon: 'cal' })}
      ${btn('Kembali ke portal', { kind: 'out', icon: 'globe', go: 'pub-beranda' })}
    </div>
  </div>`, 'pub', 'pub-statistik');

S['galat'] = () => wrap(`
  ${topbar('Gangguan sinkronisasi', { sub: 'Data operasional tidak terbaca' })}
  <div class="center">
    <div class="blob dg">${ic('off', 52, 1.6)}</div>
    <h2>Data SIPGN belum tersinkron</h2>
    <p>Angka alokasi dan jadwal terakhir berhasil dibaca pada 3 Agu 08.10. Verifikasi tetap bisa dikirim dan akan dicocokkan setelah sambungan pulih.</p>
    ${note('Yang tetap bisa dilakukan', 'PIC dapat mengisi verifikasi dan mengunggah bukti secara luring. Data akan terkirim otomatis saat sambungan kembali.', 'a', 'shield')}
    <div class="acts">
      ${btn('Coba sinkronkan lagi', { icon: 'refresh' })}
      ${btn('Lanjut mode luring', { kind: 'out', icon: 'check', go: 'pic-verifikasi' })}
    </div>
  </div>`, 'pic', 'pic-beranda');

/* ===================== NAVIGASI ===================== */
const META = {
  'splash': [1, 'Splash Screen', 'Pintu masuk'],
  'arsitektur': [2, 'Alur Data SIPGN', 'Pintu masuk'],
  'peran': [3, 'Pilih Ruang', 'Pintu masuk'],
  'login': [4, 'Masuk Ruang PIC', 'Pintu masuk'],

  'pic-beranda': [5, 'Beranda PIC', 'Ruang PIC sekolah'],
  'pic-kiriman': [6, 'Daftar Kiriman', 'Ruang PIC sekolah'],
  'pic-verifikasi': [7, 'Verifikasi Penerimaan', 'Verifikasi penerimaan'],
  'pic-verifikasi-ok': [8, 'Verifikasi Terkirim', 'Verifikasi penerimaan'],
  'pic-lapor': [9, 'Form Ketidaksesuaian', 'Pelaporan ketidaksesuaian'],
  'pic-bukti': [10, 'Unggah Bukti', 'Pelaporan ketidaksesuaian'],
  'pic-lapor-ok': [11, 'Laporan Terkirim', 'Pelaporan ketidaksesuaian'],
  'pic-tindak': [12, 'Daftar Tindak Lanjut', 'Pemantauan tindak lanjut'],
  'pic-tindak-detail': [13, 'Detail Tindak Lanjut', 'Pemantauan tindak lanjut'],
  'pic-riwayat': [14, 'Riwayat Verifikasi', 'Ruang PIC sekolah'],
  'pic-notif': [15, 'Notifikasi', 'Ruang PIC sekolah'],
  'pic-profil': [16, 'Profil PIC', 'Ruang PIC sekolah'],

  'pub-beranda': [17, 'Beranda Portal Publik', 'Portal publik'],
  'pub-cari': [18, 'Cari Kota dan Sekolah', 'Portal publik'],
  'pub-kota': [19, 'Detail Wilayah', 'Portal publik'],
  'pub-sekolah': [20, 'Alokasi dan Realisasi Porsi', 'Portal publik'],
  'pub-konfirmasi': [21, 'Konfirmasi Penerimaan Warga', 'Portal publik'],
  'pub-ketepatan': [22, 'Ketepatan Distribusi', 'Portal publik'],
  'pub-verifikasi': [23, 'Status Verifikasi', 'Portal publik'],
  'pub-statistik': [24, 'Statistik Laporan', 'Portal publik'],
  'pub-penyelesaian': [25, 'Status Penyelesaian', 'Portal publik'],
  'pub-konfirmasi-banding': [26, 'Konfirmasi Warga', 'Portal publik'],
  'pub-info': [27, 'Info dan Batasan', 'Portal publik'],

  'kosong': ['·', 'Keadaan Data Kosong', 'Keadaan sistem'],
  'galat': ['·', 'Gangguan Sinkronisasi', 'Keadaan sistem']
};

const ORDER = ['splash', 'arsitektur', 'peran', 'login',
  'pic-beranda', 'pic-kiriman', 'pic-verifikasi', 'pic-verifikasi-ok', 'pic-lapor', 'pic-bukti',
  'pic-lapor-ok', 'pic-tindak', 'pic-tindak-detail', 'pic-riwayat', 'pic-notif', 'pic-profil',
  'pub-beranda', 'pub-cari', 'pub-kota', 'pub-sekolah', 'pub-konfirmasi', 'pub-ketepatan', 'pub-verifikasi',
  'pub-statistik', 'pub-penyelesaian', 'pub-konfirmasi-banding', 'pub-info', 'kosong', 'galat'];

const GROUPS = [
  ['Pintu masuk', ['splash', 'arsitektur', 'peran', 'login']],
  ['Ruang PIC · Verifikasi penerimaan', ['pic-beranda', 'pic-kiriman', 'pic-verifikasi', 'pic-verifikasi-ok']],
  ['Ruang PIC · Pelaporan ketidaksesuaian', ['pic-lapor', 'pic-bukti', 'pic-lapor-ok']],
  ['Ruang PIC · Pemantauan tindak lanjut', ['pic-tindak', 'pic-tindak-detail']],
  ['Ruang PIC · Pendukung', ['pic-riwayat', 'pic-notif', 'pic-profil']],
  ['Portal publik', ['pub-beranda', 'pub-cari', 'pub-kota', 'pub-sekolah', 'pub-konfirmasi', 'pub-ketepatan', 'pub-verifikasi', 'pub-statistik', 'pub-penyelesaian', 'pub-konfirmasi-banding', 'pub-info']],
  ['Keadaan sistem', ['kosong', 'galat']]
];

let current = 'splash';
function go(id) {
  if (!S[id]) return;
  if (id === 'pub-konfirmasi') citizenChoice = '';
  current = id;
  const [no, title, mod] = META[id];
  document.getElementById('screen').innerHTML = `<div class="enter" style="min-height:100%">${S[id]()}</div>`;
  document.getElementById('stageTitle').textContent = title;
  document.getElementById('stageMeta').textContent = (typeof no === 'number' ? `Layar ${no} · ` : 'Pendukung · ') + mod;
  buildIndex();
  document.getElementById('screen').scrollTop = 0;
}
function nextScreen() { const i = ORDER.indexOf(current); go(ORDER[Math.min(i + 1, ORDER.length - 1)]); }
function prevScreen() { const i = ORDER.indexOf(current); go(ORDER[Math.max(i - 1, 0)]); }

function buildIndex() {
  const box = document.getElementById('screenIndex');
  if (!box) return;
  box.innerHTML = GROUPS.map(([g, ids]) => `<div class="sb-group"><p class="eyebrow">${esc(g)}</p>${ids.map(id => {
    const [no, title] = META[id]; const on = id === current;
    return `<button class="tap sb-item${on ? ' on' : ''}" onclick="go('${id}')"><span class="sb-num">${no}</span><span class="sb-txt">${esc(title)}</span></button>`;
  }).join('')}</div>`).join('');
}

/* device switcher */
let device = 'phone';
function setDevice(d) {
  device = d;
  const wrapEl = document.getElementById('deviceWrap');
  const bezel = document.getElementById('deviceBezel');
  const box = document.getElementById('deviceScreenBox');
  const notch = document.getElementById('deviceNotch');
  const bar = document.getElementById('browserBar');
  const status = document.getElementById('statusBar');
  const screen = document.getElementById('screen');
  ['phone', 'tablet', 'laptop'].forEach(k => document.getElementById('dev-' + k).classList.toggle('on', k === d));

  if (d === 'phone') {
    wrapEl.style.width = '372px';
    bezel.style.borderRadius = '44px'; bezel.style.padding = '12px';
    box.style.borderRadius = '34px'; box.style.height = '760px';
    notch.style.display = 'block'; bar.style.display = 'none';
    status.style.display = 'flex'; screen.style.paddingTop = '34px';
  } else if (d === 'tablet') {
    wrapEl.style.width = '620px';
    bezel.style.borderRadius = '32px'; bezel.style.padding = '16px';
    box.style.borderRadius = '20px'; box.style.height = '780px';
    notch.style.display = 'none'; bar.style.display = 'none';
    status.style.display = 'flex'; screen.style.paddingTop = '34px';
  } else {
    wrapEl.style.width = '900px';
    bezel.style.borderRadius = '18px'; bezel.style.padding = '10px';
    box.style.borderRadius = '10px'; box.style.height = '620px';
    notch.style.display = 'none'; bar.style.display = 'flex';
    status.style.display = 'none'; screen.style.paddingTop = '0';
  }
}

/* init — mendukung tautan langsung, mis. index.html#pub-sekolah */
setDevice('phone');
const fromHash = () => (location.hash || '').replace('#', '');
go(S[fromHash()] ? fromHash() : 'splash');
window.addEventListener('hashchange', () => { const h = fromHash(); if (S[h]) go(h); });
