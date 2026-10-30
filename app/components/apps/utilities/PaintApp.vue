<template>
  <WindowFrame id="paint" title="Untitled - Paint" icon="/icons/paint.svg">
    <div class="flex flex-col h-full bg-[#f0f4f9] text-slate-800 select-none overflow-hidden font-sans">
      <!-- 1. Paint Ribbon Toolbar (Aero style) -->
      <div class="shrink-0 bg-gradient-to-b from-[#fbfdff] via-[#eef4fa] to-[#d8e6f7] border-b border-[#a9c3e2] px-3 py-1.5 flex flex-wrap items-center gap-3 shadow-2xs">
        <!-- Tools Section -->
        <div class="flex flex-col gap-0.5 border-r border-[#c2d7ed] pr-2.5">
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Tools</span>
          <div class="grid grid-cols-3 gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
            <!-- Pencil -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'pencil' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Pencil (fine freehand)"
              @click="setTool('pencil')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>

            <!-- Brush -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'brush' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Brush (smooth stroke)"
              @click="setTool('brush')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>
              </svg>
            </button>

            <!-- Bucket / Flood Fill -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'bucket' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Fill with color"
              @click="setTool('bucket')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M19 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-2.88-6.12L10.5 5.26 3.88 11.88c-.78.78-.78 2.05 0 2.83l5.29 5.29c.78.78 2.05.78 2.83 0l5.12-5.12-1-1z"/>
              </svg>
            </button>

            <!-- Eraser -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'eraser' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Eraser"
              @click="setTool('eraser')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M15.14 3c-.43 0-.85.17-1.16.48l-8.5 8.5c-.64.64-.64 1.68 0 2.32l5.66 5.66c.31.31.73.48 1.16.48h7.7v-2h-6.28l5.88-5.88c.64-.64.64-1.68 0-2.32l-3.3-3.3c-.31-.31-.73-.48-1.16-.48z"/>
              </svg>
            </button>

            <!-- Color Picker / Eyedropper -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'picker' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Color Picker (eyedropper)"
              @click="setTool('picker')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.04.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
              </svg>
            </button>

            <!-- Reset Canvas -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer hover:bg-red-50 text-red-700 border-transparent hover:border-red-200"
              title="Clear entire canvas"
              @click="clearCanvas"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Shapes Section -->
        <div class="flex flex-col gap-0.5 border-r border-[#c2d7ed] pr-2.5">
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Shapes</span>
          <div class="grid grid-cols-3 gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
            <!-- Line -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'line' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Line"
              @click="setTool('line')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current stroke-2">
                <line x1="4" y1="20" x2="20" y2="4" />
              </svg>
            </button>

            <!-- Rectangle -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'rect' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Rectangle"
              @click="setTool('rect')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-2">
                <rect x="4" y="5" width="16" height="14" rx="1" />
              </svg>
            </button>

            <!-- Circle / Ellipse -->
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'circle' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Circle / Ellipse"
              @click="setTool('circle')"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-2">
                <circle cx="12" cy="12" r="8" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Stroke Width Selection -->
        <div class="flex flex-col gap-0.5 border-r border-[#c2d7ed] pr-2.5">
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Size</span>
          <div class="flex items-center gap-1 bg-white/70 px-2 py-1.5 rounded border border-[#b8cee7] h-9">
            <button
              v-for="size in [1, 3, 6, 12]"
              :key="size"
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="strokeWidth === size ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner' : 'border-transparent hover:bg-white'"
              :title="`${size}px stroke`"
              @click="strokeWidth = size"
            >
              <span class="rounded-full bg-slate-800" :style="{ width: `${Math.max(2, size)}px`, height: `${Math.max(2, size)}px` }" />
            </button>
          </div>
        </div>

        <!-- Color 1 Display -->
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Color</span>
          <div class="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded border border-[#b8cee7] h-9">
            <input
              type="color"
              v-model="currentColor"
              class="w-6 h-6 rounded border border-slate-400 shadow-inner cursor-pointer p-0 bg-transparent"
              title="Choose custom color"
            />
            <span class="text-[10px] font-mono font-semibold text-slate-700 uppercase">{{ currentColor }}</span>
          </div>
        </div>

        <!-- Color Palette Grid -->
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Palette</span>
          <div class="grid grid-rows-2 grid-flow-col gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
            <button
              v-for="color in palette"
              :key="color"
              type="button"
              class="w-4 h-4 rounded-xs border transition-transform hover:scale-110 cursor-pointer shadow-2xs"
              :class="currentColor.toLowerCase() === color.toLowerCase() ? 'border-black ring-1 ring-blue-500 scale-110' : 'border-black/30'"
              :style="{ backgroundColor: color }"
              @click="currentColor = color"
            />
          </div>
        </div>

        <!-- Actions: Undo, Redo, Save -->
        <div class="flex items-center gap-1 ml-auto self-center pt-2">
          <button
            type="button"
            class="h-7 px-2.5 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="undoStack.length <= 1"
            title="Undo"
            @click="undo"
          >
            <span>↶</span>
            <span>Undo</span>
          </button>
          <button
            type="button"
            class="h-7 px-2.5 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="redoStack.length === 0"
            title="Redo"
            @click="redo"
          >
            <span>↷</span>
            <span>Redo</span>
          </button>
          <button
            type="button"
            class="h-7 px-3 rounded bg-gradient-to-b from-[#e3f0fc] to-[#bedbfa] hover:from-[#cbe2f8] hover:to-[#a9d0f7] border border-[#6b9dce] text-xs font-bold text-blue-950 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Export sketch as PNG"
            @click="downloadCanvas"
          >
            <span>⬇</span>
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- 2. Drawing Workspace Canvas -->
      <div class="flex-1 bg-[#808080] p-4 flex items-center justify-center overflow-auto min-h-0">
        <div class="bg-white shadow-2xl border border-slate-500 rounded-xs overflow-hidden relative">
          <canvas
            ref="canvasRef"
            width="640"
            height="400"
            class="bg-white touch-none block"
            :class="activeTool === 'picker' ? 'cursor-cell' : 'cursor-crosshair'"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @pointercancel="handlePointerUp"
          />
        </div>
      </div>

      <!-- 3. Status Bar -->
      <div class="h-5 bg-gradient-to-b from-[#eef4fb] to-[#d8e6f7] border-t border-[#9bb6d7] px-3 flex items-center justify-between text-[10px] text-slate-600 shrink-0 select-none">
        <div class="flex items-center gap-4">
          <span class="font-mono">640 x 400px</span>
          <span v-if="coords" class="font-mono">Coordinates: {{ coords.x }}, {{ coords.y }}px</span>
          <span v-else class="text-slate-400">Hover canvas for coordinates</span>
        </div>
        <div class="flex items-center gap-3 font-medium">
          <span class="capitalize">Tool: {{ activeTool }}</span>
          <span>Size: {{ strokeWidth }}px</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

