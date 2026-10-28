<template>
  <WindowFrame id="explorer" title="Explorer" icon="/icons/computer.webp">
    <div class="flex flex-col h-full overflow-hidden select-none">
      <!-- Windows 7 Explorer Menubar -->
      <div class="explorer-menubar shrink-0 bg-gradient-to-b from-slate-100 to-slate-200 border-b border-slate-300/80 px-2 py-0.5 flex items-center gap-3 text-xs text-slate-700">
        <button type="button" class="menubar-item hover:bg-white/80 px-1.5 py-0.5 rounded cursor-pointer" @click="currentNav = 'about'">File</button>
        <button type="button" class="menubar-item hover:bg-white/80 px-1.5 py-0.5 rounded cursor-pointer" @click="currentNav = 'services'">Edit</button>
        <button type="button" class="menubar-item hover:bg-white/80 px-1.5 py-0.5 rounded cursor-pointer" @click="currentNav = 'experience'">View</button>
        <button type="button" class="menubar-item hover:bg-white/80 px-1.5 py-0.5 rounded cursor-pointer" @click="currentNav = 'contact'">Help</button>
      </div>

      <!-- Windows 7 Explorer Address Bar Toolbar -->
      <div class="explorer-toolbar shrink-0 bg-gradient-to-b from-white to-slate-100 border-b border-slate-300 p-1.5 flex items-center gap-2">
        <!-- Back / Forward Buttons -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            class="w-6 h-6 rounded-full bg-gradient-to-b from-white to-blue-200 border border-blue-400 flex items-center justify-center text-blue-900 shadow-2xs hover:bg-blue-100 cursor-pointer"
            title="Back"
            @click="navigateBack"
          >
            <svg class="w-3 h-3" viewBox="0 0 10 10">
              <polygon points="6.5,1 2.5,5 6.5,9" fill="none" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </button>
          <button
            type="button"
            class="w-6 h-6 rounded-full bg-gradient-to-b from-white to-blue-200 border border-blue-400 flex items-center justify-center text-blue-900 shadow-2xs hover:bg-blue-100 cursor-pointer opacity-60"
            title="Forward"
          >
            <svg class="w-3 h-3" viewBox="0 0 10 10">
              <polygon points="3.5,1 7.5,5 3.5,9" fill="none" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </button>
        </div>

        <!-- Breadcrumb Address Bar -->
        <div class="flex-1 h-6 bg-white border border-blue-300 rounded px-2 flex items-center gap-1.5 text-xs text-slate-700 shadow-inner overflow-hidden">
          <img src="/icons/computer.webp" alt="" class="w-3.5 h-3.5 shrink-0 object-contain" />
          <span class="text-slate-400">Computer</span>
          <span class="text-slate-400">▶</span>
          <span class="text-slate-600 font-medium">Restu Utomo</span>
          <span class="text-slate-400">▶</span>
          <span class="text-blue-950 font-bold capitalize">{{ currentNavLabel }}</span>
        </div>

        <!-- Search Input -->
        <div class="w-40 h-6 bg-white border border-slate-300 rounded px-2 flex items-center gap-1 text-xs text-slate-700 shadow-inner shrink-0">
          <svg viewBox="0 0 20 20" class="w-3 h-3 fill-slate-400 shrink-0">
            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            class="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <!-- Main Explorer Workspace: Sidebar + Pane Content -->
      <div class="flex-1 flex min-h-0 overflow-hidden bg-white">
        <!-- Left Sidebar Navigation -->
        <div class="w-48 bg-gradient-to-b from-sky-50/60 to-blue-50/40 border-r border-blue-200/70 p-2 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div class="space-y-0.5">
            <div class="font-bold text-[10px] text-blue-950/70 uppercase tracking-wider px-2 py-1">Favorites</div>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'about' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('about')"
            >
              <img src="/icons/fci-businessman.svg" alt="" class="w-4 h-4 shrink-0" />
              <span>About Me</span>
            </button>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'services' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('services')"
            >
              <img src="/icons/fci-clapperboard.svg" alt="" class="w-4 h-4 shrink-0" />
              <span>What I Do</span>
            </button>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'experience' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('experience')"
            >
              <img src="/icons/fci-library.svg" alt="" class="w-4 h-4 shrink-0" />
              <span>Work Experience</span>
            </button>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'contact' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('contact')"
            >
              <img src="/icons/fci-contacts.svg" alt="" class="w-4 h-4 shrink-0" />
              <span>Contact</span>
            </button>

            <!-- Libraries Section -->
            <div class="font-bold text-[10px] text-blue-950/70 uppercase tracking-wider px-2 py-1 mt-3">Libraries</div>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'videos' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('videos')"
            >
              <img src="/icons/folder-videos.webp" alt="" class="w-4 h-4 shrink-0" />
              <span>Videos</span>
            </button>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'documents' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('documents')"
            >
              <img src="/icons/folder-docs.webp" alt="" class="w-4 h-4 shrink-0" />
              <span>Documents</span>
            </button>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-medium cursor-pointer transition-colors"
              :class="currentNav === 'pictures' ? 'bg-sky-200/80 text-blue-950 font-bold shadow-2xs' : 'text-slate-700 hover:bg-white/60'"
              @click="setNav('pictures')"
            >
              <img src="/icons/folder-pics.webp" alt="" class="w-4 h-4 shrink-0" />
              <span>Pictures</span>
            </button>
          </div>
        </div>

        <!-- Center Content Area: Dynamic Pane Routing -->
        <div class="flex-1 overflow-y-auto bg-slate-50">
          <PaneAbout v-if="currentNav === 'about'" />
          <PaneServices v-else-if="currentNav === 'services'" />
          <PaneExperience v-else-if="currentNav === 'experience'" />
          <PaneContact v-else-if="currentNav === 'contact'" />
          <PaneMediaLibrary
            v-else-if="currentNav === 'videos' || currentNav === 'documents' || currentNav === 'pictures'"
            :category="currentNav"
          />
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import PaneAbout from '~/components/apps/explorer/PaneAbout.vue'
import PaneServices from '~/components/apps/explorer/PaneServices.vue'
import PaneExperience from '~/components/apps/explorer/PaneExperience.vue'
import PaneContact from '~/components/apps/explorer/PaneContact.vue'
import PaneMediaLibrary from '~/components/apps/explorer/PaneMediaLibrary.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

type NavSection = 'about' | 'services' | 'experience' | 'contact' | 'videos' | 'documents' | 'pictures'

const { playSound } = useAudioFeedback()
const currentNav = useState<NavSection>('explorer-nav', () => 'about')
const navHistory = ref<NavSection[]>(['about'])

const currentNavLabel = computed(() => {
  switch (currentNav.value) {
    case 'about': return 'About Me'
    case 'services': return 'What I Do'
    case 'experience': return 'Work Experience'
    case 'contact': return 'Contact'
    case 'videos': return 'Videos Library'
    case 'documents': return 'Documents Library'
    case 'pictures': return 'Pictures Library'
  }
})

const setNav = (nav: NavSection) => {
  playSound('click')
  navHistory.value.push(nav)
  currentNav.value = nav
}

const navigateBack = () => {
  if (navHistory.value.length > 1) {
    playSound('click')
    navHistory.value.pop()
    currentNav.value = navHistory.value[navHistory.value.length - 1]
  }
}
</script>
