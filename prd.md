# PRD — Frutiger Aero Studio OS (tomoeOS)

> Portofolio personal **Restu Utomo** yang dikemas sebagai replika desktop Windows 7 / Frutiger Aero, berjalan murni di browser.

## Tujuan

Memamerkan hasil kerja produksi video, desain promosi, dan distribusi media sosial dengan cara yang menonjol (sebuah "OS" interaktif), sekaligus menjadi bukti kemampuan front-end.

## Value proposition (satu kalimat)

Kami membantu **klien institusional (perpustakaan, fakultas, LSM, acara kampus)** untuk **menemukan portofolio video & distribusi Restu Utomo** tanpa **dokumen CV yang kaku** — semuanya terasa seperti menjelajah desktop Windows 7.

## ICP (Ideal Customer Profile)

- Tim marketing / humas institusi pendidikan (perpustakaan, prodi, universitas)
- NGO / lembaga kemanusiaan yang butuh video edukatif (contoh: RedR)
- Panitia acara / konferensi yang butuh media & dokumentasi

## Pengguna

- Calon klien & partner institusional (utama)
- Perekrut / HR untuk posisi multimedia & konten

## Halaman / "Window" (bukan halaman web, tapi window OS)

- **Boot → Logon** (Administrator / Welcome / Login)
- **Desktop** (ikon: Files, Resume.pdf, Welcome.txt, Videos, Pictures, Recycle Bin)
- **Restu Explorer** — pane: About, Services (What You Get), Clients & Proof, FAQ, Contact, + Libraries (Videos, Documents, Pictures)
- **Tomoe Player** — player YouTube embed (fallback dino game saat offline)
- **Notepad** (Welcome.txt, editable + save ke localStorage)
- **Calculator**
- **Games** — Minesweeper, Tetris, Purble Pairs, Solitaire
- **Photo Viewer** — preview gambar (prev/next)
- **Recycle Bin**
- **Gadgets** — jam (+stopwatch), cuaca statis
- **Start Menu** — search berfungsi, All Programs, Shut down (konfirmasi)

## Fitur inti

- Window manager penuh: drag, resize, snap (kiri/kanan/atas), minimize/restore, z-order, taskbar dinamis (muncul saat buka, hilang saat close)
- Aero Peek (pratinjau thumbnail saat hover taskbar)
- Boot screen + logon + shutdown dengan progress bar (melacak load aset nyata)
- Sound efek (WebAudio, tanpa file) untuk buka/tutup/minimize
- Video dari YouTube unlisted (embed, tidak self-host → repo ringan)

## Batas scope (NON-GOALS)

- Tidak ada login/auth sungguhan (logon hanya visual)
- Tidak ada backend / database
- Tidak ada blog / CMS
- Tidak ada error-tracking eksternal (Sentry dkk.)
- Tidak ada browser sungguhan dalam OS (iframe terbatas)
- Tidak ada Paint/Snipping/Control Panel fungsional

## Target deploy

- Vercel (static SPA, Vite)
- Wallpaper & foto milik sendiri; ikon Win7 diambil dari referensi (catatan IP di README.md)