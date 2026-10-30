<template>
  <div class="w-full h-full bg-gradient-to-b from-[#4a154b] via-[#3a103c] to-[#240b25] select-none flex flex-col items-center justify-center p-3 text-white font-sans overflow-auto">
    <!-- Header Bar -->
    <div class="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl flex items-center justify-between mb-3 shadow-lg">
      <div class="flex items-center gap-2">
        <span class="text-xs uppercase tracking-wider font-bold text-pink-300">Purble Pairs</span>
      </div>

      <div class="flex items-center gap-4 text-xs font-semibold">
        <span class="text-pink-200">Moves: <strong class="text-white">{{ moves }}</strong></span>
        <span class="text-pink-200">Matches: <strong class="text-white">{{ matchedPairs }}/8</strong></span>
      </div>

      <button
        type="button"
        class="h-6 px-2.5 rounded bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-[11px] cursor-pointer shadow-xs active:scale-95 transition-all"
        @click="resetGame"
      >
        Restart
      </button>
    </div>

    <!-- 4x4 Confectionery Card Grid -->
    <div class="grid grid-cols-4 gap-2.5 max-w-md w-full bg-black/20 p-3 rounded-2xl border border-white/10 shadow-2xl">
      <button
        v-for="(card, idx) in cards"
        :key="idx"
        type="button"
        class="aspect-square rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 select-none shadow-md transform"
        :class="getCardClasses(card, idx)"
        @click="flipCard(idx)"
      >
        <span v-if="card.flipped || card.matched" class="animate-in fade-in zoom-in-75 duration-200">
          {{ card.symbol }}
        </span>
        <span v-else class="text-white/40 text-lg">
          🧁
        </span>
      </button>
    </div>

    <!-- Win Banner Notification -->
    <div
      v-if="matchedPairs === 8"
      class="mt-3 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xl animate-bounce flex items-center gap-2"
    >
      <span>🎉 Spectacular! Solved in {{ moves }} moves!</span>
      <button type="button" class="underline cursor-pointer ml-1 text-white hover:text-amber-200" @click="resetGame">Play Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

interface PairCard {
  symbol: string
  flipped: boolean
  matched: boolean
}

const symbols = ['🎂', '🍩', '🧁', '🍓', '🍪', '🍨', '🍭', '🍫']

const cards = ref<PairCard[]>([])
const flippedIndices = ref<number[]>([])
const moves = ref(0)

const matchedPairs = computed(() => {
  return cards.value.filter(c => c.matched).length / 2
})

const resetGame = () => {
  playSound('click')
  moves.value = 0
  flippedIndices.value = []

  const deck: PairCard[] = []
  for (const sym of symbols) {
    deck.push({ symbol: sym, flipped: false, matched: false })
    deck.push({ symbol: sym, flipped: false, matched: false })
  }

  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  cards.value = deck
}

const flipCard = (idx: number) => {
  const card = cards.value[idx]
  if (card.flipped || card.matched || flippedIndices.value.length >= 2) return

  playSound('click')
  card.flipped = true
  flippedIndices.value.push(idx)

  if (flippedIndices.value.length === 2) {
    moves.value++
    const [idx1, idx2] = flippedIndices.value
    const card1 = cards.value[idx1]
    const card2 = cards.value[idx2]

    if (card1.symbol === card2.symbol) {
      // Matched!
      setTimeout(() => {
        card1.matched = true
        card2.matched = true
        flippedIndices.value = []
        playSound('startup')
      }, 300)
    } else {
      // Not matched, flip back
      setTimeout(() => {
        card1.flipped = false
        card2.flipped = false
        flippedIndices.value = []
      }, 800)
    }
  }
}

const getCardClasses = (card: PairCard, idx: number) => {
  if (card.matched) {
    return 'bg-gradient-to-br from-emerald-400 to-green-600 border-2 border-emerald-200 text-white scale-95 opacity-90'
  }
  if (card.flipped) {
    return 'bg-gradient-to-br from-white to-pink-100 border-2 border-pink-400 text-slate-800 scale-102 ring-2 ring-pink-300'
  }
  return 'bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 border-2 border-purple-400/40 hover:border-pink-400 hover:scale-102 hover:brightness-110 active:scale-95'
}

onMounted(() => {
  resetGame()
})
</script>
