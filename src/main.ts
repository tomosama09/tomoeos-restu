import './style.css';
import gsap from 'gsap';
import { mountGame, type GameId } from './games';

declare global {
  interface Window {
    openWindow: (id: string) => void;
    closeWindow: (win: HTMLDivElement) => void;
    minimizeWindow: (win: HTMLDivElement) => void;
    openExplorerNav: (navId: string) => void;
    toggleStartMenu: () => void;
    toggleShowDesktop: () => void;
    copyEmail: () => void;
    openRunDialog: () => void;
    shutdownOS: () => void;
    openVideo: (ytId: string) => void;
    openInternetExplorer: () => void;
    openPhotoViewer: (index: number) => void;
    toggleAllPrograms: (e?: Event) => void;
    unlockAudio: () => void;
    confirmCloseAllWindows: () => void;
  }
}

interface WindowGeometry {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
}

let highestZ = 30;
const windows = document.querySelectorAll<HTMLDivElement>('.window');
const previousGeometries = new Map<string, WindowGeometry>();
const minimizedWindows = new Set<string>();

// -------------------------------------------------------------
// 1. WINDOW FOCUS & TASKBAR BADGE SYNCHRONIZATION
// -------------------------------------------------------------
function bringToFront(win: HTMLDivElement) {
  highestZ += 2;
  win.style.zIndex = highestZ.toString();
  windows.forEach(w => {
    w.classList.remove('active-window');
    setTaskbarActive(w.id, false);
  });
  win.classList.add('active-window');
  updateTaskbarItemState(win.id, true);
}

// Window -> taskbar metadata (label + icon)
const APP_META: Record<string, { label: string; icon: string }> = {
  'win-player': { label: 'Tomoe Player', icon: '/icons/fci-film.svg' },
  'win-ie': { label: 'Internet Explorer', icon: '/icons/fci-display.svg' },
  'win-explorer': { label: 'Restu Explorer', icon: '/icons/fci-folder.svg' },
  'win-notepad': { label: 'Welcome.txt - Notepad', icon: '/icons/welcome-note.svg' },
  'win-games': { label: 'Games', icon: '/icons/games.webp' },
  'win-photo': { label: 'Windows Photo Viewer', icon: '/icons/folder-pics.webp' },
  'win-calc': { label: 'Calculator', icon: '/icons/calc.webp' },
  'win-bin': { label: 'Recycle Bin', icon: '/icons/bin.webp' },
  'win-cmd': { label: 'Command Prompt', icon: '/icons/fci-display.svg' },
};
const taskbarApps = document.getElementById('taskbar-apps');

function getTaskbarItem(winId: string): HTMLElement | null {
  return document.querySelector(`.aero-taskbar-item[data-target="${winId}"]`);
}

function setTaskbarActive(winId: string, active: boolean) {
  const item = getTaskbarItem(winId);
  if (!item) return;
  // Inactive = shows "open but not focused" (e.g. minimized or behind)
  item.classList.toggle('active-item', active);
}

function ensureTaskbarItem(winId: string) {
  if (!taskbarApps) return;
  if (getTaskbarItem(winId)) return;
  const meta = APP_META[winId];
  if (!meta) return;
  const btn = document.createElement('button');
  btn.className = 'aero-taskbar-item';
  btn.dataset.target = winId;
  btn.innerHTML = `<img src="${meta.icon}" alt="" class="w-4 h-4" /><span>${meta.label}</span>`;
  btn.addEventListener('click', () => openWindow(winId));
  btn.addEventListener('contextmenu', (e) => { e.preventDefault(); showJumpList(winId, e.clientX, e.clientY); });
  taskbarApps.appendChild(btn);
}

// Jump list: right-click a taskbar item -> Restore / Minimize / Close
function showJumpList(winId: string, x: number, y: number) {
  hideJumpList();
  const menu = document.createElement('div');
  menu.className = 'aero-context-menu aero-ctx-open aero-jump';
  menu.style.left = `${Math.min(x, window.innerWidth - 180)}px`;
  menu.style.top = `${Math.max(0, y - 40)}px`;
  const item = (label: string, fn: () => void) => {
    const b = document.createElement('button');
    b.className = 'aero-ctx-item';
    b.textContent = label;
    b.addEventListener('click', () => { hideJumpList(); fn(); });
    menu.appendChild(b);
  };
  item('Restore', () => { minimizedWindows.delete(winId); openWindow(winId); });
  item('Minimize', () => { const w = document.getElementById(winId) as HTMLDivElement | null; if (w) minimizeWindow(w); });
  const sep = document.createElement('div'); sep.className = 'aero-ctx-sep'; menu.appendChild(sep);
  item('Close', () => { const w = document.getElementById(winId) as HTMLDivElement | null; if (w) closeWindow(w); });
  document.body.appendChild(menu);
}
function hideJumpList() { document.querySelector('.aero-jump')?.remove(); }
document.addEventListener('click', hideJumpList);

function removeTaskbarItem(winId: string) {
  getTaskbarItem(winId)?.remove();
}

function updateTaskbarItemState(winId: string, isActive: boolean) {
  const win = document.getElementById(winId);
  const isOpen = win && !win.classList.contains('hidden');
  if (isOpen) {
    ensureTaskbarItem(winId);
    setTaskbarActive(winId, isActive);
  } else {
    // Closed entirely -> drop from toolbar (minimized windows stay via minimizedWindows)
    if (!minimizedWindows.has(winId)) removeTaskbarItem(winId);
    else setTaskbarActive(winId, false);
  }
}

// -------------------------------------------------------------
// 2. WINDOW LIFECYCLE (OPEN, CLOSE, MINIMIZE, FULLSCREEN)
// -------------------------------------------------------------
export function openWindow(targetId: string) {
  const win = document.getElementById(targetId) as HTMLDivElement | null;
  if (!win) return;

  if (minimizedWindows.has(targetId)) {
    restoreMinimized(win);
    return;
  }

  sfxClick();

  if (win.classList.contains('hidden')) {
    win.classList.remove('hidden');
    bringToFront(win);

    if (targetId === 'win-games') refreshGameHost();

    gsap.fromTo(win,
      { scale: 0.90, opacity: 0, y: 25 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.2)' }
    );
  } else {
    bringToFront(win);
    gsap.fromTo(win, { scale: 0.985 }, { scale: 1, duration: 0.18, ease: 'power2.out' });
  }
}
window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.minimizeWindow = minimizeWindow;

export function closeWindow(win: HTMLDivElement) {
  if (previousGeometries.has(win.id)) {
    previousGeometries.delete(win.id);
  }

  minimizedWindows.delete(win.id);

  if (win.id === 'win-player') {
    const frame = document.getElementById('yt-frame') as HTMLIFrameElement | null;
    if (frame) frame.src = '';
    stopDino();
  }
  if (win.id === 'win-ie') stopDino();

  gsap.to(win, {
    scale: 0.88,
    opacity: 0,
    y: 20,
    duration: 0.22,
    ease: 'power2.in',
    onComplete: () => {
      win.classList.add('hidden');
      win.classList.remove('active-window');
      updateTaskbarItemState(win.id, false);
    }
  });
  sfxClick();
}

export function minimizeWindow(win: HTMLDivElement) {
  if (minimizedWindows.has(win.id)) return;
  minimizedWindows.add(win.id);
  sfxClick();

  const taskbarItem = document.querySelector(`.aero-taskbar-item[data-target="${win.id}"]`);
  const targetRect = taskbarItem?.getBoundingClientRect();
  const targetX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth / 2;
  const targetY = window.innerHeight - 30;

  gsap.to(win, {
    scale: 0.15,
    opacity: 0,
    x: targetX - win.offsetLeft - win.offsetWidth / 2,
    y: targetY - win.offsetTop,
    duration: 0.32,
    ease: 'power2.inOut',
    onComplete: () => {
      win.classList.add('hidden');
      win.classList.remove('active-window');
      updateTaskbarItemState(win.id, false);
    }
  });
}

function restoreMinimized(win: HTMLDivElement) {
  minimizedWindows.delete(win.id);
  win.classList.remove('hidden');
  bringToFront(win);

  gsap.fromTo(win,
    { scale: 0.2, opacity: 0, y: 150 },
    { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.38, ease: 'back.out(1.2)' }
  );
}

