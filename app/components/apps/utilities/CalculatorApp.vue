<template>
  <WindowFrame id="calculator" title="Calculator" icon="/icons/calc.webp">
    <div class="flex flex-col h-full bg-slate-100 p-2.5 select-none gap-2">
      <!-- Calculator Display -->
      <div class="h-14 bg-white border border-slate-300 rounded p-2 flex flex-col justify-between text-right shadow-inner">
        <div class="text-[10px] text-slate-400 font-mono h-3 truncate">{{ equation }}</div>
        <div class="text-xl font-bold text-slate-800 font-mono tracking-wider truncate">{{ display }}</div>
      </div>

      <!-- Keypad Grid -->
      <div class="grid grid-cols-4 gap-1.5 flex-1">
        <button
          v-for="btn in buttons"
          :key="btn.label"
          type="button"
          class="rounded border text-xs font-bold transition-all shadow-2xs flex items-center justify-center cursor-pointer active:scale-95"
          :class="[
            btn.isAction
              ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white border-blue-600 hover:from-blue-400 hover:to-blue-600'
              : btn.isOp
                ? 'bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 border-slate-400 hover:bg-slate-200'
                : 'bg-gradient-to-b from-white to-slate-100 text-slate-800 border-slate-300 hover:bg-slate-50'
          ]"
          @click="pressKey(btn)"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

const display = ref('0')
const equation = ref('')
let shouldResetDisplay = false

interface CalcButton {
  label: string
  action: string
  isOp?: boolean
  isAction?: boolean
}

const buttons: CalcButton[] = [
  { label: 'C', action: 'clear', isOp: true },
  { label: 'CE', action: 'clear-entry', isOp: true },
  { label: '⌫', action: 'backspace', isOp: true },
  { label: '÷', action: '/', isOp: true },
  { label: '7', action: '7' },
  { label: '8', action: '8' },
  { label: '9', action: '9' },
  { label: '×', action: '*', isOp: true },
  { label: '4', action: '4' },
  { label: '5', action: '5' },
  { label: '6', action: '6' },
  { label: '-', action: '-', isOp: true },
  { label: '1', action: '1' },
  { label: '2', action: '2' },
  { label: '3', action: '3' },
  { label: '+', action: '+', isOp: true },
  { label: '±', action: 'negate' },
  { label: '0', action: '0' },
  { label: '.', action: '.' },
  { label: '=', action: 'eval', isAction: true }
]

const pressKey = (btn: CalcButton) => {
  playSound('click')
  if (btn.action >= '0' && btn.action <= '9') {
    if (display.value === '0' || shouldResetDisplay) {
      display.value = btn.action
      shouldResetDisplay = false
    } else {
      display.value += btn.action
    }
  } else if (btn.action === '.') {
    if (!display.value.includes('.')) {
      display.value += '.'
    }
  } else if (btn.action === 'clear') {
    display.value = '0'
    equation.value = ''
  } else if (btn.action === 'clear-entry') {
    display.value = '0'
  } else if (btn.action === 'backspace') {
    display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0'
  } else if (btn.action === 'negate') {
    display.value = String(parseFloat(display.value) * -1)
  } else if (['+', '-', '*', '/'].includes(btn.action)) {
    equation.value = `${display.value} ${btn.label}`
    shouldResetDisplay = true
  } else if (btn.action === 'eval') {
    try {
      if (!equation.value) return
      const parts = equation.value.split(' ')
      const num1 = parseFloat(parts[0])
      const op = parts[1]
      const num2 = parseFloat(display.value)
      let res = 0
      if (op === '+') res = num1 + num2
      else if (op === '-') res = num1 - num2
      else if (op === '×') res = num1 * num2
      else if (op === '÷') res = num2 !== 0 ? num1 / num2 : 0
      display.value = String(res)
      equation.value = ''
      shouldResetDisplay = true
    } catch {
      display.value = 'Error'
    }
  }
}
</script>
