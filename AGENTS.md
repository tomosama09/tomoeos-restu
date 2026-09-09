# AGENTS.md — aturan kerja proyek tomoeOS

Baca `prd.md` dan `README.md` sebelum mengubah apa pun.

## Stack (terkunci)

Vite 8 + vanilla TypeScript + Tailwind CSS v4 + GSAP. Jangan ganti framework. Tidak ada backend/database.

## Struktur & tanggung jawab

- `index.html` — semua markup OS (window, pane, gadget). Satu file untuk seluruh UI, sesuai pola asli.
- `src/main.ts` — seluruh logika OS (window manager, boot, dialog, sound, dino, dsb.).
- `src/games.ts` — game. Jangan campur logika game ke main.ts.
- `src/style.css` — design system Aero. Token `.aero-*`, `.game-*`, `.calc-*`.

## Aturan mutlak (non-nego)

1. **Jangan ubah copywriting** — teks portofolio sudah final (storytelling, bahasa Inggris, tanpa em dash `—`).
2. **Jangan ganti wallpaper** (`public/images/wallpaper.webp`) dan **jangan tambah LinkedIn** (Instagram `@tomoe09` saja yang dipakai).
3. **Jangan tambah backend / auth / database** (lihat PRD non-goals).
4. **Jangan tambah dependensi** tanpa alasan teknis nyata.
5. **Jangan sisakan dead code / file tak terpakai / console.log**.
6. **Format penulisan UI** — pertahankan pola inline Tailwind + gaya glassmorphism Aero yang sudah ada.

## Cara test

```bash
npm run build    # wajib lolos (typecheck + vite build)
```

Verifikasi interaksi/UI pakai Playwright (server dev `npm run dev`, lalu cek via browser/headless).

## Konvensi

- Nama window: `id="win-<nama>"`, meta taskbar di `APP_META` di `main.ts`.
- Pane explorer: `id="pane-<nama>"`, didaftarkan di `openExplorerNav` metadata map.
- Ikon: taruh di `public/icons/`, referensikan path mutlak `/icons/...`.