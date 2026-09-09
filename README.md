# Frutiger Aero Studio OS (tomoeOS)

Portofolio interaktif **Restu Utomo** — replika desktop Windows 7 / Frutiger Aero yang berjalan penuh di browser.

## Tech stack

- Vite 8 + vanilla TypeScript + Tailwind CSS v4 + GSAP
- Tanpa framework, tanpa backend, tanpa database

## Cara jalan lokal

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & preview

```bash
npm run build      # output ke dist/
npm run preview    # serve hasil build lokal
```

## Deploy ke Vercel

Proyek ini Vite static SPA. Konfigurasi sudah di `vercel.json` (build `npm run build`, output `dist`).

- **Via Vercel Dashboard**: Import repo GitHub → auto-detect Vite → Deploy.
- **Via CLI**: `npm i -g vercel` lalu `vercel` di folder ini.

Tidak ada env variables / secrets.

## Struktur

```
index.html        # semua markup OS (window, pane, gadget)
src/main.ts       # window manager, boot/logon, explorer, dialog, sound, dino
src/games.ts      # Minesweeper, Tetris, Purble Pairs, Solitaire
src/style.css     # design system Aero (gelas, titlebar, taskbar, dst.)
public/images/    # wallpaper, foto, library poster (webp)
public/icons/     # ikon Win7 + SVG
public/Restu_Utomo_CV.pdf
```

## Menghubungkan video YouTube

Video di **Tomoe Player** diambil dari YouTube unlisted (embed, tidak self-host).
ID-nya ada di `index.html` di dalam `pane-videos` (`onclick="openVideo('ID')"`).
Untuk ganti video, cukup ganti ID 11-karakter tersebut (dari URL `youtube.com/watch?v=XXXX`).

## Catatan IP

Ikon Windows 7 di `public/icons/*.webp` diambil dari situs referensi atas instruksi pemilik proyek. SVG tambahan dari Iconify (open license). Wallpaper & foto adalah milik Restu Utomo.