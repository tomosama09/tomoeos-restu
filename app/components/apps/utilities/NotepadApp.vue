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

const DEFAULT_TEXT = `Hello!

Welcome to my digital workspace. I am Restu Utomo, a graphic designer, videographer, and photographer based in Yogyakarta, and a 2026 graduate of Sanata Dharma University.

I built this portfolio operating system inspired by the tactile, luminous aesthetics of late-2000s desktop environments. For me, visual design is about giving ideas clarity, structure, and emotional resonance.

Over the past two years, my work has focused on institutional branding, poster design systems, and video documentation. This includes directing trailers and aftermovies that reached over 500,000 organic views and connected with 26,000+ unique accounts (with a 53.8% non-follower discovery rate), as well as developing visual identity systems for campus exhibitions.

Here is a quick guide to explore my work:
- Open "Documents" to view my complete case studies, poster series, and career background.
- Launch "Internet Explorer" or "Media Player" to watch my video showreels directly on YouTube.
- Try "Paint" if you want to sketch an idea on the canvas.
- Check "Command Prompt" if you prefer keyboard navigation.
- Download my official resume from the desktop or Start Menu.

If you are looking for a dedicated collaborator on creative direction, video documentation, or brand identity projects, my inbox is always open at rstt.tomo@gmail.com.

Warm regards,
Restu Utomo`

const STORAGE_KEY = 'tomoeos-welcome-txt-v4'
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
