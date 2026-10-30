import { useState } from '#imports'

export interface WindowState {
  id: string
  title: string
  icon: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  x: number
  y: number
  w: number
  h: number
  initialW: number
  initialH: number
}

const DEFAULT_WINDOWS: Record<string, WindowState> = {
  explorer: {
    id: 'explorer',
    title: 'Explorer',
    icon: '/icons/computer.webp',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    x: 100,
    y: 40,
    w: 780,
    h: 620,
    initialW: 780,
    initialH: 620
  },
  player: {
    id: 'player',
    title: 'Media Player',
    icon: '/icons/folder-videos.webp',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    x: 160,
    y: 70,
    w: 680,
    h: 490,
    initialW: 680,
    initialH: 490
  },
  notepad: {
    id: 'notepad',
    title: 'Welcome.txt - Notepad',
    icon: '/icons/welcome-note.svg',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    x: 220,
    y: 90,
    w: 520,
    h: 380,
    initialW: 520,
    initialH: 380
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: '/icons/calc.webp',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    x: 280,
    y: 110,
    w: 300,
    h: 410,
    initialW: 300,
    initialH: 410
  },
  games: {
    id: 'games',
    title: 'Games',
    icon: '/icons/games.webp',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    x: 190,
    y: 80,
    w: 580,
    h: 460,
    initialW: 580,
    initialH: 460
  }
}

export function useWindowManager() {
  const windows = useState<Record<string, WindowState>>('wm-windows', () => {
    return JSON.parse(JSON.stringify(DEFAULT_WINDOWS))
  })
  
  const activeWindowId = useState<string | null>('wm-active-id', () => 'explorer')
  const maxZIndex = useState<number>('wm-max-z', () => 10)

  const bringToFront = (id: string) => {
    const win = windows.value[id]
    if (!win) return
    maxZIndex.value += 1
    win.zIndex = maxZIndex.value
    win.isMinimized = false
    activeWindowId.value = id
  }

  const openWindow = (id: string) => {
    const win = windows.value[id]
    if (!win) return
    win.isOpen = true
    win.isMinimized = false
    bringToFront(id)
  }

  const closeWindow = (id: string) => {
    const win = windows.value[id]
    if (!win) return
    win.isOpen = false
    if (activeWindowId.value === id) {
      // Find next topmost open window
      let nextTopId: string | null = null
      let highestZ = -1
      for (const [wId, w] of Object.entries(windows.value)) {
        if (w.isOpen && !w.isMinimized && w.zIndex > highestZ) {
          highestZ = w.zIndex
          nextTopId = wId
        }
      }
      activeWindowId.value = nextTopId
    }
  }

  const minimizeWindow = (id: string) => {
    const win = windows.value[id]
    if (!win) return
    win.isMinimized = true
    if (activeWindowId.value === id) {
      activeWindowId.value = null
    }
  }

  const maximizeWindow = (id: string) => {
    const win = windows.value[id]
    if (!win) return
    win.isMaximized = !win.isMaximized
    bringToFront(id)
  }

  const updatePosition = (id: string, x: number, y: number) => {
    const win = windows.value[id]
    if (!win) return
    win.x = x
    win.y = Math.max(0, y) // Prevent window titlebar from disappearing above viewport
  }

  const updateSize = (id: string, w: number, h: number) => {
    const win = windows.value[id]
    if (!win) return
    win.w = Math.max(300, w)
    win.h = Math.max(200, h)
  }

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updatePosition,
    updateSize
  }
}
