<template>
  <div class="aero-desktop-wallpaper absolute inset-0 overflow-hidden flex flex-col select-none">
    <!-- Phase 1: BIOS Screen -->
    <AeroBiosScreen v-if="osPhase === 'bios'" @skip="skipBios" />

    <!-- Phase 2: Starting TomoeOS Boot Screen -->
    <AeroBootScreen v-else-if="osPhase === 'boot'" :progress="bootProgress" />

    <!-- Phase 3: Windows 7 Logon Screen -->
    <AeroLogonScreen
      v-else-if="osPhase === 'logon'"
      @login="handleLogin"
      @shutdown="handleShutdown"
    />

    <!-- Phase 4: Full Desktop Environment -->
    <template v-else>
      <!-- Sun Lens Flare -->
      <div class="aero-lens-flare pointer-events-none" />

      <!-- Iridescent Floating Glass Particles -->
      <div class="bubble-particle w-8 h-8 left-[15%]" style="animation-duration: 22s; animation-delay: 0s;" />
      <div class="bubble-particle w-12 h-12 left-[38%]" style="animation-duration: 28s; animation-delay: 4s;" />
      <div class="bubble-particle w-6 h-6 left-[62%]" style="animation-duration: 19s; animation-delay: 2s;" />
      <div class="bubble-particle w-10 h-10 left-[85%]" style="animation-duration: 25s; animation-delay: 7s;" />

      <!-- Main Desktop Workspace Area -->
      <div class="flex-1 relative overflow-hidden">
        <!-- Desktop Icons Column Grid (Exact 42px icons in 64px columns) -->
        <div class="absolute top-6 left-6 flex flex-col gap-4 z-10">
          <DesktopIcon
            label="Documents"
            icon="/icons/folder-docs.webp"
            target-id="explorer"
          />
          <DesktopIcon
            label="Internet Explorer"
            icon="/icons/internet-explorer.svg"
            target-id="ie"
          />
          <DesktopIcon
            label="Windows Media Player"
            icon="/icons/folder-videos.webp"
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
            icon="/icons/welcome-note.svg"
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
          <DesktopIcon
            label="Paint"
            icon="/icons/paint.svg"
            target-id="paint"
          />
          <DesktopIcon
            label="cmd.exe"
            icon="/icons/command-prompt.svg"
            target-id="cmd"
          />
          <DesktopIcon
            label="Recycle Bin"
            icon="/icons/bin.webp"
            target-id="recycle"
          />
        </div>

        <!-- Desktop Utilities / Widgets (Clock & Weather Gadgets) -->
        <DesktopGadgets />

        <!-- Desktop Sticky Note -->
        <StickyNote />

        <!-- App Windows Layer -->
        <ExplorerWindow />
        <InternetExplorerApp />
        <TomoePlayer />
        <NotepadApp />
        <CalculatorApp />
        <GamesApp />
        <PaintApp />
        <RecycleBinApp />
        <CommandPromptApp />
      </div>

      <!-- Start Menu Overlay -->
      <StartMenu
        v-if="isStartOpen"
        @close="isStartOpen = false"
        @shutdown="handleShutdown"
      />

      <!-- Windows 7 Aero Taskbar -->
      <AeroTaskbar :is-start-open="isStartOpen" @toggle-start="toggleStartMenu" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AeroBiosScreen from '~/components/boot/AeroBiosScreen.vue'
import AeroBootScreen from '~/components/boot/AeroBootScreen.vue'
import AeroLogonScreen from '~/components/boot/AeroLogonScreen.vue'
import DesktopIcon from '~/components/desktop/DesktopIcon.vue'
import DesktopGadgets from '~/components/desktop/DesktopGadgets.vue'
import StickyNote from '~/components/desktop/StickyNote.vue'
import AeroTaskbar from '~/components/desktop/AeroTaskbar.vue'
import StartMenu from '~/components/desktop/StartMenu.vue'
import ExplorerWindow from '~/components/apps/explorer/ExplorerWindow.vue'
import InternetExplorerApp from '~/components/apps/utilities/InternetExplorerApp.vue'
import TomoePlayer from '~/components/apps/player/TomoePlayer.vue'
import NotepadApp from '~/components/apps/utilities/NotepadApp.vue'
import CalculatorApp from '~/components/apps/utilities/CalculatorApp.vue'
import GamesApp from '~/components/apps/utilities/GamesApp.vue'
import PaintApp from '~/components/apps/utilities/PaintApp.vue'
import RecycleBinApp from '~/components/apps/utilities/RecycleBinApp.vue'
import CommandPromptApp from '~/components/apps/utilities/CommandPromptApp.vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const wm = useWindowManager()
const { playSound, playStartupChime } = useAudioFeedback()

const osPhase = ref<'bios' | 'boot' | 'logon' | 'desktop'>('bios')
const bootProgress = ref(0)
const isStartOpen = ref(false)

let bootTimer: ReturnType<typeof setInterval> | null = null
let biosTimer: ReturnType<typeof setTimeout> | null = null

const proceedToBoot = () => {
  if (biosTimer) {
    clearTimeout(biosTimer)
    biosTimer = null
  }
  if (osPhase.value !== 'bios') return
  osPhase.value = 'boot'
  const start = Date.now()
  const duration = 1200

  bootTimer = setInterval(() => {
    const elapsed = Date.now() - start
    const frac = Math.min(1, elapsed / duration)
    bootProgress.value = Math.round(frac * 100)

    if (frac >= 1) {
      if (bootTimer) clearInterval(bootTimer)
      bootTimer = null
      setTimeout(() => {
        osPhase.value = 'logon'
      }, 150)
    }
  }, 30)
}

const skipBios = () => {
  proceedToBoot()
}

const startBootSequence = () => {
  osPhase.value = 'bios'
  bootProgress.value = 0
  if (typeof document !== 'undefined') {
    document.body.classList.add('boot-phase')
  }

  // BIOS screen for 1.8s (or click to skip)
  biosTimer = setTimeout(() => {
    proceedToBoot()
  }, 1800)
}

const handleLogin = () => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('boot-phase')
  }
  playStartupChime()
  osPhase.value = 'desktop'
  setTimeout(() => {
    wm.openWindow('notepad')
  }, 250)
}

const handleShutdown = () => {
  playSound('click')
  startBootSequence()
}

const toggleStartMenu = () => {
  playSound('click')
  isStartOpen.value = !isStartOpen.value
}

const onGlobalClick = (e: MouseEvent) => {
  if (!isStartOpen.value) return
  const target = e.target as HTMLElement
  if (!target.closest('.aero-start-menu') && !target.closest('#start-orb-btn')) {
    isStartOpen.value = false
  }
}

onMounted(() => {
  startBootSequence()
  if (typeof window !== 'undefined') {
    window.addEventListener('click', onGlobalClick)
  }
})

onUnmounted(() => {
  if (biosTimer) clearTimeout(biosTimer)
  if (bootTimer) clearInterval(bootTimer)
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', onGlobalClick)
  }
})
</script>
