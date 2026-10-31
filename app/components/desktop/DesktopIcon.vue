<template>
  <button
    type="button"
    class="group flex flex-col items-center justify-start p-1.5 sm:p-1 rounded-md w-[76px] sm:w-16 text-center transition-all cursor-pointer select-none focus:outline-none"
    :class="[
      isSelected
        ? 'bg-blue-400/35 border border-blue-200/80 shadow-inner'
        : 'hover:bg-white/20 border border-transparent hover:border-white/35'
    ]"
    @click="handleClick"
    @focus="isSelected = true"
    @blur="isSelected = false"
  >
    <!-- Icon Graphic: exact 42px x 42px matching original TomoeOS -->
    <div class="relative w-[42px] h-[42px] flex items-center justify-center drop-shadow-[0_4px_8px_rgba(0,30,80,0.4)] group-hover:scale-105 transition-transform duration-150">
      <img :src="icon" :alt="label" class="w-[42px] h-[42px] max-w-[42px] max-h-[42px] object-contain pointer-events-none" />
    </div>

    <!-- Label -->
    <span
      class="mt-1 text-[10px] sm:text-[11px] font-medium text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,15,45,0.95)] px-1 py-0.5 rounded break-words max-w-[74px] line-clamp-2"
      :class="isSelected ? 'bg-blue-600/80 text-white' : 'group-hover:bg-blue-600/40'"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const props = defineProps<{
  label: string
  icon: string
  targetId: string
  actionUrl?: string
}>()

const wm = useWindowManager()
const { playSound } = useAudioFeedback()
const isSelected = ref(false)

const handleClick = () => {
  playSound('click')
  if (props.actionUrl) {
    window.open(props.actionUrl, '_blank')
    return
  }
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  wm.openWindow(props.targetId, isMobile)
}
</script>
