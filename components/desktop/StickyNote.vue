<template>
  <div
    v-if="isVisible"
    ref="stickyRef"
    class="desktop-sticky absolute w-56 rotate-1 z-30 pointer-events-auto select-none"
    :style="{ top: `${top}px`, left: `${left}px` }"
    @mousedown="startDrag"
  >
    <div class="bg-gradient-to-b from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md shadow-xl p-3.5 text-[11px] text-yellow-900 leading-relaxed font-sans cursor-move">
      <!-- Header -->
      <div class="flex items-start justify-between mb-1.5 cursor-move">
        <span
          class="font-bold text-xs outline-none"
          contenteditable="true"
          @blur="onTitleChange"
        >
          {{ noteTitle }}
        </span>
        <div class="flex items-center gap-1.5 shrink-0" @mousedown.stop>
          <button
            type="button"
            title="Close note"
            class="text-yellow-700 hover:text-red-600 font-bold text-xs cursor-pointer p-0.5"
            @click="closeNote"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Body -->
      <p
        class="outline-none text-[11px] leading-relaxed cursor-text"
        contenteditable="true"
        @mousedown.stop
        @blur="onBodyChange"
      >
        {{ noteBody }}
      </p>

      <!-- Contact email -->
      <p class="mt-2 text-yellow-800 font-semibold text-[10px]">
        <a href="mailto:rstt.tomo@gmail.com" class="hover:underline" @mousedown.stop>rstt.tomo@gmail.com</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

const isVisible = ref(true)
const noteTitle = ref('Hiring / Production')
const noteBody = ref('Available for event media documentation, photography, and graphic design.')

const top = ref(290)
const left = ref(900)

const stickyRef = ref<HTMLElement | null>(null)
let isDragging = false
let offsetX = 0
let offsetY = 0

const loadSavedState = () => {
  if (typeof window === 'undefined') return
  try {
    const saved = localStorage.getItem('tomoeos-sticky-note')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.title) noteTitle.value = data.title
      if (data.body) noteBody.value = data.body
      if (typeof data.top === 'number') top.value = data.top
      if (typeof data.left === 'number') left.value = data.left
      if (typeof data.visible === 'boolean') isVisible.value = data.visible
      return
    }
  } catch {
    // fallback
  }
  // Default position: top 290, right aligned
  left.value = Math.max(20, window.innerWidth - 250)
}

const saveState = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('tomoeos-sticky-note', JSON.stringify({
      title: noteTitle.value,
      body: noteBody.value,
      top: top.value,
      left: left.value,
      visible: isVisible.value
    }))
  } catch {
    // quota guard
  }
}

const startDrag = (e: MouseEvent) => {
  if ((e.target as HTMLElement).isContentEditable) return
  isDragging = true
  offsetX = e.clientX - left.value
  offsetY = e.clientY - top.value
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging) return
  left.value = Math.max(4, Math.min(window.innerWidth - 240, e.clientX - offsetX))
  top.value = Math.max(4, Math.min(window.innerHeight - 180, e.clientY - offsetY))
}

const stopDrag = () => {
  if (!isDragging) return
  isDragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  saveState()
}

const onTitleChange = (e: Event) => {
  noteTitle.value = (e.target as HTMLElement).innerText || 'Hiring / Production'
  saveState()
}

const onBodyChange = (e: Event) => {
  noteBody.value = (e.target as HTMLElement).innerText || ''
  saveState()
}

const closeNote = () => {
  playSound('click')
  isVisible.value = false
  saveState()
}

onMounted(() => {
  loadSavedState()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
  }
})
</script>
