<template>
  <WindowFrame id="paint" title="Untitled - Paint" icon="/icons/paint.svg">
    <div class="flex flex-col h-full bg-[#f0f4f9] text-slate-800 select-none overflow-hidden font-sans">
      <!-- 1. Paint Ribbon Toolbar (Aero style) -->
      <div class="shrink-0 bg-gradient-to-b from-[#fbfdff] via-[#eef4fa] to-[#d8e6f7] border-b border-[#a9c3e2] px-3 py-1 flex flex-wrap items-center gap-2.5 shadow-2xs select-none">
        
        <!-- Section A: Clipboard & Actions -->
        <div class="flex flex-col items-center gap-0.5 border-r border-[#c2d7ed] pr-2">
          <div class="flex items-center gap-1">
            <!-- Undo -->
            <button
              type="button"
              class="h-7 px-2 rounded bg-white/80 hover:bg-white border border-[#b8cee7] text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="undoStack.length <= 1"
              title="Undo (Ctrl+Z)"
              @click="undo"
            >
              <span>↶</span>
              <span class="hidden sm:inline">Undo</span>
            </button>
            <!-- Redo -->
            <button
              type="button"
              class="h-7 px-2 rounded bg-white/80 hover:bg-white border border-[#b8cee7] text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="redoStack.length === 0"
              title="Redo (Ctrl+Y)"
              @click="redo"
            >
              <span>↷</span>
              <span class="hidden sm:inline">Redo</span>
            </button>
            <!-- Clear Canvas -->
            <button
              type="button"
              class="h-7 px-2 rounded bg-white/80 hover:bg-red-50 hover:text-red-700 border border-[#b8cee7] hover:border-red-300 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
              title="Clear Canvas"
              @click="clearCanvas"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              <span class="hidden sm:inline">Clear</span>
            </button>
          </div>
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">History</span>
        </div>

        <!-- Section B: Tools (Pencil, Brush, Spray, Bucket, Text, Eraser, Picker) -->
        <div class="flex flex-col items-center gap-0.5 border-r border-[#c2d7ed] pr-2">
          <div class="grid grid-cols-4 gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
            <!-- Pencil -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'pencil' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Pencil (1px sharp sketch)"
              @click="setTool('pencil')"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>

            <!-- Brush -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'brush' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Brush (smooth freehand)"
              @click="setTool('brush')"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>
              </svg>
            </button>

            <!-- Spray / Airbrush -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'spray' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Airbrush / Spray paint"
              @click="setTool('spray')"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <circle cx="10" cy="8" r="1.5"/>
                <circle cx="14" cy="6" r="1"/>
                <circle cx="16" cy="10" r="1.2"/>
                <circle cx="8" cy="12" r="1.2"/>
                <circle cx="12" cy="12" r="1.8"/>
                <circle cx="10" cy="16" r="1.2"/>
                <circle cx="15" cy="15" r="1.5"/>
              </svg>
            </button>

            <!-- Fill Bucket -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'bucket' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Fill with color"
              @click="setTool('bucket')"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <path d="M19 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-2.88-6.12L10.5 5.26 3.88 11.88c-.78.78-.78 2.05 0 2.83l5.29 5.29c.78.78 2.05.78 2.83 0l5.12-5.12-1-1z"/>
              </svg>
            </button>

            <!-- Text Tool -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer text-xs font-serif font-black"
              :class="activeTool === 'text' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900' : 'hover:bg-white border-transparent text-slate-700'"
              title="Text (type onto canvas)"
              @click="setTool('text')"
            >
              <span>A</span>
            </button>

            <!-- Eraser -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'eraser' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Eraser (erase with Color 2)"
              @click="setTool('eraser')"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <path d="M15.14 3c-.43 0-.85.17-1.16.48l-8.5 8.5c-.64.64-.64 1.68 0 2.32l5.66 5.66c.31.31.73.48 1.16.48h7.7v-2h-6.28l5.88-5.88c.64-.64.64-1.68 0-2.32l-3.3-3.3c-.31-.31-.73-.48-1.16-.48z"/>
              </svg>
            </button>

            <!-- Color Picker -->
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="activeTool === 'picker' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
              title="Color Picker (Eyedropper)"
              @click="setTool('picker')"
            >
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
                <path d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.04.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
              </svg>
            </button>
          </div>
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Tools</span>
        </div>

        <!-- Section C: Shapes (Line, Rect, Rounded Rect, Circle, Triangle, Star) -->
        <div class="flex flex-col items-center gap-0.5 border-r border-[#c2d7ed] pr-2">
          <div class="flex items-center gap-1.5">
            <div class="grid grid-cols-3 gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
              <!-- Line -->
              <button
                type="button"
                class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
                :class="activeTool === 'line' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
                title="Line"
                @click="setTool('line')"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 stroke-current stroke-2">
                  <line x1="4" y1="20" x2="20" y2="4" />
                </svg>
              </button>

              <!-- Rectangle -->
              <button
                type="button"
                class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
                :class="activeTool === 'rect' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
                title="Rectangle"
                @click="setTool('rect')"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <rect x="4" y="5" width="16" height="14" />
                </svg>
              </button>

              <!-- Rounded Rectangle -->
              <button
                type="button"
                class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
                :class="activeTool === 'rounded-rect' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
                title="Rounded Rectangle"
                @click="setTool('rounded-rect')"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <rect x="4" y="5" width="16" height="14" rx="4" />
                </svg>
              </button>

              <!-- Circle / Ellipse -->
              <button
                type="button"
                class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
                :class="activeTool === 'circle' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
                title="Ellipse / Circle"
                @click="setTool('circle')"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </button>

              <!-- Triangle -->
              <button
                type="button"
                class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
                :class="activeTool === 'triangle' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
                title="Triangle"
                @click="setTool('triangle')"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <polygon points="12,4 4,20 20,20" />
                </svg>
              </button>

              <!-- Star -->
              <button
                type="button"
                class="w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer"
                :class="activeTool === 'star' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner text-blue-900 font-bold' : 'hover:bg-white border-transparent text-slate-700'"
                title="5-Point Star"
                @click="setTool('star')"
              >
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              </button>
            </div>

            <!-- Fill Toggle -->
            <button
              type="button"
              class="h-14 px-1.5 rounded flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer text-[10px]"
              :class="fillShape ? 'bg-[#cde4fc] border-[#72aee6] text-blue-950 font-bold shadow-inner' : 'bg-white/80 border-[#b8cee7] text-slate-600 hover:bg-white'"
              title="Toggle Solid Shape Fill"
              @click="fillShape = !fillShape"
            >
              <div class="w-4 h-4 border border-slate-700" :class="fillShape ? 'bg-blue-600' : 'bg-transparent'" />
              <span>{{ fillShape ? 'Filled' : 'Outline' }}</span>
            </button>
          </div>
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Shapes</span>
        </div>

        <!-- Section D: Size -->
        <div class="flex flex-col items-center gap-0.5 border-r border-[#c2d7ed] pr-2">
          <div class="flex items-center gap-1 bg-white/70 px-2 py-1.5 rounded border border-[#b8cee7] h-10">
            <button
              v-for="size in [1, 2, 4, 8, 16, 24]"
              :key="size"
              type="button"
              class="w-5 h-7 rounded flex items-center justify-center border transition-all cursor-pointer"
              :class="strokeWidth === size ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner' : 'border-transparent hover:bg-white'"
              :title="`${size}px stroke`"
              @click="strokeWidth = size"
            >
              <span class="rounded-full bg-slate-800" :style="{ width: `${Math.min(14, Math.max(2, size))}px`, height: `${Math.min(14, Math.max(2, size))}px` }" />
            </button>
          </div>
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Size ({{ strokeWidth }}px)</span>
        </div>

        <!-- Section E: Colors (Color 1, Color 2, Swatches, Custom Input) -->
        <div class="flex flex-col items-center gap-0.5">
          <div class="flex items-center gap-2">
            <!-- Color 1 (Foreground) -->
            <button
              type="button"
              class="flex flex-col items-center p-1 rounded border transition-all cursor-pointer"
              :class="activeColorSlot === 'color1' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner' : 'bg-white/70 border-[#b8cee7] hover:bg-white'"
              title="Color 1 (Foreground / Left Click)"
              @click="activeColorSlot = 'color1'"
            >
              <div class="w-6 h-6 rounded-xs border border-slate-400 shadow-inner" :style="{ backgroundColor: color1 }" />
              <span class="text-[9px] font-bold text-slate-700 mt-0.5">Color 1</span>
            </button>

            <!-- Color 2 (Background / Secondary) -->
            <button
              type="button"
              class="flex flex-col items-center p-1 rounded border transition-all cursor-pointer"
              :class="activeColorSlot === 'color2' ? 'bg-[#cde4fc] border-[#72aee6] shadow-inner' : 'bg-white/70 border-[#b8cee7] hover:bg-white'"
              title="Color 2 (Background / Right Click / Eraser)"
              @click="activeColorSlot = 'color2'"
            >
              <div class="w-6 h-6 rounded-xs border border-slate-400 shadow-inner" :style="{ backgroundColor: color2 }" />
              <span class="text-[9px] font-bold text-slate-700 mt-0.5">Color 2</span>
            </button>

            <!-- Palette Grid (20 Windows 7 classic swatches) -->
            <div class="grid grid-rows-2 grid-flow-col gap-1 bg-white/70 p-1 rounded border border-[#b8cee7]">
              <button
                v-for="color in palette"
                :key="color"
                type="button"
                class="w-4 h-4 rounded-xs border transition-transform hover:scale-125 cursor-pointer shadow-2xs"
                :class="(activeColorSlot === 'color1' ? color1 : color2).toLowerCase() === color.toLowerCase() ? 'border-blue-700 ring-2 ring-blue-500 scale-110 z-10' : 'border-black/30'"
                :style="{ backgroundColor: color }"
                :title="color"
                @click="selectPaletteColor(color)"
                @contextmenu.prevent="color2 = color"
              />
            </div>

            <!-- Custom Color Picker -->
            <div class="flex flex-col items-center gap-0.5">
              <input
                type="color"
                :value="activeColorSlot === 'color1' ? color1 : color2"
                class="w-7 h-7 rounded border border-slate-400 shadow-inner cursor-pointer p-0 bg-transparent"
                title="Edit custom color"
                @input="onCustomColorInput"
              />
              <span class="text-[8px] font-mono text-slate-500">Edit</span>
            </div>
          </div>
          <span class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Colors</span>
        </div>

        <!-- Section F: Export / Save -->
        <div class="ml-auto self-center">
          <button
            type="button"
            class="h-8 px-3 rounded bg-gradient-to-b from-[#e3f0fc] to-[#bedbfa] hover:from-[#cbe2f8] hover:to-[#a9d0f7] border border-[#6b9dce] text-xs font-bold text-blue-950 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Export sketch as PNG image"
            @click="downloadCanvas"
          >
            <span>💾</span>
            <span>Save</span>
          </button>
        </div>

      </div>

      <!-- 2. Drawing Workspace Canvas Area -->
      <div
        ref="workspaceRef"
        class="flex-1 bg-[#808080] p-4 flex items-center justify-center overflow-auto min-h-0 relative select-none"
      >
        <!-- Canvas Container with Windows 7 Resizing Handles Visual Frame -->
        <div class="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] border border-slate-600 relative select-none">
          <canvas
            ref="canvasRef"
            :width="CANVAS_WIDTH"
            :height="CANVAS_HEIGHT"
            class="bg-white touch-none block select-none"
            :class="cursorClass"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @pointercancel="handlePointerUp"
            @contextmenu.prevent
          />

          <!-- Inline Text Overlay Input for Text Tool -->
          <div
            v-if="isTypingText"
            class="absolute z-20"
            :style="{ left: `${textInputPos.x}px`, top: `${textInputPos.y}px` }"
          >
            <div class="flex items-center gap-1 bg-white/95 p-1 rounded border border-blue-400 shadow-lg">
              <input
                ref="textInputRef"
                v-model="textInputValue"
                type="text"
                class="px-1.5 py-0.5 text-xs border border-slate-300 rounded font-sans outline-none focus:border-blue-500 bg-white"
                :style="{ color: color1 }"
                placeholder="Type text and press Enter..."
                @keydown.enter="commitText"
                @keydown.esc="cancelText"
              />
              <button
                type="button"
                class="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded cursor-pointer"
                @click="commitText"
              >
                Stamp
              </button>
              <button
                type="button"
                class="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] rounded cursor-pointer"
                @click="cancelText"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Windows 7 Paint Canvas Edge Handles (Authentic Visual Details) -->
          <div class="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white border border-slate-700 pointer-events-none" />
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border border-slate-700 pointer-events-none" />
          <div class="absolute -right-1 -bottom-1 w-1.5 h-1.5 bg-white border border-slate-700 pointer-events-none" />
        </div>
      </div>

      <!-- 3. Status Bar -->
      <div class="h-5 bg-gradient-to-b from-[#eef4fb] to-[#d8e6f7] border-t border-[#9bb6d7] px-3 flex items-center justify-between text-[10px] text-slate-600 shrink-0 select-none">
        <div class="flex items-center gap-4">
          <span class="font-mono">{{ CANVAS_WIDTH }} x {{ CANVAS_HEIGHT }}px</span>
          <span v-if="coords" class="font-mono">Coordinates: {{ coords.x }}, {{ coords.y }}px</span>
          <span v-else class="text-slate-400">Hover canvas for coordinates</span>
        </div>
        <div class="flex items-center gap-3 font-medium">
          <span class="capitalize">Tool: {{ activeTool }}</span>
          <span>Size: {{ strokeWidth }}px</span>
          <span>Zoom: 100%</span>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

