<template>
  <div
    class="aero-start-menu open fixed bottom-10 left-1 w-[390px] h-[480px] rounded-t-lg bg-gradient-to-b from-sky-950/90 via-blue-950/95 to-slate-950/95 border border-white/60 shadow-2xl backdrop-blur-2xl flex flex-col z-[10000] overflow-hidden select-none"
    @click.stop
  >
    <!-- Top 2-Pane Container -->
    <div class="flex-1 flex min-h-0">
      <!-- Left Pane (White Programs List) -->
      <div class="w-[225px] bg-white/95 p-2 flex flex-col justify-between border-r border-blue-200/60">
        <!-- 1. Pinned Apps / Search Results -->
        <div v-if="!isAllPrograms" class="space-y-1 overflow-y-auto pr-1 flex-1">
          <button
            v-for="item in filteredApps"
            :key="item.id"
            type="button"
            class="w-full flex items-center gap-2.5 p-1.5 rounded hover:bg-sky-100 hover:border-sky-300 border border-transparent transition-colors text-left cursor-pointer group"
            @click="launchApp(item.id, item.actionUrl)"
          >
            <img :src="item.icon" alt="" class="w-7 h-7 object-contain shrink-0" />
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-900 truncate">{{ item.title }}</div>
              <div class="text-[10px] text-slate-600 truncate">{{ item.desc }}</div>
            </div>
          </button>
        </div>

        <!-- 2. All Programs Full Tree View -->
        <div v-else class="space-y-1 overflow-y-auto pr-1 flex-1 text-slate-900">
          <div class="text-[10px] font-bold text-slate-500 uppercase px-1 py-0.5">Programs & Utilities</div>
          <button
            v-for="prog in allProgramList"
            :key="prog.id"
            type="button"
            class="w-full flex items-center gap-2 p-1.5 rounded hover:bg-sky-100 hover:border-sky-300 border border-transparent transition-colors text-left cursor-pointer"
            @click="prog.nav ? openExplorerNav(prog.nav) : launchApp(prog.id, prog.actionUrl)"
          >
            <img :src="prog.icon" alt="" class="w-5 h-5 object-contain shrink-0" />
            <span class="text-xs font-semibold text-slate-900 truncate">{{ prog.title }}</span>
          </button>
        </div>

        <!-- All Programs Toggle Button (Clickable!) -->
        <button
          type="button"
          class="pt-2 mt-1 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-700 px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer transition-colors"
          @click="toggleAllPrograms"
        >
          <span v-if="!isAllPrograms" class="flex items-center gap-1.5">
            <span>All Programs</span>
          </span>
          <span v-else class="flex items-center gap-1.5">
            <span>◀ Back</span>
          </span>
          <span v-if="!isAllPrograms" class="text-sky-700 text-[10px]">▶</span>
        </button>
      </div>

      <!-- Right Pane (Blue Quick Access Shortcuts) -->
      <div class="flex-1 p-3 flex flex-col justify-between text-white text-xs font-semibold">
        <!-- User Avatar Header (No Personal Photo) -->
        <div class="flex items-center gap-2.5 pb-2.5 border-b border-white/20">
          <div class="w-10 h-10 rounded-md border border-white/60 overflow-hidden bg-white/20 p-0.5 shadow-sm shrink-0">
            <img src="/icons/logon-avatar.svg" alt="User Avatar" class="w-full h-full object-cover rounded-sm" />
          </div>
          <div class="min-w-0">
            <div class="font-bold text-white text-[13px] drop-shadow-sm truncate">Restu Utomo</div>
            <div class="text-[10px] text-sky-200">Administrator</div>
          </div>
        </div>

        <!-- Shortcuts List (High Contrast White Text) -->
        <div class="space-y-1.5 py-2">
          <button
            type="button"
            class="w-full text-left px-2 py-1 rounded hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer drop-shadow-sm flex items-center gap-2"
            @click="openExplorerNav('documents')"
          >
            <img src="/icons/folder-docs.webp" alt="" class="w-4 h-4 object-contain" />
            <span>Documents</span>
          </button>
          <button
            type="button"
            class="w-full text-left px-2 py-1 rounded hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer drop-shadow-sm flex items-center gap-2"
            @click="openExplorerNav('pictures')"
          >
            <img src="/icons/folder-pics.webp" alt="" class="w-4 h-4 object-contain" />
            <span>Pictures</span>
          </button>
          <button
            type="button"
            class="w-full text-left px-2 py-1 rounded hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer drop-shadow-sm flex items-center gap-2"
            @click="launchApp('player')"
          >
            <img src="/icons/folder-videos.webp" alt="" class="w-4 h-4 object-contain" />
            <span>Media Player</span>
          </button>
          <button
            type="button"
            class="w-full text-left px-2 py-1 rounded hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer drop-shadow-sm flex items-center gap-2"
            @click="openExplorerNav('about')"
          >
            <img src="/icons/computer.webp" alt="" class="w-4 h-4 object-contain" />
            <span>Computer</span>
          </button>
          <a
            href="/Restu_Utomo_CV.pdf"
            download="Restu_Utomo_CV.pdf"
            class="block px-2 py-1 rounded hover:bg-white/20 text-sky-200 hover:text-white font-semibold transition-colors cursor-pointer drop-shadow-sm flex items-center gap-2"
          >
            <img src="/icons/pdf.svg" alt="" class="w-4 h-4 object-contain" />
            <span>Curriculum Vitae</span>
          </a>
        </div>

        <!-- Shutdown Button Area -->
        <div class="pt-2 border-t border-white/20 flex justify-end">
          <button
            type="button"
            class="px-3.5 py-1 bg-gradient-to-b from-sky-400 to-blue-700 hover:from-sky-300 hover:to-blue-600 border border-white/60 rounded text-xs font-bold text-white shadow active:scale-95 cursor-pointer"
            @click="handleShutdown"
          >
            Shut down
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Search Bar -->
    <div class="h-10 bg-gradient-to-b from-slate-200 to-slate-100 p-1.5 flex items-center border-t border-white/40">
      <div class="w-full h-full bg-white rounded border border-slate-300 px-2 flex items-center gap-1.5 shadow-inner">
        <svg viewBox="0 0 20 20" class="w-3.5 h-3.5 fill-slate-500 shrink-0">
          <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search programs and files"
          class="w-full bg-transparent text-xs text-slate-900 placeholder-slate-500 font-medium focus:outline-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'shutdown'): void
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()
const explorerNav = useState<string>('explorer-nav', () => 'about')

