<template>
  <div class="aero-desktop-wallpaper absolute inset-0 overflow-hidden flex flex-col select-none">
    <!-- Sun Lens Flare -->
    <div class="aero-lens-flare pointer-events-none" />

    <!-- Iridescent Floating Glass Particles -->
    <div class="bubble-particle w-8 h-8 left-[15%]" style="animation-duration: 22s; animation-delay: 0s;" />
    <div class="bubble-particle w-12 h-12 left-[38%]" style="animation-duration: 28s; animation-delay: 4s;" />
    <div class="bubble-particle w-6 h-6 left-[62%]" style="animation-duration: 19s; animation-delay: 2s;" />
    <div class="bubble-particle w-10 h-10 left-[85%]" style="animation-duration: 25s; animation-delay: 7s;" />

    <!-- Main Desktop Workspace Area -->
    <div class="flex-1 relative overflow-hidden" @click="handleDesktopClick">
      <!-- Desktop Icons Column Grid -->
      <div class="absolute top-4 left-4 flex flex-col gap-3 z-0">
        <DesktopIcon
          label="Restu Explorer"
          icon="/icons/fci-folder.svg"
          target-id="explorer"
        />
        <DesktopIcon
          label="Tomoe Player"
          icon="/icons/fci-film.svg"
          target-id="player"
        />
        <DesktopIcon
          label="Resume.pdf"
          icon="/icons/pdf.svg"
          target-id=""
          action-url="/Restu_Utomo_CV.pdf"
        />
        <DesktopIcon
          label="Welcome.txt"
          icon="/icons/txt.svg"
          target-id="notepad"
        />
        <DesktopIcon
          label="Calculator"
          icon="/icons/calc.webp"
          target-id="calculator"
        />
        <DesktopIcon
          label="Games"
          icon="/icons/games.webp"
          target-id="games"
        />
      </div>

      <!-- App Windows Layer -->
      <ExplorerWindow />
      <TomoePlayer />
      <NotepadApp />
      <CalculatorApp />
      <GamesApp />
    </div>

    <!-- Start Menu Overlay -->
    <StartMenu v-if="isStartOpen" @close="isStartOpen = false" />

    <!-- Windows 7 Aero Taskbar -->
    <AeroTaskbar :is-start-open="isStartOpen" @toggle-start="toggleStartMenu" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DesktopIcon from '~/components/desktop/DesktopIcon.vue'
import AeroTaskbar from '~/components/desktop/AeroTaskbar.vue'
import StartMenu from '~/components/desktop/StartMenu.vue'
import ExplorerWindow from '~/components/apps/explorer/ExplorerWindow.vue'
import TomoePlayer from '~/components/apps/player/TomoePlayer.vue'
import NotepadApp from '~/components/apps/utilities/NotepadApp.vue'
import CalculatorApp from '~/components/apps/utilities/CalculatorApp.vue'
import GamesApp from '~/components/apps/utilities/GamesApp.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()
const isStartOpen = ref(false)

const toggleStartMenu = () => {
  playSound('click')
  isStartOpen.value = !isStartOpen.value
}

const handleDesktopClick = (e: MouseEvent) => {
  // If clicked directly on desktop wallpaper, close Start Menu
  const target = e.target as HTMLElement
  if (target.classList.contains('aero-desktop-wallpaper') || target.classList.contains('flex-1')) {
    isStartOpen.value = false
  }
}
</script>
