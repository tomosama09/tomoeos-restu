<template>
  <WindowFrame id="notepad" title="Notepad - Welcome.txt" icon="/icons/txt.svg">
    <div class="flex flex-col h-full bg-white select-none">
      <!-- Menubar -->
      <div class="h-6 bg-slate-100 border-b border-slate-200 px-2 flex items-center gap-3 text-xs text-slate-700 shrink-0">
        <button type="button" class="hover:bg-slate-200 px-1.5 rounded cursor-pointer" @click="saveNote">Save</button>
        <button type="button" class="hover:bg-slate-200 px-1.5 rounded cursor-pointer" @click="resetNote">Reset</button>
      </div>

      <!-- Textarea editor -->
      <textarea
        v-model="content"
        class="flex-1 p-3 font-mono text-xs text-slate-800 resize-none focus:outline-none leading-relaxed bg-white select-text"
        placeholder="Type notes here..."
        @input="autoSave"
      />

      <!-- Statusbar -->
      <div class="h-5 bg-slate-100 border-t border-slate-200 px-3 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <span>Windows (CRLF) • UTF-8</span>
        <span>Ln {{ lineCount }}, Col {{ colCount }}</span>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

const DEFAULT_TEXT = `Welcome to TomoeOS.

Restu Utomo
Graphic Designer, Videographer & Photographer
Sanata Dharma University (2026)

Key Milestones:
- Over 500,000 organic views on institutional social channels (2025 to 2026)
- 26,000+ unique accounts reached with 53.8% non-follower discovery
- Technical broadcast desk & documentation for LLTC 2025

Feel free to browse Restu Explorer or launch Tomoe Player for showreels.`

const content = ref(DEFAULT_TEXT)

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('tomoeos-welcome-txt')
    if (saved) content.value = saved
  }
})

const autoSave = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('tomoeos-welcome-txt', content.value)
  }
}

const saveNote = () => {
  playSound('click')
  autoSave()
}

const resetNote = () => {
  playSound('click')
  content.value = DEFAULT_TEXT
  autoSave()
}

const lineCount = computed(() => content.value.split('\n').length)
const colCount = computed(() => (content.value.split('\n').pop() || '').length + 1)
</script>
