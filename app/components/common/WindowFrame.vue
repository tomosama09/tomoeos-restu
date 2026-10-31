<template>
  <div
    v-if="win && win.isOpen"
    :id="`win-${id}`"
    ref="winEl"
    class="window aero-glass-window pointer-events-auto absolute flex flex-col transition-shadow duration-150"
    :class="[
      isActive ? 'active-window shadow-2xl' : 'opacity-95 shadow-md',
      win.isMinimized ? 'hidden' : 'flex',
      (isMobile || win.isMaximized) ? '!inset-0 !w-full !h-[calc(100dvh-40px)] !rounded-none !top-0 !left-0 border-x-0 border-t-0 bg-[#eef4fb] !backdrop-blur-none' : ''
    ]"
    :style="windowStyle"
    @pointerdown="onWindowPointerDown"
  >
    <!-- Titlebar -->
    <div
      class="aero-titlebar win-header shrink-0 flex items-center justify-between px-2.5 py-1.5 cursor-move select-none"
      :class="isMobile ? '!bg-gradient-to-b !from-[#f5f9fd] !via-[#e7f1fb] !to-[#d4e4f5] border-b border-[#a9c7e8]' : ''"
      @pointerdown="onTitlebarPointerDown"
      @dblclick="toggleMaximize"
    >
      <div class="flex items-center gap-2 overflow-hidden pointer-events-none">
        <img v-if="icon" :src="icon" alt="" class="w-4 h-4 shrink-0" />
        <span class="aero-title-text text-xs font-semibold text-slate-800 drop-shadow-sm truncate">
          {{ title }}
        </span>
      </div>

      <!-- Caption Controls (Aero style) -->
      <div class="aero-caption-controls flex items-center gap-0.5 pointer-events-auto">
        <!-- Minimize -->
        <button
          type="button"
          class="aero-cap-btn traffic-minimize w-8 sm:w-7 h-6 sm:h-5 flex items-center justify-center rounded-sm hover:bg-white/40 active:bg-white/60 text-slate-700 transition-colors cursor-pointer"
          title="Minimize"
          @click.stop="handleMinimize"
        >
          <svg viewBox="0 0 10 10" width="8" height="8">
            <line x1="1.5" y1="8" x2="8.5" y2="8" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </button>

        <!-- Maximize / Restore (Hidden on mobile) -->
        <button
          v-if="!isMobile"
          type="button"
          class="aero-cap-btn traffic-fullscreen w-7 h-5 flex items-center justify-center rounded-sm hover:bg-white/40 active:bg-white/60 text-slate-700 transition-colors cursor-pointer"
          :title="win.isMaximized ? 'Restore Down' : 'Maximize'"
          @click.stop="toggleMaximize"
        >
          <svg viewBox="0 0 10 10" width="8" height="8">
            <rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.4" />
          </svg>
        </button>

        <!-- Close -->
        <button
          type="button"
          class="aero-cap-btn aero-cap-close traffic-close w-10 h-6 sm:h-5 flex items-center justify-center rounded-sm hover:bg-red-500 hover:text-white active:bg-red-600 text-slate-700 transition-colors cursor-pointer"
          title="Close"
          @click.stop="handleClose"
        >
          <svg viewBox="0 0 10 10" width="9" height="9">
            <line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.6" />
            <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Window Body Container -->
    <div class="flex-1 min-h-0 overflow-auto bg-slate-50/95 relative flex flex-col">
      <slot />
    </div>

    <!-- Resize Grip Handles (only when not maximized and desktop) -->
    <template v-if="!isMobile && !win.isMaximized">
      <div
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
        @pointerdown.stop="onResizeCornerPointerDown"
      />
      <div
        class="absolute top-0 right-0 w-1.5 h-full cursor-e-resize z-10"
        @pointerdown.stop="onResizeRightPointerDown"
      />
      <div
        class="absolute bottom-0 left-0 w-full h-1.5 cursor-s-resize z-10"
        @pointerdown.stop="onResizeBottomPointerDown"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const props = defineProps<{
  id: string
  title: string
  icon?: string
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()

const win = computed(() => wm.windows.value[props.id])
const isActive = computed(() => wm.activeWindowId.value === props.id)

const isMobile = ref(false)

const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }
})

const windowStyle = computed(() => {
  if (!win.value) return {}
  if (isMobile.value || win.value.isMaximized) {
    return {
      top: '0px',
      left: '0px',
      width: '100%',
      height: 'calc(100dvh - 40px)',
      borderRadius: '0px',
      zIndex: win.value.zIndex
    }
  }
  return {
    top: `${win.value.y}px`,
    left: `${win.value.x}px`,
    width: `${win.value.w}px`,
    height: `${win.value.h}px`,
    zIndex: win.value.zIndex
  }
})

const onWindowPointerDown = () => {
  wm.bringToFront(props.id, isMobile.value)
}

const handleMinimize = () => {
  playSound('minimize')
  wm.minimizeWindow(props.id)
}

const toggleMaximize = () => {
  if (isMobile.value) return
  playSound('click')
  wm.maximizeWindow(props.id)
}

const handleClose = () => {
  playSound('click')
  wm.closeWindow(props.id)
}

// DRAGGING IMPLEMENTATION
let isDragging = false
let startX = 0
let startY = 0
let initialWinX = 0
let initialWinY = 0

const onTitlebarPointerDown = (e: PointerEvent) => {
  if (!win.value || win.value.isMaximized || isMobile.value) return
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  initialWinX = win.value.x
  initialWinY = win.value.y

  wm.bringToFront(props.id)

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging || !win.value) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  const nextX = initialWinX + dx
  const nextY = initialWinY + dy
  wm.updatePosition(props.id, nextX, nextY)
}

const onPointerUp = () => {
  isDragging = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

// RESIZING IMPLEMENTATION
let isResizing = false
let resizeStartX = 0
let resizeStartY = 0
let initialW = 0
let initialH = 0
let resizeMode: 'corner' | 'right' | 'bottom' = 'corner'

const startResize = (e: PointerEvent, mode: 'corner' | 'right' | 'bottom') => {
  if (!win.value || win.value.isMaximized || isMobile.value) return
  isResizing = true
  resizeMode = mode
  resizeStartX = e.clientX
  resizeStartY = e.clientY
  initialW = win.value.w
  initialH = win.value.h

  wm.bringToFront(props.id)

  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', onResizeUp)
}

const onResizeCornerPointerDown = (e: PointerEvent) => startResize(e, 'corner')
const onResizeRightPointerDown = (e: PointerEvent) => startResize(e, 'right')
const onResizeBottomPointerDown = (e: PointerEvent) => startResize(e, 'bottom')

const onResizeMove = (e: PointerEvent) => {
  if (!isResizing || !win.value) return
  const dx = e.clientX - resizeStartX
  const dy = e.clientY - resizeStartY

  let newW = initialW
  let newH = initialH

  if (resizeMode === 'corner' || resizeMode === 'right') {
    newW = Math.max(320, initialW + dx)
  }
  if (resizeMode === 'corner' || resizeMode === 'bottom') {
    newH = Math.max(220, initialH + dy)
  }

  wm.updateSize(props.id, newW, newH)
}

const onResizeUp = () => {
  isResizing = false
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', onResizeUp)
}
</script>
