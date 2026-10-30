<template>
  <WindowFrame id="ie" :title="windowTitle" icon="/icons/internet-explorer.svg">
    <div class="flex flex-col h-full bg-[#f1f1f1] text-slate-800 select-none overflow-hidden font-sans">
      <!-- 1. IE9 Glass Navigation & Command Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#eaf2fb] via-[#d6e5f7] to-[#c2d7f0] border-b border-[#9bb6d7] p-1.5 flex flex-col gap-1.5 shadow-2xs">
        <!-- Top Toolbar: Back/Forward, Address Bar, Tabs -->
        <div class="flex items-center gap-2">
          <!-- Back & Forward Buttons -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              class="w-7 h-7 rounded-full bg-gradient-to-b from-white via-[#d3e5f8] to-[#9fc6f0] border border-[#6b9dce] shadow-xs flex items-center justify-center text-[#18487d] hover:brightness-105 active:scale-95 cursor-pointer"
              title="Back"
              @click="navigateBack"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 10 10">
                <polygon points="6.5,1.5 2.5,5 6.5,8.5" fill="none" stroke="currentColor" stroke-width="2" />
              </svg>
            </button>
            <button
              type="button"
              class="w-6 h-6 rounded-full bg-gradient-to-b from-white via-[#d3e5f8] to-[#9fc6f0] border border-[#6b9dce] shadow-xs flex items-center justify-center text-[#18487d] opacity-50 cursor-default"
              title="Forward"
            >
              <svg class="w-3 h-3" viewBox="0 0 10 10">
                <polygon points="3.5,1.5 7.5,5 3.5,8.5" fill="none" stroke="currentColor" stroke-width="2" />
              </svg>
            </button>
          </div>

          <!-- IE Address Bar -->
          <div class="flex-1 h-7 bg-white rounded border border-[#7f9db9] hover:border-[#3c7fb1] px-2 flex items-center gap-1.5 shadow-inner transition-colors">
            <!-- Lock / Security Badge -->
            <div class="hidden sm:flex items-center gap-1 bg-[#e7f4e4] border border-[#b8dfb3] text-[#2b7424] text-[10px] font-semibold px-1.5 py-0.5 rounded-xs shrink-0">
              <svg viewBox="0 0 20 20" class="w-2.5 h-2.5 fill-current">
                <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v2H8V6z"/>
              </svg>
              <span>YouTube</span>
            </div>

            <!-- Address URL -->
            <input
              :value="currentUrl"
              readonly
              type="text"
              class="flex-1 bg-transparent text-xs text-slate-800 font-mono outline-none select-text cursor-text truncate min-w-0"
            />

            <!-- Refresh & Stop & Go Controls -->
            <div class="flex items-center gap-1 shrink-0 text-slate-500">
              <button
                type="button"
                class="hover:text-blue-700 p-0.5 cursor-pointer"
                title="Refresh"
                @click="refreshPlayer"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                  <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- IE Command Icons (Desktop only) -->
          <div class="hidden sm:flex items-center gap-1 shrink-0 text-[#294c74]">
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center rounded hover:bg-white/50 cursor-pointer"
              title="Home"
              @click="activeIeVideoId = '_yHTgNrsVhQ'"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </button>
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center rounded hover:bg-white/50 cursor-pointer"
              title="Favorites"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-amber-500">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </button>
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center rounded hover:bg-white/50 cursor-pointer"
              title="Tools"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- IE Tabs Row -->
        <div class="flex items-center gap-1 px-1 pt-0.5">
          <div class="h-6 px-3 bg-white rounded-t-sm border-t border-l border-r border-[#9bb6d7] text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-red-600 shrink-0">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span class="truncate max-w-[220px]">{{ currentVideo.title }} - YouTube</span>
          </div>
        </div>
      </div>

      <!-- 2. Main Webpage: Authentic YouTube Web Interface -->
      <div class="flex-1 overflow-y-auto bg-[#0f0f0f] text-white flex flex-col">
        <!-- YouTube Top Header Bar -->
        <div class="h-14 bg-[#0f0f0f] border-b border-[#272727] px-4 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <!-- YouTube Logo -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 cursor-pointer">
              <svg viewBox="0 0 24 24" class="w-7 h-7 fill-red-600">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span class="font-bold text-lg tracking-tighter text-white">YouTube</span>
              <span class="text-[10px] text-slate-400 self-start ml-0.5">ID</span>
            </div>
          </div>

          <!-- YouTube Search Bar (Desktop only) -->
          <div class="hidden sm:flex items-center max-w-md w-full mx-4">
            <div class="flex-1 h-9 bg-[#121212] border border-[#303030] rounded-l-full px-4 flex items-center">
              <input
                type="text"
                :value="currentVideo.title"
                readonly
                class="w-full bg-transparent text-xs text-white outline-none"
              />
            </div>
            <button
              type="button"
              class="h-9 px-5 bg-[#222222] border border-l-0 border-[#303030] rounded-r-full text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>

          <!-- Profile Badge -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center font-bold text-xs text-white shadow">
              RU
            </div>
          </div>
        </div>

        <!-- YouTube Watch Layout: 2-Column Grid -->
        <div class="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          <!-- Left Column: Video Player & Metadata -->
          <div class="lg:col-span-2 space-y-3.5">
            <!-- Responsive 16:9 Video Embed Player -->
            <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                v-if="playerKey"
                :key="playerKey"
                :src="`https://www.youtube-nocookie.com/embed/${activeIeVideoId}?autoplay=1&rel=0`"
                :title="currentVideo.title"
                class="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>

            <!-- Video Title -->
            <h1 class="text-lg font-bold text-white leading-snug">
              {{ currentVideo.title }}
            </h1>

            <!-- Channel Row & Action Buttons -->
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#272727]">
              <!-- Channel Info -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center font-bold text-sm text-white">
                  RU
                </div>
                <div>
                  <div class="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Restu Utomo</span>
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-slate-400">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div class="text-[11px] text-slate-400">Portfolio Channel • Videographer</div>
                </div>
                <button
                  type="button"
                  class="ml-2 px-3.5 py-1.5 bg-white text-black hover:bg-slate-200 rounded-full font-semibold text-xs transition-colors cursor-pointer"
                >
                  Subscribed
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <div class="flex items-center bg-[#272727] rounded-full text-xs font-medium overflow-hidden">
                  <button type="button" class="px-3 py-1.5 hover:bg-[#3f3f3f] flex items-center gap-1.5 text-slate-200">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                    <span>1.2K</span>
                  </button>
                  <div class="w-px h-4 bg-slate-600" />
                  <button type="button" class="px-2.5 py-1.5 hover:bg-[#3f3f3f] text-slate-200">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                    </svg>
                  </button>
                </div>
                <a
                  :href="currentUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  title="Open in external browser"
                >
                  <span>Open URL</span>
                  <span class="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            <!-- Video Description Box -->
            <div class="bg-[#272727] rounded-xl p-3 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <div class="font-bold text-white text-xs">
                {{ currentVideo.views }} • Released {{ currentVideo.year }}
              </div>
              <p>
                {{ currentVideo.desc }}
              </p>
              <div class="text-[11px] text-slate-400 pt-1 border-t border-[#3a3a3a]">
                Production & Camera: Restu Utomo • Category: {{ currentVideo.category }}
              </div>
            </div>
          </div>

          <!-- Right Column: Up Next / Portfolio Showreels -->
          <div class="space-y-3">
            <div class="font-bold text-sm text-white px-1">More Showreels</div>
            <div class="space-y-2">
              <button
                v-for="item in playlist"
                :key="item.id"
                type="button"
                class="w-full p-2 rounded-lg flex items-start gap-2.5 text-left transition-all cursor-pointer border"
                :class="activeIeVideoId === item.id ? 'bg-[#272727] border-red-500/60' : 'hover:bg-[#1f1f1f] border-transparent'"
                @click="selectVideo(item.id)"
              >
                <div class="w-28 aspect-video rounded bg-black overflow-hidden relative shrink-0">
                  <img :src="item.thumb" :alt="item.title" class="w-full h-full object-cover" />
                  <div class="absolute bottom-1 right-1 px-1 bg-black/80 text-[9px] font-mono rounded text-white">
                    HD
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-white leading-snug line-clamp-2">{{ item.title }}</div>
                  <div class="text-[10px] text-slate-400 mt-1">Restu Utomo</div>
                  <div class="text-[10px] text-slate-500">{{ item.views }} • {{ item.year }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. IE9 Status Bar -->
      <div class="h-5 bg-gradient-to-b from-[#eef4fb] to-[#d6e5f7] border-t border-[#9bb6d7] px-3 flex items-center justify-between text-[10px] text-slate-600 shrink-0">
        <div class="flex items-center gap-2">
          <span>Internet | Protected Mode: On</span>
        </div>
        <div class="flex items-center gap-3">
          <span>100%</span>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useState } from '#imports'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()