const searchQuery = ref('')
const isAllPrograms = ref(false)

const apps = [
  { id: 'explorer', title: 'Explorer', desc: 'File management & portfolio', icon: '/icons/computer.webp' },
  { id: 'player', title: 'Media Player', desc: 'Video showreel player', icon: '/icons/folder-videos.webp' },
  { id: 'notepad', title: 'Notepad', desc: 'Welcome.txt memo', icon: '/icons/welcome-note.svg' },
  { id: 'calculator', title: 'Calculator', desc: 'Standard desktop calculator', icon: '/icons/calc.webp' },
  { id: 'games', title: 'Games', desc: 'Classic desktop games collection', icon: '/icons/games.webp' },
  { id: 'resume', title: 'Curriculum Vitae', desc: 'Official PDF Document', icon: '/icons/pdf.svg', actionUrl: '/Restu_Utomo_CV.pdf' }
]

const allProgramList = [
  { id: 'explorer', title: 'Explorer', icon: '/icons/computer.webp' },
  { id: 'player', title: 'Media Player', icon: '/icons/folder-videos.webp' },
  { id: 'notepad', title: 'Notepad', icon: '/icons/welcome-note.svg' },
  { id: 'calculator', title: 'Calculator', icon: '/icons/calc.webp' },
  { id: 'games', title: 'Games', icon: '/icons/games.webp' },
  { id: 'docs', title: 'Documents Library', icon: '/icons/folder-docs.webp', nav: 'documents' as const },
  { id: 'pics', title: 'Pictures Library', icon: '/icons/folder-pics.webp', nav: 'pictures' as const },
  { id: 'vids', title: 'Videos Library', icon: '/icons/folder-videos.webp', nav: 'videos' as const },
  { id: 'cv', title: 'Curriculum Vitae (PDF)', icon: '/icons/pdf.svg', actionUrl: '/Restu_Utomo_CV.pdf' }
]

const filteredApps = computed(() => {
  if (!searchQuery.value.trim()) return apps
  const q = searchQuery.value.toLowerCase()
  return apps.filter(a => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q))
})

const toggleAllPrograms = () => {
  playSound('click')
  isAllPrograms.value = !isAllPrograms.value
}

const launchApp = (id: string, actionUrl?: string) => {
  playSound('click')
  emit('close')
  if (actionUrl) {
    window.open(actionUrl, '_blank')
    return
  }
  wm.openWindow(id)
}

const openExplorerNav = (nav: 'about' | 'documents' | 'pictures' | 'videos') => {
  playSound('click')
  emit('close')
  explorerNav.value = nav
  wm.openWindow('explorer')
}

const handleShutdown = () => {
  playSound('click')
  emit('close')
  emit('shutdown')
  for (const id of Object.keys(wm.windows.value)) {
    wm.closeWindow(id)
  }
}
</script>