type ToolType = 'pencil' | 'brush' | 'spray' | 'bucket' | 'text' | 'eraser' | 'picker' | 'line' | 'rect' | 'rounded-rect' | 'circle' | 'triangle' | 'star'

const CANVAS_WIDTH = 720
const CANVAS_HEIGHT = 440

const canvasRef = ref<HTMLCanvasElement | null>(null)
const workspaceRef = ref<HTMLElement | null>(null)
const textInputRef = ref<HTMLInputElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

// Persistent store across window minimize/close/reopen
const persistentCanvasData = ref<string | null>(null)

const activeTool = ref<ToolType>('pencil')
const previousTool = ref<ToolType>('pencil')
const activeColorSlot = ref<'color1' | 'color2'>('color1')
const color1 = ref('#000000')
const color2 = ref('#ffffff')
const fillShape = ref(false)
const strokeWidth = ref(2)
const coords = ref<{ x: number; y: number } | null>(null)

let isDrawing = false
let startPos = { x: 0, y: 0 }
let lastPos = { x: 0, y: 0 }
let shapeSnapshot: ImageData | null = null
let sprayInterval: ReturnType<typeof setInterval> | null = null

// Text Tool States
const isTypingText = ref(false)
const textInputValue = ref('')
const textInputPos = ref({ x: 0, y: 0, canvasX: 0, canvasY: 0 })

