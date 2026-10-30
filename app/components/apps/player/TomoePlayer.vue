<template>
  <WindowFrame id="player" title="Media Player" icon="/icons/folder-videos.webp">
    <div class="flex flex-col h-full bg-slate-950 text-white select-none overflow-hidden">
      <!-- Player Video Area -->
      <div class="flex-1 bg-black flex items-center justify-center relative min-h-0">
        <!-- Open in Internet Explorer Button -->
        <button
          type="button"
          class="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 bg-black/70 hover:bg-blue-950/90 border border-white/30 rounded-full text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg"
          title="Watch in Internet Explorer"
          @click="openInIe"
        >
          <img src="/icons/internet-explorer.svg" alt="" class="w-3.5 h-3.5 object-contain" />
          <span>Watch in Internet Explorer</span>
        </button>

        <!-- Online State: YouTube Embed -->
        <iframe
          v-if="isOnline && currentVideoId"
          :src="`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`"
          title="Tomoe Video Player"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />

        <!-- Offline Fallback State -->
        <div v-else class="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-200">No active video connection</div>
            <p class="text-xs text-slate-400 mt-1 max-w-sm">Connect to the internet to stream showreel videos or select another track below.</p>
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
            <div class="text-[9px] text-slate-400">{{ vid.category }} • {{ vid.year }}</div>
          </div>
        </button>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useState } from '#imports'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const wm = useWindowManager()
const { playSound } = useAudioFeedback()
const isOnline = ref(true)
const currentVideoId = useState<string>('tomoe-active-video', () => '_yHTgNrsVhQ')
const activeIeVideoId = useState<string>('ie-video-id', () => '_yHTgNrsVhQ')

const playlist = [
  { id: '_yHTgNrsVhQ', title: 'EWD 2023 Aftermovie', category: 'Aftermovie', year: '2023', thumb: 'https://img.youtube.com/vi/_yHTgNrsVhQ/hqdefault.jpg' },
  { id: 'e1N52bWm5d0', title: 'EAD 2024 Trailer', category: 'Trailer', year: '2024', thumb: 'https://img.youtube.com/vi/e1N52bWm5d0/hqdefault.jpg' },
  { id: '1AV-MsdP0Zo', title: 'EWD 2023 Trailer', category: 'Trailer', year: '2023', thumb: 'https://img.youtube.com/vi/1AV-MsdP0Zo/hqdefault.jpg' },
  { id: 'dkFmQt1pxow', title: 'Undergraduate Conf.', category: 'Conference Coverage', year: '2024', thumb: 'https://img.youtube.com/vi/dkFmQt1pxow/hqdefault.jpg' }
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

const openInIe = () => {
  playSound('click')
  activeIeVideoId.value = currentVideoId.value
  wm.openWindow('ie')
}
</script>
