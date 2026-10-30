<template>
  <WindowFrame id="games" title="Games" icon="/icons/games.webp">
    <div class="flex h-full select-none overflow-hidden bg-slate-100">
      <!-- Left Sidebar Tabs -->
      <div class="w-40 bg-gradient-to-b from-sky-50 to-slate-200 border-r border-slate-300 p-2 flex flex-col gap-1 shrink-0 text-xs">
        <div class="font-bold text-[10px] text-blue-950/70 uppercase tracking-wider px-2 py-1 mb-1">
          Select Game
        </div>
        <button
          v-for="game in gameOptions"
          :key="game.id"
          type="button"
          class="w-full flex items-center gap-2 px-2.5 py-2 rounded text-left text-xs font-semibold cursor-pointer transition-colors"
          :class="[
            activeGame === game.id
              ? 'bg-sky-200 text-blue-950 shadow-2xs font-bold border border-sky-300'
              : 'text-slate-700 hover:bg-white/60 border border-transparent'
          ]"
          @click="selectGame(game.id)"
        >
          <span>{{ game.icon }}</span>
          <span>{{ game.label }}</span>
        </button>
      </div>

      <!-- Game Stage Container -->
      <div class="flex-1 bg-gradient-to-b from-[#eaf3fc] to-[#dbe7f5] p-3 overflow-auto flex items-center justify-center">
        <div ref="hostRef" class="w-full h-full flex items-center justify-center" />
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { mountGame, type GameId } from '~/utils/games'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

const gameOptions: { id: GameId; label: string; icon: string }[] = [
  { id: 'minesweeper', label: 'Minesweeper', icon: '💣' },
  { id: 'tetris', label: 'Tetris', icon: '🧱' },
  { id: 'pairs', label: 'Purble Pairs', icon: '🃏' },
  { id: 'solitaire', label: 'Solitaire', icon: '♠' }
]

const activeGame = ref<GameId>('minesweeper')
const hostRef = ref<HTMLElement | null>(null)

const selectGame = (id: GameId) => {
  playSound('click')
  activeGame.value = id
  if (hostRef.value) {
    mountGame(hostRef.value, id)
  }
}

onMounted(() => {
  if (hostRef.value) {
    mountGame(hostRef.value, activeGame.value)
  }
})

watch(activeGame, (newId) => {
  if (hostRef.value) {
    mountGame(hostRef.value, newId)
  }
})
</script>
