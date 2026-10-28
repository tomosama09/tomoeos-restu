<template>
  <div id="desktop-gadgets" class="desktop-gadgets absolute top-6 right-6 w-52 z-10 pointer-events-auto select-none">
    <div class="desktop-gadgets-shell">
      <div class="desktop-gadgets-header">
        <span class="desktop-gadgets-orb" />
        <span class="desktop-gadgets-line" />
      </div>

      <!-- Clock & Stopwatch Gadget Card -->
      <div id="gadget-clock" class="desktop-gadget-card">
        <div class="desktop-clock-face">
          <span class="desktop-clock-spark">✦</span>
          <div class="desktop-clock-time">{{ currentTime }}</div>
          <div class="desktop-clock-date">{{ currentDate }}</div>
        </div>
        <div class="desktop-stopwatch-row">
          <span class="desktop-stopwatch">{{ stopwatchDisplay }}</span>
          <button
            type="button"
            class="desktop-gadget-button"
            @click="toggleStopwatch"
          >
            {{ isStopwatchRunning ? 'Pause' : 'Start' }}
          </button>
        </div>
      </div>

      <!-- Weather Gadget Card -->
      <div id="gadget-weather" class="desktop-gadget-card desktop-weather-card">
        <span class="desktop-weather-icon">⛅</span>
        <div>
          <div class="desktop-weather-temp">28°</div>
          <div class="desktop-weather-place">Yogyakarta</div>
        </div>
        <span class="desktop-weather-glint">•</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

const currentTime = ref('--:--')
const currentDate = ref('')

const isStopwatchRunning = ref(false)
const stopwatchStart = ref(0)
const stopwatchElapsed = ref(0)
const stopwatchDisplay = ref('00:00.0')

let clockTimer: ReturnType<typeof setInterval> | null = null
let stopwatchTimer: ReturnType<typeof setInterval> | null = null

const updateClock = () => {
  const n = new Date()
  currentTime.value = n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  currentDate.value = n.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}

const renderStopwatch = () => {
  const total = stopwatchElapsed.value + (isStopwatchRunning.value ? Date.now() - stopwatchStart.value : 0)
  const m = Math.floor(total / 60000)
  const s = Math.floor((total % 60000) / 1000)
  const d = Math.floor((total % 1000) / 100)
  stopwatchDisplay.value = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${d}`
}

const toggleStopwatch = () => {
  playSound('click')
  if (isStopwatchRunning.value) {
    // Pause
    isStopwatchRunning.value = false
    stopwatchElapsed.value += Date.now() - stopwatchStart.value
    if (stopwatchTimer) clearInterval(stopwatchTimer)
    stopwatchTimer = null
  } else {
    // Start
    isStopwatchRunning.value = true
    stopwatchStart.value = Date.now()
    stopwatchTimer = setInterval(renderStopwatch, 50)
  }
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  if (stopwatchTimer) clearInterval(stopwatchTimer)
})
</script>
