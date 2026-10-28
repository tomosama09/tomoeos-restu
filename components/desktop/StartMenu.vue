<template>
  <div
    class="aero-start-menu fixed bottom-10 left-1 w-[380px] h-[480px] rounded-t-lg bg-gradient-to-b from-sky-950/85 to-blue-950/95 border border-white/60 shadow-2xl backdrop-blur-2xl flex flex-col z-[10000] overflow-hidden select-none"
    @click.stop
  >
    <!-- Top 2-Pane Container -->
    <div class="flex-1 flex min-h-0">
      <!-- Left Pane (White Programs List) -->
      <div class="w-[220px] bg-white/95 p-2 flex flex-col justify-between border-r border-blue-200/50">
        <!-- Programs List -->
        <div class="space-y-1 overflow-y-auto pr-1">
          <button
            v-for="item in filteredApps"
            :key="item.id"
            type="button"
            class="w-full flex items-center gap-2 p-1.5 rounded hover:bg-sky-100 hover:border-sky-300 border border-transparent transition-colors text-left cursor-pointer group"
            @click="launchApp(item.id, item.actionUrl)"
          >
            <img :src="item.icon" alt="" class="w-6 h-6 shrink-0" />
            <div class="min-w-0">
              <div class="text-xs font-semibold text-slate-800 truncate">{{ item.title }}</div>
              <div class="text-[9px] text-slate-500 truncate">{{ item.desc }}</div>
            </div>
          </button>
        </div>

        <!-- All Programs Arrow -->
        <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-medium text-slate-700 px-1">
          <span class="text-[11px]">All Programs</span>
          <span class="text-sky-700">▶</span>
        </div>
      </div>

      <!-- Right Pane (Blue Quick Access Shortcuts) -->
      <div class="flex-1 p-3 flex flex-col justify-between text-slate-100 text-xs font-medium">
        <!-- User Avatar Header -->
        <div class="flex items-center gap-2 pb-2 border-b border-white/20">
          <div class="w-10 h-10 rounded-full border border-white/80 overflow-hidden bg-white/30 p-0.5">
            <img src="/images/restu-photo.webp" alt="Restu Utomo" class="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <div class="font-bold text-white text-[13px]">Restu Utomo</div>
            <div class="text-[10px] text-sky-200">Administrator</div>
          </div>
        </div>

        <!-- Shortcuts List -->
        <div class="space-y-2 py-2">
          <button
            type="button"
            class="w-full text-left hover:text-sky-300 transition-colors cursor-pointer"
            @click="openExplorerNav('documents')"
          >
            Documents
          </button>
          <button
            type="button"
            class="w-full text-left hover:text-sky-300 transition-colors cursor-pointer"
            @click="openExplorerNav('pictures')"
          >
            Pictures
          </button>
          <button
            type="button"
            class="w-full text-left hover:text-sky-300 transition-colors cursor-pointer"
            @click="launchApp('player')"
          >
            Videos (Showreel)
          </button>
          <button
            type="button"
            class="w-full text-left hover:text-sky-300 transition-colors cursor-pointer"
            @click="openExplorerNav('about')"
          >
            Computer
          </button>
          <a
            href="/Restu_Utomo_CV.pdf"
            download="Restu_Utomo_CV.pdf"
            class="block text-sky-200 hover:text-white transition-colors cursor-pointer"
          >
            Curriculum Vitae (PDF)
          </a>
        </div>

        <!-- Shutdown Button Area -->
        <div class="pt-2 border-t border-white/20 flex justify-end">
          <button
            type="button"
            class="px-3 py-1 bg-gradient-to-b from-sky-400 to-blue-700 hover:from-sky-300 hover:to-blue-600 border border-white/60 rounded text-xs font-bold text-white shadow active:scale-95 cursor-pointer"
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
        <svg viewBox="0 0 20 20" class="w-3.5 h-3.5 fill-slate-400">
          <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search programs and files"
          class="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
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
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()
const explorerNav = useState<string>('explorer-nav', () => 'about')

const searchQuery = ref('')

const apps = [
  { id: 'explorer', title: 'Restu Explorer', desc: 'Personal portfolio & credentials', icon: '/icons/fci-folder.svg' },
  { id: 'player', title: 'Tomoe Player', desc: 'YouTube showreel video player', icon: '/icons/fci-film.svg' },
  { id: 'notepad', title: 'Notepad', desc: 'Welcome.txt memo', icon: '/icons/txt.svg' },
  { id: 'calculator', title: 'Calculator', desc: 'Standard desktop calculator', icon: '/icons/calc.webp' },
  { id: 'games', title: 'Game Center', desc: 'Classic desktop games', icon: '/icons/games.webp' },
  { id: 'resume', title: 'Official CV Document', desc: 'Download verified PDF', icon: '/icons/pdf.svg', actionUrl: '/Restu_Utomo_CV.pdf' }
]

const filteredApps = computed(() => {
  if (!searchQuery.value.trim()) return apps
  const q = searchQuery.value.toLowerCase()
  return apps.filter(a => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q))
})

const launchApp = (id: string, actionUrl?: string) => {
  playSound('click')
  emit('close')
  if (actionUrl) {
    window.open(actionUrl, '_blank')
    return
  }
  wm.openWindow(id)
}

const openExplorerNav = (nav: 'about' | 'documents' | 'pictures') => {
  playSound('click')
  emit('close')
  explorerNav.value = nav
  wm.openWindow('explorer')
}

const handleShutdown = () => {
  playSound('click')
  emit('close')
  // Close all open windows
  for (const id of Object.keys(wm.windows.value)) {
    wm.closeWindow(id)
  }
}
</script>