export function toggleFullscreen(win: HTMLDivElement) {
  const isCurrentlyFullscreen = previousGeometries.has(win.id);

  if (!isCurrentlyFullscreen) {
    previousGeometries.set(win.id, {
      top: win.style.top || `${win.offsetTop}px`,
      left: win.style.left || `${win.offsetLeft}px`,
      width: win.style.width || `${win.offsetWidth}px`,
      height: win.style.height || `${win.offsetHeight}px`,
      borderRadius: win.style.borderRadius || '9px'
    });

    bringToFront(win);

    gsap.to(win, {
      top: 0,
      left: 0,
      width: '100vw',
      height: 'calc(100vh - 38px)',
      borderRadius: '0px',
      duration: 0.3,
      ease: 'power3.out'
    });
  } else {
    const saved = previousGeometries.get(win.id)!;
    previousGeometries.delete(win.id);

    gsap.to(win, {
      top: saved.top,
      left: saved.left,
      width: saved.width,
      height: saved.height,
      borderRadius: saved.borderRadius,
      duration: 0.3,
      ease: 'power3.out'
    });
  }
}

// Aero Snap: drag window to edge of screen to snap left-half, right-half, or full.
function snapWindow(win: HTMLDivElement, zone: 'left' | 'right' | 'top') {
  const vw = window.innerWidth;
  const vh = window.innerHeight - 38; // taskbar height
  let target: { left: number; top: number; width: number; height: number; radius: string };

  if (zone === 'left') {
    target = { left: 0, top: 0, width: vw / 2, height: vh, radius: '0px' };
  } else if (zone === 'right') {
    target = { left: vw / 2, top: 0, width: vw / 2, height: vh, radius: '0px' };
  } else {
    target = { left: 0, top: 0, width: vw, height: vh, radius: '0px' };
  }

  // Remember state so restore works via double-click/toggle
  if (!previousGeometries.has(win.id)) {
    previousGeometries.set(win.id, {
      top: win.style.top || `${win.offsetTop}px`,
      left: win.style.left || `${win.offsetLeft}px`,
      width: win.style.width || `${win.offsetWidth}px`,
      height: win.style.height || `${win.offsetHeight}px`,
      borderRadius: win.style.borderRadius || '9px',
    });
  }

  gsap.to(win, {
    left: target.left,
    top: target.top,
    width: target.width,
    height: target.height,
    borderRadius: target.radius,
    duration: 0.28,
    ease: 'power3.out',
  });
}

// Taskbar hover thumbnail: uses event delegation so dynamically-created items work.
let peekTimer: number | null = null;
let peekTargetId: string | null = null;
function bindTaskbarHover() {
  const root = taskbarApps || document;
  root.addEventListener('mouseover', (e) => {
    const btn = (e.target as HTMLElement).closest('.aero-taskbar-item') as HTMLButtonElement | null;
    if (!btn) { hidePeek(); return; }
    const related = (e as MouseEvent).relatedTarget as Node | null;
    if (related && btn.contains(related)) return;
    if (peekTimer) window.clearTimeout(peekTimer);
    peekTargetId = btn.getAttribute('data-target');
    peekTimer = window.setTimeout(() => {
      const target = btn.getAttribute('data-target');
      const win = document.getElementById(target || '');
      if (win && target && target === peekTargetId && btn.matches(':hover')) showPeek(target, win);
    }, 450);
  });
  root.addEventListener('mouseleave', () => {
    if (peekTimer) window.clearTimeout(peekTimer);
    peekTargetId = null;
    hidePeek();
  });
}

let peekEl: HTMLDivElement | null = null;
function showPeek(targetId: string, win: HTMLElement) {
  hidePeek(true);
  peekEl = document.createElement('div');
  peekEl.className = 'aero-taskbar-peek';
  const label = document.createElement('div');
  label.className = 'aero-taskbar-peek-label';
  label.textContent = (document.querySelector(`.aero-taskbar-item[data-target="${targetId}"]`)?.textContent || '').trim();
  peekEl.appendChild(label);
  const snapshot = document.createElement('div');
  snapshot.className = 'aero-taskbar-peek-stage';
  snapshot.innerHTML = win.innerHTML;
  peekEl.appendChild(snapshot);
  document.body.appendChild(peekEl);
  // Place above the button
  const btn = document.querySelector(`.aero-taskbar-item[data-target="${targetId}"]`) as HTMLElement;
  const rect = btn.getBoundingClientRect();
  peekEl.style.bottom = `${window.innerHeight - rect.top + 8}px`;
  peekEl.style.left = `${Math.max(8, rect.left + rect.width / 2 - peekEl.offsetWidth / 2)}px`;
  gsap.fromTo(peekEl,
    { opacity: 0, y: 8, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' }
  );
}
function hidePeek(immediate = false) {
  if (!peekEl) return;
  const current = peekEl;
  peekEl = null;
  if (immediate) {
    gsap.killTweensOf(current);
    current.remove();
    return;
  }
  gsap.to(current, {
    opacity: 0,
    y: 8,
    scale: 0.97,
    duration: 0.12,
    ease: 'power1.in',
    onComplete: () => current.remove(),
  });
}

// -------------------------------------------------------------
// 3. WINDOW DRAGGING & RESIZING
// -------------------------------------------------------------
windows.forEach((win) => {
  const header = win.querySelector('.win-header') as HTMLDivElement | null;
  const btnClose = win.querySelector('.traffic-close') as HTMLButtonElement | null;
  const btnMin = win.querySelector('.traffic-minimize') as HTMLButtonElement | null;
  const btnFull = win.querySelector('.traffic-fullscreen') as HTMLButtonElement | null;

  win.addEventListener('mousedown', () => bringToFront(win));

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(win);
    });
  }

  if (btnMin) {
    btnMin.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizeWindow(win);
    });
  }

  if (btnFull) {
    btnFull.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen(win);
    });
  }

// Header Dragging
    if (header) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let snapZone: 'left' | 'right' | 'top' | null = null;

      header.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('.aero-caption-controls')) return;
        if (previousGeometries.has(win.id)) return;

        isDragging = true;
        snapZone = null;
        bringToFront(win);

        const rect = win.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        header.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newX = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - startX));
        const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - startY));
        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;

        // Determine snap zone on edge proximity
        const edge = 10;
        if (e.clientX <= edge) snapZone = 'left';
        else if (e.clientX >= window.innerWidth - edge) snapZone = 'right';
        else if (e.clientY <= edge && !minimizedWindows.has(win.id)) snapZone = 'top';
        else snapZone = null;
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        header.style.cursor = 'grab';

        if (snapZone === 'left') {
          snapWindow(win, 'left');
        } else if (snapZone === 'right') {
          snapWindow(win, 'right');
        } else if (snapZone === 'top') {
          snapWindow(win, 'top');
        }
        snapZone = null;
      });
    }

  // Resizing Handles
  const handleCorner = win.querySelector('.resize-handle-corner') as HTMLDivElement | null;
  const handleRight = win.querySelector('.resize-handle-edge-r') as HTMLDivElement | null;
  const handleBottom = win.querySelector('.resize-handle-edge-b') as HTMLDivElement | null;

  function initResize(handle: HTMLElement | null, resizeX: boolean, resizeY: boolean) {
    if (!handle) return;

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (previousGeometries.has(win.id)) return;

      bringToFront(win);

      const startW = win.offsetWidth;
      const startH = win.offsetHeight;
      const mouseStartX = e.clientX;
      const mouseStartY = e.clientY;

      function onMouseMove(event: MouseEvent) {
        if (resizeX) {
          const deltaX = event.clientX - mouseStartX;
          const newW = Math.max(460, Math.min(window.innerWidth - win.offsetLeft - 10, startW + deltaX));
          win.style.width = `${newW}px`;
        }
        if (resizeY) {
          const deltaY = event.clientY - mouseStartY;
          const newH = Math.max(340, Math.min(window.innerHeight - win.offsetTop - 50, startH + deltaY));
          win.style.height = `${newH}px`;
        }
      }

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  initResize(handleCorner, true, true);
  initResize(handleRight, true, false);
  initResize(handleBottom, false, true);
});

