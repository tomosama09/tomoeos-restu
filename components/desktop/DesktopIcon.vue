<template>
  <button
    type="button"
    class="group flex flex-col items-center justify-start p-1.5 rounded-lg w-22 text-center transition-all cursor-pointer select-none focus:outline-none"
    :class="[
      isSelected
        ? 'bg-blue-400/35 border border-blue-200/80 shadow-inner ring-1 ring-white/40'
        : 'hover:bg-white/20 border border-transparent hover:border-white/35'
    ]"
    @click="handleClick"
    @focus="isSelected = true"
    @blur="isSelected = false"
  >
    <!-- Icon Graphic (52px x 52px authentic Vista/Win7 desktop dimension) -->
    <div class="relative w-13 h-13 flex items-center justify-center drop-shadow-[0_8px_14px_rgba(0,30,80,0.5)] group-hover:scale-105 transition-transform duration-150">
      <img :src="icon" :alt="label" class="w-full h-full object-contain pointer-events-none" />
    </div>

    <!-- Label -->
    <span
      class="mt-1 text-[11px] font-medium text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,15,45,0.95)] px-1.5 py-0.5 rounded truncate max-w-full"
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
  wm.openWindow(props.targetId)
}
</script>
