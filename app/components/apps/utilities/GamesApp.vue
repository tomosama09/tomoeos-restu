<template>
  <WindowFrame id="games" :title="windowTitle" icon="/icons/games.webp">
    <div class="flex flex-col h-full bg-[#f4f7fa] text-slate-800 select-none overflow-hidden font-sans">
      <!-- 1. Top Windows 7 Aero Command Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#fbfdff] via-[#e8f1fb] to-[#d8e6f7] border-b border-[#a9c3e2] px-3 py-1.5 flex items-center justify-between text-xs shadow-2xs">
        <div class="flex items-center gap-2">
          <!-- Back button when inside a game -->
          <button
            v-if="activeGame !== null"
            type="button"
            class="h-7 px-2.5 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-semibold text-blue-900 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
            @click="backToExplorer"
          >
            <span>◀</span>
            <span>Games Explorer</span>
          </button>

          <!-- Current Breadcrumb -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="font-semibold text-slate-700">Games</span>
            <template v-if="activeGameData">
              <span class="text-slate-400">›</span>
              <span class="font-bold text-blue-950">{{ activeGameData.title }}</span>
            </template>
          </div>
        </div>

        <!-- Quick Switcher Dropdown / Tabs -->
        <div class="flex items-center gap-1">
          <button
            v-for="game in gamesList"
            :key="game.id"
            type="button"
            class="h-7 px-2.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border"
            :class="activeGame === game.id ? 'bg-[#cde4fc] border-[#72aee6] text-blue-950 shadow-inner' : 'bg-white/60 hover:bg-white border-transparent text-slate-700'"
            @click="launchGame(game.id)"
          >
            <span>{{ game.icon }}</span>
            <span class="hidden sm:inline">{{ game.title }}</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Viewport: Either Games Explorer or Active Game -->
      <div class="flex-1 min-h-0 overflow-auto bg-gradient-to-b from-[#f8fafc] to-[#eaf1f8] relative">
        <!-- View A: Games Explorer (Game Selection Library) -->
        <div v-if="activeGame === null" class="p-4 flex flex-col gap-4">
          <div>
            <h2 class="text-base font-bold text-blue-950">Games Library</h2>
            <p class="text-xs text-slate-500">Select a game to start playing classic Windows desktop titles.</p>
          </div>

          <!-- Game Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div
              v-for="game in gamesList"
              :key="game.id"
              class="group bg-white rounded-xl border border-slate-300/80 hover:border-blue-400 p-3 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
              @click="launchGame(game.id)"
            >
              <div>
                <!-- Game Icon Badge Banner -->
                <div
                  class="h-28 rounded-lg flex items-center justify-center text-4xl mb-3 border shadow-inner group-hover:scale-102 transition-transform"
                  :class="game.badgeBg"
                >
                  <span>{{ game.bigIcon }}</span>
                </div>

                <!-- Game Title & Meta -->
                <div class="font-bold text-sm text-slate-800 group-hover:text-blue-700 transition-colors">
                  {{ game.title }}
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  {{ game.genre }}
                </div>
                <p class="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {{ game.description }}
                </p>
              </div>

              <!-- Action Button -->
              <div class="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-medium">Microsoft Studios</span>
                <button
                  type="button"
                  class="h-6 px-3 rounded bg-gradient-to-b from-[#e3f0fc] to-[#bedbfa] group-hover:from-[#cbe2f8] group-hover:to-[#a9d0f7] border border-[#6b9dce] text-xs font-bold text-blue-950 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Play</span>
                  <span>▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- View B: Active Game Stage -->
        <div v-else class="w-full h-full">
          <MinesweeperGame v-if="activeGame === 'minesweeper'" />
          <SolitaireGame v-else-if="activeGame === 'solitaire'" />
          <PurblePairsGame v-else-if="activeGame === 'pairs'" />
          <TetrisGame v-else-if="activeGame === 'tetris'" />
        </div>
      </div>

      <!-- 3. Status Bar -->
      <div class="h-5 bg-gradient-to-b from-[#eef4fb] to-[#d8e6f7] border-t border-[#9bb6d7] px-3 flex items-center justify-between text-[10px] text-slate-600 shrink-0">
        <div>
          <span>{{ activeGame === null ? '4 games available' : `Playing: ${activeGameData?.title}` }}</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="activeGame !== null"
            type="button"
            class="hover:underline text-blue-800 font-semibold cursor-pointer"
            @click="backToExplorer"
          >
            Back to Library
          </button>
          <span>Windows 7 Aero Edition</span>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import MinesweeperGame from '~/components/apps/games/MinesweeperGame.vue'
import SolitaireGame from '~/components/apps/games/SolitaireGame.vue'
import PurblePairsGame from '~/components/apps/games/PurblePairsGame.vue'
import TetrisGame from '~/components/apps/games/TetrisGame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

type GameId = 'minesweeper' | 'solitaire' | 'pairs' | 'tetris'

interface GameMeta {
  id: GameId
  title: string
  genre: string
  icon: string
  bigIcon: string
  badgeBg: string
  description: string
}

const gamesList: GameMeta[] = [
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    genre: 'Classic Puzzle',
    icon: '💣',
    bigIcon: '💣',
    badgeBg: 'bg-gradient-to-br from-sky-400 to-blue-700 border-sky-300 text-white',
    description: 'Clear the minefield without detonating any hidden bombs using numerical proximity clues.'
  },
  {
    id: 'solitaire',
    title: 'Solitaire',
    genre: 'Klondike Card Game',
    icon: '♠',
    bigIcon: '🂠',
    badgeBg: 'bg-gradient-to-br from-emerald-600 to-green-900 border-emerald-400 text-white',
    description: 'Classic Klondike Solitaire on green felt. Build four foundation suits from Ace to King.'
  },
  {
    id: 'pairs',
    title: 'Purble Pairs',
    genre: 'Memory Confectionery',
    icon: '🧁',
    bigIcon: '🎂',
    badgeBg: 'bg-gradient-to-br from-pink-500 to-purple-800 border-pink-300 text-white',
    description: 'Find matching pastry and bakery pairs in this classic confectionery memory match game.'
  },
  {
    id: 'tetris',
    title: 'Tetris Aero',
    genre: 'Retro Arcade',
    icon: '🧱',
    bigIcon: '🧱',
    badgeBg: 'bg-gradient-to-br from-indigo-700 to-slate-900 border-indigo-400 text-white',
    description: 'Stack falling geometric blocks, clear complete lines, and rack up high scores.'
  }
]

const activeGame = ref<GameId | null>('minesweeper')

const activeGameData = computed(() => {
  return gamesList.find(g => g.id === activeGame.value) || null
})

const windowTitle = computed(() => {
  if (activeGameData.value) {
    return `${activeGameData.value.title} - Games`
  }
  return 'Games'
})

const launchGame = (id: GameId) => {
  playSound('click')
  activeGame.value = id
}

const backToExplorer = () => {
  playSound('click')
  activeGame.value = null
}
</script>
