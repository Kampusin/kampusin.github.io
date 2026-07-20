-- ============================================================
-- Kampusin — Supabase Schema
-- Developed by Nugraha Nastya · Yogyakarta
-- ------------------------------------------------------------
-- Cara pakai:
--   1. Buka dashboard Supabase → SQL Editor → New query
--   2. Paste SEMUA isi file ini
--   3. Klik Run (tunggu sampai "Success. No rows returned")
--   4. Cek Table Editor — semua tabel + data demo akan muncul
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
do $$ begin
  create type user_role as enum ('mahasiswa', 'dosen', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_status as enum ('hadir', 'izin', 'sakit', 'alpha');
exception when duplicate_object then null; end $$;

do $$ begin
  create type announce_priority as enum ('normal', 'high');
exception when duplicate_object then null; end $$;

do $$ begin
  create type advisee_status as enum ('aktif', 'kp', 'cuti', 'lulus');
exception when duplicate_object then null; end $$;

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (1:1 dengan auth.users, berisi data akademik)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role user_role not null default 'mahasiswa',
  full_name text not null,
  avatar_initials text generated always as (
    substring(upper(split_part(full_name, ' ', 1)) for 1) ||
    coalesce(substring(upper(split_part(full_name, ' ', 2)) for 1), '')
  ) stored,
  -- Mahasiswa fields
  nim text unique,
  prodi text,
  fakultas text,
  angkatan int,
  semester int,
  dosen_pa_id uuid references public.profiles(id),
  ipk numeric(3,2) default 0.00,
  sks_lulus int default 0,
  -- Dosen fields
  nidn text unique,
  jabatan text,
  created_at timestamptz not null default now()
);

-- Courses (mata kuliah)
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sks int not null check (sks > 0 and sks <= 6),
  prodi text,
  lecturer_id uuid references public.profiles(id),
  semester int,
  created_at timestamptz not null default now()
);

-- Enrollments (mahasiswa ↔ mata kuliah)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- Schedule (sesi perkuliahan berulang mingguan)
create table if not exists public.schedule (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  day_of_week int not null check (day_of_week between 1 and 7), -- 1=Senin ... 7=Minggu
  start_time time not null,
  end_time time not null,
  room text,
  class_group text, -- untuk dosen: TI-2A, dll
  created_at timestamptz not null default now()
);

-- Attendance sessions (sesi absensi yang dibuka dosen)
create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  session_date date not null,
  opened_by uuid not null references public.profiles(id),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  room text,
  status text not null default 'open' check (status in ('open','closed'))
);

-- Attendance records (record kehadiran per mahasiswa per sesi)
create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status attendance_status not null,
  checked_in_at timestamptz,
  note text,
  recorded_by uuid references public.profiles(id),
  unique (session_id, student_id)
);

-- Grades (nilai per mata kuliah per semester)
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  semester_label text not null, -- '2024/2025 Ganjil'
  letter text not null, -- 'A','A-','B+',...
  numeric_grade numeric(3,2) not null check (numeric_grade between 0 and 4),
  sks int not null,
  created_at timestamptz not null default now(),
  unique (student_id, course_id, semester_label)
);

-- Announcements (pengumuman)
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author text,
  author_id uuid references public.profiles(id),
  priority announce_priority not null default 'normal',
  pinned boolean not null default false,
  published_at timestamptz not null default now()
);

-- ============================================================
-- AUTO-CREATE PROFILE SAAT USER SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'mahasiswa')::user_role,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles            enable row level security;
alter table public.courses             enable row level security;
alter table public.enrollments         enable row level security;
alter table public.schedule            enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records  enable row level security;
alter table public.grades              enable row level security;
alter table public.announcements       enable row level security;

-- Helper: apakah user saat ini dosen/admin
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('dosen', 'admin')
  );
$$;

-- Helper: apakah user saat ini mahasiswa
create or replace function public.is_student()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'mahasiswa'
  );
$$;

-- ---------- PROFILES ----------
-- Setiap user bisa lihat profil sendiri
-- Mahasiswa bisa lihat profil dosen (untuk info PA)
-- Dosen bisa lihat semua profil
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (
    id = auth.uid() or public.is_staff() or
    (public.is_student() and role = 'dosen')
  );

