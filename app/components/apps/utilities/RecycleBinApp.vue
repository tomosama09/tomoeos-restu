<template>
  <WindowFrame id="recycle" title="Recycle Bin" icon="/icons/bin.webp">
    <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden font-sans">
      <!-- 1. Recycle Bin Command Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#fbfdff] via-[#e8f1fb] to-[#d8e6f7] border-b border-[#a9c3e2] p-1.5 flex items-center justify-between shadow-2xs">
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="h-7 px-3 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="items.length === 0"
            @click="emptyBin"
          >
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-red-600">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            <span>Empty the Recycle Bin</span>
          </button>
          <button
            type="button"
            class="h-7 px-3 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="items.length === initialItems.length"
            @click="restoreItems"
          >
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-blue-600">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            <span>Restore all items</span>
          </button>
        </div>
        <div class="text-[11px] text-slate-500 pr-2">
          Recycle Bin Tools
        </div>
      </div>

      <!-- 2. Address Bar -->
      <div class="shrink-0 bg-gradient-to-b from-white to-slate-100 border-b border-slate-200 px-3 py-1 flex items-center gap-2">
        <div class="flex-1 h-6 bg-white border border-blue-300 rounded px-2 flex items-center gap-2 text-xs text-slate-700 shadow-inner">
          <img src="/icons/bin.webp" alt="" class="w-3.5 h-3.5 object-contain shrink-0" />
          <span class="font-semibold text-blue-950">Recycle Bin</span>
        </div>
      </div>

      <!-- 3. Items Details View -->
      <div class="flex-1 overflow-auto bg-white min-h-0">
        <table v-if="items.length > 0" class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-300 text-[11px] font-semibold text-slate-600 sticky top-0">
              <th class="py-1 px-3 border-r border-slate-200">Name</th>
              <th class="py-1 px-3 border-r border-slate-200">Original Location</th>
              <th class="py-1 px-3 border-r border-slate-200">Date Deleted</th>
              <th class="py-1 px-3 border-r border-slate-200">Size</th>
              <th class="py-1 px-3">Item Type</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in items"
              :key="file.name"
              class="border-b border-slate-100 hover:bg-sky-50 transition-colors cursor-pointer select-none"
              :class="selectedItem === file.name ? 'bg-sky-100 text-blue-950' : 'text-slate-800'"
              @click="selectedItem = file.name"
            >
              <td class="py-1.5 px-3 flex items-center gap-2 font-medium">
                <img :src="file.icon" alt="" class="w-4 h-4 object-contain shrink-0" />
                <span class="truncate">{{ file.name }}</span>
              </td>
              <td class="py-1.5 px-3 text-slate-500 font-mono text-[11px]">{{ file.loc }}</td>
              <td class="py-1.5 px-3 text-slate-600">{{ file.date }}</td>
              <td class="py-1.5 px-3 text-slate-600 font-mono">{{ file.size }}</td>
              <td class="py-1.5 px-3 text-slate-500">{{ file.type }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-else class="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
          <img src="/icons/bin.webp" alt="Empty Bin" class="w-12 h-12 opacity-40 grayscale" />
          <div class="font-bold text-sm text-slate-600">This folder is empty.</div>
          <p class="text-xs text-slate-500 max-w-sm">No deleted files or project drafts in the Recycle Bin.</p>
        </div>
      </div>

      <!-- 4. Status Bar -->
      <div class="h-5 bg-gradient-to-b from-slate-100 to-slate-200 border-t border-slate-300 px-3 flex items-center justify-between text-[10px] text-slate-600 shrink-0">
        <span>{{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}</span>
        <span>Total size: {{ totalSize }} MB</span>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

interface DeletedItem {
  name: string
  loc: string
  date: string
  size: string
  sizeMb: number
  type: string
  icon: string
}

const initialItems: DeletedItem[] = [
  {
    name: 'proposal_final_v2_revisi_asli_fix.psd',
    loc: 'C:\\Projects\\BrandIdentity',
    date: '10/24/2026 14:22',
    size: '142 MB',
    sizeMb: 142,
    type: 'Adobe Photoshop Image',
    icon: '/icons/fci-file.svg'
  },
  {
    name: 'render_aftermovie_corrupt_ulang_lagi.prproj',
    loc: 'C:\\Video\\Showreel2023',
    date: '10/22/2026 19:10',
    size: '48 MB',
    sizeMb: 48,
    type: 'Premiere Pro Project',
    icon: '/icons/fci-film.svg'
  },
  {
    name: 'underexposed_raw_shoot_004.cr2',
    loc: 'C:\\DCIM\\100CANON',
    date: '10/18/2026 09:45',
    size: '28 MB',
    sizeMb: 28,
    type: 'Canon Raw Image',
    icon: '/icons/fci-film.svg'
  },
  {
    name: 'client_feedback_audio_unintelligible.wav',
    loc: 'C:\\Audio\\Briefing',
    date: '10/15/2026 16:30',
    size: '12 MB',
    sizeMb: 12,
    type: 'Waveform Audio',
    icon: '/icons/volume-100.webp'
  }
]

const items = ref<DeletedItem[]>([...initialItems])
const selectedItem = ref<string | null>(null)

const totalSize = computed(() => {
  return items.value.reduce((acc, it) => acc + it.sizeMb, 0)
})

const emptyBin = () => {
  playSound('click')
  items.value = []
  selectedItem.value = null
}

const restoreItems = () => {
  playSound('click')
  items.value = [...initialItems]
}
</script>