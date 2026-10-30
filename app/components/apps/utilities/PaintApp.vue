<template>
  <WindowFrame id="paint" title="Untitled - Paint" icon="/icons/paint.svg">
    <div class="flex flex-col h-full bg-[#f0f4f9] text-slate-800 select-none overflow-hidden font-sans">
      <!-- 1. Paint Ribbon Toolbar -->
      <div class="shrink-0 bg-gradient-to-b from-[#fbfdff] via-[#e8f1fb] to-[#d8e6f7] border-b border-[#a9c3e2] p-1.5 flex flex-wrap items-center gap-2 shadow-2xs">
        <!-- Tools Section -->
        <div class="flex items-center gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
            :class="activeTool === 'pencil' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900' : 'hover:bg-white border-transparent text-slate-700'"
            title="Pencil"
            @click="activeTool = 'pencil'"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
            :class="activeTool === 'brush' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900' : 'hover:bg-white border-transparent text-slate-700'"
            title="Brush"
            @click="activeTool = 'brush'"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
              <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>
            </svg>
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
            :class="activeTool === 'eraser' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900' : 'hover:bg-white border-transparent text-slate-700'"
            title="Eraser"
            @click="activeTool = 'eraser'"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
              <path d="M15.14 3c-.43 0-.85.17-1.16.48l-8.5 8.5c-.64.64-.64 1.68 0 2.32l5.66 5.66c.31.31.73.48 1.16.48h7.7v-2h-6.28l5.88-5.88c.64-.64.64-1.68 0-2.32l-3.3-3.3c-.31-.31-.73-.48-1.16-.48z"/>
            </svg>
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
            :class="activeTool === 'bucket' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900' : 'hover:bg-white border-transparent text-slate-700'"
            title="Fill with color"
            @click="activeTool = 'bucket'"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
              <path d="M19 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-2.88-6.12L10.5 5.26 3.88 11.88c-.78.78-.78 2.05 0 2.83l5.29 5.29c.78.78 2.05.78 2.83 0l5.12-5.12-1-1z"/>
            </svg>
          </button>
        </div>

        <!-- Stroke Width Selection -->
        <div class="flex items-center gap-1 bg-white/70 px-2 py-1 rounded border border-[#b8cee7] text-xs font-semibold text-slate-700">
          <span class="text-[10px] text-slate-500 mr-0.5">Size:</span>
          <button
            v-for="size in [2, 5, 10, 18]"
            :key="size"
            type="button"
            class="w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer"
            :class="strokeWidth === size ? 'bg-[#cde4fc] border-[#72aee6]' : 'border-transparent hover:bg-white'"
            @click="strokeWidth = size"
          >
            <span class="rounded-full bg-slate-800" :style="{ width: `${Math.min(14, size + 1)}px`, height: `${Math.min(14, size + 1)}px` }" />
          </button>
        </div>

        <!-- Current Color Box -->
        <div class="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded border border-[#b8cee7]">
          <div
            class="w-6 h-6 rounded border border-slate-400 shadow-inner"
            :style="{ backgroundColor: currentColor }"
            title="Active Color"
          />
          <div class="text-[10px] font-semibold text-slate-600 leading-tight">
            Color 1
          </div>
        </div>

        <!-- Color Palette -->
        <div class="grid grid-rows-2 grid-flow-col gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
          <button
            v-for="color in palette"
            :key="color"
            type="button"
            class="w-4 h-4 rounded-xs border transition-transform hover:scale-110 cursor-pointer shadow-2xs"
            :class="currentColor === color ? 'border-black ring-1 ring-blue-500 scale-105' : 'border-black/30'"
            :style="{ backgroundColor: color }"
            @click="currentColor = color"
          />
        </div>

        <!-- Actions: Undo, Clear, Save -->
        <div class="flex items-center gap-1 ml-auto">
          <button
            type="button"
            class="h-7 px-2.5 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Undo last stroke"
            @click="undo"
          >
            <span>↶</span>
            <span>Undo</span>
          </button>
          <button
            type="button"
            class="h-7 px-2.5 rounded bg-white hover:bg-slate-100 border border-[#b8cee7] text-xs font-medium text-red-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Clear canvas"
            @click="clearCanvas"
          >
            <span>✕</span>
            <span>Clear</span>
          </button>
          <button
            type="button"
            class="h-7 px-2.5 rounded bg-gradient-to-b from-[#e3f0fc] to-[#bedbfa] hover:from-[#cbe2f8] hover:to-[#a9d0f7] border border-[#6b9dce] text-xs font-bold text-blue-950 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Download sketch PNG"
            @click="downloadCanvas"
          >
            <span>⬇</span>
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- 2. Drawing Workspace Canvas -->
      <div class="flex-1 bg-[#808080] p-4 flex items-center justify-center overflow-auto min-h-0">
        <div class="bg-white shadow-xl border border-slate-400 rounded-xs overflow-hidden">
          <canvas
            ref="canvasRef"
            width="640"
            height="400"
            class="bg-white cursor-crosshair touch-none"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart.passive="handleTouchStart"
            @touchmove.passive="handleTouchMove"
            @touchend="stopDrawing"
          />
        </div>
      </div>

      <!-- 3. Status Bar -->
      <div class="h-5 bg-gradient-to-b from-[#eef4fb] to-[#d8e6f7] border-t border-[#9bb6d7] px-3 flex items-center justify-between text-[10px] text-slate-600 shrink-0">
        <div class="flex items-center gap-3">
          <span>640 x 400px</span>
          <span v-if="coords">Position: {{ coords.x }}, {{ coords.y }}px</span>
        </div>
        <div class="flex items-center gap-2">
          <span>Tool: {{ activeTool }} • Size: {{ strokeWidth }}px</span>
          <span>100%</span>
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

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

