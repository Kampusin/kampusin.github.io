# Kampusin — Sistem Informasi Akademik

Portal akademik responsif untuk mahasiswa & dosen. Dibangun dengan vanilla
HTML/CSS/JS — tanpa framework, tanpa build step, langsung jalan di GitHub Pages.

## Fitur

- **Login adaptif** — mahasiswa & dosen, UI berbeda di desktop vs mobile
- **Dashboard mahasiswa**: ringkasan IPK, kehadiran, SKS, jadwal hari ini
- **Dashboard dosen**: mata kuliah ampu, sesi absensi, mahasiswa bimbingan PA
- **Jadwal kuliah/mengajar** — dikelompokkan per hari
- **Absensi** — rekap per mata kuliah + riwayat real-time (mahasiswa), buka/tutup sesi (dosen)
- **Nilai** — riwayat per semester, IPS otomatis, unduh KHS
- **Mata kuliah**, **pengumuman**, **profil akademik**
- **Responsif penuh**: sidebar di desktop, bottom-nav di mobile, auto-deteksi
- **Aksesibilitas**: kontras AA, keyboard-nav, reduced-motion, focus-visible
- **PWA**: installable, maskable icon, offline shell-ready

## Teknologi

- HTML5 + CSS3 custom properties (design tokens)
- Vanilla JavaScript (SPA hash-router, ~600 baris)
- Plus Jakarta Sans (Google Fonts)
- Logo & ikon: SVG inline kustom — **tanpa emoji**
- Zero dependency, zero build

## Akun demo

| Role      | Email                            | Password  |
|-----------|----------------------------------|-----------|
| Mahasiswa | `andi.pratama@kampusin.ac.id`    | `mhs123`  |
| Dosen     | `budi.santoso@kampusin.ac.id`    | `dosen123` |

## Struktur

```
├── index.html          # Halaman login
├── dashboard.html      # SPA shell (semua view)
├── 404.html            # Halaman tidak ditemukan
├── assets/
│   ├── css/styles.css  # Design system + responsif
│   ├── js/app.js       # Data, auth, router, renderer
│   └── img/logo.svg    # Brand mark
├── favicon.svg
├── manifest.json       # PWA
├── robots.txt
└── sitemap.xml
```

## Live

https://kampusin.github.io/

---

**Developed by Nugraha Nastya · Yogyakarta · 2026**

Data pada situs demo adalah mock — bukan data mahasiswa nyata. Untuk produksi,
ganti `assets/js/app.js` dengan integrasi backend asli.
