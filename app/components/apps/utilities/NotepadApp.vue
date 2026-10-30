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

const DEFAULT_TEXT = `Welcome to TomoeOS [Version 7.1.7601]
Personal Portfolio of Restu Utomo

Profile:
- Role: Graphic Designer, Videographer & Photographer
- Education: Sanata Dharma University (Graduated 2026)
- Disciplines: Brand Identity, Motion Graphics, Video Production & Documentary Photography

Verified Highlights:
- Generated over 500,000 organic video views across institutional channels (2025 - 2026)
- Reached 26,000+ unique accounts with 53.8% non-follower discovery rate
- Directed visual media and event documentation for campus conferences and exhibitions

System Guide:
- Documents: Browse project galleries, case studies, and career history
- Internet Explorer: Watch video showreels on integrated YouTube web interface
- Media Player: Dedicated video stream player
- Curriculum Vitae: Download official PDF resume via desktop or Start Menu

Contact & Inquiries:
- Email: rstt.tomo@gmail.com
- Location: Yogyakarta, Indonesia`

const STORAGE_KEY = 'tomoeos-welcome-txt-v3'
const content = ref(DEFAULT_TEXT)

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) content.value = saved
  }
})

const autoSave = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, content.value)
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