const activeTool = ref<'pencil' | 'brush' | 'eraser' | 'bucket'>('pencil')
const currentColor = ref('#000000')
const strokeWidth = ref(2)
const coords = ref<{ x: number, y: number } | null>(null)

let isDrawing = false
const undoStack = ref<ImageData[]>([])

const palette = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'
]

const initCanvas = () => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 640, 400)
  saveState()
}

const saveState = () => {
  if (!ctx || !canvasRef.value) return
  const imgData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  undoStack.value.push(imgData)
  if (undoStack.value.length > 15) {
    undoStack.value.shift()
  }
}

const getCanvasPos = (clientX: number, clientY: number) => {
  if (!canvasRef.value) return { x: 0, y: 0 }
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  return {
    x: Math.round((clientX - rect.left) * scaleX),
    y: Math.round((clientY - rect.top) * scaleY)
  }
}

const startDrawing = (e: MouseEvent) => {
  if (!ctx) return
  isDrawing = true
  const pos = getCanvasPos(e.clientX, e.clientY)
  coords.value = pos

  if (activeTool.value === 'bucket') {
    ctx.fillStyle = currentColor.value
    ctx.fillRect(0, 0, 640, 400)
    saveState()
    isDrawing = false
    return
  }

  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = activeTool.value === 'eraser' ? strokeWidth.value * 2.5 : strokeWidth.value
  ctx.strokeStyle = activeTool.value === 'eraser' ? '#ffffff' : currentColor.value
}

const draw = (e: MouseEvent) => {
  const pos = getCanvasPos(e.clientX, e.clientY)
  coords.value = pos
  if (!isDrawing || !ctx) return
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

const stopDrawing = () => {
  if (!isDrawing) return
  isDrawing = false
  saveState()
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 0 || !ctx) return
  isDrawing = true
  const touch = e.touches[0]
  const pos = getCanvasPos(touch.clientX, touch.clientY)
  coords.value = pos
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = strokeWidth.value
  ctx.strokeStyle = activeTool.value === 'eraser' ? '#ffffff' : currentColor.value
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDrawing || !ctx || e.touches.length === 0) return
  const touch = e.touches[0]
  const pos = getCanvasPos(touch.clientX, touch.clientY)
  coords.value = pos
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

const undo = () => {
  playSound('click')
  if (!ctx || undoStack.value.length <= 1) return
  undoStack.value.pop()
  const prev = undoStack.value[undoStack.value.length - 1]
  if (prev) {
    ctx.putImageData(prev, 0, 0)
  }
}

const clearCanvas = () => {
  playSound('click')
  if (!ctx) return
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 640, 400)
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
  initCanvas()
})
</script>