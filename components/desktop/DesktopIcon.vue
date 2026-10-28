<template>
  <button
    type="button"
    class="group flex flex-col items-center justify-start p-2 rounded-md w-22 text-center transition-all cursor-pointer select-none focus:outline-none"
    :class="[
      isSelected
        ? 'bg-blue-400/30 border border-blue-200/60 shadow-inner'
        : 'hover:bg-white/20 border border-transparent hover:border-white/30'
    ]"
    @click="handleClick"
    @focus="isSelected = true"
    @blur="isSelected = false"
  >
    <!-- Icon Graphic -->
    <div class="relative w-12 h-12 flex items-center justify-center drop-shadow-md group-hover:scale-105 transition-transform">
      <img :src="icon" :alt="label" class="max-w-full max-h-full object-contain pointer-events-none" />
    </div>

    <!-- Label -->
    <span
      class="mt-1 text-[11px] font-medium text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-1 rounded truncate max-w-full"
      :class="isSelected ? 'bg-blue-600/70 text-white' : ''"
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
  wm.openWindow(props.targetId)
}
</script>