-- User hanya bisa update profil sendiri (terbatas)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Hanya admin (service role) yang bisa insert profil lewat SQL
-- (signup lewat auth.users akan trigger handle_new_user, tanpa lewat RLS profiles)

-- ---------- COURSES ----------
-- Mahasiswa hanya lihat mata kuliah yang dia enroll
-- Dosen lihat mata kuliah yang dia ampu
drop policy if exists "courses_select" on public.courses;
create policy "courses_select" on public.courses
  for select using (
    public.is_staff() or
    lecturer_id = auth.uid() or
    exists (
      select 1 from public.enrollments e
      where e.course_id = courses.id and e.student_id = auth.uid()
    )
  );

-- Hanya dosen/admin yang bisa insert/update courses
drop policy if exists "courses_modify_staff" on public.courses;
create policy "courses_modify_staff" on public.courses
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- ENROLLMENTS ----------
-- Mahasiswa lihat enrollment sendiri, dosen lihat enrollment di kelasnya
drop policy if exists "enrollments_select" on public.enrollments;
create policy "enrollments_select" on public.enrollments
  for select using (
    student_id = auth.uid() or public.is_staff()
  );

drop policy if exists "enrollments_modify_staff" on public.enrollments;
create policy "enrollments_modify_staff" on public.enrollments
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- SCHEDULE ----------
-- Mahasiswa lihat jadwal matkul yang dia enroll, dosen lihat jadwal kelasnya
drop policy if exists "schedule_select" on public.schedule;
create policy "schedule_select" on public.schedule
  for select using (
    public.is_staff() or
    exists (
      select 1 from public.courses c
      where c.id = schedule.course_id and c.lecturer_id = auth.uid()
    ) or
    exists (
      select 1 from public.enrollments e
      where e.course_id = schedule.course_id and e.student_id = auth.uid()
    )
  );

drop policy if exists "schedule_modify_staff" on public.schedule;
create policy "schedule_modify_staff" on public.schedule
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- ATTENDANCE SESSIONS ----------
drop policy if exists "att_sessions_select" on public.attendance_sessions;
create policy "att_sessions_select" on public.attendance_sessions
  for select using (
    public.is_staff() or
    exists (
      select 1 from public.enrollments e
      join public.courses c on c.id = e.course_id
      where c.id = attendance_sessions.course_id and e.student_id = auth.uid()
    )
  );

-- Dosen hanya bisa kelola sesi di kelas yang dia ampu
drop policy if exists "att_sessions_modify" on public.attendance_sessions;
create policy "att_sessions_modify" on public.attendance_sessions
  for all using (
    public.is_staff() and exists (
      select 1 from public.courses c
      where c.id = attendance_sessions.course_id and c.lecturer_id = auth.uid()
    )
  ) with check (
    public.is_staff() and opened_by = auth.uid()
  );

-- ---------- ATTENDANCE RECORDS ----------
-- Mahasiswa lihat record sendiri, dosen lihat record di kelasnya
drop policy if exists "att_records_select" on public.attendance_records;
create policy "att_records_select" on public.attendance_records
  for select using (
    student_id = auth.uid() or public.is_staff()
  );

-- Mahasiswa bisa create record sendiri (check-in), dosen bisa input manual
drop policy if exists "att_records_insert" on public.attendance_records;
create policy "att_records_insert" on public.attendance_records
  for insert with check (
    student_id = auth.uid() or public.is_staff()
  );

-- Update hanya dosen
drop policy if exists "att_records_update_staff" on public.attendance_records;
create policy "att_records_update_staff" on public.attendance_records
  for update using (public.is_staff());

-- ---------- GRADES ----------
-- Mahasiswa hanya lihat nilai sendiri
drop policy if exists "grades_select" on public.grades;
create policy "grades_select" on public.grades
  for select using (student_id = auth.uid() or public.is_staff());

-- Input/ubah nilai hanya dosen/admin
drop policy if exists "grades_modify_staff" on public.grades;
create policy "grades_modify_staff" on public.grades
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- ANNOUNCEMENTS ----------
-- Semua user terotentikasi bisa lihat
drop policy if exists "announcements_select" on public.announcements;
create policy "announcements_select" on public.announcements
  for select using (true);

-- Cuma staff yang bikin/edit pengumuman
drop policy if exists "announcements_modify_staff" on public.announcements;
create policy "announcements_modify_staff" on public.announcements
  for all using (public.is_staff()) with check (public.is_staff());