// Taskbar item click handlers
document.querySelectorAll<HTMLButtonElement>('.aero-taskbar-item').forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-target');
    if (!target) return;
    const win = document.getElementById(target) as HTMLDivElement | null;
    if (!win) return;

    if (win.classList.contains('hidden') || minimizedWindows.has(target)) {
      openWindow(target);
    } else if (win.classList.contains('active-window')) {
      minimizeWindow(win);
    } else {
      bringToFront(win);
    }
  });
});

// -------------------------------------------------------------
// 4. FLOATING IRIDESCENT GLASS BUBBLES GENERATOR
// -------------------------------------------------------------
const bubblesLayer = document.getElementById('bubbles-layer');
function spawnBubbles() {
  if (!bubblesLayer) return;
  const bubbleCount = 14;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble-particle';

    const size = Math.floor(Math.random() * 65) + 25; // 25px - 90px
    const left = Math.random() * 95; // 0% - 95%
    const duration = Math.random() * 10 + 12; // 12s - 22s
    const delay = Math.random() * 15;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;

    bubblesLayer.appendChild(bubble);
  }
}
spawnBubbles();

// -------------------------------------------------------------
// 5. START ORB & START MENU
// -------------------------------------------------------------
const startMenu = document.getElementById('aero-start-menu');
const startOrbBtn = document.getElementById('start-orb-btn');

export function toggleStartMenu() {
  if (!startMenu) return;
  startMenu.classList.toggle('open');
}
window.toggleStartMenu = toggleStartMenu;

if (startOrbBtn) {
  startOrbBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });
}

window.addEventListener('click', (e) => {
  if (startMenu && startMenu.classList.contains('open')) {
    if (!startMenu.contains(e.target as Node) && e.target !== startOrbBtn) {
      startMenu.classList.remove('open');
    }
  }
  // Close All Programs panel when clicking outside it (but not the toggle button)
  const apPanel = document.getElementById('all-programs-panel');
  const apToggle = (e.target as HTMLElement).closest('[onclick*="toggleAllPrograms"]');
  if (apPanel && !apPanel.classList.contains('hidden') && !apPanel.contains(e.target as Node) && !apToggle) {
    apPanel.classList.add('hidden');
  }
});

// -------------------------------------------------------------
// 6. SHOW DESKTOP PEEK BUTTON (FAR RIGHT OF TASKBAR)
// -------------------------------------------------------------
let allHidden = false;
// -------------------------------------------------------------
// 6. SHOW DESKTOP PEEK BUTTON (FAR RIGHT OF TASKBAR)
// -------------------------------------------------------------
export function toggleShowDesktop() {
  windows.forEach((win) => {
    if (!allHidden) {
      if (!win.classList.contains('hidden')) {
        minimizeWindow(win);
      }
    } else {
      if (minimizedWindows.has(win.id)) {
        restoreMinimized(win);
      }
    }
  });
  allHidden = !allHidden;
}
window.toggleShowDesktop = toggleShowDesktop;

// -------------------------------------------------------------
// 8. RESTU EXPLORER (VISTA / WIN7 FOLDERS & DETAILS PANE)
// -------------------------------------------------------------
const explorerNavItems = document.querySelectorAll<HTMLButtonElement>('.explorer-nav-item');
const explorerPanes = document.querySelectorAll<HTMLDivElement>('.explorer-pane');
const breadcrumbCurrent = document.getElementById('breadcrumb-current');
const explorerTitle = document.getElementById('explorer-title');
const detailsItemCount = document.getElementById('details-item-count');

export function openExplorerNav(navId: string) {
  openWindow('win-explorer');

  explorerNavItems.forEach(item => {
    if (item.getAttribute('data-nav') === navId) {
      item.classList.add('active-nav');
    } else {
      item.classList.remove('active-nav');
    }
  });

  explorerPanes.forEach(pane => {
    if (pane.id === `pane-${navId}`) {
      pane.classList.remove('hidden');
      pane.classList.add('flex');
      gsap.fromTo(pane, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
    } else {
      pane.classList.add('hidden');
      pane.classList.remove('flex');
    }
  });

  const metadata: Record<string, { breadcrumb: string; title: string; details: string }> = {
    about: { 
      breadcrumb: 'About Me', 
      title: 'Restu Explorer - System Credentials & About Me',
      details: 'Item: System Specifications | Author: Restu Utomo'
    },
    services: { 
      breadcrumb: 'What You Get', 
      title: 'Restu Explorer - Production Packages & Deliverables',
      details: '5 Packages Available | ProRes 422 HQ / H.265 Master 4K'
    },
    clients: { 
      breadcrumb: 'Clients & Proof', 
      title: 'Restu Explorer - Institutional Proof & Certificates',
      details: '4 Verified Certificates | RedR Indonesia, USD, UC, LLTC'
    },
    faq: { 
      breadcrumb: 'Production FAQ', 
      title: 'Restu Explorer - Windows Help and Support (FAQ)',
      details: 'Help Knowledgebase: 4 Core Topics'
    },
    contact: { 
      breadcrumb: 'Contact & Connect', 
      title: 'Restu Explorer - Windows Contacts (Direct vCard)',
      details: 'vCard Document: Direct Email & WhatsApp'
    },
    videos: {
      breadcrumb: 'Videos Library',
      title: 'Restu Explorer - Videos Library',
      details: '4 video tracks | Open in Media Player'
    },
    documents: {
      breadcrumb: 'Documents Library',
      title: 'Restu Explorer - Documents Library',
      details: '1 document | CV (PDF)'
    },
    pictures: {
      breadcrumb: 'Pictures Library',
      title: 'Restu Explorer - Pictures Library',
      details: '21 posters | USD Library promotional work'
    }
  };

  if (metadata[navId]) {
    if (breadcrumbCurrent) breadcrumbCurrent.innerText = metadata[navId].breadcrumb;
    if (explorerTitle) explorerTitle.innerText = metadata[navId].title;
    if (detailsItemCount) detailsItemCount.innerText = metadata[navId].details;
  }
}
window.openExplorerNav = openExplorerNav;

explorerNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const navId = item.getAttribute('data-nav');
    if (navId) openExplorerNav(navId);
  });
});

// -------------------------------------------------------------
// 9. SYSTEM CLOCK
// -------------------------------------------------------------
const clockEl = document.getElementById('live-clock');
function updateClock() {
  if (!clockEl) return;
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  clockEl.innerHTML = `
    <div>${hours}:${minutes}</div>
    <div class="text-[9px] text-slate-600">${day}/${month}/${year}</div>
  `;
}
updateClock();
setInterval(updateClock, 1000);

// Desktop clock gadget
const gadgetTime = document.getElementById('gadget-clock-time');
const gadgetDate = document.getElementById('gadget-clock-date');
function updateGadget() {
  if (!gadgetTime || !gadgetDate) return;
  const n = new Date();
  gadgetTime.textContent = n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  gadgetDate.textContent = n.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
}
updateGadget();
setInterval(updateGadget, 1000);

// Desktop gadget stopwatch (feature 8)
let swRunning = false;
let swStart = 0;
let swElapsed = 0;
let swTimer: number | null = null;
function renderStopwatch() {
  const el = document.getElementById('gadget-stopwatch');
  if (!el) return;
  const total = swElapsed + (swRunning ? Date.now() - swStart : 0);
  const m = Math.floor(total / 60000), s = Math.floor((total % 60000) / 1000), d = Math.floor((total % 1000) / 100);
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${d}`;
}
const swBtn = document.getElementById('gadget-stopwatch-toggle');
swBtn?.addEventListener('click', () => {
  if (!swRunning) { swStart = Date.now(); swRunning = true; swBtn.textContent = 'Stop'; swTimer = window.setInterval(renderStopwatch, 100); }
  else { swElapsed += Date.now() - swStart; swRunning = false; swBtn.textContent = 'Start'; if (swTimer) window.clearInterval(swTimer); }
});
renderStopwatch();

// Calendar flyout toggle
const clockBtn = document.getElementById('live-clock-btn');
const clockFlyout = document.getElementById('clock-flyout');
const flyoutTime = document.getElementById('clock-flyout-time');
const flyoutCal = document.getElementById('clock-flyout-cal');

function renderCalendar() {
  if (!flyoutTime || !flyoutCal) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  flyoutTime.innerHTML = `<div class="text-2xl font-light">${timeStr}</div><div class="text-[11px] text-slate-600 mt-1">${dateStr}</div>`;

  // Build month grid
  const y = now.getFullYear();
  const m = now.getMonth();
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDow = new Date(y, m, 1).getDay(); // 0=Sun
  const today = now.getDate();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  let html = `<div class="text-center text-xs font-bold text-blue-900 mb-2">${monthLabel}</div>`;
  html += `<div class="grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-slate-500">S M T W T F S</div>`;
  html += `<div class="grid grid-cols-7 gap-0.5 text-center text-[10px] mt-1">`;
  for (let i = 0; i < firstDow; i++) html += `<span></span>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today;
    html += `<span class="${isToday ? 'bg-blue-600 text-white rounded font-bold' : 'hover:bg-blue-100 text-slate-700'} py-0.5 cursor-default">${d}</span>`;
  }
  html += `</div>`;
  flyoutCal.innerHTML = html;
}

clockBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const hidden = clockFlyout?.classList.contains('hidden');
  if (hidden) {
    renderCalendar();
    clockFlyout?.classList.remove('hidden');
  } else {
    clockFlyout?.classList.add('hidden');
  }
});
document.addEventListener('click', (e) => {
  if (clockFlyout && !clockFlyout.contains(e.target as Node) && e.target !== clockBtn && !clockBtn?.contains(e.target as Node)) {
    clockFlyout.classList.add('hidden');
  }
});

// -------------------------------------------------------------
// 10. COPY EMAIL UTILITY
// -------------------------------------------------------------
export function copyEmail() {
  navigator.clipboard.writeText('rstt.tomo@gmail.com');
  const btns = document.querySelectorAll<HTMLElement>('[onclick*="copyEmail"]');
  btns.forEach(btn => {
    const prev = btn.innerText;
    btn.innerText = 'Copied! ✓';
    setTimeout(() => {
      btn.innerText = prev;
    }, 2000);
  });
}
window.copyEmail = copyEmail;

// -------------------------------------------------------------
// 10. OS DIALOGS (Run, Confirm, About/Properties)
// -------------------------------------------------------------
let activeDialog: HTMLElement | null = null;

function openDialog(opts: {
  title: string;
  icon?: string;
  body: string;
  okText?: string;
  cancelText?: string | null;
  onOk?: (input?: HTMLInputElement) => void;
  input?: boolean;
}) {
  closeDialog();
  const dlg = document.createElement('div');
  dlg.className = 'aero-dialog-scrim';
  const panel = document.createElement('div');
  panel.className = 'aero-dialog';

  const titlebar = document.createElement('div');
  titlebar.className = 'aero-dialog-titlebar';
  titlebar.innerHTML = `<span class="aero-dialog-title">${opts.title}</span><button class="aero-cap-btn aero-cap-close dialog-close"><svg viewBox="0 0 10 10" width="9" height="9"><line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.4"/><line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" stroke-width="1.4"/></svg></button>`;

  const body = document.createElement('div');
  body.className = 'aero-dialog-body';
  body.innerHTML = `<div class="aero-dialog-msg"><img src="${opts.icon || '/icons/fci-info.svg'}" alt="" class="aero-dialog-icon" /><span>${opts.body}</span></div>`;
  let inputEl: HTMLInputElement | null = null;
  if (opts.input) {
    inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'aero-dialog-input';
    body.appendChild(inputEl);
  }

  const actions = document.createElement('div');
  actions.className = 'aero-dialog-actions';
  const ok = document.createElement('button');
  ok.className = 'aero-jelly-btn';
  ok.textContent = opts.okText || 'OK';
  const cancel = document.createElement('button');
  cancel.className = 'aero-jelly-btn';
  cancel.textContent = opts.cancelText || 'Cancel';

  actions.appendChild(ok);
  if (opts.cancelText !== null) actions.appendChild(cancel);

  ok.addEventListener('click', () => { const val = inputEl; closeDialog(); opts.onOk?.(val || undefined); });
  cancel.addEventListener('click', () => closeDialog());
  titlebar.querySelector('.dialog-close')?.addEventListener('click', () => closeDialog());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDialog(); });

  panel.appendChild(titlebar);
  panel.appendChild(body);
  panel.appendChild(actions);
  dlg.appendChild(panel);
  document.body.appendChild(dlg);
  activeDialog = dlg;
  requestAnimationFrame(() => (panel.style.transform = 'scale(1)'));
}

function closeDialog() {
  if (activeDialog) { activeDialog.remove(); activeDialog = null; }
}

export function openRunDialog() {
  openDialog({
    title: 'Run',
    body: 'Type the name of a program, folder, or document to open.',
    okText: 'OK',
    cancelText: 'Cancel',
    input: true,
    onOk: (input) => {
      const v = input?.value.trim().toLowerCase() || '';
      if (v.includes('video') || v === 'videos' || v === 'media') openExplorerNav('videos');
      else if (v.includes('explorer') || v.includes('files') || v === 'dir') openWindow('win-explorer');
      else if (v.includes('note') || v.includes('doc') || v === 'welcome') openExplorerNav('documents');
    },
  });
}
window.openRunDialog = openRunDialog;

// -------------------------------------------------------------
// 12. DESKTOP CONTEXT MENU & KEYBOARD SHORTCUTS
// -------------------------------------------------------------
let contextMenuEl: HTMLElement | null = null;
function hideContextMenu() { if (contextMenuEl) { contextMenuEl.remove(); contextMenuEl = null; } }

document.addEventListener('contextmenu', (e) => {
  // Only show on empty desktop area (not over windows/notes)
  if ((e.target as HTMLElement).closest('.window, .aero-taskbar, .aero-start-menu, .explorer-sidebar, .desktop-sticky')) { hideContextMenu(); return; }

  e.preventDefault();
  hideContextMenu();
  contextMenuEl = document.createElement('div');
  contextMenuEl.className = 'aero-context-menu';
  const items: ({ text: string; fn?: () => void; disabled?: boolean } | { divider: true })[] = [
    { text: 'View' },
    { text: 'Refresh', fn: () => location.reload() },
    { divider: true },
    { text: 'Run...', fn: () => { openRunDialog(); } },
    { text: 'Open Videos', fn: () => openExplorerNav('videos') },
    { text: 'Open Explorer', fn: () => openWindow('win-explorer') },
    { text: 'Open Notepad', fn: () => openWindow('win-notepad') },
    { divider: true },
    { text: 'Close All Windows', fn: () => confirmCloseAllWindows() },
    { text: 'Personalize (Aero theme)', disabled: true },
  ];
  items.forEach(entry => {
    if ('divider' in entry) {
      const hr = document.createElement('div');
      hr.className = 'aero-ctx-sep';
      contextMenuEl!.appendChild(hr);
      return;
    }
    const item = entry as { text: string; fn?: () => void; disabled?: boolean };
    const btn = document.createElement('button');
    btn.textContent = item.text || '';
    btn.className = 'aero-ctx-item';
    if (item.disabled) { btn.classList.add('aero-ctx-disabled'); }
    else { btn.addEventListener('click', () => { hideContextMenu(); item.fn?.(); }); }
    contextMenuEl!.appendChild(btn);
  });
  document.body.appendChild(contextMenuEl);

  const x = Math.min(e.clientX, window.innerWidth - contextMenuEl.offsetWidth - 4);
  const y = Math.min(e.clientY, window.innerHeight - contextMenuEl.offsetHeight - 40);
  contextMenuEl.style.left = `${x}px`;
  contextMenuEl.style.top = `${y}px`;
  requestAnimationFrame(() => contextMenuEl!.classList.add('aero-ctx-open'));
});

document.addEventListener('click', hideContextMenu);

// Escape closes context menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideContextMenu();
});

// Keyboard shortcuts: Win key = Start, Ctrl+Esc = Start, Alt+Tab = next window
window.addEventListener('keydown', (e) => {
  if (e.key === 'Meta') {
    if (e.type === 'keydown') toggleStartMenu();
  } else if (e.ctrlKey && e.key === 'Escape') {
    e.preventDefault();
    toggleStartMenu();
  }
});