type ToolType = 'pencil' | 'brush' | 'bucket' | 'eraser' | 'picker' | 'line' | 'rect' | 'circle'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

const activeTool = ref<ToolType>('pencil')
const currentColor = ref('#000000')
const strokeWidth = ref(3)
const coords = ref<{ x: number; y: number } | null>(null)

let isDrawing = false
let startPos = { x: 0, y: 0 }
let lastPos = { x: 0, y: 0 }
let shapeSnapshot: ImageData | null = null

const undoStack = ref<ImageData[]>([])
const redoStack = ref<ImageData[]>([])

const palette = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'
]

const setTool = (tool: ToolType) => {
  playSound('click')
  activeTool.value = tool
}

const initCanvas = () => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  // Fill canvas with pure white
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 640, 400)
  saveState()
}

const saveState = () => {
  if (!ctx || !canvasRef.value) return
  const imgData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  undoStack.value.push(imgData)
  if (undoStack.value.length > 20) {
    undoStack.value.shift()
  }
  // Clear redo stack on new action
  redoStack.value = []
}

const getCanvasPos = (clientX: number, clientY: number) => {
  if (!canvasRef.value) return { x: 0, y: 0 }
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  return {
    x: Math.max(0, Math.min(639, Math.round((clientX - rect.left) * scaleX))),
    y: Math.max(0, Math.min(399, Math.round((clientY - rect.top) * scaleY)))
  }
}

// Convert Hex to RGBA
function hexToRgba(hex: string): [number, number, number, number] {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  const num = parseInt(c, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255]
}

