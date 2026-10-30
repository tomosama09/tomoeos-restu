<template>
  <WindowFrame id="player" title="Windows Media Player" icon="/icons/wmp.svg">
    <div class="flex flex-col h-full bg-[#0a0f18] text-white select-none overflow-hidden font-sans">
      <!-- Native HTML5 Audio element -->
      <audio
        ref="audioRef"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="onTrackEnded"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />

      <!-- 1. Top Windows 7 WMP Glass Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#24334a] via-[#162132] to-[#0c1420] border-b border-blue-900/40 px-3 py-1.5 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <img src="/icons/wmp.svg" alt="" class="w-4 h-4 object-contain" />
          <span class="font-bold text-slate-200 tracking-wide text-xs">Windows Media Player</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Visualizer Mode Buttons -->
          <div class="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-white/15 text-[11px]">
            <span class="text-slate-400 text-[10px] pl-1 pr-0.5">Mode:</span>
            <button
              type="button"
              class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all"
              :class="visualizerMode === 'bars' ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'"
              @click="setVisualizerMode('bars')"
            >
              Bars
            </button>
            <button
              type="button"
              class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all"
              :class="visualizerMode === 'alchemy' ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'"
              @click="setVisualizerMode('alchemy')"
            >
              Alchemy
            </button>
            <button
              type="button"
              class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all"
              :class="visualizerMode === 'wave' ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'"
              @click="setVisualizerMode('wave')"
            >
              Wave
            </button>
          </div>

          <!-- Playlist Toggle Button -->
          <button
            type="button"
            class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
            :class="showPlaylist ? 'bg-blue-600/70 border-blue-400 text-white shadow-xs' : 'text-slate-300'"
            @click="showPlaylist = !showPlaylist"
          >
            <span>☰</span>
            <span class="hidden sm:inline">Playlist</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Stage Area: Full-Bleed Visualizer Canvas + Sleek Info Pill + Playlist -->
      <div class="flex-1 flex min-h-0 relative bg-black overflow-hidden">
        <!-- Visualizer Canvas Container -->
        <div class="flex-1 relative flex items-center justify-center overflow-hidden h-full">
          <!-- Canvas Full Stage -->
          <canvas
            ref="canvasRef"
            class="w-full h-full block absolute inset-0 cursor-pointer"
            @click="togglePlay"
          />

          <!-- Ambient Vignette -->
          <div class="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

          <!-- Top-Center Track Info Floating Pill (Does NOT obstruct visualizer) -->
          <div class="absolute top-3 z-10 flex items-center gap-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-xl max-w-[85%] truncate pointer-events-auto">
            <!-- Mini Vinyl Disc spinning icon -->
            <div
              class="w-6 h-6 rounded-full border border-slate-600 bg-gradient-to-tr from-slate-800 to-black flex items-center justify-center shrink-0"
              :class="isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''"
            >
              <div class="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>

            <!-- Track Info -->
            <div class="flex items-center gap-2 truncate text-xs">
              <span class="font-bold text-white truncate">{{ currentTrack.title }}</span>
              <span class="text-sky-300/80 text-[11px] truncate">by {{ currentTrack.artist }}</span>
            </div>

            <!-- License Badge -->
            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/15 text-slate-300 shrink-0">
              {{ currentTrack.license }}
            </span>
          </div>

          <!-- Bottom Visualizer Mode Status Hint -->
          <div class="absolute bottom-2 left-3 z-10 text-[10px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
            {{ visualizerMode }} Visualizer • {{ isPlaying ? 'Playing' : 'Paused' }}
          </div>
        </div>

        <!-- Collapsible Playlist Side Pane -->
        <div
          v-if="showPlaylist"
          class="w-64 bg-[#0d1624]/95 backdrop-blur-md border-l border-blue-900/40 flex flex-col shrink-0 text-xs shadow-2xl transition-all"
        >
          <div class="p-2.5 bg-[#142033] border-b border-blue-900/40 flex items-center justify-between text-slate-300 font-bold text-[11px] uppercase tracking-wider">
            <span>Audio Library</span>
            <span class="text-[10px] text-slate-400 font-mono">{{ playlist.length }} tracks</span>
          </div>

          <div class="flex-1 overflow-y-auto divide-y divide-white/5">
            <button
              v-for="(track, idx) in playlist"
              :key="track.id"
              type="button"
              class="w-full p-2.5 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              :class="currentTrackIndex === idx ? 'bg-blue-900/50 text-sky-200 border-l-3 border-sky-400' : 'text-slate-300 hover:bg-white/5'"
              @click="loadAndPlayTrack(idx, true)"
            >
              <span class="w-4 text-center font-mono text-[10px]" :class="currentTrackIndex === idx && isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'">
                <template v-if="currentTrackIndex === idx && isPlaying">▶</template>
                <template v-else>{{ idx + 1 }}</template>
              </span>
              <div class="flex-1 min-w-0">
                <div class="font-bold truncate" :class="currentTrackIndex === idx ? 'text-white' : ''">
                  {{ track.title }}
                </div>
                <div class="text-[10px] text-slate-400 truncate">
                  {{ track.artist }}
                </div>
              </div>
              <span class="text-[10px] text-slate-500 font-mono shrink-0">
                {{ track.durationStr }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Scrub Bar Timeline -->
      <div class="shrink-0 bg-[#0d1522] border-t border-blue-950 px-3 pt-2 pb-1 flex items-center gap-3 text-[11px] font-mono text-slate-400">
        <span class="w-10 text-right">{{ formattedCurrentTime }}</span>
        <div
          class="flex-1 h-2 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
          @click="seekTimeline"
        >
          <div
            class="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 rounded-full"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <span class="w-10">{{ formattedDuration }}</span>
      </div>

      <!-- 4. Windows 7 Aero Media Controls Bottom Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#1b2738] via-[#101926] to-[#080d14] border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
        <!-- Repeat & Shuffle Controls (Left) -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer text-xs"
            :class="isShuffle ? 'bg-blue-600/80 border-blue-400 text-white' : 'border-transparent text-slate-400 hover:text-white'"
            title="Shuffle"
            @click="isShuffle = !isShuffle"
          >
            🔀
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer text-xs"
            :class="isLoop ? 'bg-blue-600/80 border-blue-400 text-white' : 'border-transparent text-slate-400 hover:text-white'"
            title="Loop"
            @click="isLoop = !isLoop"
          >
            🔁
          </button>
        </div>

        <!-- Central Playback Controls (Center) -->
        <div class="flex items-center gap-2">
          <!-- Previous Track -->
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-slate-200 cursor-pointer transition-all shadow-md"
            title="Previous Track"
            @click="prevTrack"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <!-- Play / Pause (Aero Glass Orb) -->
          <button
            type="button"
            class="w-12 h-12 rounded-full bg-gradient-to-b from-[#56a7f5] via-[#247adc] to-[#1258ab] hover:brightness-110 active:scale-95 border-2 border-white/80 flex items-center justify-center text-white cursor-pointer shadow-lg transition-transform"
            :title="isPlaying ? 'Pause' : 'Play'"
            @click="togglePlay"
          >
            <!-- Pause Icon -->
            <svg v-if="isPlaying" viewBox="0 0 24 24" class="w-5 h-5 fill-current">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            <!-- Play Icon -->
            <svg v-else viewBox="0 0 24 24" class="w-5 h-5 fill-current ml-0.5">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <!-- Stop -->
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-slate-200 cursor-pointer transition-all shadow-md"
            title="Stop"
            @click="stopTrack"
          >
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
          </button>

          <!-- Next Track -->
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-slate-200 cursor-pointer transition-all shadow-md"
            title="Next Track"
            @click="nextTrack"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <!-- Volume Controls (Right) -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="text-slate-300 hover:text-white cursor-pointer text-xs"
            :title="isMuted ? 'Unmute' : 'Mute'"
            @click="toggleMute"
          >
            <span v-if="isMuted || volume === 0">🔇</span>
            <span v-else-if="volume < 0.5">🔉</span>
            <span v-else>🔊</span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model.number="volume"
            class="w-20 accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            @input="onVolumeChange"
          />
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import WindowFrame from '~/components/common/WindowFrame.vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

interface Track {
  id: string
  title: string
  artist: string
  genre: string
  license: string
  durationStr: string
  src: string
}

const playlist: Track[] = [
  {
    id: 'lofi-study',
    title: 'Lofi Focus & Study',
    artist: 'Caden Currie',
    genre: 'Lo-Fi Chillhop',
    license: 'CC BY 3.0',
    durationStr: '1:28',
    src: '/audio/lofi-study.mp3'
  },
  {
    id: 'perspective',
    title: 'Perspective (Piano Beats)',
    artist: 'Sappheiros',
    genre: 'Melodic Chillhop',
    license: 'CC BY 3.0',
    durationStr: '2:17',
    src: '/audio/chillhop-perspective.ogg'
  },
  {
    id: 'calmant',
    title: 'Calmant Ambient',
    artist: 'Kevin MacLeod',
    genre: 'Peaceful Ambient',
    license: 'CC BY 3.0',
    durationStr: '3:24',
    src: '/audio/calm-ambient.ogg'
  }
]

const audioRef = ref<HTMLAudioElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const isShuffle = ref(false)
const isLoop = ref(false)
const showPlaylist = ref(true)
const visualizerMode = ref<'bars' | 'alchemy' | 'wave'>('bars')

let animFrameId: number | null = null

const currentTrack = computed(() => playlist[currentTrackIndex.value])

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return Math.min(100, (currentTime.value / duration.value) * 100)
})

