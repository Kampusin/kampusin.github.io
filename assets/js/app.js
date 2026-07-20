/* ============================================================
   Kampusin — Application logic
   Developed by Nugraha Nastya · Yogyakarta
   ------------------------------------------------------------
   Single-file app: mock data, auth, view router, renderers.
   No external deps. Pure vanilla JS.
   ============================================================ */
(function(window) {
  'use strict';

  const STORAGE_KEY = 'kampusin_session_v1';

  /* ----------------------------------------------------------
     ICON LIBRARY — inline SVG, no emoji, consistent stroke
     ---------------------------------------------------------- */
  const icons = {
    dashboard: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    schedule: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    attendance: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    grades: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    courses: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    announce: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
    profile: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    students: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    logout: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    mapPin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    trendUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    trendDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    cap: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  };

  /* ----------------------------------------------------------
     MOCK DATA — realistic Indonesian university context
     ---------------------------------------------------------- */
  const USERS = {
    'nugraha.nastya@kampusin.ac.id': {
      password: 'mhs123', role: 'mahasiswa',
      profile: {
        nim: '2024/5312345', name: 'Nugraha Nastya', email: 'nugraha.nastya@kampusin.ac.id',
        prodi: 'Teknik Informatika', fakultas: 'Fakultas Teknik', angkatan: 2024,
        semester: 4, dosenPa: 'Dr. Budi Santoso, M.Kom', avatar: 'NN',
        ipk: 3.72, sksLulus: 84, sksTotal: 144,
      },
    },
    'budi.santoso@kampusin.ac.id': {
      password: 'dosen123', role: 'dosen',
      profile: {
        nidn: '0023118501', name: 'Dr. Budi Santoso, M.Kom', email: 'budi.santoso@kampusin.ac.id',
        jabatan: 'Lektor Kepala', prodi: 'Teknik Informatika', fakultas: 'Fakultas Teknik',
        avatar: 'BS', mataKuliahCount: 4, mahasiswaBimbingan: 28,
      },
    },
  };

  const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  // Student: weekly schedule
  const SCHEDULE = {
    mahasiswa: [
      { day:'Senin', start:'08:00', end:'09:40', code:'IF-201', name:'Struktur Data', room:'Ged. Teknik 301', lecturer:'Budi Santoso', color:'brand' },
      { day:'Senin', start:'10:00', end:'11:40', code:'IF-204', name:'Basis Data', room:'Lab Komputer 2', lecturer:'Siti Aminah', color:'amber' },
      { day:'Senin', start:'13:00', end:'14:40', code:'MK-202', name:'Pancasila', room:'Ged. Utama 102', lecturer:'Ahmad Hidayat', color:'blue' },
      { day:'Selasa', start:'08:00', end:'09:40', code:'IF-202', name:'Aljabar Linear', room:'Ged. Teknik 205', lecturer:'Dewi Lestari', color:'green' },
      { day:'Selasa', start:'10:00', end:'12:30', code:'IF-208', name:'Pemrograman Web', room:'Lab Komputer 4', lecturer:'Budi Santoso', color:'brand' },
      { day:'Rabu', start:'08:00', end:'09:40', code:'IF-201', name:'Struktur Data', room:'Ged. Teknik 301', lecturer:'Budi Santoso', color:'brand' },
      { day:'Rabu', start:'10:00', end:'11:40', code:'IF-210', name:'Sistem Operasi', room:'Ged. Teknik 108', lecturer:'Rudi Hartono', color:'amber' },
      { day:'Kamis', start:'08:00', end:'10:30', code:'IF-208', name:'Pemrograman Web', room:'Lab Komputer 4', lecturer:'Budi Santoso', color:'brand' },
      { day:'Kamis', start:'13:00', end:'14:40', code:'IF-204', name:'Basis Data', room:'Lab Komputer 2', lecturer:'Siti Aminah', color:'amber' },
      { day:'Jumat', start:'08:00', end:'09:40', code:'IF-202', name:'Aljabar Linear', room:'Ged. Teknik 205', lecturer:'Dewi Lestari', color:'green' },
      { day:'Jumat', start:'10:00', end:'11:40', code:'IF-210', name:'Sistem Operasi', room:'Ged. Teknik 108', lecturer:'Rudi Hartono', color:'amber' },
    ],
    // Lecturer view: their teaching schedule
    dosen: [
      { day:'Senin', start:'08:00', end:'09:40', code:'IF-201', name:'Struktur Data', room:'Ged. Teknik 301', class:'TI-2A', color:'brand' },
      { day:'Senin', start:'10:00', end:'12:30', code:'IF-208', name:'Pemrograman Web', room:'Lab Komputer 4', class:'TI-3A', color:'amber' },
      { day:'Rabu', start:'08:00', end:'09:40', code:'IF-201', name:'Struktur Data', room:'Ged. Teknik 301', class:'TI-2A', color:'brand' },
      { day:'Kamis', start:'08:00', end:'10:30', code:'IF-208', name:'Pemrograman Web', room:'Lab Komputer 4', class:'TI-3A', color:'amber' },
      { day:'Jumat', start:'13:00', end:'15:30', code:'IF-308', name:'Rekayasa Perangkat Lunak', room:'Lab Komputer 6', class:'TI-4A', color:'green' },
    ],
  };

  // Attendance summary (student)
  const ATTENDANCE_SUMMARY = [
    { code:'IF-201', name:'Struktur Data', hadir:14, izin:1, sakit:0, alpha:0, total:15 },
    { code:'IF-204', name:'Basis Data', hadir:13, izin:0, sakit:1, alpha:1, total:15 },
    { code:'IF-208', name:'Pemrograman Web', hadir:15, izin:0, sakit:0, alpha:0, total:15 },
    { code:'IF-210', name:'Sistem Operasi', hadir:12, izin:1, sakit:1, alpha:1, total:15 },
    { code:'IF-202', name:'Aljabar Linear', hadir:14, izin:1, sakit:0, alpha:0, total:15 },
    { code:'MK-202', name:'Pancasila', hadir:10, izin:0, sakit:0, alpha:0, total:10 },
  ];

  // Recent attendance log (student) — most recent first
  const ATTENDANCE_LOG = [
    { date:'2026-07-18', code:'IF-208', name:'Pemrograman Web', status:'hadir', time:'08:02' },
    { date:'2026-07-18', code:'IF-204', name:'Basis Data', status:'hadir', time:'10:05' },
    { date:'2026-07-17', code:'IF-201', name:'Struktur Data', status:'hadir', time:'08:00' },
    { date:'2026-07-17', code:'IF-210', name:'Sistem Operasi', status:'izin', time:'—' },
    { date:'2026-07-16', code:'IF-202', name:'Aljabar Linear', status:'hadir', time:'08:03' },
    { date:'2026-07-16', code:'IF-208', name:'Pemrograman Web', status:'hadir', time:'10:00' },
    { date:'2026-07-15', code:'IF-204', name:'Basis Data', status:'alpha', time:'—' },
    { date:'2026-07-15', code:'IF-201', name:'Struktur Data', status:'sakit', time:'—' },
  ];

  // Grades by semester (student)
  const GRADES = {
    '2024/2025 Ganjil': [
      { code:'IF-101', name:'Pengantar Pemrograman', sks:4, nilai:'A', angka:4.0 },
      { code:'MK-101', name:'Agama', sks:2, nilai:'A', angka:4.0 },
      { code:'IF-102', name:'Kalkulus I', sks:3, nilai:'B+', angka:3.5 },
      { code:'IF-103', name:'Logika Informatika', sks:3, nilai:'A', angka:4.0 },
      { code:'UM-101', name:'Bahasa Indonesia', sks:2, nilai:'A-', angka:3.7 },
    ],
    '2024/2025 Genap': [
      { code:'IF-201', name:'Struktur Data', sks:4, nilai:'A', angka:4.0 },
      { code:'IF-204', name:'Basis Data', sks:3, nilai:'A-', angka:3.7 },
      { code:'IF-208', name:'Pemrograman Web', sks:4, nilai:'A', angka:4.0 },
      { code:'IF-202', name:'Aljabar Linear', sks:3, nilai:'B+', angka:3.5 },
      { code:'IF-210', name:'Sistem Operasi', sks:3, nilai:'B', angka:3.0 },
      { code:'MK-202', name:'Pancasila', sks:2, nilai:'A', angka:4.0 },
    ],
  };

  // Announcements
  const ANNOUNCEMENTS = [
    { id:1, title:'Ujian Tengah Semester Ganjil 2026/2027', body:'Jadwal UTS sudah dirilis. Silakan unduh di menu Jadwal. Periksa ruang ujian H-1.', date:'2026-07-19', priority:'high', author:'Bagian Akademik', pinned:true },
    { id:2, title:'Libur Idul Adha 1447 H', body:'Kampus libur tanggal 6-7 Juni 2026. Perkuliahan diganti pada Sabtu, 13 Juni.', date:'2026-06-01', priority:'normal', author:'Rektorat' },
    { id:3, title:'Pendaftaran KP / Magang', body:'Mahasiswa semester 6 dapat mengajukan Kerja Praktik. Deadline: 15 Agustus 2026.', date:'2026-07-10', priority:'normal', author:'Koordinator KP' },
    { id:4, title:'Workshop CV & Karir oleh Alumni', body:' Gratis, terbuka untuk umum. Daftar via SIA. Sabtu, 26 Juli 2026, 09:00, Aula FT.', date:'2026-07-18', priority:'normal', author:'Career Center' },
    { id:5, title:'Pembayaran SPP Semester Ganjil', body:'Batas akhir pembayaran SPP: 10 Agustus 2026. Keterlambatan dikenakan denda.', date:'2026-07-05', priority:'high', author:'Keuangan' },
  ];

  // Courses (student — enrolled)
  const COURSES = [
    { code:'IF-201', name:'Struktur Data', sks:4, lecturer:'Budi Santoso', progress:75, nextSession:'Senin 08:00' },
    { code:'IF-204', name:'Basis Data', sks:3, lecturer:'Siti Aminah', progress:80, nextSession:'Senin 10:00' },
    { code:'IF-208', name:'Pemrograman Web', sks:4, lecturer:'Budi Santoso', progress:90, nextSession:'Kamis 08:00' },
    { code:'IF-202', name:'Aljabar Linear', sks:3, lecturer:'Dewi Lestari', progress:70, nextSession:'Jumat 08:00' },
    { code:'IF-210', name:'Sistem Operasi', sks:3, lecturer:'Rudi Hartono', progress:65, nextSession:'Rabu 10:00' },
    { code:'MK-202', name:'Pancasila', sks:2, lecturer:'Ahmad Hidayat', progress:100, nextSession:'Selesai' },
  ];

  // Lecturer: courses they teach, with class roster summary
  const DOSEN_COURSES = [
    { code:'IF-201', name:'Struktur Data', class:'TI-2A', students:42, sessionsDone:14, sessionsTotal:16 },
    { code:'IF-208', name:'Pemrograman Web', class:'TI-3A', students:38, sessionsDone:12, sessionsTotal:16 },
    { code:'IF-308', name:'Rekayasa Perangkat Lunak', class:'TI-4A', students:35, sessionsDone:10, sessionsTotal:16 },
  ];

  // Lecturer: students to advise (PA)
  const BIMBINGAN = [
    { nim:'2024/5312345', name:'Nugraha Nastya', prodi:'Teknik Informatika', semester:4, ipk:3.72, status:'aktif' },
    { nim:'2024/5312346', name:'Bunga Lestari', prodi:'Teknik Informatika', semester:4, ipk:3.85, status:'aktif' },
    { nim:'2024/5312347', name:'Citra Dewi', prodi:'Teknik Informatika', semester:4, ipk:3.40, status:'aktif' },
    { nim:'2023/5312310', name:'Dimas Putra', prodi:'Teknik Informatika', semester:6, ipk:3.55, status:'kp' },
    { nim:'2023/5312311', name:'Eka Putri', prodi:'Teknik Informatika', semester:6, ipk:3.91, status:'aktif' },
  ];

  // Attendance session for lecturer to manage
  const DOSEN_SESSIONS = [
    { id:'s1', code:'IF-201', name:'Struktur Data', class:'TI-2A', date:'2026-07-21', time:'08:00', room:'Ged. Teknik 301', status:'upcoming', attended:0, total:42 },
    { id:'s2', code:'IF-208', name:'Pemrograman Web', class:'TI-3A', date:'2026-07-21', time:'10:00', room:'Lab Komputer 4', status:'upcoming', attended:0, total:38 },
  ];

  /* ----------------------------------------------------------
     AUTH — localStorage-based (demo only, NOT real security)
     ---------------------------------------------------------- */
  function login(email, password, role) {
    const user = USERS[email.toLowerCase()];
    if (!user) return { ok:false, error:'Email tidak terdaftar.' };
    if (user.password !== password) return { ok:false, error:'Kata sandi salah.' };
    if (user.role !== role) return { ok:false, error:`Akun ini terdaftar sebagai ${user.role}. Pilih tab yang sesuai.` };
    const session = { email:user.profile.email, role:user.role, name:user.profile.name, loginAt:Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch(e) {}
    return { ok:true, session };
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      // 8-hour session expiry
      if (Date.now() - s.loginAt > 8 * 3600 * 1000) { logout(); return null; }
      return s;
    } catch(e) { return null; }
  }

  function logout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    window.location.href = '/';
  }

  function getCurrentUser() {
    const s = getSession(); if (!s) return null;
    return USERS[s.email] || null;
  }

  /* ----------------------------------------------------------
     HELPERS
     ---------------------------------------------------------- */
  function fmtDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  }
  function relTime(iso) {
    const d = new Date(iso + 'T00:00:00'); const now = new Date('2026-07-20T00:00:00');
    const diff = Math.round((now - d) / 86400000);
    if (diff === 0) return 'Hari ini';
    if (diff === 1) return 'Kemarin';
    if (diff < 7) return `${diff} hari lalu`;
    return fmtDate(iso);
  }
  function statusBadge(status) {
    const map = { hadir:'badge-success', izin:'badge-info', sakit:'badge-warning', alpha:'badge-danger',
                  aktif:'badge-success', kp:'badge-info', cuti:'badge-warning', upcoming:'badge-brand' };
    const label = { hadir:'Hadir', izin:'Izin', sakit:'Sakit', alpha:'Alpha',
                    aktif:'Aktif', kp:'KP', cuti:'Cuti', upcoming:'Akan datang' };
    return `<span class="badge ${map[status]||'badge-neutral'}">${label[status]||status}</span>`;
  }
  function attRate(row) {
    return Math.round((row.hadir / row.total) * 100);
  }
  function attColor(rate) {
    if (rate >= 85) return 'var(--brand-500)';
    if (rate >= 75) return 'var(--warning)';
    return 'var(--danger)';
  }

  /* Expose as global */
  window.Kampusin = {
    icons, login, logout, getSession, getCurrentUser,
    // data
    SCHEDULE, ATTENDANCE_SUMMARY, ATTENDANCE_LOG, GRADES, ANNOUNCEMENTS, COURSES,
    DOSEN_COURSES, BIMBINGAN, DOSEN_SESSIONS, DAYS,
    // helpers
    fmtDate, relTime, statusBadge, attRate, attColor,
  };

})(window);
