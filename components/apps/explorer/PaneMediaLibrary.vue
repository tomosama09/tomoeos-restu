<template>
  <div class="p-4 space-y-3.5 text-slate-800 text-xs">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-bold text-blue-950 tracking-tight capitalize">{{ category }} Library</h2>
        <p class="text-xs text-slate-600 mt-0.5">Media assets, production records, and archived documents.</p>
      </div>
      <span class="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
        {{ items.length }} items
      </span>
    </div>

    <!-- Media Thumbnails Grid (Windows 7 Explorer Medium Icons view) -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="group p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all shadow-2xs flex flex-col items-center text-center cursor-pointer select-none"
        @click="handleItemClick(item)"
      >
        <div class="w-full h-24 rounded bg-slate-100 border border-slate-200/80 overflow-hidden mb-2 flex items-center justify-center relative">
          <img
            v-if="item.preview"
            :src="item.preview"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <img
            v-else
            :src="item.icon || '/icons/fci-film.svg'"
            alt=""
            class="w-8 h-8 opacity-60"
          />
        </div>
        <div class="font-semibold text-blue-950 text-xs truncate max-w-full">{{ item.name }}</div>
        <div class="text-[10px] text-slate-500 mt-0.5">{{ item.sub }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const props = defineProps<{
  category: 'videos' | 'documents' | 'pictures'
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()

interface MediaItem {
  name: string
  sub: string
  icon?: string
  preview?: string
  actionUrl?: string
  targetWindow?: string
}

const items = computed<MediaItem[]>(() => {
  if (props.category === 'videos') {
    return [
      { name: 'USD Library Profile Film', sub: 'Institutional Video (2025)', preview: '/images/library/library-10.webp', targetWindow: 'player' },
      { name: 'LLTC 2025 Conference Highlights', sub: 'Event Documentation (2025)', preview: '/images/library/library-43.webp', targetWindow: 'player' },
      { name: 'Campus Social Media Reels', sub: 'Short-Form Batch (2025)', preview: '/images/library/library-80.webp', targetWindow: 'player' }
    ]
  } else if (props.category === 'documents') {
    return [
      { name: 'Restu Utomo CV.pdf', sub: 'Official Verified Resume', icon: '/icons/pdf.svg', actionUrl: '/Restu_Utomo_CV.pdf' },
      { name: 'ADDIE Module Storyboard.pdf', sub: 'Instructional Design R&D', icon: '/icons/pdf.svg', actionUrl: '/Restu_Utomo_CV.pdf' }
    ]
  } else {
    return [
      { name: 'Conference Stage Photography', sub: 'Processed 24MP Capture', preview: '/images/library/library-11.webp' },
      { name: 'Campus Faculty Session', sub: 'High-Resolution Portrait', preview: '/images/library/library-90.webp' },
      { name: 'Academic Symposium Panel', sub: 'Auditorium Lighting', preview: '/images/library/library-110.webp' }
    ]
  }
})

const handleItemClick = (item: MediaItem) => {
  playSound('click')
  if (item.actionUrl) {
    window.open(item.actionUrl, '_blank')
    return
  }
  if (item.targetWindow) {
    wm.openWindow(item.targetWindow)
  }
}
</script>