-- ============================================================
-- SEED DATA — akun demo (BACA PETUNJUK DI BAWAH)
-- ============================================================
-- ⚠️ PENTING: Sebelum menjalankan bagian ini, Anda harus daftarkan
--    2 user demo lewat Supabase Dashboard → Authentication → Users →
--    Add user, dengan email:
--      - andi.pratama@kampusin.ac.id  (password: mhs123)
--      - budi.santoso@kampusin.ac.id  (password: dosen123)
--    Setelah itu, jalankan SQL di bawah untuk melengkapi profil mereka.
--    Kalau belum daftar, skip bagian ini dulu.
-- ============================================================

-- Update profile untuk user demo (asumsikan sudah signup)
-- Catatan: jalankan SETELAH kedua user demo signup di Supabase Auth
update public.profiles set
  role = 'mahasiswa', full_name = 'Andi Pratama',
  nim = '2024/5312345', prodi = 'Teknik Informatika',
  fakultas = 'Fakultas Teknik', angkatan = 2024, semester = 4,
  ipk = 3.72, sks_lulus = 84
where email = 'andi.pratama@kampusin.ac.id';

update public.profiles set
  role = 'dosen', full_name = 'Dr. Budi Santoso, M.Kom',
  nidn = '0023118501', jabatan = 'Lektor Kepala',
  prodi = 'Teknik Informatika', fakultas = 'Fakultas Teknik'
where email = 'budi.santoso@kampusin.ac.id';

-- Set PA (Andi dibimbing Budi)
update public.profiles set dosen_pa_id = (
  select id from public.profiles where email = 'budi.santoso@kampusin.ac.id'
) where email = 'andi.pratama@kampusin.ac.id';

-- ============================================================
-- SEED: Mata kuliah (jalan dengan / tanpa user demo — lewat anon)
-- ============================================================
-- Catatan: tabel courses punya RLS "select" tanpa insert untuk anon,
-- jadi jalankan seed ini dengan "Run as: postgres" di SQL editor
-- (atau langsung lewat service role / dashboard Table Editor)

insert into public.courses (code, name, sks, prodi, semester) values
  ('IF-201', 'Struktur Data', 4, 'Teknik Informatika', 4),
  ('IF-204', 'Basis Data', 3, 'Teknik Informatika', 4),
  ('IF-208', 'Pemrograman Web', 4, 'Teknik Informatika', 4),
  ('IF-202', 'Aljabar Linear', 3, 'Teknik Informatika', 4),
  ('IF-210', 'Sistem Operasi', 3, 'Teknik Informatika', 4),
  ('MK-202', 'Pancasila', 2, 'Umum', 4),
  ('IF-308', 'Rekayasa Perangkat Lunak', 3, 'Teknik Informatika', 6)
on conflict (code) do nothing;

-- Assign dosen (Budi) ke 3 matkul
update public.courses set lecturer_id = (
  select id from public.profiles where email = 'budi.santoso@kampusin.ac.id'
) where code in ('IF-201','IF-208','IF-308');

-- Pengumuman contoh
insert into public.announcements (title, body, author, priority, pinned) values
  ('Ujian Tengah Semester Ganjil 2026/2027', 'Jadwal UTS sudah dirilis. Silakan unduh di menu Jadwal. Periksa ruang ujian H-1.', 'Bagian Akademik', 'high', true),
  ('Libur Idul Adha 1447 H', 'Kampus libur tanggal 6-7 Juni 2026. Perkuliahan diganti pada Sabtu, 13 Juni.', 'Rektorat', 'normal', false),
  ('Pendaftaran KP / Magang', 'Mahasiswa semester 6 dapat mengajukan Kerja Praktik. Deadline: 15 Agustus 2026.', 'Koordinator KP', 'normal', false),
  ('Workshop CV & Karir oleh Alumni', 'Gratis, terbuka untuk umum. Daftar via SIA. Sabtu, 26 Juli 2026, 09:00, Aula FT.', 'Career Center', 'normal', false),
  ('Pembayaran SPP Semester Ganjil', 'Batas akhir pembayaran SPP: 10 Agustus 2026. Keterlambatan dikenakan denda.', 'Keuangan', 'high', false)
on conflict do nothing;

-- Done. Cek Table Editor untuk verifikasi.