const activeIeVideoId = useState<string>('ie-video-id', () => '_yHTgNrsVhQ')
const historyStack = ref<string[]>(['_yHTgNrsVhQ'])
const playerKey = ref(1)

const playlist = [
  {
    id: '_yHTgNrsVhQ',
    title: 'EWD 2023 Aftermovie',
    category: 'Aftermovie',
    year: '2023',
    views: '21K views',
    desc: 'Event recap aftermovie covering performances, stage lighting, and audience interactions.',
    thumb: 'https://img.youtube.com/vi/_yHTgNrsVhQ/hqdefault.jpg'
  },
  {
    id: 'e1N52bWm5d0',
    title: 'EAD 2024 Trailer',
    category: 'Trailer',
    year: '2024',
    views: '8.4K views',
    desc: 'Official teaser and promotional video for English Action Days 2024. Handled multi-camera setup and color grading.',
    thumb: 'https://img.youtube.com/vi/e1N52bWm5d0/hqdefault.jpg'
  },
  {
    id: '1AV-MsdP0Zo',
    title: 'EWD 2023 Trailer',
    category: 'Trailer',
    year: '2023',
    views: '12K views',
    desc: 'Official trailer for English Wave Days. Directed, filmed, and edited for promotional campaigns.',
    thumb: 'https://img.youtube.com/vi/1AV-MsdP0Zo/hqdefault.jpg'
  },
  {
    id: 'dkFmQt1pxow',
    title: 'Undergraduate Conf.',
    category: 'Conference Coverage',
    year: '2024',
    views: '15K views',
    desc: 'Complete conference documentation and highlight video for the Undergraduate Conference.',
    thumb: 'https://img.youtube.com/vi/dkFmQt1pxow/hqdefault.jpg'
  }
]

const currentVideo = computed(() => {
  return playlist.find(v => v.id === activeIeVideoId.value) || playlist[0]
})

const currentUrl = computed(() => {
  return `https://www.youtube.com/watch?v=${activeIeVideoId.value}`
})

const windowTitle = computed(() => {
  return `${currentVideo.value.title} - YouTube - Internet Explorer`
})

const selectVideo = (id: string) => {
  playSound('click')
  activeIeVideoId.value = id
  historyStack.value.push(id)
  playerKey.value++
}

const navigateBack = () => {
  if (historyStack.value.length > 1) {
    playSound('click')
    historyStack.value.pop()
    activeIeVideoId.value = historyStack.value[historyStack.value.length - 1]
    playerKey.value++
  }
}

const refreshPlayer = () => {
  playSound('click')
  playerKey.value++
}
</script>