// Flood Fill BFS algorithm
function floodFill(startX: number, startY: number, fillHex: string) {
  if (!ctx || !canvasRef.value) return
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = new Uint32Array(imgData.data.buffer)

  const targetColor = data[startY * width + startX]
  const [r, g, b, a] = hexToRgba(fillHex)
  const fillColor = (a << 24) | (b << 16) | (g << 8) | r

  if (targetColor === fillColor) return

  const queue: number[] = [startX + startY * width]
  const visited = new Uint8Array(width * height)
  visited[startX + startY * width] = 1

  while (queue.length > 0) {
    const idx = queue.pop()!
    data[idx] = fillColor
    const cx = idx % width
    const cy = Math.floor(idx / width)

    if (cx > 0) {
      const left = idx - 1
      if (!visited[left] && data[left] === targetColor) {
        visited[left] = 1
        queue.push(left)
      }
    }
    if (cx < width - 1) {
      const right = idx + 1
      if (!visited[right] && data[right] === targetColor) {
        visited[right] = 1
        queue.push(right)
      }
    }
    if (cy > 0) {
      const up = idx - width
      if (!visited[up] && data[up] === targetColor) {
        visited[up] = 1
        queue.push(up)
      }
    }
    if (cy < height - 1) {
      const down = idx + width
      if (!visited[down] && data[down] === targetColor) {
        visited[down] = 1
        queue.push(down)
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
}

const handlePointerDown = (e: PointerEvent) => {
  if (!ctx || !canvasRef.value) return
  // Capture pointer to continue drawing even when cursor leaves canvas
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  } catch {}

  const pos = getCanvasPos(e.clientX, e.clientY)
  coords.value = pos
  startPos = pos
  lastPos = pos

  // 1. Color Picker tool
  if (activeTool.value === 'picker') {
    const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data
    const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)
    currentColor.value = hex
    playSound('click')
    activeTool.value = 'brush'
    return
  }

  // 2. Flood Fill bucket tool
  if (activeTool.value === 'bucket') {
    floodFill(pos.x, pos.y, currentColor.value)
    saveState()
    playSound('click')
    return
  }

  // 3. Shape tools
  if (activeTool.value === 'line' || activeTool.value === 'rect' || activeTool.value === 'circle') {
    isDrawing = true
    shapeSnapshot = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    return
  }

  // 4. Pencil / Brush / Eraser tools
  isDrawing = true
  const isEraser = activeTool.value === 'eraser'
  const isPencil = activeTool.value === 'pencil'
  const size = isEraser ? strokeWidth.value * 3 : (isPencil ? 1 : strokeWidth.value)
  const color = isEraser ? '#ffffff' : currentColor.value

  // Single click immediate dot rendering
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(pos.x, pos.y, Math.max(1, size / 2), 0, Math.PI * 2)
  ctx.fill()
}

const handlePointerMove = (e: PointerEvent) => {
  const pos = getCanvasPos(e.clientX, e.clientY)
  coords.value = pos

  if (!isDrawing || !ctx || !canvasRef.value) return

  // Shape previews
  if (shapeSnapshot && (activeTool.value === 'line' || activeTool.value === 'rect' || activeTool.value === 'circle')) {
    ctx.putImageData(shapeSnapshot, 0, 0)
    ctx.strokeStyle = currentColor.value
    ctx.lineWidth = strokeWidth.value
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (activeTool.value === 'line') {
      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (activeTool.value === 'rect') {
      const x = Math.min(startPos.x, pos.x)
      const y = Math.min(startPos.y, pos.y)
      const w = Math.abs(pos.x - startPos.x)
      const h = Math.abs(pos.y - startPos.y)
      ctx.strokeRect(x, y, w, h)
    } else if (activeTool.value === 'circle') {
      const rx = Math.abs(pos.x - startPos.x) / 2
      const ry = Math.abs(pos.y - startPos.y) / 2
      const cx = Math.min(startPos.x, pos.x) + rx
      const cy = Math.min(startPos.y, pos.y) + ry
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
    return
  }

  // Freehand drawing (pencil, brush, eraser)
  const isEraser = activeTool.value === 'eraser'
  const isPencil = activeTool.value === 'pencil'
  const size = isEraser ? strokeWidth.value * 3 : (isPencil ? 1 : strokeWidth.value)
  const color = isEraser ? '#ffffff' : currentColor.value

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.moveTo(lastPos.x, lastPos.y)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()

  lastPos = pos
}

const handlePointerUp = (e: PointerEvent) => {
  if (!isDrawing) return
  isDrawing = false
  shapeSnapshot = null

  try {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {}

  saveState()
}

const undo = () => {
  playSound('click')
  if (!ctx || !canvasRef.value || undoStack.value.length <= 1) return
  const current = undoStack.value.pop()
  if (current) {
    redoStack.value.push(current)
  }
  const prev = undoStack.value[undoStack.value.length - 1]
  if (prev) {
    ctx.putImageData(prev, 0, 0)
  }
}

const redo = () => {
  playSound('click')
  if (!ctx || !canvasRef.value || redoStack.value.length === 0) return
  const next = redoStack.value.pop()
  if (next) {
    undoStack.value.push(next)
    ctx.putImageData(next, 0, 0)
  }
}

const clearCanvas = () => {
  playSound('click')
  if (!ctx || !canvasRef.value) return
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  saveState()
}

const downloadCanvas = () => {
  playSound('click')
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = 'Restu_Utomo_Sketch.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}

onMounted(() => {
  nextTick(() => {
    initCanvas()
  })
})
</script>
