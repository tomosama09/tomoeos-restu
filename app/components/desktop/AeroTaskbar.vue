<template>
  <div class="aero-taskbar fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-sky-900/60 via-blue-950/70 to-slate-950/80 backdrop-blur-xl border-t border-white/30 flex items-center justify-between px-2 z-[9999] select-none shadow-lg pointer-events-auto">
    <!-- Left Section: Start Orb & Task Items -->
    <div class="flex items-center gap-1.5 h-full flex-1 min-w-0">
      <!-- Dark Blue Glossy Start Orb (No Windows Logo) -->
      <button
        id="start-orb-btn"
        type="button"
        class="relative w-9 h-9 rounded-full cursor-pointer shrink-0 z-50 focus:outline-none select-none transition-transform active:scale-95 flex items-center justify-center border border-white/60 shadow-[0_2px_6px_rgba(0,15,40,0.6)]"
        :class="isStartOpen ? 'ring-2 ring-sky-300 ring-offset-1 ring-offset-blue-950 bg-gradient-to-b from-blue-900 to-slate-950' : 'bg-gradient-to-b from-sky-600 via-blue-800 to-blue-950 hover:from-sky-500 hover:via-blue-700 hover:to-blue-900'"
        title="Start"
        @click.stop="$emit('toggle-start')"
      >
        <!-- Gloss Reflection Upper Half -->
        <div class="absolute top-0.5 left-1 right-1 h-3.5 rounded-t-full bg-gradient-to-b from-white/70 to-white/10 pointer-events-none" />
      </button>

      <!-- Taskbar Open Windows Buttons -->
      <div class="flex items-center gap-1 h-full py-1 overflow-x-auto no-scrollbar">
        <template v-for="(win, id) in wm.windows.value" :key="id">
          <div
            v-if="win.isOpen"
            class="relative h-full flex items-center"
            @mouseenter="hoveredWinId = String(id)"
            @mouseleave="hoveredWinId = null"
          >
            <button
              type="button"
              class="h-8 px-2 sm:px-2.5 rounded-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 max-w-[40px] sm:max-w-[170px] min-w-[36px] sm:min-w-[110px] text-left transition-all border cursor-pointer select-none"
              :class="[
                isActive(String(id))
                  ? 'bg-white/30 border-white/60 shadow-inner text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-200'
              ]"
              :title="win.title"
              @click="handleTaskClick(String(id))"
            >
              <img :src="win.icon" :alt="win.title" class="w-4 h-4 shrink-0" />
              <span class="hidden sm:inline text-xs font-medium truncate drop-shadow-sm">
                {{ win.title }}
              </span>
            </button>

            <!-- Aero Peek Preview Tooltip -->
            <TaskbarPreview
              v-if="hoveredWinId === id"
              :title="win.title"
              :icon="win.icon"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Right Section: System Tray & Clock & Show Desktop -->
    <div class="flex items-center gap-1 sm:gap-2 h-full shrink-0 pl-1 sm:pl-2">
      <!-- Volume Indicator Icon (Desktop only) -->
      <button
        type="button"
        class="hidden sm:flex w-6 h-6 items-center justify-center rounded hover:bg-white/20 text-slate-200 cursor-pointer"
        title="Volume"
        @click="playSound('click')"
      >
        <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      </button>

      <!-- Digital Clock & Date -->
      <div class="flex flex-col items-center justify-center px-1.5 sm:px-2 py-0.5 rounded hover:bg-white/10 cursor-default text-[10px] leading-tight text-white drop-shadow-sm font-sans">
        <span class="font-bold tracking-wider">{{ currentTime }}</span>
        <span class="hidden sm:inline text-slate-300 text-[9px]">{{ currentDate }}</span>
      </div>

      <!-- Show Desktop Peek Button (Rightmost strip) -->
      <button
        type="button"
        class="w-2.5 sm:w-3 h-full border-l border-white/30 hover:bg-white/30 active:bg-white/50 transition-colors ml-0.5 sm:ml-1 cursor-pointer"
        title="Show Desktop"
        @click="handleShowDesktop"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'
import TaskbarPreview from '~/components/desktop/TaskbarPreview.vue'

defineProps<{
  isStartOpen: boolean
}>()

defineEmits<{
  (e: 'toggle-start'): void
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()

const hoveredWinId = ref<string | null>(null)
const currentTime = ref('12:00 PM')
const currentDate = ref('10/28/2026')

let clockTimer: ReturnType<typeof setInterval> | null = null

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  currentDate.value = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

const isActive = (id: string) => {
  const win = wm.windows.value[id]
  return win && wm.activeWindowId.value === id && !win.isMinimized
}

const handleTaskClick = (id: string) => {
  const win = wm.windows.value[id]
  if (!win) return
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (win.isMinimized) {
    playSound('restore')
    wm.bringToFront(id, isMobile)
  } else if (wm.activeWindowId.value === id) {
    playSound('minimize')
    wm.minimizeWindow(id)
  } else {
    playSound('click')
    wm.bringToFront(id, isMobile)
  }
}

const handleShowDesktop = () => {
  playSound('click')
  for (const [id, win] of Object.entries(wm.windows.value)) {
    if (win.isOpen && !win.isMinimized) {
      wm.minimizeWindow(id)
    }
  }
}
</script>