// Alt+Tab window switcher
window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 'Tab') {
    e.preventDefault();
    e.stopPropagation();
    const list = document.querySelectorAll<HTMLElement>('.window:not(.hidden)');
    if (!list.length) return;
    showAltTab();
    // simple: rotate z-order once
    const visibles = Array.from(list).filter(w => !w.classList.contains('hidden'));
    if (visibles.length < 2) return;
    const topEl = visibles.reduce((top, w) => (parseInt(w.style.zIndex || '0') > parseInt(top.style.zIndex || '0') ? w : top), visibles[0]);
    const idx = visibles.indexOf(topEl);
    const next = visibles[(idx + 1) % visibles.length];
    bringToFront(next as HTMLDivElement);
    window.setTimeout(showAltTab, 260);
  }
});
let altTabEl: HTMLElement | null = null;
function showAltTab() {
  if (!altTabEl) {
    altTabEl = document.createElement('div');
    altTabEl.className = 'aero-alttab';
    const list = document.querySelectorAll('.window:not(.hidden)');
    list.forEach((w) => {
      const t = document.createElement('div');
      t.className = 'aero-alttab-item';
      const label = w.querySelector('.aero-title-text, [id*="title"]')?.textContent || w.id;
      t.textContent = label;
      altTabEl!.appendChild(t);
    });
    document.body.appendChild(altTabEl);
    window.setTimeout(() => { if (altTabEl) { altTabEl.remove(); altTabEl = null; } }, 800);
  }
}

// -------------------------------------------------------------
// 13. INITIAL BOOT SEQUENCE
// -------------------------------------------------------------
function showBootScreen() {
  document.body.classList.add('boot-phase');
  let boot = document.getElementById('aero-boot-screen');
  if (!boot) {
    boot = document.createElement('div');
    boot.id = 'aero-boot-screen';
    boot.className = 'aero-boot-screen';
    boot.innerHTML = `
      <div class="aero-boot-text">Starting TomoeOS</div>
      <div class="aero-boot-progress"><div id="boot-progress-fill" class="aero-boot-progress-fill"></div></div>`;
    document.body.appendChild(boot);
  } else {
    boot.style.display = 'flex';
    const fill = boot.querySelector('#boot-progress-fill');
    if (fill) (fill as HTMLElement).style.width = '0%';
  }
  return boot;
}

function hideBootScreen() {
  const boot = document.getElementById('aero-boot-screen');
  if (boot) boot.style.display = 'none';
}

function showLogonScreen() {
  hideBootScreen();
  let logon = document.getElementById('aero-logon-screen');
  if (!logon) {
    logon = document.createElement('div');
    logon.id = 'aero-logon-screen';
    logon.className = 'aero-logon-screen';
    logon.innerHTML = `
      <div class="aero-logon-card">
        <div class="aero-logon-name">Administrator</div>
        <div class="aero-logon-tagline">Welcome</div>
        <button class="aero-jelly-btn aero-logon-enter" id="logon-enter-btn">Login</button>
      </div>`;
    document.body.appendChild(logon);
    logon.querySelector('#logon-enter-btn')?.addEventListener('click', () => {
      hideLogonScreen();
      unlockAudio();
    });
  } else {
    logon.style.display = 'flex';
    logon.querySelector('.aero-logon-card')?.classList.remove('aero-logon-leave');
  }
  return logon;
}

function hideLogonScreen() {
  const logon = document.getElementById('aero-logon-screen');
  if (logon) { logon.style.display = 'none'; }
  document.body.classList.remove('boot-phase');
  showDesktop();
}

let desktopShown = false;
function showDesktop() {
  if (desktopShown) return;
  desktopShown = true;
  openWindow('win-explorer');
}

function playStartupChime() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const notes: [number, number][] = [[523.25, 0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.36]];
    notes.forEach(([f, t]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.exponentialRampToValueAtTime(0.12, now + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.5);
      o.connect(g); g.connect(ctx.destination);
      o.start(now + t);
      o.stop(now + t + 0.55);
    });
  } catch { /* audio unavailable */ }
}

// ---------- Sound effects (WebAudio, no files, gated on user gesture) ----------
let audioCtx: AudioContext | null = null;
let audioReady = false;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}
// Call once after a user gesture (logon Enter) to unlock audio.
export function unlockAudio() {
  try { const c = getAudioCtx(); if (c.state === 'suspended') c.resume(); audioReady = true; } catch { audioReady = false; }
  playStartupChime();
}
window.unlockAudio = unlockAudio;

function tone(freq: number, dur: number, delay: number, vol: number, type: OscillatorType = 'sine') {
  if (!audioReady) return;
  try {
    const ctx = getAudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime + delay;
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch { /* ignore */ }
}

// Short soft click when opening/closing a window.
function sfxClick() {
  tone(660, 0.06, 0, 0.06);
}
// Two-note "ding" for notifications / events.
function sfxNotify() {
  tone(880, 0.1, 0, 0.08);
  tone(1320, 0.12, 0.08, 0.06);
}

export function shutdownOS() {
  toggleStartMenu();
  openDialog({
    title: 'Shut Down',
    icon: '/icons/shutdown.webp',
    body: 'Do you want to shut down TomoeOS?',
    okText: 'Shut Down',
    cancelText: 'Cancel',
    onOk: () => doShutdown(),
  });
}
window.shutdownOS = shutdownOS;

function doShutdown() {
  closeAllWindows();
  const overlay = document.createElement('div');
  overlay.className = 'aero-shutdown-overlay';
  overlay.innerHTML = `<div class="aero-shutdown-orb"><div class="aero-boot-text">Shutting down</div></div>`;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
    desktopShown = false;
    document.querySelectorAll('.window').forEach(w => w.classList.add('hidden'));
    showBootScreen();
    setTimeout(showLogonScreen, 900);
  }, 1100);
}

function closeAllWindows() {
  document.querySelectorAll('.window:not(.hidden)').forEach(win => {
    const el = win as HTMLDivElement;
    closeWindow(el);
  });
}

export function confirmCloseAllWindows() {
  const count = document.querySelectorAll('.window:not(.hidden)').length;
  openDialog({
    title: 'Close All Windows',
    icon: '/icons/fci-ok.svg',
    body: count < 2 ? 'No open windows to close.' : `Close all ${count} open windows?`,
    okText: 'Close All',
    cancelText: count < 2 ? null : 'Cancel',
    onOk: () => { closeAllWindows(); sfxNotify(); },
  });
}
window.confirmCloseAllWindows = confirmCloseAllWindows;

// Desktop Sticky Notes: add, edit, drag, close, and persist multiple notes.
interface StickyNoteData {
  id: string;
  title: string;
  body: string;
  email: string;
  left: number;
  top: number;
  rotation: number;
}

const STICKY_STORAGE_KEY = 'tomoeos-sticky-notes';
let stickySequence = 1;

function getStickyData(note: HTMLElement): StickyNoteData {
  const rect = note.getBoundingClientRect();
  return {
    id: note.dataset.stickyId || `note-${stickySequence++}`,
    title: note.querySelector<HTMLElement>('[data-sticky-title]')?.innerText.trim() || 'New Note',
    body: note.querySelector<HTMLElement>('[data-sticky-body]')?.innerText.trim() || 'Write something here.',
    email: note.querySelector<HTMLElement>('[data-sticky-email]')?.innerText.trim() || '',
    left: parseFloat(note.style.left) || rect.left,
    top: parseFloat(note.style.top) || rect.top,
    rotation: parseFloat(note.dataset.stickyRotation || '1'),
  };
}

function saveStickyNotes() {
  const notes = Array.from(document.querySelectorAll<HTMLElement>('.desktop-sticky')).map(getStickyData);
  localStorage.setItem(STICKY_STORAGE_KEY, JSON.stringify(notes));
}

