<template>
  <WindowFrame id="player" title="Windows Media Player" icon="/icons/folder-videos.webp">
    <div class="flex flex-col h-full bg-[#0a0f18] text-white select-none overflow-hidden font-sans">
      <!-- Hidden native HTML5 Audio element -->
      <audio
        ref="audioRef"
        :src="currentTrack.src"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="onTrackEnded"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />

      <!-- 1. Top Windows 7 WMP Toolbar -->
      <div class="shrink-0 bg-gradient-to-b from-[#24334a] via-[#162132] to-[#0c1420] border-b border-blue-900/40 px-3 py-1.5 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <img src="/icons/folder-videos.webp" alt="" class="w-4 h-4 object-contain" />
          <span class="font-bold text-slate-200 tracking-wide text-xs">Now Playing</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Visualizer Mode Toggle -->
          <div class="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-[11px]">
            <span class="text-slate-400">Mode:</span>
            <button
              type="button"
              class="px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors"
              :class="visualizerMode === 'bars' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              @click="visualizerMode = 'bars'"
            >
              Bars
            </button>
            <button
              type="button"
              class="px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors"
              :class="visualizerMode === 'alchemy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              @click="visualizerMode = 'alchemy'"
            >
              Alchemy
            </button>
            <button
              type="button"
              class="px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors"
              :class="visualizerMode === 'wave' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              @click="visualizerMode = 'wave'"
            >
              Wave
            </button>
          </div>

          <!-- Playlist Toggle Button -->
          <button
            type="button"
            class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
            :class="showPlaylist ? 'bg-blue-600/60 border-blue-400 text-white' : 'text-slate-300'"
            @click="showPlaylist = !showPlaylist"
          >
            <span>☰</span>
            <span class="hidden sm:inline">Playlist</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Stage Area: Visualizer & Track Card + Playlist Pane -->
      <div class="flex-1 flex min-h-0 relative bg-black">
        <!-- Visualizer & Active Stage Canvas -->
        <div class="flex-1 relative flex items-center justify-center overflow-hidden">
          <canvas
            ref="canvasRef"
            width="600"
            height="340"
            class="w-full h-full block absolute inset-0 object-cover"
          />

          <!-- Ambient Glow vignette -->
          <div class="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

          <!-- Center Track Card Overlay -->
          <div class="relative z-10 flex flex-col items-center text-center p-4 max-w-sm bg-black/50 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl">
            <!-- Vinyl Record Spinning Animation -->
            <div
              class="w-24 h-24 rounded-full border-4 border-slate-700 bg-gradient-to-tr from-slate-900 via-neutral-900 to-black shadow-2xl flex items-center justify-center relative mb-3 transition-transform"
              :class="isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''"
            >
              <div class="w-16 h-16 rounded-full border border-white/20 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center shadow-inner">
                <span class="text-white text-lg">♫</span>
              </div>
              <div class="w-3 h-3 rounded-full bg-white border border-slate-900" />
            </div>

            <!-- Track Metadata -->
            <div class="font-bold text-sm text-white tracking-wide truncate w-full">
              {{ currentTrack.title }}
            </div>
            <div class="text-xs text-sky-300 mt-0.5 truncate w-full">
              {{ currentTrack.artist }}
            </div>
            <div class="text-[10px] text-slate-400 mt-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
              {{ currentTrack.genre }} • {{ currentTrack.license }}
            </div>
          </div>
        </div>

        <!-- Collapsible Playlist Side Pane -->
        <div
          v-if="showPlaylist"
          class="w-64 bg-[#0d1624] border-l border-blue-900/40 flex flex-col shrink-0 text-xs shadow-xl animate-in slide-in-from-right duration-150"
        >
          <div class="p-2.5 bg-[#142033] border-b border-blue-900/30 flex items-center justify-between text-slate-300 font-bold text-[11px] uppercase tracking-wider">
            <span>Library Tracks</span>
            <span class="text-[10px] text-slate-400 font-mono">{{ playlist.length }} items</span>
          </div>

          <div class="flex-1 overflow-y-auto divide-y divide-white/5">
            <button
              v-for="(track, idx) in playlist"
              :key="track.id"
              type="button"
              class="w-full p-2.5 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              :class="currentTrackIndex === idx ? 'bg-blue-900/40 text-sky-200 border-l-2 border-sky-400' : 'text-slate-300 hover:bg-white/5'"
              @click="selectTrack(idx)"
            >
              <span class="w-4 text-center font-mono text-[10px] text-slate-500">
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
            class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const togglePlay = () => {
  playSound('click')
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play().catch(() => {
      // Autoplay restriction guard
    })
  }
}

const stopTrack = () => {
  playSound('click')
  if (!audioRef.value) return
  audioRef.value.pause()
  audioRef.value.currentTime = 0
  isPlaying.value = false
}

const selectTrack = (idx: number) => {
  playSound('click')
  currentTrackIndex.value = idx
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play().catch(() => {})
  }
}

const nextTrack = () => {
  playSound('click')
  if (isShuffle.value) {
    const nextIdx = Math.floor(Math.random() * playlist.length)
    selectTrack(nextIdx)
  } else {
    const nextIdx = (currentTrackIndex.value + 1) % playlist.length
    selectTrack(nextIdx)
  }
}

const prevTrack = () => {
  playSound('click')
  const prevIdx = (currentTrackIndex.value - 1 + playlist.length) % playlist.length
  selectTrack(prevIdx)
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

// Visualizer Canvas Rendering
const renderVisualizer = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const width = canvasRef.value.width
  const height = canvasRef.value.height

  ctx.clearRect(0, 0, width, height)

  const t = Date.now() / 600

  if (visualizerMode.value === 'bars') {
    // Mode A: Classic Windows 7 Equalizer Bars
    const barCount = 36
    const barWidth = width / barCount - 3
    for (let i = 0; i < barCount; i++) {
      const freq = Math.sin(t * 3 + i * 0.4) * 0.5 + 0.5
      const h = isPlaying.value ? (freq * (height * 0.7) + 10) : 6
      const x = i * (barWidth + 3) + 2
      const y = height - h

      // Green to Cyan to Orange gradient
      const grad = ctx.createLinearGradient(0, height, 0, 0)
      grad.addColorStop(0, '#00e676')
      grad.addColorStop(0.6, '#00d2ff')
      grad.addColorStop(1, '#ff9100')

      ctx.fillStyle = grad
      ctx.fillRect(x, y, barWidth, h)

      // Peak Cap
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2)
    }
  } else if (visualizerMode.value === 'alchemy') {
    // Mode B: WMP Alchemy concentric color waves
    const cx = width / 2
    const cy = height / 2
    const ringCount = 8
    for (let r = 1; r <= ringCount; r++) {
      const radius = isPlaying.value
        ? ((t * 20 + r * 25) % (width * 0.45))
        : r * 20
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `hsla(${(t * 40 + r * 30) % 360}, 90%, 65%, ${isPlaying.value ? 0.35 : 0.15})`
      ctx.lineWidth = isPlaying.value ? 3 : 1
      ctx.stroke()
    }
  } else if (visualizerMode.value === 'wave') {
    // Mode C: Oscilloscope smooth sine wave
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = '#00d2ff'
    for (let x = 0; x < width; x += 4) {
      const amp = isPlaying.value ? 40 : 5
      const y = height / 2 + Math.sin(x * 0.03 + t * 4) * amp + Math.cos(x * 0.05 - t * 2) * (amp * 0.5)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  animFrameId = requestAnimationFrame(renderVisualizer)
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
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
