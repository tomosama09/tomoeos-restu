<template>
  <WindowFrame id="player" title="Tomoe Player - Video Showreel" icon="/icons/fci-film.svg">
    <div class="flex flex-col h-full bg-slate-950 text-white select-none overflow-hidden">
      <!-- Player Video Area -->
      <div class="flex-1 bg-black flex items-center justify-center relative min-h-0">
        <!-- Online State: YouTube Embed -->
        <iframe
          v-if="isOnline && currentVideoId"
          :src="`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`"
          title="Tomoe Video Player"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />

        <!-- Offline / Dino Fallback State -->
        <div v-else class="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-200">No active video stream available</div>
            <p class="text-xs text-slate-400 mt-1 max-w-sm">Connect to the internet to stream unlisted production showreels or select another video below.</p>
          </div>
        </div>
      </div>

      <!-- Video Selector Playlist Toolbar -->
      <div class="h-20 bg-slate-900 border-t border-slate-800 p-2 flex items-center gap-2 overflow-x-auto shrink-0">
        <button
          v-for="vid in playlist"
          :key="vid.id"
          type="button"
          class="h-full px-2.5 rounded bg-slate-800/80 hover:bg-slate-700/90 border transition-all flex items-center gap-2.5 shrink-0 text-left cursor-pointer"
          :class="currentVideoId === vid.id ? 'border-sky-400 ring-1 ring-sky-400/50 bg-slate-700' : 'border-slate-700'"
          @click="selectVideo(vid.id)"
        >
          <div class="w-16 h-11 bg-slate-950 rounded overflow-hidden relative shrink-0">
            <img :src="vid.thumb" alt="" class="w-full h-full object-cover opacity-80" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white text-xs">▶</span>
            </div>
          </div>
          <div class="min-w-0 pr-1">
            <div class="text-[11px] font-bold text-slate-200 truncate">{{ vid.title }}</div>
            <div class="text-[9px] text-slate-400">{{ vid.duration }} • {{ vid.year }}</div>
          </div>
        </button>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()
const isOnline = ref(true)
const currentVideoId = ref('dQw4w9WgXcQ') // default embed

const playlist = [
  { id: 'dQw4w9WgXcQ', title: 'Sanata Dharma Library Profile Film', duration: '03:45', year: '2025', thumb: '/images/library/library-10.webp' },
  { id: 'L_LUpnjgPso', title: 'LLTC 2025 Hybrid Conference Reel', duration: '02:18', year: '2025', thumb: '/images/library/library-43.webp' },
  { id: '3JZ_D3ELwOQ', title: 'Campus Social Media Viral Series', duration: '01:30', year: '2025', thumb: '/images/library/library-80.webp' }
]

onMounted(() => {
  if (typeof navigator !== 'undefined') {
    isOnline.value = navigator.onLine
    window.addEventListener('online', () => { isOnline.value = true })
    window.addEventListener('offline', () => { isOnline.value = false })
  }
})

const selectVideo = (id: string) => {
  playSound('click')
  currentVideoId.value = id
}
</script>