function createStickyNote(data: StickyNoteData): HTMLElement {
  const note = document.createElement('div');
  note.className = 'desktop-sticky absolute w-56 z-30 pointer-events-auto cursor-move';
  note.dataset.stickyId = data.id;
  note.dataset.stickyRotation = String(data.rotation);
  note.style.left = `${data.left}px`;
  note.style.top = `${data.top}px`;
  note.style.transform = `rotate(${data.rotation}deg)`;
  note.innerHTML = `
    <div class="bg-gradient-to-b from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md shadow-xl p-4 text-[11px] text-yellow-900 leading-relaxed font-sans">
      <div class="flex items-start justify-between mb-1.5">
        <span class="font-bold text-sm" data-sticky-title contenteditable="true">${data.title}</span>
        <div class="flex items-center gap-1">
          <button data-sticky-add title="New note" class="text-yellow-700 hover:text-blue-700 font-bold text-sm cursor-pointer">+</button>
          <button data-sticky-close title="Close note" class="text-yellow-700 hover:text-red-600 font-bold text-xs cursor-pointer">×</button>
        </div>
      </div>
      <p data-sticky-body contenteditable="true">${data.body}</p>
      <p class="mt-1.5 text-yellow-800" data-sticky-email contenteditable="true">${data.email}</p>
    </div>`;
  document.getElementById('desktop-workspace')?.appendChild(note);
  bindStickyNote(note);
  return note;
}

function bindStickyNote(note: HTMLElement) {
  note.querySelector('[data-sticky-close]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    note.remove();
    saveStickyNotes();
  });
  note.querySelector('[data-sticky-add]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const count = document.querySelectorAll('.desktop-sticky').length;
    const created = createStickyNote({
      id: `note-${Date.now()}`,
      title: 'New Note',
      body: 'Write something here.',
      email: '',
      left: Math.min(window.innerWidth - 240, 80 + count * 24),
      top: Math.min(window.innerHeight - 180, 100 + count * 24),
      rotation: count % 2 ? -1 : 1,
    });
    (created.querySelector('[data-sticky-title]') as HTMLElement | null)?.focus();
    saveStickyNotes();
  });
  note.querySelectorAll<HTMLElement>('[contenteditable="true"]').forEach((field) => {
    field.addEventListener('input', saveStickyNotes);
  });

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  note.addEventListener('mousedown', (e) => {
    if ((e.target as HTMLElement).closest('button, [contenteditable="true"]')) return;
    dragging = true;
    const rect = note.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    note.style.left = `${rect.left}px`;
    note.style.top = `${rect.top}px`;
    note.style.right = 'auto';
    highestZ += 1;
    note.style.zIndex = String(highestZ);
    note.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    note.style.left = `${Math.max(4, Math.min(window.innerWidth - note.offsetWidth - 4, e.clientX - offsetX))}px`;
    note.style.top = `${Math.max(4, Math.min(window.innerHeight - note.offsetHeight - 46, e.clientY - offsetY))}px`;
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    note.style.cursor = 'move';
    saveStickyNotes();
  });
}

function initStickyNotes() {
  const initial = document.querySelector<HTMLElement>('.desktop-sticky');
  if (!initial) return;
  const saved = localStorage.getItem(STICKY_STORAGE_KEY);
  if (saved) {
    try {
      const notes = JSON.parse(saved) as StickyNoteData[];
      initial.remove();
      notes.forEach(createStickyNote);
    } catch {
      bindStickyNote(initial);
    }
  } else {
    bindStickyNote(initial);
    saveStickyNotes();
  }
}

// Boot sequence: boot screen + real asset-loading progress -> logon (enter) -> desktop
window.addEventListener('DOMContentLoaded', () => {
  bindTaskbarHover();
  initGames();
  initPictures();
  initNotepad();
  initStartSearch();
  initCalculator();
  initCmd();
  initInternetExplorer();
  initMenubar();
  initStickyNotes();
  bindDesktopIcons();
  showBiosScreen();
});

// Brief BIOS/POST screen before the OS boot.
function showBiosScreen() {
  document.body.classList.add('boot-phase');
  let bios = document.getElementById('aero-bios-screen');
  if (!bios) {
    bios = document.createElement('div');
    bios.id = 'aero-bios-screen';
    bios.className = 'aero-bios-screen';
    bios.innerHTML = `
      <pre>TomoeOS BIOS v1.0</pre>
      <pre>Copyright (C) Restu Utomo</pre>
      <pre>CPU : TomoeKernel OK</pre>
      <pre>Memory Test : 4096 MB OK</pre>`;
    document.body.appendChild(bios);
  } else {
    bios.style.display = 'flex';
  }
  setTimeout(() => {
    if (bios) bios.style.display = 'none';
    showBootScreen();
    startBootProgress();
  }, 1100);
}

// Track real asset loading and drive the boot progress bar.
// Completes when all critical assets have loaded AND a minimum time has elapsed,
// then transitions to the logon screen.
function startBootProgress() {
  const fill = document.getElementById('boot-progress-fill') as HTMLElement | null;
  const criticalAssets = [
    '/images/wallpaper.webp',
    '/images/restu-photo.webp',
    '/icons/start-button.webp',
    '/icons/computer.webp',
    '/icons/folder-videos.webp',
    '/icons/folder-docs.webp',
    '/icons/folder-pics.webp',
    '/icons/games.webp',
    '/icons/calc.webp',
    '/icons/bin.webp',
    '/icons/fci-film.svg',
    '/icons/fci-folder.svg',
    '/icons/fci-file.svg',
    '/icons/shutdown.webp',
    '/icons/network.webp',
    '/icons/volume-100.webp',
    ...LIBRARY_PICTURES.map(p => `/images/library/${p}`),
  ];

  const total = criticalAssets.length;
  let loaded = 0;

  if (!total) { setTimeout(showLogonScreen, 900); return; }

  const MIN_DURATION = 1400; // keep boot feel even if assets are cached
  const start = Date.now();

  function bump() {
    loaded += 1;
    const frac = Math.min(1, loaded / total);
    if (fill) fill.style.width = `${Math.round(frac * 100)}%`;
  }

  let done = false;
  function finish() {
    if (done) return;
    done = true;
    if (fill) fill.style.width = '100%';
    const elapsed = Date.now() - start;
    const wait = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(showLogonScreen, wait);
  }

  criticalAssets.forEach(src => {
    const img = new Image();
    img.onload = bump;
    img.onerror = bump; // count failed as loaded so progress always completes
    img.src = src;
  });

  // Safety: hard cap in case browser stalls loading callbacks
  setTimeout(finish, 6000);

  // When all assets resolved, finish (respect min duration)
  const poll = window.setInterval(() => {
    if (loaded >= total) { window.clearInterval(poll); finish(); }
  }, 60);
}

// Desktop icon clicks via delegation (robust against inline-handler issues)
function bindDesktopIcons() {
  const holder = document.getElementById('desktop-icons');
  if (!holder) return;
  // add tooltips from label text (feature 4)
  holder.querySelectorAll<HTMLElement>('[data-open], [data-nav]').forEach(btn => {
    if (!btn.getAttribute('title')) btn.setAttribute('title', (btn.textContent || '').trim());
  });
  holder.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-open], [data-nav]') as HTMLElement | null;
    if (!btn) return;
    const nav = btn.getAttribute('data-nav');
    if (nav) { openExplorerNav(nav); return; }
    const target = btn.getAttribute('data-open');
    if (target) openWindow(target);
  });
}

let currentGame: GameId | null = null;
function initGames() {
  const host = document.getElementById('game-host');
  if (!host) return;
  const navs = document.querySelectorAll<HTMLButtonElement>('.explorer-nav-item[data-game]');
  if (!navs.length) return;
  currentGame = navs[0].getAttribute('data-game') as GameId;
  mountGame(host, currentGame);
  navs.forEach(nav => {
    nav.addEventListener('click', () => {
      navs.forEach(n => n.classList.remove('active-nav'));
      nav.classList.add('active-nav');
      currentGame = nav.getAttribute('data-game') as GameId;
      mountGame(host, currentGame!);
    });
  });
}
// Re-mount the current game whenever the Games window is (re)opened so it's never blank/stale.
function refreshGameHost() {
  const host = document.getElementById('game-host');
  if (host && currentGame) mountGame(host, currentGame);
}

// -------------------------------------------------------------
// Pictures library + Windows Photo Viewer
// -------------------------------------------------------------
const LIBRARY_PICTURES: string[] = [
  'library-01.webp','library-04.webp','library-10.webp','library-11.webp','library-29.webp',
  'library-43.webp','library-47.webp','library-55.webp','library-75.webp','library-80.webp',
  'library-90.webp','library-100.webp','library-101.webp','library-110.webp','library-111.webp',
  'library-113.webp','library-117.webp','library-118.webp','library-122.webp','library-123.webp','library-124.webp',
];
let photoIndex = 0;

