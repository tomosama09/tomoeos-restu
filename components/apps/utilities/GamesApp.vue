<template>
  <WindowFrame id="games" title="Game Center - Minesweeper" icon="/icons/games.webp">
    <div class="flex flex-col h-full bg-slate-200 p-3 select-none items-center justify-center">
      <!-- Game Board Frame -->
      <div class="p-3 bg-slate-300 rounded border-2 border-white shadow-md flex flex-col gap-3">
        <!-- Status Bar with Smiley -->
        <div class="h-10 bg-slate-400/30 border border-slate-500 rounded px-3 flex items-center justify-between">
          <div class="font-mono font-bold text-red-600 bg-black px-2 py-0.5 rounded text-sm tracking-widest">
            {{ String(mineCount).padStart(3, '0') }}
          </div>
          <button
            type="button"
            class="w-7 h-7 rounded border border-slate-400 bg-yellow-300 flex items-center justify-center text-sm shadow cursor-pointer active:scale-95"
            @click="initGame"
          >
            {{ gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂' }}
          </button>
          <div class="font-mono font-bold text-red-600 bg-black px-2 py-0.5 rounded text-sm tracking-widest">
            {{ String(timer).padStart(3, '0') }}
          </div>
        </div>

        <!-- 8x8 Minesweeper Grid -->
        <div class="grid grid-cols-8 gap-0.5 bg-slate-400 p-1 border-2 border-slate-500 rounded">
          <button
            v-for="(cell, idx) in grid"
            :key="idx"
            type="button"
            class="w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors cursor-pointer select-none"
            :class="[
              cell.isRevealed
                ? 'bg-slate-200 border-slate-300 shadow-inner'
                : 'bg-gradient-to-b from-white to-slate-200 border-white hover:bg-slate-100 shadow-xs'
            ]"
            @click="revealCell(idx)"
            @contextmenu.prevent="toggleFlag(idx)"
          >
            <template v-if="cell.isRevealed">
              <span v-if="cell.isMine" class="text-sm">💣</span>
              <span v-else-if="cell.neighborMines > 0" :class="numberColor(cell.neighborMines)">
                {{ cell.neighborMines }}
              </span>
            </template>
            <span v-else-if="cell.isFlagged" class="text-xs">🚩</span>
          </button>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

const GRID_SIZE = 8
const TOTAL_MINES = 8

const grid = ref<Cell[]>([])
const mineCount = ref(TOTAL_MINES)
const timer = ref(0)
const gameState = ref<'idle' | 'playing' | 'won' | 'lost'>('idle')

const initGame = () => {
  playSound('click')
  gameState.value = 'playing'
  timer.value = 0
  mineCount.value = TOTAL_MINES

  const cells: Cell[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0
  }))

  // Place mines randomly
  let placed = 0
  while (placed < TOTAL_MINES) {
    const idx = Math.floor(Math.random() * cells.length)
    if (!cells[idx].isMine) {
      cells[idx].isMine = true
      placed++
    }
  }

  // Calculate neighbor counts
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].isMine) continue
    const r = Math.floor(i / GRID_SIZE)
    const c = i % GRID_SIZE
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          if (cells[nr * GRID_SIZE + nc].isMine) count++
        }
      }
    }
    cells[i].neighborMines = count
  }

  grid.value = cells
}

onMounted(() => {
  initGame()
})

const revealCell = (idx: number) => {
  if (gameState.value !== 'playing') return
  const cell = grid.value[idx]
  if (cell.isRevealed || cell.isFlagged) return

  playSound('click')
  cell.isRevealed = true

  if (cell.isMine) {
    playSound('error')
    gameState.value = 'lost'
    // Reveal all mines
    grid.value.forEach(c => { if (c.isMine) c.isRevealed = true })
    return
  }

  // If blank cell, flood fill reveal
  if (cell.neighborMines === 0) {
    const r = Math.floor(idx / GRID_SIZE)
    const c = idx % GRID_SIZE
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          revealCell(nr * GRID_SIZE + nc)
        }
      }
    }
  }

  // Check win condition
  const unrevealedSafe = grid.value.filter(c => !c.isMine && !c.isRevealed).length
  if (unrevealedSafe === 0) {
    playSound('restore')
    gameState.value = 'won'
  }
}

const toggleFlag = (idx: number) => {
  if (gameState.value !== 'playing') return
  const cell = grid.value[idx]
  if (cell.isRevealed) return
  playSound('click')
  cell.isFlagged = !cell.isFlagged
  mineCount.value += cell.isFlagged ? -1 : 1
}

const numberColor = (n: number) => {
  switch (n) {
    case 1: return 'text-blue-600'
    case 2: return 'text-emerald-600'
    case 3: return 'text-red-600'
    case 4: return 'text-purple-700'
    default: return 'text-amber-800'
  }
}
</script>
