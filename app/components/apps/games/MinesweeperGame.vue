<template>
  <div class="flex flex-col items-center justify-center p-3 select-none font-sans w-full h-full overflow-auto">
    <!-- Minesweeper Classic Chrome Frame -->
    <div class="bg-gradient-to-b from-[#d5e4f5] via-[#bdd6ef] to-[#a2c4e6] p-3 rounded-lg border-2 border-white shadow-xl flex flex-col items-center gap-3">
      <!-- Top Options / Difficulty Bar -->
      <div class="w-full flex items-center justify-between text-xs font-semibold text-slate-700 px-1 border-b border-blue-200/60 pb-2">
        <div class="flex items-center gap-2">
          <span class="text-blue-950 font-bold">Difficulty:</span>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors"
            :class="difficulty === 'beginner' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white/80 hover:bg-white text-slate-700'"
            @click="setDifficulty('beginner')"
          >
            Beginner (9x9)
          </button>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors"
            :class="difficulty === 'intermediate' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white/80 hover:bg-white text-slate-700'"
            @click="setDifficulty('intermediate')"
          >
            Intermediate (16x16)
          </button>
        </div>
      </div>

      <!-- LED Scoreboard & Smiley Header -->
      <div class="w-full bg-gradient-to-b from-[#b4cef0] to-[#91b8e4] p-2 rounded border border-[#7ca6d8] shadow-inner flex items-center justify-between">
        <!-- Mines Remaining LED Display -->
        <div class="bg-black text-red-600 font-mono text-xl font-bold px-2 py-0.5 rounded border border-neutral-700 tracking-wider shadow-inner min-w-[54px] text-center">
          {{ formattedMinesLeft }}
        </div>

        <!-- Smiley Face Button -->
        <button
          type="button"
          class="w-9 h-9 rounded-full bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 border-2 border-amber-600 shadow-md hover:brightness-105 active:scale-95 flex items-center justify-center text-lg cursor-pointer transition-transform"
          :title="status === 'won' ? 'You won! Click to restart' : status === 'lost' ? 'Game Over. Click to restart' : 'Restart Game'"
          @click="resetGame"
        >
          <span>{{ smileyIcon }}</span>
        </button>

        <!-- Timer LED Display -->
        <div class="bg-black text-red-600 font-mono text-xl font-bold px-2 py-0.5 rounded border border-neutral-700 tracking-wider shadow-inner min-w-[54px] text-center">
          {{ formattedTimer }}
        </div>
      </div>

      <!-- Minesweeper Board Grid -->
      <div
        class="bg-[#8caecf] p-1.5 rounded border-2 border-[#6893be] shadow-inner grid gap-0.5"
        :style="{
          gridTemplateColumns: `repeat(${cols}, 28px)`
        }"
        @pointerdown="onBoardPointerDown"
        @pointerup="onBoardPointerUp"
      >
        <template v-for="(row, r) in grid" :key="r">
          <button
            v-for="(cell, c) in row"
            :key="`${r}-${c}`"
            type="button"
            class="w-7 h-7 rounded-xs flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-all active:scale-95"
            :class="getCellClasses(cell)"
            @click="onCellClick(r, c)"
            @contextmenu.prevent="onCellRightClick(r, c)"
          >
            <template v-if="cell.revealed">
              <span v-if="cell.hasMine" class="text-sm">💣</span>
              <span v-else-if="cell.neighborCount > 0" :class="getNumberColor(cell.neighborCount)">
                {{ cell.neighborCount }}
              </span>
            </template>
            <template v-else-if="cell.flagged">
              <span class="text-xs">🚩</span>
            </template>
          </button>
        </template>
      </div>

      <!-- Hint and Controls Footer -->
      <div class="text-[11px] text-slate-600 flex items-center justify-between w-full px-1">
        <span>Left-click: Reveal</span>
        <span>Right-click: Flag 🚩</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

interface Cell {
  hasMine: boolean
  revealed: boolean
  flagged: boolean
  neighborCount: number
  exploded: boolean
}

type Difficulty = 'beginner' | 'intermediate'
type Status = 'idle' | 'playing' | 'won' | 'lost'

const difficulty = ref<Difficulty>('beginner')
const status = ref<Status>('idle')
const timer = ref(0)
const isPressing = ref(false)

let timerInterval: number | null = null

const rows = computed(() => (difficulty.value === 'beginner' ? 9 : 16))
const cols = computed(() => (difficulty.value === 'beginner' ? 9 : 16))
const totalMines = computed(() => (difficulty.value === 'beginner' ? 10 : 40))

const grid = ref<Cell[][]>([])

const flaggedCount = computed(() => {
  let count = 0
  for (const r of grid.value) {
    for (const c of r) {
      if (c.flagged) count++
    }
  }
  return count
})

const minesLeft = computed(() => totalMines.value - flaggedCount.value)

const formattedMinesLeft = computed(() => {
  const val = Math.max(-99, Math.min(999, minesLeft.value))
  return String(val).padStart(3, '0')
})

const formattedTimer = computed(() => {
  const val = Math.min(999, timer.value)
  return String(val).padStart(3, '0')
})

const smileyIcon = computed(() => {
  if (status.value === 'won') return '😎'
  if (status.value === 'lost') return '😵'
  if (isPressing.value) return '😮'
  return '🙂'
})