function initPictures() {
  const grid = document.getElementById('pictures-grid');
  if (!grid) return;
  grid.innerHTML = '';
  LIBRARY_PICTURES.forEach((name, i) => {
    const img = document.createElement('img');
    img.src = `/images/library/${name}`;
    img.alt = '';
    img.className = 'w-full aspect-[4/5] object-cover rounded border border-blue-200 shadow-sm cursor-pointer hover:opacity-85 transition-opacity';
    img.addEventListener('click', () => openPhotoViewer(i));
    grid.appendChild(img);
  });
}

export function openPhotoViewer(index: number) {
  photoIndex = index;
  openWindow('win-photo');
  updatePhoto();
  const prev = document.getElementById('photo-prev');
  const next = document.getElementById('photo-next');
  if (prev) prev.onclick = () => { photoIndex = (photoIndex - 1 + LIBRARY_PICTURES.length) % LIBRARY_PICTURES.length; updatePhoto(); };
  if (next) next.onclick = () => { photoIndex = (photoIndex + 1) % LIBRARY_PICTURES.length; updatePhoto(); };
}
window.openPhotoViewer = openPhotoViewer;

function updatePhoto() {
  const img = document.getElementById('photo-viewer-img') as HTMLImageElement | null;
  if (img) img.src = `/images/library/${LIBRARY_PICTURES[photoIndex]}`;
}

// -------------------------------------------------------------
// Tomoe Player: YouTube embed + dino offline fallback
// -------------------------------------------------------------
const YT_BASE = 'https://www.youtube-nocookie.com/embed/';

