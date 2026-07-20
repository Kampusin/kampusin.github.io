# Setup Backend Supabase — Kampusin

Web Anda sekarang punya **backend nyata** (Supabase). Tapi backend ini perlu
**diisi skema database** dulu sebelum bisa dipakai. Setelah itu, login akan
cek ke Supabase (bukan data mock lagi).

Total waktu setup: **~10 menit**.

---

## Langkah 1 — Jalankan skema database (2 menit)

1. Buka https://supabase.com → login → klik project Anda (`ohviyawkiwacafwodbbr`)
2. Klik **SQL Editor** di sidebar kiri → **New query**
3. Buka file `supabase/schema.sql` dari repo ini (atau copy dari laptop Anda)
4. **Paste semua isinya** ke editor
5. Klik tombol **Run** (hijau, kanan bawah)
6. Tunggu sampai muncul `Success. No rows returned`

✅ Setelah ini, semua tabel + keamanan (RLS) + pengumuman contoh sudah jadi.
Cek di **Table Editor** → harus ada 8 tabel (profiles, courses, enrollments,
schedule, attendance_sessions, attendance_records, grades, announcements).

---

## Langkah 2 — Daftarkan 2 user demo (3 menit)

Web Anda sudah jalan pakai **data mock** selama backend belum disetup.
Setelah langkah 1 selesai, sebaiknya pakai **login Supabase asli**. Untuk itu,
daftarkan 2 user demo:

1. Di dashboard Supabase → **Authentication** → **Users** → **Add user**
2. Tambah user pertama:
   - Email: `nugraha.nastya@kampusin.ac.id`
   - Password: `mhs123`
   - Auto Confirm User: **✅ centang**
   - Klik **Create user**
3. Tambah user kedua:
   - Email: `budi.santoso@kampusin.ac.id`
   - Password: `dosen123`
   - Auto Confirm User: **✅ centang**
   - Klik **Create user**

4. Kembali ke **SQL Editor → New query**, paste bagian `UPDATE profiles` dari
   `schema.sql` (bagian "SEED DATA — akun demo"), **Run**.

   Ini untuk melengkapi profil mahasiswa & dosen (nim, prodi, IPK, dll).

---

## Langkah 3 — Test di web (1 menit)

1. Buka https://kampusin.github.io/
2. Buka **DevTools (F12) → Console** — harus muncul:
   ```
   [Kampusin] Mode backend: Supabase aktif.
   ```
3. Login pakai akun demo:
   - Mahasiswa: `nugraha.nastya@kampusin.ac.id` / `mhs123`
   - Dosen: `budi.santoso@kampusin.ac.id` / `dosen123`
4. Kalau berhasil masuk → backend jalan. 🎉

Kalau muncul `[Kampusin] Mode backend: Supabase belum disetup` → ulangi Langkah 1.

---

## Cara kerjanya (singkat)

```
Browser Anda (kampusin.github.io)
    │
    │ HTTPS request (fetch) + Authorization: Bearer <JWT>
    ▼
Supabase REST API (ohviyawkiwacafwodbbr.supabase.co)
    │
    │ Cek Row Level Security (RLS) — siapa user? boleh lihat apa?
    ▼
PostgreSQL Database (tabel profiles, courses, grades, ...)
```

**Keamanan:** anon key yang ada di frontend boleh public (itu desain Supabase).
Yang melindungi data adalah **RLS policy** — mahasiswa hanya bisa lihat data
dirinya sendiri, dosen hanya lihat kelas yang dia ampu.

---

## Yang bisa Anda lakukan setelah setup

### Kelola data lewat dashboard (tanpa coding)
- **Table Editor** → tambah/edit/hapus mahasiswa, matkul, nilai, pengumuman
- **Authentication → Users** → tambah user baru (mahasiswa/dosen)
- **SQL Editor** → query kompleks, report

### Tambah mahasiswa baru
1. **Authentication → Add user** (email + password)
2. Trigger otomatis bikin profil kosong
3. **Table Editor → profiles** → lengkapi NIM, prodi, semester, dll

### Input nilai
**Table Editor → grades → Insert row**:
- student_id: pilih mahasiswa
- course_id: pilih matkul
- semester_label: `2024/2025 Genap`
- letter: `A`
- numeric_grade: `4.0`
- sks: `3`

### Buka sesi absensi
Sudah otomatis dari web — dosen klik "Buka absensi" di dashboard.

---

## Troubleshooting

**"Mode backend: belum disetup"**
→ Anda belum Run `schema.sql`. Ulangi Langkah 1.

**Login gagal: "Email atau kata sandi salah"**
→ User demo belum dibuat di Supabase Auth. Ulangi Langkah 2.

**Login sukses tapi data kosong**
→ Profil belum dilengkapi. Run bagian `UPDATE profiles` di schema.sql.

**Error 401 / 403 di console**
→ RLS nge-blok. Pastikan user sudah login (token valid). Cek user_id sesuai
   dengan `auth.uid()`.

**Pengumuman tidak muncul**
→ Belum ada data di tabel announcements. Run ulang bagian SEED announcements
   di schema.sql.

---

## Free tier Supabase (yang Anda dapat)

| Resource | Gratis selamanya |
|----------|------------------|
| Database | 500 MB (cukup untuk ribuan mahasiswa) |
| Auth | 50.000 user aktif / bulan |
| Storage | 1 GB file |
| Bandwidth | 5 GB / bulan |
| API calls | Tidak dibatasi (fair use) |

**Tidak perlu kartu kredit.** Project tidak akan dihapus karena tidak dipakai
(selama Anda login minimal 1x setahun).

---

## Backup data (penting!)

Periodik (sebulan sekali cukup):
1. Dashboard → **Database → Backups** → **Download backup**
2. Simpan file `.sql` di tempat aman

Atau pakai command line:
```cmd
"C:\Program Files\Git\cmd\git.exe" clone https://ohviyawkiwacafwodbbr.supabase.co/rest/v1/ ...
```
(Lebih praktis lewat dashboard.)

---

Developed by Nugraha Nastya · Yogyakarta · 2026
