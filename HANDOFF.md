# HANDOFF — TomoeOS (Frutiger Aero Studio OS)

> Baca dulu, lalu lanjut. Proyek hidup di folder ini. Build terakhir **hijau** (`npm run build` ✓, 0 error).

## Setup

- **Stack:** Vite 8 + vanilla TypeScript + Tailwind CSS v4 + GSAP. Tanpa framework/backend.
- **Run:** `npm run dev` (http://localhost:5173), build: `npm run build`.
- **Dokumen acuan:** `prd.md`, `README.md`, `AGENTS.md`, `brand.md` (aturan mutlak ada di AGENTS.md).

## Struktur file

```
index.html      # seluruh markup OS (window, pane, gadget)
src/main.ts     # window manager, boot/logon, explorer, dialog, sound, dino, cmd, menubar
src/games.ts    # Minesweeper, Tetris, Purble Pairs, Solitaire
src/style.css   # design system Aero (.aero-*, .game-*, .calc-*, .menubar-*)
public/images/  # wallpaper, foto, library poster (webp)
public/icons/   # ikon Win7 + SVG
```

## Fitur yang SUDAH ada (verified)

Booting BIOS → boot progress (track aset nyata) → logon (Administrator/Welcome/Login) → desktop.
Window manager: drag, resize, snap kiri/kanan/atas, minimize/restore, z-order, taskbar dinamis.
- **Window:** explorer (About/Services/Clients/FAQ/Contact + Libraries Videos/Documents/Pictures), Tomoe Player (YouTube embed + dino fallback offline), Notepad (editable+save), Calculator, Games, Photo Viewer, Recycle Bin, Command Prompt.
- **Games:** Minesweeper, Tetris, Purble Pairs, Solitaire.
- **Chrome OS:** Start Menu + search berfungsi, All Programs, jump list (klik kanan taskbar), menu bar File/Edit/View/Help di explorer, clock flyout calendar, Aero Peek, gadget jam(+stopwatch)+cuaca, sticky note, konfirmasi shutdown & close-all, sound WebAudio.

## Yang SEDANG di tengah jalan (task "B" lalu "C")

Task aktif: kelompok **B** (fitur OS), lalu **C** (mobile).

**B — sudah selesai:** BIOS screen, Jump list, Command Prompt, Menu bar File/Edit/View/Help.
**B — belum:** Aero Peek "halus", Sticky Notes multiple, Notepad multi, Control Panel.
**C — belum:** mobile/tablet ≤760px fallback.

### Prioritas lanjutan (disarankan)
Lanjut sisa B lalu C; atau fokus dulu ke **deploy Vercel** (config `vercel.json` sudah siap; belum `git init` — butuh perintah user).

## Aturan non-nego (dari AGENTS.md — jangan dilanggar)

1. Jangan ubah copywriting portfolio (sudah final, storytelling, nda em dash).
2. Jangan ganti wallpaper; jangan tambah LinkedIn (cuma Instagram @tomoe09).
3. Tidak ada backend/auth/database (lihat PRD non-goals).
4. Jangan tambah dependensi tanpa alasan.
5. Jangan sisakan dead code / console.log / file tak terpakai.
6. Setiap perubahan: `npm run build` harus lolos.

## Catatan penting

- Video → YouTube unlisted (embed), ID ada di `index.html` pane-videos (`openVideo('ID')`). Jangan self-host video.
- Ikon Win7 di `public/icons/*.webp` dari referensi (IP note di README).
- Build menghasilkan `dist/` (~3.7MB, bersih).