const initGrid = () => {
  const rCount = rows.value
  const cCount = cols.value
  const newGrid: Cell[][] = []
  for (let r = 0; r < rCount; r++) {
    const row: Cell[] = []
    for (let c = 0; c < cCount; c++) {
      row.push({
        hasMine: false,
        revealed: false,
        flagged: false,
        neighborCount: 0,
        exploded: false
      })
    }
    newGrid.push(row)
  }
  grid.value = newGrid
  status.value = 'idle'
  timer.value = 0
  stopTimer()
}

const placeMines = (safeR: number, safeC: number) => {
  const rCount = rows.value
  const cCount = cols.value
  let placed = 0
  while (placed < totalMines.value) {
    const r = Math.floor(Math.random() * rCount)
    const c = Math.floor(Math.random() * cCount)
    if ((r === safeR && c === safeC) || grid.value[r][c].hasMine) continue
    grid.value[r][c].hasMine = true
    placed++
  }

  // Calculate neighbor counts
  for (let r = 0; r < rCount; r++) {
    for (let c = 0; c < cCount; c++) {
      if (grid.value[r][c].hasMine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rCount && nc >= 0 && nc < cCount) {
            if (grid.value[nr][nc].hasMine) count++
          }
        }
      }
      grid.value[r][c].neighborCount = count
    }
  }
}

const startTimer = () => {
  if (timerInterval) return
  timerInterval = window.setInterval(() => {
    timer.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const setDifficulty = (diff: Difficulty) => {
  if (difficulty.value === diff) return
  difficulty.value = diff
  playSound('click')
  initGrid()
}

const resetGame = () => {
  playSound('click')
  initGrid()
}

const onBoardPointerDown = () => {
  if (status.value === 'playing') {
    isPressing.value = true
  }
}

const onBoardPointerUp = () => {
  isPressing.value = false
}

const onCellClick = (r: number, c: number) => {
  if (status.value === 'won' || status.value === 'lost') return
  const cell = grid.value[r][c]
  if (cell.flagged || cell.revealed) return

  playSound('click')

  if (status.value === 'idle') {
    placeMines(r, c)
    status.value = 'playing'
    startTimer()
  }

  if (cell.hasMine) {
    // Boom
    cell.exploded = true
    cell.revealed = true
    status.value = 'lost'
    stopTimer()
    // Reveal all mines
    for (const row of grid.value) {
      for (const item of row) {
        if (item.hasMine) item.revealed = true
      }
    }
    return
  }

  revealCell(r, c)
  checkWin()
}

const revealCell = (r: number, c: number) => {
  const rCount = rows.value
  const cCount = cols.value
  if (r < 0 || r >= rCount || c < 0 || c >= cCount) return
  const cell = grid.value[r][c]
  if (cell.revealed || cell.flagged || cell.hasMine) return

  cell.revealed = true

  if (cell.neighborCount === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        revealCell(r + dr, c + dc)
      }
    }
  }
}

const onCellRightClick = (r: number, c: number) => {
  if (status.value === 'won' || status.value === 'lost') return
  const cell = grid.value[r][c]
  if (cell.revealed) return

  playSound('click')
  cell.flagged = !cell.flagged
  checkWin()
}

const checkWin = () => {
  if (status.value === 'lost') return
  let unrevealedSafe = 0
  for (const row of grid.value) {
    for (const cell of row) {
      if (!cell.hasMine && !cell.revealed) {
        unrevealedSafe++
      }
    }
  }

  if (unrevealedSafe === 0) {
    status.value = 'won'
    stopTimer()
    // Auto-flag remaining mines
    for (const row of grid.value) {
      for (const cell of row) {
        if (cell.hasMine) cell.flagged = true
      }
    }
  }
}

const getCellClasses = (cell: Cell) => {
  if (cell.revealed) {
    if (cell.exploded) {
      return 'bg-red-500 border border-red-700 text-white shadow-inner animate-pulse'
    }
    if (cell.hasMine) {
      return 'bg-amber-200 border border-amber-400 text-slate-800'
    }
    return 'bg-[#e2eaf4] border border-[#a6bfd9] shadow-inner'
  }
  if (cell.flagged) {
    return 'bg-gradient-to-b from-[#bfe0ff] to-[#7db4ea] border-t border-l border-white border-b-2 border-r-2 border-[#4174a7] shadow-xs'
  }
  // Unrevealed Windows 7 Crystal Tile
  return 'bg-gradient-to-b from-[#ffffff] via-[#d7e8fa] to-[#a9cef5] hover:brightness-105 border-t border-l border-white border-b-2 border-r-2 border-[#5480ab] shadow-xs text-transparent'
}

const getNumberColor = (num: number) => {
  switch (num) {
    case 1: return 'text-blue-600'
    case 2: return 'text-emerald-700'
    case 3: return 'text-red-600'
    case 4: return 'text-indigo-900'
    case 5: return 'text-amber-800'
    case 6: return 'text-teal-700'
    case 7: return 'text-purple-800'
    case 8: return 'text-slate-700'
    default: return 'text-slate-900'
  }
}

onMounted(() => {
  initGrid()
})

onUnmounted(() => {
  stopTimer()
})
</script>