const formatTime = (secs: number) => {
  if (isNaN(secs) || secs < 0) return '00:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

const setVisualizerMode = (mode: 'bars' | 'alchemy' | 'wave') => {
  playSound('click')
  visualizerMode.value = mode
}

// Robust, direct track switcher
const loadAndPlayTrack = async (idx: number, shouldPlay: boolean = true) => {
  playSound('click')
  if (idx < 0 || idx >= playlist.length) return
  currentTrackIndex.value = idx
  const track = playlist[idx]

  await nextTick()

  if (audioRef.value) {
    audioRef.value.src = track.src
    audioRef.value.currentTime = 0
    audioRef.value.load()

    if (shouldPlay) {
      try {
        await audioRef.value.play()
        isPlaying.value = true
      } catch (err) {
        console.warn('Playback error:', err)
      }
    }
  }
}

const togglePlay = async () => {
  playSound('click')
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    // If src is empty or mismatched, set it explicitly
    if (!audioRef.value.src || !audioRef.value.src.includes(currentTrack.value.src)) {
      audioRef.value.src = currentTrack.value.src
      audioRef.value.load()
    }
    try {
      await audioRef.value.play()
      isPlaying.value = true
    } catch (err) {
      console.warn('Playback error:', err)
    }
  }
}

const stopTrack = () => {
  playSound('click')
  if (!audioRef.value) return
  audioRef.value.pause()
  audioRef.value.currentTime = 0
  isPlaying.value = false
}

