<template>
  <div class="p-4 space-y-3.5 text-slate-800 text-xs">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 border-b border-slate-200">
      <div>
        <h2 class="text-base font-bold text-blue-950 tracking-tight capitalize">{{ category }} Library</h2>
        <p class="text-xs text-slate-600 mt-0.5">
          <template v-if="category === 'videos'">Showreel tracks. Click to watch in Internet Explorer.</template>
          <template v-else-if="category === 'pictures'">Selected Work: Promotional and literacy poster designs for the Sanata Dharma University Library.</template>
          <template v-else>Official curriculum vitae document.</template>
        </p>
      </div>
      <span class="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <!-- 1. VIDEOS LIBRARY -->
    <div v-if="category === 'videos'" class="space-y-2">
      <div
        v-for="vid in videoList"
        :key="vid.id"
        class="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-red-400 hover:bg-red-50/30 transition-all shadow-2xs flex items-center gap-3 cursor-pointer select-none"
        @click="playVideo(vid.id)"
      >
        <img :src="vid.thumb" alt="" class="w-16 h-10 object-cover rounded border border-slate-300 shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold text-blue-950 truncate">{{ vid.title }}</div>
          <div class="text-[11px] text-slate-500">{{ vid.sub }}</div>
        </div>
        <span class="text-xs text-blue-800 font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200 hover:bg-blue-100 shrink-0 flex items-center gap-1.5">
          <img src="/icons/internet-explorer.svg" alt="" class="w-3.5 h-3.5 object-contain" />
          <span>Watch</span>
        </span>
      </div>
    </div>

    <!-- 2. DOCUMENTS LIBRARY (ONLY CV) -->
    <div v-else-if="category === 'documents'" class="space-y-2">
      <div
        class="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all shadow-2xs flex items-center gap-3 cursor-pointer select-none"
        @click="openCV"
      >
        <img src="/icons/pdf.svg" alt="" class="w-9 h-9 object-contain shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold text-blue-950">Restu_Utomo_CV.pdf</div>
          <div class="text-[11px] text-slate-500">PDF Document • Official Curriculum Vitae (96 KB)</div>
        </div>
        <a
          href="/Restu_Utomo_CV.pdf"
          download="Restu_Utomo_CV.pdf"
          class="text-xs text-blue-700 font-bold px-2.5 py-1 rounded bg-blue-100 hover:bg-blue-200 shrink-0 flex items-center gap-1"
          @click.stop
        >
          <span>Download</span>
          <span>⬇</span>
        </a>
      </div>
    </div>

    <!-- 3. PICTURES LIBRARY (POSTER WORK 4-COL GRID) -->
    <div v-else-if="category === 'pictures'" class="space-y-3">
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        <div
          v-for="(pic, idx) in pictureList"
          :key="pic"
          class="group rounded-md bg-white border border-slate-200 overflow-hidden shadow-2xs cursor-pointer hover:border-blue-400 hover:shadow-md transition-all relative aspect-[4/5]"
          @click="openPhoto(idx)"
        >
          <img
            :src="`/images/library/${pic}`"
            :alt="`Poster ${idx + 1}`"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Photo Lightbox Viewer Modal -->
    <div
      v-if="selectedPhotoIndex !== null"
      class="fixed inset-0 z-[11000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      @click="selectedPhotoIndex = null"
    >
      <div class="relative max-w-xl max-h-[85vh] bg-slate-900 rounded-lg p-2 border border-white/20 shadow-2xl flex flex-col items-center" @click.stop>
        <!-- Top bar -->
        <div class="w-full flex items-center justify-between pb-2 px-1 text-slate-300 text-xs">
          <span class="font-bold">Windows Photo Viewer - Selected Work (Poster {{ selectedPhotoIndex + 1 }} of {{ pictureList.length }})</span>
          <button type="button" class="text-white hover:text-red-400 font-bold px-2 py-0.5 rounded cursor-pointer" @click="selectedPhotoIndex = null">✕</button>
        </div>

        <!-- Main Photo -->
        <div class="flex-1 max-h-[70vh] flex items-center justify-center overflow-hidden rounded bg-black">
          <img
            :src="`/images/library/${pictureList[selectedPhotoIndex]}`"
            alt="Library Poster"
            class="max-w-full max-h-[70vh] object-contain"
          />
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-4 pt-2 text-white text-xs">
          <button type="button" class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded font-bold cursor-pointer" @click="prevPhoto">◀ Previous</button>
          <button type="button" class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded font-bold cursor-pointer" @click="nextPhoto">Next ▶</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useState } from '#imports'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const props = defineProps<{
  category: 'videos' | 'documents' | 'pictures'
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()
const activeVideoId = useState<string>('tomoe-active-video', () => '1AV-MsdP0Zo')
const activeIeVideoId = useState<string>('ie-video-id', () => '1AV-MsdP0Zo')

const selectedPhotoIndex = ref<number | null>(null)

const videoList = [
  { id: '1AV-MsdP0Zo', title: 'EWD Official Trailer', sub: 'YouTube • Trailer • 2023', thumb: 'https://img.youtube.com/vi/1AV-MsdP0Zo/hqdefault.jpg' },
  { id: 'e1N52bWm5d0', title: 'EAD 2024 Trailer', sub: 'YouTube • Trailer • 2024', thumb: 'https://img.youtube.com/vi/e1N52bWm5d0/hqdefault.jpg' },
  { id: 'dkFmQt1pxow', title: '12th Undergraduate Conference', sub: 'YouTube • Conference Coverage • 2024', thumb: 'https://img.youtube.com/vi/dkFmQt1pxow/hqdefault.jpg' },
  { id: '_yHTgNrsVhQ', title: 'EWD 2023 Aftermovie', sub: 'YouTube • Aftermovie • 2023', thumb: 'https://img.youtube.com/vi/_yHTgNrsVhQ/hqdefault.jpg' }
]

const pictureList = [
  'library-01.webp','library-04.webp','library-10.webp','library-11.webp','library-29.webp',
  'library-43.webp','library-47.webp','library-55.webp','library-75.webp','library-80.webp',
  'library-90.webp','library-100.webp','library-101.webp','library-110.webp','library-111.webp',
  'library-113.webp','library-117.webp','library-118.webp','library-122.webp','library-123.webp','library-124.webp'
]

const itemCount = computed(() => {
  if (props.category === 'videos') return videoList.length
  if (props.category === 'documents') return 1
  return pictureList.length
})

const playVideo = (id: string) => {
  playSound('click')
  activeIeVideoId.value = id
  wm.openWindow('ie')
}

const openCV = () => {
  playSound('click')
  window.open('/Restu_Utomo_CV.pdf', '_blank')
}

const openPhoto = (idx: number) => {
  playSound('click')
  selectedPhotoIndex.value = idx
}

const prevPhoto = () => {
  if (selectedPhotoIndex.value === null) return
  playSound('click')
  selectedPhotoIndex.value = (selectedPhotoIndex.value - 1 + pictureList.length) % pictureList.length
}

const nextPhoto = () => {
  if (selectedPhotoIndex.value === null) return
  playSound('click')
  selectedPhotoIndex.value = (selectedPhotoIndex.value + 1) % pictureList.length
}
</script>