// Undo / Redo Stacks (stored as data URLs for robust restoration)
const undoStack = ref<string[]>([])
const redoStack = ref<string[]>([])

// 20 Authentic Classic Windows 7 Paint Colors
const palette = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'
]

const cursorClass = computed(() => {
  if (activeTool.value === 'picker') return 'cursor-cell'
  if (activeTool.value === 'text') return 'cursor-text'
  return 'cursor-crosshair'
})

const setTool = (tool: ToolType) => {
  playSound('click')
  if (activeTool.value !== 'picker') {
    previousTool.value = activeTool.value
  }
  activeTool.value = tool
  if (tool !== 'text' && isTypingText.value) {
    cancelText()
  }
}

const selectPaletteColor = (color: string) => {
  playSound('click')
  if (activeColorSlot.value === 'color1') {
    color1.value = color
  } else {
    color2.value = color
  }
}

const onCustomColorInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  if (activeColorSlot.value === 'color1') {
    color1.value = val
  } else {
    color2.value = val
  }
}

const ensureCanvasContext = (): boolean => {
  if (!canvasRef.value) return false
  if (!ctx) {
    ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
  }
  return !!ctx
}

const initOrRestoreCanvas = () => {
  if (!ensureCanvasContext() || !canvasRef.value || !ctx) return

  if (persistentCanvasData.value) {
    const img = new Image()
    img.onload = () => {
      if (!ctx || !canvasRef.value) return
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = persistentCanvasData.value
  } else {
    // Fill pristine canvas with solid white
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    saveState()
  }
}

const saveState = () => {
  if (!ensureCanvasContext() || !canvasRef.value) return
  try {
    const dataUrl = canvasRef.value.toDataURL('image/png')
    persistentCanvasData.value = dataUrl
    undoStack.value.push(dataUrl)
    if (undoStack.value.length > 30) {
      undoStack.value.shift()
    }
    redoStack.value = []
  } catch (err) {
    console.warn('Canvas snapshot failed:', err)
  }
}

const restoreFromDataUrl = (dataUrl: string) => {
  if (!ensureCanvasContext() || !canvasRef.value || !ctx) return
  const img = new Image()
  img.onload = () => {
    if (!ctx || !canvasRef.value) return
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    ctx.drawImage(img, 0, 0)
    persistentCanvasData.value = dataUrl
  }
  img.src = dataUrl
}

const getCanvasPos = (clientX: number, clientY: number) => {
  if (!canvasRef.value) return { x: 0, y: 0 }
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  return {
    x: Math.max(0, Math.min(CANVAS_WIDTH - 1, Math.round((clientX - rect.left) * scaleX))),
    y: Math.max(0, Math.min(CANVAS_HEIGHT - 1, Math.round((clientY - rect.top) * scaleY)))
  }
}

// Convert Hex to RGBA
function hexToRgba(hex: string): [number, number, number, number] {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  const num = parseInt(c, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255]
}

// Fast BFS Flood Fill with Antialiasing Tolerance
function floodFill(startX: number, startY: number, fillHex: string, tolerance = 32) {
  if (!ensureCanvasContext() || !canvasRef.value || !ctx) return
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  const startIndex = (startY * width + startX) * 4
  const startR = data[startIndex]
  const startG = data[startIndex + 1]
  const startB = data[startIndex + 2]
  const startA = data[startIndex + 3]

  const [fillR, fillG, fillB, fillA] = hexToRgba(fillHex)

  if (
    Math.abs(startR - fillR) < 3 &&
    Math.abs(startG - fillG) < 3 &&
    Math.abs(startB - fillB) < 3 &&
    Math.abs(startA - fillA) < 3
  ) {
    return
  }

  function matchesStart(idx: number) {
    return (
      Math.abs(data[idx] - startR) <= tolerance &&
      Math.abs(data[idx + 1] - startG) <= tolerance &&
      Math.abs(data[idx + 2] - startB) <= tolerance &&
      Math.abs(data[idx + 3] - startA) <= tolerance
    )
  }

  const visited = new Uint8Array(width * height)
  const queue: number[] = [startX + startY * width]
  visited[startX + startY * width] = 1

  while (queue.length > 0) {
    const p = queue.pop()!
    const x = p % width
    const y = Math.floor(p / width)
    const idx = p * 4

    data[idx] = fillR
    data[idx + 1] = fillG
    data[idx + 2] = fillB
    data[idx + 3] = fillA

    if (x > 0) {
      const left = p - 1
      if (!visited[left] && matchesStart(left * 4)) {
        visited[left] = 1
        queue.push(left)
      }
    }
    if (x < width - 1) {
      const right = p + 1
      if (!visited[right] && matchesStart(right * 4)) {
        visited[right] = 1
        queue.push(right)
      }
    }
    if (y > 0) {
      const up = p - width
      if (!visited[up] && matchesStart(up * 4)) {
        visited[up] = 1
        queue.push(up)
      }
    }
    if (y < height - 1) {
      const down = p + width
      if (!visited[down] && matchesStart(down * 4)) {
        visited[down] = 1
        queue.push(down)
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
}

// Spray Paint Particle Function
const sprayPaintAt = (p: { x: number; y: number }, color: string) => {
  if (!ctx) return
  ctx.fillStyle = color
  const radius = Math.max(5, strokeWidth.value * 2.5)
  const density = Math.min(35, strokeWidth.value * 5 + 10)
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * radius
    const sx = Math.round(p.x + Math.cos(angle) * r)
    const sy = Math.round(p.y + Math.sin(angle) * r)
    ctx.fillRect(sx, sy, 1, 1)
  }
}

// 5-Pointed Star Path Helper
const drawStarPath = (c: CanvasRenderingContext2D, cx: number, cy: number, rOuter: number, rInner: number) => {
  let rot = (Math.PI / 2) * 3
  const step = Math.PI / 5
  c.beginPath()
  c.moveTo(cx, cy - rOuter)
  for (let i = 0; i < 5; i++) {
    let x = cx + Math.cos(rot) * rOuter
    let y = cy + Math.sin(rot) * rOuter
    c.lineTo(x, y)
    rot += step
    x = cx + Math.cos(rot) * rInner
    y = cy + Math.sin(rot) * rInner
    c.lineTo(x, y)
    rot += step
  }
  c.closePath()
}

const isShapeTool = (tool: ToolType) => {
  return ['line', 'rect', 'rounded-rect', 'circle', 'triangle', 'star'].includes(tool)
}

const handlePointerDown = (e: PointerEvent) => {
  if (!ensureCanvasContext() || !canvasRef.value || !ctx) return

  try {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  } catch {}

  const isSecondary = e.button === 2 || e.buttons === 2
  const activeColor = isSecondary ? color2.value : color1.value
  const activeBgColor = isSecondary ? color1.value : color2.value

  const pos = getCanvasPos(e.clientX, e.clientY)
  coords.value = pos
  startPos = pos
  lastPos = pos

  // 1. Color Picker tool
  if (activeTool.value === 'picker') {
    const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')
    if (isSecondary) {
      color2.value = hex
    } else {
      color1.value = hex
    }
    playSound('click')
    activeTool.value = previousTool.value || 'brush'
    return
  }

  // 2. Flood Fill bucket tool
  if (activeTool.value === 'bucket') {
    floodFill(pos.x, pos.y, activeColor)
    saveState()
    playSound('click')
    return
  }

  // 3. Text Tool
  if (activeTool.value === 'text') {
    const rect = canvasRef.value.getBoundingClientRect()
    textInputPos.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      canvasX: pos.x,
      canvasY: pos.y
    }
    isTypingText.value = true
    textInputValue.value = ''
    nextTick(() => {
      textInputRef.value?.focus()
    })
    return
  }

  // 4. Shape tools
  if (isShapeTool(activeTool.value)) {
    isDrawing = true
    shapeSnapshot = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    return
  }

  // 5. Spray tool
  if (activeTool.value === 'spray') {
    isDrawing = true
    sprayPaintAt(pos, activeColor)
    if (sprayInterval) clearInterval(sprayInterval)
    sprayInterval = setInterval(() => {
      if (isDrawing) sprayPaintAt(lastPos, activeColor)
    }, 45)
    return
  }

  // 6. Freehand Drawing (pencil, brush, eraser)
  isDrawing = true
  const isEraser = activeTool.value === 'eraser'
  const isPencil = activeTool.value === 'pencil'
  const size = isEraser ? strokeWidth.value * 3 : (isPencil ? 1 : strokeWidth.value)
  const drawColor = isEraser ? color2.value : activeColor

  ctx.beginPath()
  ctx.fillStyle = drawColor
  ctx.arc(pos.x, pos.y, Math.max(0.5, size / 2), 0, Math.PI * 2)
  ctx.fill()
}

const handlePointerMove = (e: PointerEvent) => {
  const pos = getCanvasPos(e.clientX, e.clientY)
  coords.value = pos

  if (!isDrawing || !ctx || !canvasRef.value) return

  const isSecondary = e.buttons === 2
  const activeColor = isSecondary ? color2.value : color1.value
  const activeBgColor = isSecondary ? color1.value : color2.value

  // Shape live previews
  if (shapeSnapshot && isShapeTool(activeTool.value)) {
    ctx.putImageData(shapeSnapshot, 0, 0)
    ctx.strokeStyle = activeColor
    ctx.fillStyle = activeBgColor
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
      if (fillShape.value) ctx.fillRect(x, y, w, h)
      ctx.strokeRect(x, y, w, h)
    } else if (activeTool.value === 'rounded-rect') {
      const x = Math.min(startPos.x, pos.x)
      const y = Math.min(startPos.y, pos.y)
      const w = Math.abs(pos.x - startPos.x)
      const h = Math.abs(pos.y - startPos.y)
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, 8)
      } else {
        ctx.rect(x, y, w, h)
      }
      if (fillShape.value) ctx.fill()
      ctx.stroke()
    } else if (activeTool.value === 'circle') {
      const rx = Math.abs(pos.x - startPos.x) / 2
      const ry = Math.abs(pos.y - startPos.y) / 2
      const cx = Math.min(startPos.x, pos.x) + rx
      const cy = Math.min(startPos.y, pos.y) + ry
      ctx.beginPath()
      ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2)
      if (fillShape.value) ctx.fill()
      ctx.stroke()
    } else if (activeTool.value === 'triangle') {
      const topX = (startPos.x + pos.x) / 2
      const topY = Math.min(startPos.y, pos.y)
      const botY = Math.max(startPos.y, pos.y)
      ctx.beginPath()
      ctx.moveTo(topX, topY)
      ctx.lineTo(startPos.x, botY)
      ctx.lineTo(pos.x, botY)
      ctx.closePath()
      if (fillShape.value) ctx.fill()
      ctx.stroke()
    } else if (activeTool.value === 'star') {
      const cx = (startPos.x + pos.x) / 2
      const cy = (startPos.y + pos.y) / 2
      const rOuter = Math.max(4, Math.abs(pos.x - startPos.x) / 2)
      const rInner = rOuter / 2.2
      drawStarPath(ctx, cx, cy, rOuter, rInner)
      if (fillShape.value) ctx.fill()
      ctx.stroke()
    }
    return
  }

  // Spray move
  if (activeTool.value === 'spray') {
    sprayPaintAt(pos, activeColor)
    lastPos = pos
    return
  }

  // Freehand drawing (pencil, brush, eraser)
  const isEraser = activeTool.value === 'eraser'
  const isPencil = activeTool.value === 'pencil'
  const size = isEraser ? strokeWidth.value * 3 : (isPencil ? 1 : strokeWidth.value)
  const drawColor = isEraser ? color2.value : activeColor

  ctx.beginPath()
  ctx.strokeStyle = drawColor
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.moveTo(lastPos.x, lastPos.y)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()

  lastPos = pos
}