const nextTrack = () => {
  playSound('click')
  let nextIdx = (currentTrackIndex.value + 1) % playlist.length
  if (isShuffle.value) {
    nextIdx = Math.floor(Math.random() * playlist.length)
  }
  loadAndPlayTrack(nextIdx, isPlaying.value || true)
}

const prevTrack = () => {
  playSound('click')
  const prevIdx = (currentTrackIndex.value - 1 + playlist.length) % playlist.length
  loadAndPlayTrack(prevIdx, isPlaying.value || true)
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

const onTrackEnded = () => {
  if (isLoop.value) {
    if (audioRef.value) {
      audioRef.value.currentTime = 0
      audioRef.value.play().catch(() => {})
    }
  } else {
    nextTrack()
  }
}

const seekTimeline = (e: MouseEvent) => {
  if (!audioRef.value || duration.value === 0) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  audioRef.value.currentTime = ratio * duration.value
}

const onVolumeChange = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
    isMuted.value = volume.value === 0
  }
}

const toggleMute = () => {
  playSound('click')
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

// Equalizer bar peak hold tracking
const peaks = ref<number[]>(Array(36).fill(0))

// Visualizer Canvas Rendering
const renderVisualizer = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Auto-resize canvas to match its bounding client rect
  const rect = canvas.getBoundingClientRect()
  if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = Math.floor(rect.width)
      canvas.height = Math.floor(rect.height)
    }
  }

  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  const t = Date.now() / 350
  const active = isPlaying.value

  if (visualizerMode.value === 'bars') {
    // Mode A: Classic Windows 7 Equalizer Spectrum Bars
    const barCount = 36
    const spacing = 4
    const totalSpacing = spacing * (barCount - 1)
    const barWidth = Math.max(3, (width - 40 - totalSpacing) / barCount)
    const startX = 20

    for (let i = 0; i < barCount; i++) {
      // Dynamic frequency rhythm based on position and time
      const wave1 = Math.sin(t * 2.5 + i * 0.35)
      const wave2 = Math.cos(t * 1.8 - i * 0.2)
      const wave3 = Math.sin(t * 4.2 + i * 0.8)
      const rawAmp = (wave1 + wave2 * 0.7 + wave3 * 0.4 + 2.1) / 4.2

      const h = active ? Math.max(8, rawAmp * (height * 0.65)) : 4
      const x = startX + i * (barWidth + spacing)
      const y = height - 20 - h

      // Update peak
      if (h > (peaks.value[i] || 0)) {
        peaks.value[i] = h
      } else {
        peaks.value[i] = Math.max(4, (peaks.value[i] || 0) - 1.5)
      }

      // Bar Gradient: Green to Cyan to Orange/Red
      const grad = ctx.createLinearGradient(0, height - 20, 0, height - 20 - height * 0.65)
      grad.addColorStop(0, '#00e676')
      grad.addColorStop(0.5, '#00b0ff')
      grad.addColorStop(0.85, '#ffea00')
      grad.addColorStop(1, '#ff3d00')

      ctx.fillStyle = grad
      ctx.fillRect(x, y, barWidth, h)

      // Peak Hold Cap
      const peakY = height - 20 - peaks.value[i]
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x, peakY - 3, barWidth, 2)

      // Soft reflection underneath floor
      ctx.fillStyle = 'rgba(0, 176, 255, 0.15)'
      ctx.fillRect(x, height - 16, barWidth, Math.min(12, h * 0.2))
    }
  } else if (visualizerMode.value === 'alchemy') {
    // Mode B: WMP Alchemy Pulsating Rotating Rings
    const cx = width / 2
    const cy = height / 2 + 10
    const ringCount = 10

    for (let r = 1; r <= ringCount; r++) {
      const pulse = active ? Math.sin(t * 3 + r * 0.7) * 15 : 0
      const radius = active
        ? ((t * 25 + r * 30) % (Math.min(width, height) * 0.52)) + pulse
        : r * 22

      if (radius > 5) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate((t * 0.2 * (r % 2 === 0 ? 1 : -1)) + r * 0.2)

        ctx.beginPath()
        const petals = 6 + (r % 4) * 2
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const rMod = radius + Math.sin(a * petals + t * 2) * (active ? 12 : 2)
          const px = Math.cos(a) * rMod
          const py = Math.sin(a) * rMod
          if (a === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()

        const hue = (t * 35 + r * 28) % 360
        ctx.strokeStyle = `hsla(${hue}, 95%, 65%, ${active ? 0.65 : 0.25})`
        ctx.lineWidth = active ? 2.5 : 1
        ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`
        ctx.shadowBlur = active ? 14 : 4
        ctx.stroke()
        ctx.restore()
      }
    }
  } else if (visualizerMode.value === 'wave') {
    // Mode C: Oscilloscope Multi-Harmonic Neon Wave
    const cy = height / 2 + 15
    const ampBase = active ? 45 : 4

    // Primary Neon Cyan Wave
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = '#00f5ff'
    ctx.shadowColor = '#00f5ff'
    ctx.shadowBlur = active ? 16 : 4

    for (let x = 0; x <= width; x += 3) {
      const wave1 = Math.sin(x * 0.02 + t * 4) * ampBase
      const wave2 = Math.cos(x * 0.04 - t * 2.5) * (ampBase * 0.5)
      const wave3 = Math.sin(x * 0.008 + t) * (ampBase * 0.8)
      const y = cy + wave1 + wave2 + wave3

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Secondary Magenta Echo Wave
    if (active) {
      ctx.beginPath()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#ff007f'
      ctx.shadowColor = '#ff007f'
      ctx.shadowBlur = 10

      for (let x = 0; x <= width; x += 4) {
        const wave = Math.sin(x * 0.025 - t * 3) * (ampBase * 0.7)
        const y = cy + wave
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  animFrameId = requestAnimationFrame(renderVisualizer)
}

onMounted(() => {
  // Initialize audio element with first track
  if (audioRef.value) {
    audioRef.value.src = playlist[0].src
    audioRef.value.volume = volume.value
    audioRef.value.load()
  }
  renderVisualizer()
})

onUnmounted(() => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>
