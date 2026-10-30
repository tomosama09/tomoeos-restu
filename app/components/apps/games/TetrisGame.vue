<template>
  <div class="w-full h-full bg-[#111622] select-none flex items-center justify-center p-3 text-white font-sans overflow-auto">
    <div class="flex items-start gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-700 shadow-2xl">
      <!-- Main Playing Canvas -->
      <div class="border-2 border-slate-600 rounded-lg overflow-hidden bg-black/90 shadow-inner relative">
        <canvas
          ref="canvasRef"
          width="180"
          height="360"
          class="block bg-slate-950"
        />

        <!-- Game Over Overlay -->
        <div
          v-if="isGameOver"
          class="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center"
        >
          <div class="text-red-500 font-extrabold text-lg mb-1 tracking-wider">GAME OVER</div>
          <div class="text-xs text-slate-300 mb-3">Score: {{ score }}</div>
          <button
            type="button"
            class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
            @click="startGame"
          >
            Play Again
          </button>
        </div>
      </div>

      <!-- Side Information & Controls Panel -->
      <div class="w-32 flex flex-col gap-3">
        <!-- Next Piece Preview -->
        <div class="bg-slate-800/80 p-2 rounded-lg border border-slate-700 flex flex-col items-center">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Next</span>
          <canvas ref="nextCanvasRef" width="72" height="72" class="bg-black/60 rounded border border-slate-700/60 block" />
        </div>

        <!-- Score & Stats -->
        <div class="bg-slate-800/80 p-2 rounded-lg border border-slate-700 flex flex-col gap-1.5 text-xs font-semibold">
          <div class="flex justify-between items-center text-slate-400">
            <span>Score:</span>
            <span class="text-white font-mono font-bold">{{ score }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-400">
            <span>Lines:</span>
            <span class="text-white font-mono font-bold">{{ lines }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-400">
            <span>Level:</span>
            <span class="text-white font-mono font-bold">{{ level }}</span>
          </div>
        </div>

        <!-- On-Screen Controls (touch & trackpad friendly) -->
        <div class="bg-slate-800/80 p-2 rounded-lg border border-slate-700 flex flex-col gap-1.5">
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Controls</span>
          <div class="grid grid-cols-3 gap-1">
            <button
              type="button"
              class="h-7 rounded bg-slate-700 hover:bg-slate-600 active:scale-95 text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Move Left"
              @click="move(-1)"
            >
              ◀
            </button>
            <button
              type="button"
              class="h-7 rounded bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Rotate"
              @click="rotate"
            >
              ↻
            </button>
            <button
              type="button"
              class="h-7 rounded bg-slate-700 hover:bg-slate-600 active:scale-95 text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Move Right"
              @click="move(1)"
            >
              ▶
            </button>
          </div>
          <div class="grid grid-cols-2 gap-1">
            <button
              type="button"
              class="h-7 rounded bg-slate-700 hover:bg-slate-600 active:scale-95 text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Soft Drop"
              @click="softDrop"
            >
              ▼ Drop
            </button>
            <button
              type="button"
              class="h-7 rounded bg-amber-600 hover:bg-amber-500 active:scale-95 text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Hard Drop"
              @click="hardDrop"
            >
              ⤓ Slam
            </button>
          </div>
        </div>

        <!-- Restart Button -->
        <button
          type="button"
          class="h-7 rounded bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer transition-colors"
          @click="startGame"
        >
          Restart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

const COLS = 10
const ROWS = 20
const CELL_SIZE = 18

const canvasRef = ref<HTMLCanvasElement | null>(null)
const nextCanvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let nextCtx: CanvasRenderingContext2D | null = null

const score = ref(0)
const lines = ref(0)
const level = ref(1)
const isGameOver = ref(false)

let board: (string | null)[][] = []
let currentPiece: { m: number[][]; col: string; x: number; y: number } | null = null
let nextPiece: { m: number[][]; col: string } | null = null
let gameLoopTimer: number | null = null

const SHAPES: { m: number[][]; col: string }[] = [
  { m: [[1, 1, 1, 1]], col: '#00d2ff' }, // I (cyan)
  { m: [[1, 1], [1, 1]], col: '#ffd000' }, // O (yellow)
  { m: [[0, 1, 0], [1, 1, 1]], col: '#bf00ff' }, // T (purple)
  { m: [[0, 1, 1], [1, 1, 0]], col: '#00e676' }, // S (green)
  { m: [[1, 1, 0], [0, 1, 1]], col: '#ff3d00' }, // Z (red)
  { m: [[1, 0, 0], [1, 1, 1]], col: '#ff9100' }, // L (orange)
  { m: [[0, 0, 1], [1, 1, 1]], col: '#2979ff' } // J (blue)
]

const getRandomShape = () => {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  return {
    m: shape.m.map(row => [...row]),
    col: shape.col
  }
}

const startGame = () => {
  playSound('click')
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  score.value = 0
  lines.value = 0
  level.value = 1
  isGameOver.value = false

  nextPiece = getRandomShape()
  spawnPiece()

  if (gameLoopTimer) clearInterval(gameLoopTimer)
  gameLoopTimer = window.setInterval(tick, Math.max(150, 700 - (level.value - 1) * 60))

  render()
}

const spawnPiece = () => {
  const incoming = nextPiece || getRandomShape()
  nextPiece = getRandomShape()

  currentPiece = {
    m: incoming.m,
    col: incoming.col,
    x: Math.floor((COLS - incoming.m[0].length) / 2),
    y: 0
  }

  drawNextPiece()

  if (hasCollision(currentPiece.m, currentPiece.x, currentPiece.y)) {
    isGameOver.value = true
    if (gameLoopTimer) {
      clearInterval(gameLoopTimer)
      gameLoopTimer = null
    }
  }
}

const hasCollision = (matrix: number[][], posX: number, posY: number): boolean => {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        const targetX = posX + c
        const targetY = posY + r

        if (targetX < 0 || targetX >= COLS || targetY >= ROWS) {
          return true
        }
        if (targetY >= 0 && board[targetY][targetX]) {
          return true
        }
      }
    }
  }
  return false
}