const handlePointerUp = (e: PointerEvent) => {
  if (sprayInterval) {
    clearInterval(sprayInterval)
    sprayInterval = null
  }

  if (!isDrawing) return
  isDrawing = false
  shapeSnapshot = null

  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {}

  saveState()
}

// Text Tool Commit
const commitText = () => {
  if (!textInputValue.value.trim() || !ensureCanvasContext() || !ctx) {
    cancelText()
    return
  }
  const fontSize = Math.max(14, strokeWidth.value * 4)
  ctx.font = `bold ${fontSize}px sans-serif`
  ctx.fillStyle = color1.value
  ctx.textBaseline = 'top'
  ctx.fillText(textInputValue.value, textInputPos.value.canvasX, textInputPos.value.canvasY)
  saveState()
  playSound('click')
  isTypingText.value = false
  textInputValue.value = ''
}

const cancelText = () => {
  isTypingText.value = false
  textInputValue.value = ''
}

const undo = () => {
  playSound('click')
  if (undoStack.value.length <= 1) return
  const current = undoStack.value.pop()
  if (current) {
    redoStack.value.push(current)
  }
  const prev = undoStack.value[undoStack.value.length - 1]
  if (prev) {
    restoreFromDataUrl(prev)
  }
}

const redo = () => {
  playSound('click')
  if (redoStack.value.length === 0) return
  const next = redoStack.value.pop()
  if (next) {
    undoStack.value.push(next)
    restoreFromDataUrl(next)
  }
}

const clearCanvas = () => {
  playSound('click')
  if (!ensureCanvasContext() || !canvasRef.value || !ctx) return
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  saveState()
}

const downloadCanvas = () => {
  playSound('click')
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = 'Restu_Utomo_Paint_Artwork.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  const isCtrlOrCmd = e.ctrlKey || e.metaKey
  if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) {
      redo()
    } else {
      undo()
    }
  } else if (isCtrlOrCmd && e.key.toLowerCase() === 'y') {
    redo()
  }
}

// Automatically initialize or restore whenever the canvas ref becomes available in DOM
watch(canvasRef, (newCanvas) => {
  if (newCanvas) {
    nextTick(() => {
      initOrRestoreCanvas()
    })
  }
}, { immediate: true })

onMounted(() => {
  nextTick(() => {
    initOrRestoreCanvas()
  })
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  if (sprayInterval) {
    clearInterval(sprayInterval)
  }
})
</script>
