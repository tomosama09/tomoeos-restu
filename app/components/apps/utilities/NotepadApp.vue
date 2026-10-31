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
        class="flex-1 p-3 font-mono text-xs sm:text-[13px] text-slate-800 resize-none focus:outline-none leading-relaxed bg-white select-text"
        placeholder="Type notes here..."
        @input="autoSave"
      />

      <!-- Interactive Quick Launch Pills (Seamless navigation from Welcome text) -->
      <div class="p-2 bg-sky-50/90 border-t border-blue-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
        <span class="text-[10px] font-bold text-blue-900 uppercase tracking-wider shrink-0 mr-0.5">Explore:</span>
        <button
          type="button"
          class="px-2.5 py-1 rounded-full bg-white hover:bg-sky-100 border border-blue-300 text-xs font-semibold text-blue-950 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-all"
          @click="openApp('explorer')"
        >
          <img src="/icons/folder-docs.webp" alt="" class="w-3.5 h-3.5 object-contain" />
          <span>Documents</span>
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-full bg-white hover:bg-sky-100 border border-blue-300 text-xs font-semibold text-blue-950 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-all"
          @click="openApp('ie')"
        >
          <img src="/icons/internet-explorer.svg" alt="" class="w-3.5 h-3.5 object-contain" />
          <span>Showreel (YouTube)</span>
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-full bg-white hover:bg-sky-100 border border-blue-300 text-xs font-semibold text-blue-950 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-all"
          @click="openApp('player')"
        >
          <img src="/icons/wmp.svg" alt="" class="w-3.5 h-3.5 object-contain" />
          <span>Media Player</span>
        </button>
        <a
          href="/Restu_Utomo_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="px-2.5 py-1 rounded-full bg-white hover:bg-sky-100 border border-blue-300 text-xs font-semibold text-blue-950 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-all"
        >
          <img src="/icons/pdf.svg" alt="" class="w-3.5 h-3.5 object-contain" />
          <span>Resume (PDF)</span>
        </a>
      </div>

      <!-- Statusbar -->
      <div class="h-5 bg-slate-100 border-t border-slate-200 px-3 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <span>CRLF • UTF-8</span>
        <span>Ln {{ lineCount }}, Col {{ colCount }}</span>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const wm = useWindowManager()
const { playSound } = useAudioFeedback()

const openApp = (id: string) => {
  playSound('click')
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  wm.openWindow(id, isMobile)
}

const DEFAULT_TEXT = `Hello!

Welcome to my digital workspace. I am Restu Utomo, a graphic designer, videographer, and photographer based in Yogyakarta, and a 2026 graduate of Sanata Dharma University.

I built this portfolio operating system inspired by late-2000s desktop interfaces.

Quick navigation:
- Documents: Complete case studies, posters, and background
- Internet Explorer: Video showreels directly on YouTube
- Media Player: Audio player with curated tracks
- Paint: Canvas sketching tools
- Games: Classic desktop games
- Command Prompt: Terminal navigation
- Resume: CV download via desktop or Start Menu

Reach me anytime at rstt.tomo@gmail.com.

Warm regards,
Restu Utomo`

const STORAGE_KEY = 'tomoeos-welcome-txt-v7'
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
