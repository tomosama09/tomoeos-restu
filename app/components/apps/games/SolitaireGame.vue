<template>
  <div class="w-full h-full bg-[#125828] select-none flex flex-col p-3 overflow-auto font-sans text-slate-800">
    <!-- Top Solitaire Bar: Controls & Scores -->
    <div class="shrink-0 flex items-center justify-between bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20 mb-3 text-white text-xs">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="h-7 px-3 rounded bg-gradient-to-b from-[#e3f0fc] to-[#bedbfa] hover:from-[#cbe2f8] hover:to-[#a9d0f7] border border-[#6b9dce] font-bold text-blue-950 flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95"
          @click="startNewGame"
        >
          <span>↺</span>
          <span>New Deal</span>
        </button>
        <span class="text-emerald-200">Score: <strong class="text-white">{{ score }}</strong></span>
        <span class="text-emerald-200">Moves: <strong class="text-white">{{ moves }}</strong></span>
      </div>

      <div class="text-[11px] text-emerald-200/90 hidden sm:block">
        Tip: Click any face-up card to auto-move
      </div>
    </div>

    <!-- Green Felt Playing Table -->
    <div class="flex-1 flex flex-col gap-4 min-h-[420px]">
      <!-- Top Row: Stock, Waste, and 4 Foundations -->
      <div class="flex items-center justify-between gap-2 max-w-2xl mx-auto w-full">
        <!-- Stock & Waste (Left) -->
        <div class="flex items-center gap-2">
          <!-- Stock Pile -->
          <div
            class="w-14 h-20 rounded-md border-2 border-white/30 flex items-center justify-center cursor-pointer transition-transform hover:scale-102 active:scale-98 shadow-md"
            :class="stock.length > 0 ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 border-white' : 'bg-emerald-900/40 border-dashed'"
            title="Draw Card"
            @click="drawStock"
          >
            <div v-if="stock.length > 0" class="w-12 h-18 rounded border border-blue-300/40 flex items-center justify-center text-white/80 font-bold text-xs">
              🂠
            </div>
            <div v-else class="text-white/40 text-lg">
              ↺
            </div>
          </div>

          <!-- Waste Pile -->
          <div
            class="w-14 h-20 rounded-md border-2 border-white/30 flex items-center justify-center shadow-md relative"
            :class="waste.length > 0 ? 'bg-white cursor-pointer hover:ring-2 hover:ring-yellow-300' : 'bg-emerald-900/20 border-dashed'"
            @click="waste.length > 0 ? moveCardFromWaste() : null"
          >
            <template v-if="waste.length > 0">
              <div
                class="w-full h-full rounded-md p-1 flex flex-col justify-between font-bold text-xs leading-none"
                :class="isRed(topWasteCard!) ? 'text-red-600' : 'text-slate-900'"
              >
                <div class="flex flex-col items-center">
                  <span>{{ getCardLabel(topWasteCard!) }}</span>
                  <span class="text-sm">{{ topWasteCard!.suit }}</span>
                </div>
                <div class="text-center text-lg">
                  {{ topWasteCard!.suit }}
                </div>
                <div class="flex flex-col items-center rotate-180">
                  <span>{{ getCardLabel(topWasteCard!) }}</span>
                  <span class="text-sm">{{ topWasteCard!.suit }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 4 Foundations (Right: Hearts, Diamonds, Clubs, Spades) -->
        <div class="flex items-center gap-2">
          <div
            v-for="(foundation, fIdx) in foundations"
            :key="fIdx"
            class="w-14 h-20 rounded-md border-2 border-white/40 flex items-center justify-center shadow-md relative"
            :class="foundation.length > 0 ? 'bg-white' : 'bg-emerald-900/30 border-dashed'"
          >
            <template v-if="foundation.length > 0">
              <div
                class="w-full h-full rounded-md p-1 flex flex-col justify-between font-bold text-xs leading-none cursor-pointer"
                :class="isRed(foundation[foundation.length - 1]) ? 'text-red-600' : 'text-slate-900'"
              >
                <div class="flex flex-col items-center">
                  <span>{{ getCardLabel(foundation[foundation.length - 1]) }}</span>
                  <span class="text-sm">{{ foundation[foundation.length - 1].suit }}</span>
                </div>
                <div class="text-center text-lg">
                  {{ foundation[foundation.length - 1].suit }}
                </div>
                <div class="flex flex-col items-center rotate-180">
                  <span>{{ getCardLabel(foundation[foundation.length - 1]) }}</span>
                  <span class="text-sm">{{ foundation[foundation.length - 1].suit }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <span class="text-white/30 text-xl font-bold">{{ suitPips[fIdx] }}</span>
            </template>
          </div>
        </div>
      </div>

      <!-- Bottom: 7 Tableau Columns -->
      <div class="grid grid-cols-7 gap-2 max-w-2xl mx-auto w-full flex-1">
        <div
          v-for="(col, colIdx) in tableau"
          :key="colIdx"
          class="flex flex-col items-center min-h-[260px] relative rounded-md"
          :class="col.length === 0 ? 'border-2 border-dashed border-white/20 bg-emerald-900/20' : ''"
          @click="col.length === 0 ? handleEmptyTableauClick(colIdx) : null"
        >
          <div
            v-for="(card, cardIdx) in col"
            :key="card.id"
            class="w-14 h-20 rounded-md shadow-md absolute cursor-pointer transition-transform hover:-translate-y-1"
            :style="{
              top: `${cardIdx * 20}px`,
              zIndex: cardIdx + 1
            }"
            @click.stop="card.faceUp ? handleCardClick(colIdx, cardIdx) : null"
          >
            <!-- Face-down Card -->
            <div
              v-if="!card.faceUp"
              class="w-full h-full rounded-md bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 border border-white/80 p-0.5 shadow-sm"
            >
              <div class="w-full h-full rounded border border-blue-300/40 flex items-center justify-center text-white/50 text-xs">
                ❖
              </div>
            </div>

            <!-- Face-up Card -->
            <div
              v-else
              class="w-full h-full rounded-md bg-white border border-slate-300 p-1 flex flex-col justify-between font-bold text-xs leading-none shadow-sm hover:ring-2 hover:ring-amber-400"
              :class="isRed(card) ? 'text-red-600' : 'text-slate-900'"
            >
              <div class="flex items-center justify-between">
                <span>{{ getCardLabel(card) }}</span>
                <span class="text-xs">{{ card.suit }}</span>
              </div>
              <div class="text-center text-base">
                {{ card.suit }}
              </div>
              <div class="flex items-center justify-between rotate-180">
                <span>{{ getCardLabel(card) }}</span>
                <span class="text-xs">{{ card.suit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAudioFeedback } from '~/composables/useAudioFeedback'

const { playSound } = useAudioFeedback()

type Suit = '♥' | '♦' | '♣' | '♠'

interface Card {
  id: string
  suit: Suit
  value: number // 1 to 13
  faceUp: boolean
}

const suitPips: Suit[] = ['♥', '♦', '♣', '♠']

const stock = ref<Card[]>([])
const waste = ref<Card[]>([])
const foundations = ref<Card[][]>([[], [], [], []])
const tableau = ref<Card[][]>([[], [], [], [], [], [], []])

const score = ref(0)
const moves = ref(0)

const topWasteCard = computed(() => {
  return waste.value.length > 0 ? waste.value[waste.value.length - 1] : null
})

const isRed = (card: Card) => card.suit === '♥' || card.suit === '♦'

const getCardLabel = (card: Card) => {
  if (card.value === 1) return 'A'
  if (card.value === 11) return 'J'
  if (card.value === 12) return 'Q'
  if (card.value === 13) return 'K'
  return String(card.value)
}

const createDeck = (): Card[] => {
  const deck: Card[] = []
  const suits: Suit[] = ['♥', '♦', '♣', '♠']
  for (const suit of suits) {
    for (let v = 1; v <= 13; v++) {
      deck.push({
        id: `${suit}-${v}`,
        suit,
        value: v,
        faceUp: false
      })
    }
  }
  // Fisher-Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

const startNewGame = () => {
  playSound('click')
  const deck = createDeck()

  foundations.value = [[], [], [], []]
  tableau.value = [[], [], [], [], [], [], []]
  waste.value = []
  score.value = 0
  moves.value = 0

  let cardIdx = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[cardIdx++]
      card.faceUp = row === col
      tableau.value[col].push(card)
    }
  }

  stock.value = deck.slice(cardIdx)
}

const drawStock = () => {
  playSound('click')
  moves.value++
  if (stock.value.length > 0) {
    const card = stock.value.pop()!
    card.faceUp = true
    waste.value.push(card)
  } else {
    // Recycle waste to stock
    stock.value = waste.value.reverse().map(c => ({ ...c, faceUp: false }))
    waste.value = []
  }
}

// Check if card can be placed on foundation
const canPlaceOnFoundation = (card: Card, foundation: Card[]) => {
  if (foundation.length === 0) {
    return card.value === 1 // Ace
  }
  const top = foundation[foundation.length - 1]
  return top.suit === card.suit && top.value + 1 === card.value
}

// Check if card can be placed on a tableau column
const canPlaceOnTableau = (card: Card, column: Card[]) => {
  if (column.length === 0) {
    return card.value === 13 // King
  }
  const top = column[column.length - 1]
  if (!top.faceUp) return false
  return isRed(top) !== isRed(card) && top.value === card.value + 1
}

const moveCardFromWaste = () => {
  if (waste.value.length === 0) return
  const card = topWasteCard.value!

  // 1. Try moving to foundations
  for (let f = 0; f < 4; f++) {
    if (canPlaceOnFoundation(card, foundations.value[f])) {
      playSound('click')
      waste.value.pop()
      foundations.value[f].push(card)
      score.value += 10
      moves.value++
      return
    }
  }

  // 2. Try moving to tableau
  for (let t = 0; t < 7; t++) {
    if (canPlaceOnTableau(card, tableau.value[t])) {
      playSound('click')
      waste.value.pop()
      tableau.value[t].push(card)
      score.value += 5
      moves.value++
      return
    }
  }
}

const handleCardClick = (colIdx: number, cardIdx: number) => {
  const col = tableau.value[colIdx]
  const card = col[cardIdx]
  if (!card.faceUp) return

  // Single card move: if it's the top card of column, check foundation first
  if (cardIdx === col.length - 1) {
    for (let f = 0; f < 4; f++) {
      if (canPlaceOnFoundation(card, foundations.value[f])) {
        playSound('click')
        col.pop()
        foundations.value[f].push(card)
        score.value += 10
        moves.value++
        // Flip under card if face down
        if (col.length > 0 && !col[col.length - 1].faceUp) {
          col[col.length - 1].faceUp = true
          score.value += 5
        }
        return
      }
    }
  }

  // Check moving stack or card to another tableau column
  const movingCards = col.slice(cardIdx)
  const baseCard = movingCards[0]

  for (let targetColIdx = 0; targetColIdx < 7; targetColIdx++) {
    if (targetColIdx === colIdx) continue
    const targetCol = tableau.value[targetColIdx]

    if (canPlaceOnTableau(baseCard, targetCol)) {
      playSound('click')
      // Move slice to target
      tableau.value[colIdx] = col.slice(0, cardIdx)
      targetCol.push(...movingCards)
      moves.value++

      // Flip previous card if face down
      const prevCol = tableau.value[colIdx]
      if (prevCol.length > 0 && !prevCol[prevCol.length - 1].faceUp) {
        prevCol[prevCol.length - 1].faceUp = true
        score.value += 5
      }
      return
    }
  }
}

const handleEmptyTableauClick = (colIdx: number) => {
  // If waste card is a King, move it
  if (topWasteCard.value && topWasteCard.value.value === 13) {
    moveCardFromWaste()
  }
}

onMounted(() => {
  startNewGame()
})
</script>
