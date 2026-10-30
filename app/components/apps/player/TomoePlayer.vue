<template>
  <WindowFrame id="player" title="Media Player" icon="/icons/wmp.svg">
    <div class="flex flex-col h-full bg-[#080d14] text-white select-none overflow-hidden font-sans">
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

      <!-- 1. Top Media Player Glass Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#24334a] via-[#162132] to-[#0c1420] border-b border-blue-900/40 px-3 py-1.5 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <img src="/icons/wmp.svg" alt="" class="w-4 h-4 object-contain" />
          <span class="font-bold text-slate-200 tracking-wide text-xs">Now Playing</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Playlist Toggle Button -->
          <button
            type="button"
            class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
            :class="showPlaylist ? 'bg-blue-600/70 border-blue-400 text-white shadow-xs' : 'text-slate-300'"
            @click="showPlaylist = !showPlaylist"
          >
            <span>☰</span>
            <span>Playlist</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Stage Area: Centered Album Art & Vinyl Stage + Playlist -->
      <div class="flex-1 flex min-h-0 relative bg-gradient-to-b from-[#111e30] via-[#09111c] to-[#05080e] overflow-hidden">
        <!-- Center Stage: Vinyl & Metadata Showcase -->
        <div class="flex-1 relative flex flex-col items-center justify-center p-6 text-center overflow-auto">
          <!-- Ambient Glow Background -->
          <div class="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <!-- Vinyl Record Disc in Sleeve -->
          <div class="relative mb-5 flex items-center justify-center cursor-pointer group" @click="togglePlay">
            <!-- Vinyl Disc with Grooves -->
            <div
              class="w-44 h-44 rounded-full border-4 border-slate-700 bg-gradient-to-tr from-neutral-900 via-stone-900 to-black shadow-2xl flex items-center justify-center relative transition-transform duration-700"
              :class="isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:scale-102'"
            >
              <!-- Vinyl Concentric Grooves -->
              <div class="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
              <div class="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
              <div class="absolute inset-9 rounded-full border border-white/5 pointer-events-none" />

              <!-- Center Album Label -->
              <div class="w-20 h-20 rounded-full border-2 border-white/30 bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-900 flex flex-col items-center justify-center shadow-inner text-white">
                <span class="text-xl">♫</span>
                <span class="text-[8px] font-mono opacity-80 uppercase tracking-widest mt-0.5">PLAYER</span>
              </div>

              <!-- Center Spindle Hole -->
              <div class="w-4 h-4 rounded-full bg-neutral-900 border border-slate-700 shadow-inner" />
            </div>

            <!-- Hover Play / Pause Overlay Hint -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
              <span class="text-3xl text-white drop-shadow-lg">
                {{ isPlaying ? '⏸' : '▶' }}
              </span>
            </div>
          </div>

          <!-- Track Information -->
          <div class="max-w-md w-full flex flex-col items-center space-y-1 z-10">
            <h2 class="text-base sm:text-lg font-bold text-white tracking-wide truncate w-full">
              {{ currentTrack.title }}
            </h2>
            <p class="text-xs sm:text-sm text-sky-300 font-medium truncate w-full">
              {{ currentTrack.artist }}
            </p>

            <div class="flex items-center gap-2 mt-2 pt-1 text-[10px]">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-sky-200">
                {{ currentTrack.genre }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-300">
                {{ currentTrack.license }}
              </span>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border"
                :class="isPlaying ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300' : 'bg-slate-800/80 border-slate-600 text-slate-400'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'" />
                <span>{{ isPlaying ? 'Playing' : 'Paused' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Collapsible Playlist Side Pane -->
        <div
          v-if="showPlaylist"
          class="w-64 bg-[#0d1624]/95 backdrop-blur-md border-l border-blue-900/40 flex flex-col shrink-0 text-xs shadow-2xl transition-all"
        >
          <div class="p-2.5 bg-[#142033] border-b border-blue-900/40 flex items-center justify-between text-slate-300 font-bold text-[11px] uppercase tracking-wider">
            <span>Audio Playlist</span>
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
              <span class="w-4 text-center font-mono text-[10px]" :class="currentTrackIndex === idx && isPlaying ? 'text-sky-400 font-bold' : 'text-slate-500'">
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

      <!-- 4. Aero Media Controls Bottom Bar -->
      <div class="shrink-0 bg-gradient-to-b from-[#1b2738] via-[#101926] to-[#080d14] border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
        <!-- Repeat & Shuffle Controls (Left) -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer text-xs"
            :class="isShuffle ? 'bg-blue-600/80 border-blue-400 text-white shadow-xs' : 'border-transparent text-slate-400 hover:text-white'"
            title="Shuffle"
            @click="isShuffle = !isShuffle"
          >
            🔀
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer text-xs"
            :class="isLoop ? 'bg-blue-600/80 border-blue-400 text-white shadow-xs' : 'border-transparent text-slate-400 hover:text-white'"
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

const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const isShuffle = ref(false)
const isLoop = ref(false)
const showPlaylist = ref(true)

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

// Direct track switcher
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

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.src = playlist[0].src
    audioRef.value.volume = volume.value
    audioRef.value.load()
  }
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>