export function openVideo(ytId: string) {
  const frame = document.getElementById('yt-frame') as HTMLIFrameElement | null;
  const dino = document.getElementById('dino-host');
  const title = document.getElementById('player-title');
  const offline = !navigator.onLine;
  if (frame) {
    if (offline) {
      frame.classList.add('hidden');
      frame.src = '';
      if (dino) startDino();
      if (title) title.textContent = 'Tomoe Player — Offline';
    } else {
      frame.classList.remove('hidden');
      frame.src = `${YT_BASE}${ytId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;
      if (dino) { dino.classList.add('hidden'); stopDino(); }
      if (title) title.textContent = 'Tomoe Player';
    }
  }
  openWindow('win-player');
}
window.openVideo = openVideo;

// ---- Dino runner (offline fallback, shown when the player has no video) ----
let dinoRun: { stop: () => void } | null = null;
function startDino(hostId = 'dino-host') {
  stopDino();
  const host = document.getElementById(hostId);
  if (!host) return;
  host.innerHTML = '';
  host.classList.remove('hidden');

  const cv = document.createElement('canvas');
  cv.width = 700; cv.height = 220;
  cv.style.cssText = 'max-width:100%;height:auto;background:#fff;border-radius:4px';
  host.appendChild(cv);
  const ctx = cv.getContext('2d')!;

  const groundY = 180;
  let dino = { x: 50, y: groundY, w: 34, h: 40, vy: 0, jumping: false };
  let obstacle = { x: 700, w: 22, h: 34, speed: 5 };
  let score = 0;
  let alive = true;
  let raf = 0;

  function frame() {
    if (alive) {
      // gravity/jump
      if (dino.jumping) { dino.vy += 0.8; dino.y += dino.vy; if (dino.y >= groundY) { dino.y = groundY; dino.jumping = false; dino.vy = 0; } }
      // obstacle
      obstacle.x -= obstacle.speed;
      if (obstacle.x + obstacle.w < 0) { obstacle.x = 700; obstacle.speed += 0.2; }
      // collision
      if (dino.x + dino.w > obstacle.x && dino.x < obstacle.x + obstacle.w && dino.y + dino.h > groundY - obstacle.h + dino.h - 10) {
        alive = false;
      } else if (obstacle.x + obstacle.w < dino.x) { score += 1; }
      // draw
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = '#999'; ctx.beginPath(); ctx.moveTo(0, groundY + dino.h); ctx.lineTo(cv.width, groundY + dino.h); ctx.stroke();
      ctx.fillStyle = '#444'; ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      ctx.fillStyle = '#6b4'; ctx.fillRect(obstacle.x, groundY + dino.h - obstacle.h, obstacle.w, obstacle.h);
      ctx.fillStyle = '#222'; ctx.font = '14px monospace'; ctx.fillText(String(Math.floor(score / 4)), cv.width - 60, 30);
      if (!alive) { ctx.fillStyle = '#c00'; ctx.font = 'bold 18px monospace'; ctx.fillText('GAME OVER — press Space to retry', 180, 90); }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function jump() { if (!dino.jumping) { dino.jumping = true; dino.vy = -13; } }
  function reset() { dino = { x: 50, y: groundY, w: 34, h: 40, vy: 0, jumping: false }; obstacle = { x: 700, w: 22, h: 34, speed: 5 }; score = 0; alive = true; }

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); if (!alive) reset(); else jump(); }
  };
  window.addEventListener('keydown', onKey);
  host.addEventListener('mousedown', () => { if (!alive) reset(); else jump(); });

  dinoRun = { stop() { cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey); } };
}
function stopDino() {
  if (dinoRun) { dinoRun.stop(); dinoRun = null; }
}

// Internet Explorer shell: a local offline page that hosts the Dino runner.
function openInternetExplorer() {
  openWindow('win-ie');
  const host = document.getElementById('ie-dino-host');
  if (host && !host.querySelector('canvas')) startDino('ie-dino-host');
}
window.openInternetExplorer = openInternetExplorer;

function initInternetExplorer() {
  document.getElementById('ie-refresh')?.addEventListener('click', () => startDino('ie-dino-host'));
  ['ie-back', 'ie-forward', 'ie-home'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => sfxClick());
  });
}

// -------------------------------------------------------------
// Notepad multi-document editor + save (localStorage)
// -------------------------------------------------------------
interface NotepadDocument { id: string; name: string; content: string; }
const NOTEPAD_STORAGE_KEY = 'notepad-documents';

function initNotepad() {
  const editor = document.getElementById('notepad-editor') as HTMLTextAreaElement | null;
  const newBtn = document.getElementById('notepad-new');
  const save = document.getElementById('notepad-save');
  const status = document.getElementById('notepad-status');
  const tabs = document.getElementById('notepad-tabs');
  if (!editor) return;
  const editorEl = editor;

  const initialContent = editor.value;
  let documents: NotepadDocument[] = [];
  const savedDocs = localStorage.getItem(NOTEPAD_STORAGE_KEY);
  if (savedDocs) {
    try { documents = JSON.parse(savedDocs) as NotepadDocument[]; } catch { documents = []; }
  }
  if (!documents.length) {
    documents = [{ id: 'welcome', name: 'Welcome.txt', content: localStorage.getItem('notepad-content') ?? initialContent }];
  }
  let activeId = documents[0].id;

  function persist() { localStorage.setItem(NOTEPAD_STORAGE_KEY, JSON.stringify(documents)); }
  function activeDocument() { return documents.find(doc => doc.id === activeId) || documents[0]; }
  function renderTabs() {
    if (!tabs) return;
    tabs.innerHTML = '';
    documents.forEach((doc) => {
      const tab = document.createElement('button');
      tab.className = `notepad-tab ${doc.id === activeId ? 'active' : ''}`;
      tab.title = `Open ${doc.name}`;
      tab.textContent = doc.name;
      tab.addEventListener('click', () => {
        activeDocument().content = editorEl.value;
        activeId = doc.id;
        editorEl.value = doc.content;
        if (status) status.textContent = doc.name;
        renderTabs();
      });
      const close = document.createElement('span');
      close.className = 'notepad-tab-close';
      close.textContent = '×';
      close.title = `Close ${doc.name}`;
      close.addEventListener('click', (e) => {
        e.stopPropagation();
        if (documents.length === 1) return;
        const index = documents.findIndex(item => item.id === doc.id);
        documents = documents.filter(item => item.id !== doc.id);
        if (activeId === doc.id) {
          const next = documents[Math.max(0, index - 1)];
          activeId = next.id;
          editorEl.value = next.content;
          if (status) status.textContent = next.name;
        }
        persist();
        renderTabs();
      });
      tab.appendChild(close);
      tabs.appendChild(tab);
    });
  }

  editorEl.value = activeDocument().content;
  renderTabs();
  persist();

  newBtn?.addEventListener('click', () => {
    activeDocument().content = editorEl.value;
    const count = documents.filter(doc => doc.name.startsWith('Untitled')).length + 1;
    const doc = { id: `note-${Date.now()}`, name: `Untitled-${count}.txt`, content: '' };
    documents.push(doc);
    activeId = doc.id;
    editorEl.value = '';
    if (status) status.textContent = doc.name;
    persist();
    renderTabs();
    editorEl.focus();
  });

  if (save) {
    save.addEventListener('click', () => {
      const doc = activeDocument();
      doc.content = editorEl.value;
      persist();
      if (status) { status.textContent = 'Saved'; setTimeout(() => (status.textContent = doc.name), 1200); }
    });
  }
}

// -------------------------------------------------------------
// Start menu search
// -------------------------------------------------------------
function initStartSearch() {
  const input = document.getElementById('start-search-input') as HTMLInputElement | null;
  if (!input) return;
  // searchable programs = windows + explorer sections
  const items: { label: string; run: () => void }[] = [
    { label: 'Videos', run: () => { openExplorerNav('videos'); } },
    { label: 'Restu Explorer', run: () => { openWindow('win-explorer'); } },
    { label: 'Internet Explorer', run: () => { openInternetExplorer(); } },
    { label: 'Notepad', run: () => { openWindow('win-notepad'); } },
    { label: 'Calculator', run: () => { openWindow('win-calc'); } },
    { label: 'Command Prompt', run: () => { openWindow('win-cmd'); } },
    { label: 'Games', run: () => { openWindow('win-games'); } },
    { label: 'About Me', run: () => openExplorerNav('about') },
    { label: 'Services / What You Get', run: () => openExplorerNav('services') },
    { label: 'Clients', run: () => openExplorerNav('clients') },
    { label: 'FAQ', run: () => openExplorerNav('faq') },
    { label: 'Contact', run: () => openExplorerNav('contact') },
    { label: 'Videos', run: () => openExplorerNav('videos') },
    { label: 'Documents', run: () => openExplorerNav('documents') },
    { label: 'Pictures', run: () => openExplorerNav('pictures') },
    { label: 'Shut down', run: () => shutdownOS() },
  ];
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return;
    const hit = items.find(i => i.label.toLowerCase().includes(q));
    if (hit) { toggleStartMenu(); input.value = ''; hit.run(); }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim().toLowerCase();
      const hit = items.find(i => i.label.toLowerCase().includes(q));
      if (hit) { toggleStartMenu(); input.value = ''; hit.run(); }
    }
  });
}

// -------------------------------------------------------------
// Calculator (mini app)
// -------------------------------------------------------------
function initCalculator() {
  const host = document.getElementById('calc-display');
  if (!host) return;
  host.textContent = '0';
  const expr: string[] = [];
  const display = host;
  function render() { display.textContent = expr.join('') || '0'; }
  const btns = document.getElementById('calc-buttons');
  if (!btns) return;
  btns.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button[data-v]') as HTMLButtonElement | null;
    if (!b) return;
    const v = b.getAttribute('data-v') || '';
    if (v === '=') {
      try { const r = new Function(`return (${expr.join('')})`)(); expr.length = 0; expr.push(String(r)); } catch { expr.length = 0; expr.push('0'); }
    } else if (v === 'C') { expr.length = 0; }
    else if (v === 'CE') { expr.pop(); }
    else if (v === '⌫') { expr.pop(); }
    else { expr.push(v); }
    render();
  });
}

// -------------------------------------------------------------
// Command Prompt (symbolic commands)
// -------------------------------------------------------------
function initCmd() {
  const out = document.getElementById('cmd-output');
  const input = document.getElementById('cmd-input') as HTMLInputElement | null;
  if (!out || !input) return;
  const print = (s: string) => { out.textContent += s + '\n'; out.scrollTop = out.scrollHeight; };
  print('TomoeOS [Version 1.0]');
  print('(c) Restu Utomo. Simulated shell.');
  print('');
  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    print('C:\\>' + raw);
    switch (true) {
      case cmd === '': break;
      case cmd === 'help': print('Commands: help, about, dir, videos, date, echo <text>, clear, exit, shutdown'); break;
      case cmd === 'about': print('TomoeOS - portfolio OS by Restu Utomo'); break;
      case cmd === 'dir' || cmd === 'ls': print(' Files  Restu Explorer'); print(' Videos  Libraries\\Videos'); print(' Pictures  Libraries\\Pictures'); break;
      case cmd === 'videos': print('Opening Videos library...'); openExplorerNav('videos'); break;
      case cmd === 'date': print(new Date().toString()); break;
      case cmd.startsWith('echo '): print(raw.slice(5)); break;
      case cmd === 'clear' || cmd === 'cls': out.textContent = ''; break;
      case cmd === 'exit': closeWindow(document.getElementById('win-cmd') as HTMLDivElement); break;
      case cmd === 'shutdown': shutdownOS(); break;
      default: print(`'${raw}' is not recognized. Type 'help'.`); break;
    }
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); } });
}

// -------------------------------------------------------------
// Explorer menu bar (File / Edit / View / Help)
// -------------------------------------------------------------
function initMenubar() {
  const menuBtns = document.querySelectorAll<HTMLButtonElement>('.menubar-item');
  menuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = btn.getAttribute('data-menu');
      document.querySelectorAll('.menubar-dropdown').forEach(d => {
        if (d.getAttribute('data-drop') === menu) d.classList.toggle('hidden');
        else d.classList.add('hidden');
      });
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.menubar-dropdown').forEach(d => d.classList.add('hidden'));
  });
}

// -------------------------------------------------------------
// All Programs panel (feature 5)
// -------------------------------------------------------------
export function toggleAllPrograms(e?: Event) {
  if (e) e.stopPropagation();
  const panel = document.getElementById('all-programs-panel');
  if (!panel) return;
  const wasHidden = panel.classList.contains('hidden');
  if (wasHidden) {
    const items: { label: string; icon: string; run: () => void }[] = [
      { label: 'Videos', icon: '/icons/folder-videos.webp', run: () => openExplorerNav('videos') },
      { label: 'Restu Explorer', icon: '/icons/fci-folder.svg', run: () => openWindow('win-explorer') },
      { label: 'Internet Explorer', icon: '/icons/fci-display.svg', run: () => openInternetExplorer() },
      { label: 'Notepad', icon: '/icons/welcome-note.svg', run: () => openWindow('win-notepad') },
      { label: 'Calculator', icon: '/icons/calc.webp', run: () => openWindow('win-calc') },
      { label: 'Command Prompt', icon: '/icons/fci-display.svg', run: () => openWindow('win-cmd') },
      { label: 'Games', icon: '/icons/games.webp', run: () => openWindow('win-games') },
      { label: 'Recycle Bin', icon: '/icons/bin.webp', run: () => openWindow('win-bin') },
      { label: 'Pictures', icon: '/icons/folder-pics.webp', run: () => openExplorerNav('pictures') },
      { label: 'Documents', icon: '/icons/folder-docs.webp', run: () => openExplorerNav('documents') },
      { label: 'Videos', icon: '/icons/folder-videos.webp', run: () => openExplorerNav('videos') },
      { label: 'Run...', icon: '/icons/fci-idea.svg', run: () => openRunDialog() },
      { label: 'Close All Windows', icon: '/icons/fci-ok.svg', run: () => confirmCloseAllWindows() },
    ];
    panel.innerHTML = '';
    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'w-full flex items-center gap-2 p-1.5 rounded hover:bg-blue-100 text-blue-950 text-left text-[11px] cursor-pointer';
      b.innerHTML = `<img src="${it.icon}" alt="" class="w-4 h-4" /><span>${it.label}</span>`;
      b.addEventListener('click', () => { toggleStartMenu(); it.run(); });
      panel.appendChild(b);
    });
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}
window.toggleAllPrograms = toggleAllPrograms;
