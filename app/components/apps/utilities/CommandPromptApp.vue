<template>
  <WindowFrame id="cmd" title="Command Prompt" icon="/icons/command-prompt.svg">
    <div
      class="flex flex-col h-full bg-[#0c0c0c] text-slate-100 font-mono text-xs select-text overflow-hidden p-2.5 cursor-text"
      @click="focusInput"
    >
      <!-- Terminal Output Scroll Container -->
      <div ref="outputRef" class="flex-1 overflow-y-auto space-y-1 pr-1 selection:bg-slate-700">
        <!-- Banner Message -->
        <div class="text-slate-300 leading-relaxed whitespace-pre-wrap">TomoeOS [Version 7.1.7601]
(c) 2026 Restu Utomo. All rights reserved.

Type 'help' to view available system commands.
</div>

        <!-- History Items -->
        <div v-for="(entry, idx) in history" :key="idx" class="leading-relaxed">
          <div v-if="entry.type === 'input'" class="flex items-center gap-1.5 text-slate-300">
            <span class="text-emerald-400 font-bold">C:\Users\User&gt;</span>
            <span class="text-white">{{ entry.text }}</span>
          </div>
          <div v-else class="text-slate-300 whitespace-pre-wrap pl-1">{{ entry.text }}</div>
        </div>

        <!-- Active Input Line -->
        <div class="flex items-center gap-1.5 pt-0.5">
          <span class="text-emerald-400 font-bold shrink-0">C:\Users\User&gt;</span>
          <input
            ref="inputRef"
            v-model="currentInput"
            type="text"
            class="flex-1 bg-transparent border-0 outline-none text-white font-mono text-xs p-0 m-0 focus:ring-0"
            autofocus
            @keydown.enter="handleEnter"
            @keydown.up.prevent="historyUp"
            @keydown.down.prevent="historyDown"
          />
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useWindowManager } from '~/composables/useWindowManager'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const wm = useWindowManager()
const { playSound } = useAudioFeedback()

interface TerminalEntry {
  type: 'input' | 'output'
  text: string
}

const history = ref<TerminalEntry[]>([])
const currentInput = ref('')
const commandHistory = ref<string[]>([])
let historyIndex = -1

const outputRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

const historyUp = () => {
  if (commandHistory.value.length === 0) return
  if (historyIndex === -1) {
    historyIndex = commandHistory.value.length - 1
  } else if (historyIndex > 0) {
    historyIndex--
  }
  currentInput.value = commandHistory.value[historyIndex] || ''
}

const historyDown = () => {
  if (historyIndex >= 0 && historyIndex < commandHistory.value.length - 1) {
    historyIndex++
    currentInput.value = commandHistory.value[historyIndex]
  } else {
    historyIndex = -1
    currentInput.value = ''
  }
}

const handleEnter = () => {
  const raw = currentInput.value
  const cmd = raw.trim().toLowerCase()
  history.value.push({ type: 'input', text: raw })
  if (raw.trim()) {
    commandHistory.value.push(raw.trim())
  }
  historyIndex = -1
  currentInput.value = ''

  playSound('click')
  processCommand(cmd, raw.trim())
  scrollToBottom()
}

const processCommand = (cmd: string, originalCmd: string) => {
  if (!cmd) return

  if (cmd === 'help') {
    history.value.push({
      type: 'output',
      text: `Available system commands:
  help       - Display this list of commands
  dir        - List files and directories in current folder
  whoami     - Display verified user identity and role
  skills     - Display technical production and design competencies
  contact    - Display professional contact channels
  type <file>- Display file contents (e.g. type Welcome.txt)
  date       - Print current system date and time
  ver        - Print operating system build version
  echo <msg> - Print message to the screen
  cls        - Clear screen buffer
  exit       - Close command prompt window`
    })
    return
  }

  if (cmd === 'dir') {
    history.value.push({
      type: 'output',
      text: ` Volume in drive C has no label.
 Volume Serial Number is 7601-E4D2

 Directory of C:\\Users\\User

10/30/2026  09:00 AM    <DIR>          .
10/30/2026  09:00 AM    <DIR>          ..
10/30/2026  12:00 PM    <DIR>          Documents
10/30/2026  12:00 PM    <DIR>          Pictures
10/30/2026  12:00 PM    <DIR>          Videos
10/30/2026  09:00 AM             1,420 Welcome.txt
10/28/2026  02:15 PM            98,206 Restu_Utomo_CV.pdf
               2 File(s)         99,626 bytes
               3 Dir(s)  124,432,189,440 bytes free`
    })
    return
  }

  if (cmd === 'whoami') {
    history.value.push({
      type: 'output',
      text: `User Profile:
- Name: Restu Utomo
- Role: Graphic Designer, Videographer & Photographer
- Education: Sanata Dharma University (Class of 2026)`
    })
    return
  }

  if (cmd === 'skills') {
    history.value.push({
      type: 'output',
      text: `Core Technical Competencies:
- Video & Motion: Adobe Premiere Pro, After Effects, DaVinci Resolve
- Graphic Design: Adobe Photoshop, Illustrator, Brand Identity, Poster Typography
- Production: Studio Lighting, Camera Operation, Audio Recording, Live Broadcast Desk`
    })
    return
  }

  if (cmd === 'contact') {
    history.value.push({
      type: 'output',
      text: `Contact & Inquiries:
- Email: rstt.tomo@gmail.com
- Location: Yogyakarta, Indonesia`
    })
    return
  }

  if (cmd === 'ver') {
    history.value.push({
      type: 'output',
      text: `TomoeOS [Version 7.1.7601] (Nuxt 4.6.3 Engine)`
    })
    return
  }

  if (cmd === 'date') {
    history.value.push({
      type: 'output',
      text: `The current date is: ${new Date().toDateString()}`
    })
    return
  }

  if (cmd === 'cls' || cmd === 'clear') {
    history.value = []
    return
  }

  if (cmd === 'exit') {
    wm.closeWindow('cmd')
    return
  }

  if (cmd.startsWith('echo ')) {
    history.value.push({
      type: 'output',
      text: originalCmd.slice(5)
    })
    return
  }

  if (cmd === 'type welcome.txt' || cmd === 'cat welcome.txt') {
    history.value.push({
      type: 'output',
      text: `[Welcome.txt]
Welcome to TomoeOS.
Personal Portfolio of Restu Utomo - Graphic Designer, Videographer & Photographer.
Sanata Dharma University (2026).
- 500,000+ views delivered on institutional channels
- 26,000+ unique accounts reached with 53.8% discovery rate`
    })
    return
  }

  history.value.push({
    type: 'output',
    text: `'${originalCmd}' is not recognized as an internal or external command,
operable program or batch file. Type 'help' for command list.`
  })
}

onMounted(() => {
  focusInput()
})
</script>