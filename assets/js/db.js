/* ============================================================
   Kampusin — Data layer
   ------------------------------------------------------------
   Mengambil data dari Supabase (backend nyata).
   Kalau Supabase belum disetup / error, fallback ke mock data
   supaya web tetap bisa di-demo.

   Semua fungsi async (return Promise).
   ============================================================ */
(function(window) {
  'use strict';

  const B = window.KampusinBackend;
  // Mock data dari app.js sebagai fallback demo
  const M = window.Kampusin;

  let _useBackend = null; // null = belum dicek, true/false setelah ping

  // ---------- Cek apakah backend siap ----------
  async function isBackendReady() {
    if (_useBackend !== null) return _useBackend;
    try {
      _useBackend = await B.ping();
    } catch (e) {
      _useBackend = false;
    }
    // Beri tahu konsol (developer experience)
    console.info(_useBackend
      ? '[Kampusin] Mode backend: Supabase aktif.'
      : '[Kampusin] Mode backend: Supabase belum disetup → pakai data mock. Jalankan supabase/schema.sql di SQL Editor.');
    return _useBackend;
  }

  // ---------- AUTH ----------
  async function login(email, password, role) {
    // Coba backend dulu
    try {
      const ready = await isBackendReady();
      if (ready) {
        const session = await B.signInWithEmail(email.toLowerCase(), password);
        // Ambil profil untuk verifikasi role
        const profile = await B.from('profiles').select('*', { id: session.user.id });
        const p = Array.isArray(profile) ? profile[0] : null;
        if (!p) throw new Error('Profil tidak ditemukan.');
        if (p.role !== role) {
          B.signOut();
          return { ok: false, error: `Akun ini terdaftar sebagai ${p.role}. Pilih tab yang sesuai.` };
        }
        // Cache role + buat session mock supaya UI langsung render
        try { localStorage.setItem('kampusin_role', p.role); } catch (e) {}
        try { localStorage.setItem('kampusin_session_v1', JSON.stringify({
          role: p.role, email: p.email, name: p.full_name, loginAt: Date.now()
        })); } catch (e) {}
        return { ok: true, user: p, session };
      }
    } catch (e) {
      // Kalau backend error spesifik (mis. password salah), tampilkan
      if (e.status === 400 || e.status === 401) {
        return { ok: false, error: 'Email atau kata sandi salah.' };
      }
      // error lain → lanjut ke mock fallback
      console.warn('[Kampusin] Backend login error, fallback mock:', e.message);
    }

    // Fallback: mock auth (demo offline)
    return M.login(email, password, role);
  }

  function logout() {
    B.signOut();
    M.logout();
  }

  // ---------- Profile ----------
  async function getMyProfile() {
    if (await isBackendReady()) {
      const token = B.getToken();
      // decode JWT payload untuk dapat user id
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rows = await B.from('profiles').select('*', { id: payload.sub });
      return Array.isArray(rows) ? rows[0] : null;
    }
    return null;
  }

  // ---------- Announcements ----------
  async function getAnnouncements() {
    if (await isBackendReady()) {
      const rows = await B.from('announcements').select('*',
        {},
        { order: { column: 'published_at', ascending: false }, limit: 50 });
      return rows.map(r => ({
        id: r.id,
        title: r.title,
        body: r.body,
        author: r.author,
        date: (r.published_at || '').slice(0, 10),
        priority: r.priority,
        pinned: r.pinned,
      }));
    }
    return M.ANNOUNCEMENTS;
  }

  // ---------- Schedule (mahasiswa) ----------
  async function getStudentSchedule(profile) {
    if (await isBackendReady()) {
      // Ambil enrollment mahasiswa ini, lalu jadwal tiap course
      const enrollments = await B.from('enrollments').select('course_id', { student_id: profile.id });
      if (!enrollments.length) return [];
      const courseIds = enrollments.map(e => e.course_id);
      // Filter jadwal by course_id IN (...) — Supabase pakai header REST
      // Untuk kesederhanaan, ambil semua lalu filter client-side
      const allSchedule = await B.request(B.URL + '/rest/v1/schedule?select=*,courses(*)');
      return allSchedule
        .filter(s => courseIds.includes(s.course_id))
        .map(s => ({
          day: ['','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'][s.day_of_week],
          start: (s.start_time || '').slice(0, 5),
          end: (s.end_time || '').slice(0, 5),
          code: s.courses?.code,
          name: s.courses?.name,
          room: s.room,
          lecturer: '—',
          color: 'brand',
        }));
    }
    return M.SCHEDULE.mahasiswa;
  }

  // ---------- Schedule (dosen) ----------
  async function getLecturerSchedule(profile) {
    if (await isBackendReady()) {
      const allSchedule = await B.request(B.URL + '/rest/v1/schedule?select=*,courses(*)');
      return allSchedule
        .filter(s => s.courses?.lecturer_id === profile.id)
        .map(s => ({
          day: ['','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'][s.day_of_week],
          start: (s.start_time || '').slice(0, 5),
          end: (s.end_time || '').slice(0, 5),
          code: s.courses?.code,
          name: s.courses?.name,
          room: s.room,
          class: s.class_group || '—',
          color: 'brand',
        }));
    }
    return M.SCHEDULE.dosen;
  }

  // ---------- Grades (mahasiswa) ----------
  async function getStudentGrades(profile) {
    if (await isBackendReady()) {
      const rows = await B.from('grades').select('*,courses(*)', { student_id: profile.id });
      // Kelompokkan per semester_label
      const grouped = {};
      rows.forEach(r => {
        const sem = r.semester_label;
        if (!grouped[sem]) grouped[sem] = [];
        grouped[sem].push({
          code: r.courses?.code,
          name: r.courses?.name,
          sks: r.sks,
          nilai: r.letter,
          angka: parseFloat(r.numeric_grade),
        });
      });
      return grouped;
    }
    return M.GRADES;
  }

  // ---------- Courses ----------
  async function getCourses(profile, role) {
    if (await isBackendReady()) {
      if (role === 'dosen') {
        const rows = await B.from('courses').select('*', { lecturer_id: profile.id });
        return rows.map(c => ({
          code: c.code, name: c.name, class: '—',
          students: 0, sessionsDone: 0, sessionsTotal: 16,
        }));
      }
      const enrollments = await B.from('enrollments').select('course_id', { student_id: profile.id });
      if (!enrollments.length) return [];
      const allCourses = await B.request(B.URL + '/rest/v1/courses?select=*,profiles!lecturer_id(full_name)');
      return allCourses
        .filter(c => enrollments.some(e => e.course_id === c.id))
        .map(c => ({
          code: c.code, name: c.name, sks: c.sks,
          lecturer: c.profiles?.full_name || '—',
          progress: 0, nextSession: '—',
        }));
    }
    return role === 'dosen' ? M.DOSEN_COURSES : M.COURSES;
  }

  // ---------- Attendance (mahasiswa) ----------
  async function getStudentAttendance(profile) {
    if (await isBackendReady()) {
      const rows = await B.from('attendance_records').select('*,attendance_sessions(*)', { student_id: profile.id });
      // Ringkas per course
      const summary = {};
      rows.forEach(r => {
        const courseId = r.attendance_sessions?.course_id;
        if (!courseId) return;
        if (!summary[courseId]) summary[courseId] = { hadir:0, izin:0, sakit:0, alpha:0, total:0 };
        summary[courseId][r.status]++;
        summary[courseId].total++;
      });
      // Ambil info course
      const courses = await B.from('courses').select('*');
      return Object.entries(summary).map(([cid, s]) => {
        const c = courses.find(x => x.id === cid);
        return {
          code: c?.code, name: c?.name,
          hadir: s.hadir, izin: s.izin, sakit: s.sakit, alpha: s.alpha, total: s.total,
        };
      });
    }
    return M.ATTENDANCE_SUMMARY;
  }

  // ---------- Attendance sessions (dosen) ----------
  async function getLecturerSessions(profile) {
    if (await isBackendReady()) {
      const courses = await B.from('courses').select('*', { lecturer_id: profile.id });
      if (!courses.length) return [];
      const courseIds = courses.map(c => c.id);
      const allSessions = await B.request(B.URL + '/rest/v1/attendance_sessions?select=*,courses(*),attendance_records(*)');
      return allSessions
        .filter(s => courseIds.includes(s.course_id))
        .map(s => ({
          id: s.id,
          code: s.courses?.code,
          name: s.courses?.name,
          class: s.class_group || '—',
          date: s.session_date,
          time: (s.opened_at || '').slice(11, 16),
          room: s.room,
          status: s.status,
          attended: (s.attendance_records || []).filter(r => r.status === 'hadir').length,
          total: (s.attendance_records || []).length,
        }));
    }
    return M.DOSEN_SESSIONS;
  }

  // ---------- Bimbingan (dosen) ----------
  async function getAdvisees(profile) {
    if (await isBackendReady()) {
      const rows = await B.from('profiles').select('*', { dosen_pa_id: profile.id });
      return rows.map(s => ({
        nim: s.nim, name: s.full_name, prodi: s.prodi,
        semester: s.semester, ipk: parseFloat(s.ipk) || 0,
        status: 'aktif',
      }));
    }
    return M.BIMBINGAN;
  }

  // ---------- Open attendance session (dosen) ----------
  async function openSession(courseCode, classGroup, profile) {
    if (await isBackendReady()) {
      const courses = await B.from('courses').select('*', { code: courseCode });
      const c = courses[0];
      if (!c) throw new Error('Mata kuliah tidak ditemukan.');
      await B.from('attendance_sessions').insert({
        course_id: c.id,
        session_date: new Date().toISOString().slice(0, 10),
        opened_by: profile.id,
        room: '—',
        status: 'open',
      });
      return { ok: true };
    }
    return { ok: true }; // mock
  }

  // ---------- Expose ----------
  window.KampusinDB = {
    isBackendReady, login, logout,
    getMyProfile,
    getAnnouncements,
    getStudentSchedule, getLecturerSchedule,
    getStudentGrades,
    getCourses,
    getStudentAttendance,
    getLecturerSessions,
    getAdvisees,
    openSession,
  };

})(window);