const lockPiece = () => {
  if (!currentPiece) return
  currentPiece.m.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v && currentPiece && currentPiece.y + r >= 0) {
        board[currentPiece.y + r][currentPiece.x + c] = currentPiece.col
      }
    })
  })

  clearLines()
  spawnPiece()
}

const clearLines = () => {
  let cleared = 0
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== null)) {
      board.splice(r, 1)
      board.unshift(Array(COLS).fill(null))
      cleared++
      r++
    }
  }

  if (cleared > 0) {
    const points = [0, 100, 300, 500, 800][cleared] || 100
    score.value += points * level.value
    lines.value += cleared
    level.value = Math.floor(lines.value / 10) + 1
    playSound('startup')
  }
}

const move = (dx: number) => {
  if (!currentPiece || isGameOver.value) return
  if (!hasCollision(currentPiece.m, currentPiece.x + dx, currentPiece.y)) {
    currentPiece.x += dx
    render()
  }
}

const rotate = () => {
  if (!currentPiece || isGameOver.value) return
  const rotated = currentPiece.m[0].map((_, c) => currentPiece!.m.map(row => row[c]).reverse())
  if (!hasCollision(rotated, currentPiece.x, currentPiece.y)) {
    currentPiece.m = rotated
    render()
  }
}

const softDrop = () => {
  if (!currentPiece || isGameOver.value) return
  if (!hasCollision(currentPiece.m, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y++
    render()
  } else {
    lockPiece()
    render()
  }
}

const hardDrop = () => {
  if (!currentPiece || isGameOver.value) return
  while (!hasCollision(currentPiece.m, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y++
  }
  lockPiece()
  render()
}

const tick = () => {
  if (!isGameOver.value) {
    softDrop()
  }
}

const render = () => {
  if (!ctx || !canvasRef.value) return
  ctx.fillStyle = '#0a0d14'
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // Draw board grid lines
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 0.5
  for (let c = 0; c < COLS; c++) {
    ctx.beginPath()
    ctx.moveTo(c * CELL_SIZE, 0)
    ctx.lineTo(c * CELL_SIZE, ROWS * CELL_SIZE)
    ctx.stroke()
  }
  for (let r = 0; r < ROWS; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * CELL_SIZE)
    ctx.lineTo(COLS * CELL_SIZE, r * CELL_SIZE)
    ctx.stroke()
  }

  // Draw placed blocks
  board.forEach((row, r) => {
    row.forEach((color, c) => {
      if (color) {
        drawBlock(ctx!, c * CELL_SIZE, r * CELL_SIZE, color)
      }
    })
  })

  // Draw falling piece
  if (currentPiece) {
    currentPiece.m.forEach((row, r) => {
      row.forEach((v, c) => {
        if (v && currentPiece && currentPiece.y + r >= 0) {
          drawBlock(ctx!, (currentPiece.x + c) * CELL_SIZE, (currentPiece.y + r) * CELL_SIZE, currentPiece.col)
        }
      })
    })
  }
}

const drawBlock = (context: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  context.fillStyle = color
  context.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2)

  // Highlight
  context.fillStyle = 'rgba(255, 255, 255, 0.35)'
  context.fillRect(x + 1, y + 1, CELL_SIZE - 2, 3)

  // Shadow
  context.fillStyle = 'rgba(0, 0, 0, 0.25)'
  context.fillRect(x + 1, y + CELL_SIZE - 4, CELL_SIZE - 2, 3)
}

const drawNextPiece = () => {
  if (!nextCtx || !nextCanvasRef.value || !nextPiece) return
  nextCtx.fillStyle = '#0a0d14'
  nextCtx.fillRect(0, 0, 72, 72)

  const piece = nextPiece
  const offsetX = (72 - piece.m[0].length * CELL_SIZE) / 2
  const offsetY = (72 - piece.m.length * CELL_SIZE) / 2

  piece.m.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        drawBlock(nextCtx!, offsetX + c * CELL_SIZE, offsetY + r * CELL_SIZE, piece.col)
      }
    })
  })
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!canvasRef.value || !canvasRef.value.isConnected) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    rotate()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    softDrop()
  } else if (e.key === ' ') {
    e.preventDefault()
    hardDrop()
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }
  if (nextCanvasRef.value) {
    nextCtx = nextCanvasRef.value.getContext('2d')
  }
  window.addEventListener('keydown', handleKeyDown)
  startGame()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (gameLoopTimer) {
    clearInterval(gameLoopTimer)
    gameLoopTimer = null
  }
})
</script>
