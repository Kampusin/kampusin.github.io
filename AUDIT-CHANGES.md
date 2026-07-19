# Ringkasan Audit & Perubahan — kampusin.github.io

**Tanggal:** 2026-07-20
**Repo:** `kampusin.github.io` (output build Next.js, deploy ke GitHub Pages)

---

## ⚠️ Sebelum commit — WAJIB

1. **Revoke token GitHub** yang tadi di-share di chat:
   https://github.com/settings/tokens → cari token `github_pat_11CFTIAZY0...` → **Revoke**
2. **Generate og-image.png** dari `og-image.html` (lihat bagian bawah).

---

## Yang sudah dikerjakan (10 item)

### 🔴 Prioritas tinggi

| # | Item | File | Status |
|---|------|------|--------|
| 1 | Title lebih kaya SEO ("Kampusin — Jadwal Kuliah, Absensi & Nilai Online") | `index.html` | ✅ |
| 2 | OG image + twitter:image meta untuk preview WhatsApp/Twitter | `index.html`, `404.html` | ✅ (butuh file png) |

### 🟡 Prioritas menengah

| # | Item | File | Status |
|---|------|------|--------|
| 3 | Hapus `<meta name="keywords">` (mati sejak ~2009) | `index.html`, `404.html` | ✅ |
| 4 | Security headers via `<meta http-equiv>`: CSP, nosniff, referrer-policy | `index.html`, `404.html` | ✅ |
| 5 | PWA manifest + apple-touch-icon + mobile-web-app meta | `manifest.json` (baru), `index.html`, `404.html` | ✅ (butuh icon png) |
| 6 | `sitemap.xml` baru | `sitemap.xml` (baru) | ✅ |

### 🟢 Prioritas rendah

| # | Item | File | Status |
|---|------|------|--------|
| 7 | `robots.txt` tambah sitemap reference | `robots.txt` | ✅ |
| 8 | Title & metadata 404.html dirapikan | `404.html` | ✅ |

---

## Yang TIDAK bisa dikerjakan dari repo ini (perlu source code asli)

Repo `kampusin.github.io` hanya berisi **output build** Next.js (HTML/CSS/JS yang
sudah di-minify). Untuk pekerjaan berikut, butuh **repo source code asli** (yang
berisi `app/`, `package.json`, `next.config.js`, dst.):

- 🔒 Audit security kode React (apakah ada token/secret bocor di bundle?)
- 🧩 Refactor komponen, perbaiki state management Zustand
- ♿ Audit aksesibilitas nyata (HTML yang di-render)
- 📦 Dependency audit (`npm audit` untuk CVE)
- 🎨 Perbaiki kontras warna `#10b981` di komponen Tailwind
- 🚀 Performance: dynamic import untuk chart/kalender/PDF library

**Saran:** tambahkan repo source code ke org `kampusin` (bisa private), lalu
set CI (GitHub Actions) untuk `next build` + push output ke repo ini otomatis.
Sekarang prosesnya manual — rawan drift antara source dan deploy.

---

## Yang masih perlu Anda lakukan manual

### A. Generate `og-image.png` (wajib supaya OG meta jalan)

1. Buka `og-image.html` di Chrome/Edge.
2. Tekan `F12` → `Ctrl+Shift+P` → ketik "Capture full size screenshot" → enter.
3. Simpan hasilnya sebagai `og-image.png` di root repo ini (ukuran harus 1200×630).

### B. Generate icon PWA (wajib supaya manifest jalan)

1. Buka https://realfavicongenerator.net → upload `logo.svg`.
2. Atur "App name" = `Kampusin`.
3. Generate → download zip → extract file berikut ke root repo:
   - `icon-192.png`
   - `icon-512.png`
   - `icon-192-maskable.png` (atur "Maskable" di generator)
   - `icon-512-maskable.png`

### C. Cek CSP di dev sebelum push

Content-Security-Policy yang saya pasang cukup ketat. **Sebelum push**, buka
situs lokal atau preview, lalu cek **DevTools → Console**. Kalau ada error
`Refused to load ...`, berarti ada sumber yang perlu ditambahkan ke CSP. Kirim
saya screenshot error-nya, saya sesuaikan.

---

## Cara commit & push (dari cmd laptop Anda)

```cmd
cd C:\Users\acer\ZCodeProject\kampusin.github.io

:: cek apa yang berubah
"C:\Program Files\Git\cmd\git.exe" status

:: tambah semua perubahan
"C:\Program Files\Git\cmd\git.exe" add .

:: commit
"C:\Program Files\Git\cmd\git.exe" commit -m "audit: SEO, OG image, PWA, security headers, sitemap"

:: push ke GitHub Pages (butuh login GitHub pertama kali)
"C:\Program Files\Git\cmd\git.exe" push
```

**Catatan push:** Saat `git push`, Git akan minta login. **Jangan paste token
yang tadi bocor** (sudah harus di-revoke). Pakai salah satu:
- **HTTPS + PAT baru** (buat di github.com/settings/tokens, scope `repo`),
  saat prompt username masukkan username GitHub, saat password tempel PAT baru.
- **SSH** (lebih praktis jangka panjang) — setup sekali di
  https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Setelah deploy (1-2 menit setelah push), verifikasi

| Tes | URL |
|-----|-----|
| OG preview | https://www.opengraph.xyz/url/https%3A%2F%2Fkampusin.github.io |
| Security headers | https://securityheaders.com/?q=kampusin.github.io |
| PWA report | https://www.pwabuilder.com/reportcard?site=https://kampusin.github.io |
| SEO/Lighthouse | Chrome DevTools → Lighthouse → Generate report |

Target: Lighthouse SEO ≥ 95, Security headers grade A atau B.

---

## Kontras warna — masih perlu perbaikan di source code

`#10b981` (emerald) sebagai background dengan teks putih: rasio **2.59:1** →
**GAGAL** WCAG AA (minimum 4.5:1 untuk teks normal). Untuk fix di source code:
- Gunakan `#047857` (emerald-700) untuk background dengan teks putih → ~5.9:1 ✅
- Atau pakai emerald sebagai accent, bukan background text.
- Tes: https://webaim.org/resources/contrastchecker/

Ini harus dikerjakan di source code Next.js (file Tailwind/CSS), bukan di repo
build output ini.
