<template>
  <div class="aero-taskbar fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-sky-900/60 via-blue-950/70 to-slate-950/80 backdrop-blur-xl border-t border-white/30 flex items-center justify-between px-2 z-[9999] select-none shadow-lg pointer-events-auto">
    <!-- Left Section: Start Orb & Task Items -->
    <div class="flex items-center gap-1.5 h-full flex-1 min-w-0">
      <!-- Windows 7 Start Orb Button -->
      <button
        id="start-orb-btn"
        type="button"
        class="relative w-10 h-10 -mt-1 ml-0.5 cursor-pointer shrink-0 z-50 focus:outline-none select-none group"
        title="Start"
        @click.stop="$emit('toggle-start')"
      >
        <img
          :src="isStartOpen ? '/icons/start-orb-pressed.webp' : '/icons/start-orb-normal.webp'"
          alt="Start"
          class="w-full h-full object-contain drop-shadow transition-transform group-hover:scale-105 active:scale-95"
          :class="isStartOpen ? '' : 'group-hover:hidden'"
        />
        <img
          v-if="!isStartOpen"
          src="/icons/start-orb-hover.webp"
          alt="Start"
          class="w-full h-full object-contain drop-shadow transition-transform scale-105 hidden group-hover:block"
        />
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
              class="h-8 px-2.5 rounded-sm flex items-center gap-2 max-w-[170px] min-w-[110px] text-left transition-all border cursor-pointer select-none"
              :class="[
                isActive(String(id))
                  ? 'bg-white/30 border-white/60 shadow-inner text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-200'
              ]"
              @click="handleTaskClick(String(id))"
            >
              <img :src="win.icon" alt="" class="w-4 h-4 shrink-0" />
              <span class="text-xs font-medium truncate drop-shadow-sm">
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
    <div class="flex items-center gap-2 h-full shrink-0 pl-2">
      <!-- Volume Indicator Icon -->
      <button
        type="button"
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-slate-200"
        title="Volume"
        @click="playSound('click')"
      >
        <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      </button>

      <!-- Digital Clock & Date -->
      <div class="flex flex-col items-center justify-center px-2 py-0.5 rounded hover:bg-white/10 cursor-default text-[10px] leading-tight text-white drop-shadow-sm font-sans">
        <span class="font-bold tracking-wider">{{ currentTime }}</span>
        <span class="text-slate-300 text-[9px]">{{ currentDate }}</span>
      </div>

      <!-- Show Desktop Peek Button (Rightmost strip) -->
      <button
        type="button"
        class="w-3 h-full border-l border-white/30 hover:bg-white/30 active:bg-white/50 transition-colors ml-1 cursor-pointer"
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

  if (win.isMinimized) {
    playSound('restore')
    wm.bringToFront(id)
  } else if (wm.activeWindowId.value === id) {
    playSound('minimize')
    wm.minimizeWindow(id)
  } else {
    playSound('click')
    wm.bringToFront(id)
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
