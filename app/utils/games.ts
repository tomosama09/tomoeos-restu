// Aero Games: Minesweeper, Tetris, Purble Pairs (memory match), Solitaire
// Lightweight vanilla implementations render into a host container.

export type GameId = 'minesweeper' | 'tetris' | 'pairs' | 'solitaire';

export function mountGame(container: HTMLElement, game: GameId) {
  content[game](container, game);
}

// helper: nested element builder
function el(tag: string, cls?: string, text?: string): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// ===================================================================
// MINESWEEPER
// ===================================================================
function createMinesweeper(host: HTMLElement) {
  const R = 9, C = 9, MINES = 10;
  let grid: number[][] = []; // -1 mine, else adjacent count
  let revealed: boolean[][] = [];
  let flagged: boolean[][] = [];
  let firstClick = true;
  let gameOver = false;
  let minesLeft = MINES;
  let cells = 0;

  host.innerHTML = '';
  const root = el('div', 'game-minesweeper');
  const hdr = el('div', 'game-hdr');
  const counter = el('span', 'game-led', MINES.toString());
  const smiley = el('span', 'game-smiley', '🙂');
  const timer = el('span', 'game-led', '000');
  hdr.append(el('span', 'game-caption', ''), counter);
  hdr.append(smiley);
  hdr.append(el('span', 'count') /* placeholder */, timer);
  // layout: counter left, smiley center, timer right
  hdr.innerHTML = '';
  hdr.style.display = 'flex'; hdr.style.justifyContent = 'space-between'; hdr.style.alignItems = 'center';
  hdr.append(counter, smiley, timer);
  root.append(hdr);
  const board = el('div', 'game-board');
  root.append(board);
  host.append(root);

  function neighbors(r: number, c: number): [number, number][] {
    const out: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C) out.push([nr, nc]);
    }
    return out;
  }
  function placeMines(exR: number, exC: number) {
    const cellsA: [number, number][] = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++)
      if (!(r === exR && c === exC)) cellsA.push([r, c]);
    // shuffle and pick first MINES
    for (let i = cellsA.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cellsA[i], cellsA[j]] = [cellsA[j], cellsA[i]]; }
    grid = Array.from({ length: R }, () => Array(C).fill(0));
    for (let i = 0; i < MINES; i++) grid[cellsA[i][0]][cellsA[i][1]] = -1;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r][c] !== -1) {
      grid[r][c] = neighbors(r, c).filter(([nr, nc]) => grid[nr][nc] === -1).length;
    }
  }
  function checkWin(): boolean {
    return revealed.flat().filter(x => x).length === R * C - MINES;
  }
  function reveal(r: number, c: number) {
    if (gameOver || r < 0 || r >= R || c < 0 || c >= C || revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true; cells++;
    renderCell(board.querySelector(`.cell-${r}-${c}`) as HTMLElement, r, c);
    if (grid[r][c] === -1) { lose(r, c); return; }
    if (grid[r][c] === 0) neighbors(r, c).forEach(([nr, nc]) => reveal(nr, nc));
    if (checkWin()) win();
  }
  function lose(r: number, c: number) {
    gameOver = true;
    smiley.textContent = '😵';
    revealed.forEach((re, ri) => re.forEach((_, ci) => { if (grid[ri][ci] === -1) renderCell(board.querySelector(`.cell-${ri}-${ci}`) as HTMLElement, ri, ci, true); }));
    const cell = board.querySelector(`.cell-${r}-${c}`) as HTMLElement;
    cell.classList.add('game-cell-boom');
  }
  function win() {
    gameOver = true;
    smiley.textContent = '😎';
  }
  function toggleFlag(r: number, c: number) {
    if (gameOver || revealed[r][c]) return;
    flagged[r][c] = !flagged[r][c];
    minesLeft += flagged[r][c] ? -1 : 1;
    counter.textContent = minesLeft.toString();
    const cell = board.querySelector(`.cell-${r}-${c}`) as HTMLElement;
    cell.textContent = flagged[r][c] ? '🚩' : '';
    cell.classList.toggle('game-cell-flag', flagged[r][c]);
  }
  function reset() {
    firstClick = true; gameOver = false; minesLeft = MINES; cells = 0;
    counter.textContent = MINES.toString(); timer.textContent = '000'; smiley.textContent = '🙂';
    grid = Array.from({ length: R }, () => Array(C).fill(0));
    revealed = Array.from({ length: R }, () => Array(C).fill(false));
    flagged = Array.from({ length: R }, () => Array(C).fill(false));
    board.innerHTML = '';
    for (let r = 0; r < R; r++) { for (let c = 0; c < C; c++) { const cell = el('button', `game-cell cell-${r}-${c}`); cell.addEventListener('click', () => { if (firstClick) { placeMines(r, c); firstClick = false; startTimer(); } if (!gameOver) reveal(r, c); }); cell.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleFlag(r, c); }); board.appendChild(cell); } }
  }
  let timerId: number | null = null, secs = 0;
  function startTimer() { if (timerId) return; timerId = window.setInterval(() => { secs++; timer.textContent = String(secs).padStart(3, '0'); }, 1000); }
  function renderCell(cell: HTMLElement | null, r: number, c: number, forceMine = false) {
    if (!cell) return;
    cell.classList.add('game-cell-open');
    if (grid[r][c] === -1 || forceMine) cell.textContent = '💣';
    else if (grid[r][c] > 0) cell.textContent = String(grid[r][c]);
  }
  smiley.addEventListener('click', reset);
  reset();
}

// ===================================================================
// TETRIS
// ===================================================================
function createTetris(host: HTMLElement) {
  const COLS = 10, ROWS = 20;
  const SHAPES: { m: number[][]; col: string }[] = [
    { m: [[1,1,1,1]], col: '#00bcd4' },
    { m: [[1,1],[1,1]], col: '#ffeb3b' },
    { m: [[0,1,0],[1,1,1]], col: '#9c27b0' },
    { m: [[0,1,1],[1,1,0]], col: '#4caf50' },
    { m: [[1,1,0],[0,1,1]], col: '#f44336' },
    { m: [[1,0,0],[1,1,1]], col: '#ff9800' },
    { m: [[0,0,1],[1,1,1]], col: '#2196f3' },
  ];
  let board: (string | null)[][] = [];
  let cur: { m: number[][]; col: string; x: number; y: number } | null = null;
  let score = 0;
  let dropTimer: number | null = null;
  let over = false;
  const container = el('div', 'game-tetris');
  host.innerHTML = ''; host.append(container);

  const side = el('div', 'game-tetris-side');
  side.append(el('div', 'game-caption', 'TETRIS'));
  const scoreEl = el('div', 'game-tetris-score', '0');
  side.append(el('div', 'game-caption', 'Score'), scoreEl);
  const canvasWrap = el('div', 'game-tetris-canvas');
  container.append(side, canvasWrap);
  const cv = document.createElement('canvas'); cv.width = COLS * 24; cv.height = ROWS * 24;
  canvasWrap.appendChild(cv);
  const ctx = cv.getContext('2d')!;

  function reset() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    score = 0; scoreEl.textContent = '0'; over = false;
    spawn();
    if (!dropTimer) dropTimer = window.setInterval(tick, 600);
  }
  function randomShape() { const s = SHAPES[Math.floor(Math.random() * SHAPES.length)]; cur = { m: s.m.map(r => r.slice()), col: s.col, x: Math.floor((COLS - s.m[0].length) / 2), y: 0 }; }
  function spawn() { randomShape(); if (collide(cur!.m, cur!.x, cur!.y)) { over = true; draw(); if (dropTimer) window.clearInterval(dropTimer); dropTimer = null; } }
  function collide(m: number[][], x: number, y: number): boolean {
    for (let r = 0; r < m.length; r++) for (let c = 0; c < m[r].length; c++) if (m[r][c]) {
      const nx = x + c, ny = y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
    return false;
  }
  function lock() {
    if (!cur) return;
    cur.m.forEach((row, r) => row.forEach((v, c) => { if (v && cur && cur.y + r >= 0) board[cur.y + r][cur.x + c] = cur!.col; }));
    clearLines();
    spawn();
  }
  function clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) if (board[r].every(v => v)) { board.splice(r, 1); board.unshift(Array(COLS).fill(null)); cleared++; r++; }
    if (cleared) { score += [0, 100, 300, 500, 800][cleared] || 0; scoreEl.textContent = String(score); }
  }
  function move(dx: number) { if (!cur || over) return; if (!collide(cur.m, cur.x + dx, cur.y)) { cur.x += dx; draw(); } }
  function rotate() { if (!cur || over) return; const m = cur.m[0].map((_, ci) => cur!.m.map(r => r[ci]).reverse()); if (!collide(m, cur.x, cur.y)) cur.m = m; draw(); }
  function softDrop() { if (!cur || over) return; if (!collide(cur.m, cur.x, cur.y + 1)) { cur.y++; draw(); } else lock(); draw(); }
  function hardDrop() { if (!cur || over) return; while (!collide(cur.m, cur.x, cur.y + 1)) cur.y++; lock(); draw(); }
  function tick() { if (!over) softDrop(); }
  function draw() {
    ctx.fillStyle = '#151a23'; ctx.fillRect(0, 0, cv.width, cv.height);
    board.forEach((row, r) => row.forEach((v, c) => { if (v) drawCell(c, r, v); }));
    if (cur) cur.m.forEach((row, r) => row.forEach((v, c) => { if (v && cur && cur.y + r >= 0) drawCell(cur.x + c, cur.y + r, cur!.col); }));
  }
  function drawCell(x: number, y: number, col: string) {
    ctx.fillStyle = col; ctx.fillRect(x * 24, y * 24, 23, 23);
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x * 24, y * 24, 23, 6);
  }
  document.addEventListener('keydown', function kd(e) {
    if (!cv.isConnected) { document.removeEventListener('keydown', kd); return; }
    if (over) return;
    if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowDown') softDrop();
    else if (e.key === 'ArrowUp') rotate();
    else if (e.key === ' ') { e.preventDefault(); hardDrop(); }
  });
  reset(); draw();
}

// ===================================================================
// PURBLE PAIRS (memory match)
// ===================================================================
function createPairs(host: HTMLElement) {
  const emojis = ['🐱','🐶','🦊','🐼','🐸','🐵','🦁','🐰'];
  let cards: string[] = [];
  let flipped: number[] = [];
  let matched = 0;
  let moves = 0;
  host.innerHTML = '';
  const root = el('div', 'game-pairs');
  const hdr = el('div', 'game-hdr');
  hdr.append(el('span', 'game-caption', 'PURBLE PAIRS'), el('span', 'game-caption', `Moves: 0`));
  const grid = el('div', 'game-pairs-grid');
  root.append(hdr, grid); host.append(root);
  const movesEl = hdr.lastChild as HTMLElement;

  function deal() {
    cards = [...emojis, ...emojis];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    flipped = []; matched = 0; moves = 0;
    movesEl.textContent = 'Moves: 0';
    grid.innerHTML = '';
    cards.forEach((_, i) => {
      const b = el('button', 'game-pairs-card');
      b.addEventListener('click', () => flip(b, i));
      grid.appendChild(b);
    });
  }
  function flip(b: HTMLElement, i: number) {
    if (flipped.includes(i) || b.textContent || flipped.length === 2) return;
    b.textContent = cards[i]; b.classList.add('game-pairs-open');
    flipped.push(i);
    if (flipped.length === 2) {
      moves++; movesEl.textContent = `Moves: ${moves}`;
      const [a, bIdx] = flipped;
      const ba = grid.children[a] as HTMLElement, bb = grid.children[bIdx] as HTMLElement;
      if (cards[a] === cards[bIdx]) {
        ba.classList.add('game-pairs-match'); bb.classList.add('game-pairs-match');
        matched += 2; flipped = [];
        if (matched === cards.length) movesEl.textContent = `You won in ${moves} moves!`;
      } else {
        setTimeout(() => { ba.textContent = ''; bb.textContent = ''; ba.classList.remove('game-pairs-open'); bb.classList.remove('game-pairs-open'); flipped = []; }, 700);
      }
    }
  }
  deal();
}

// ===================================================================
// SOLITAIRE (klondike, playable)
// ===================================================================
function createSolitaire(host: HTMLElement) {
  const suits = ['♥','♦','♣','♠'];
  const red = (s: string) => s === '♥' || s === '♦';
  type Card = { v: number; s: string };
  let stock: Card[] = [];
  let waste: Card[] = [];
  let foundations: Card[][] = [[],[],[],[]];
  let tableau: Card[][] = Array.from({ length: 7 }, () => []);
  let tableauOpen: boolean[][] = Array.from({ length: 7 }, () => []);
  host.innerHTML = '';
  const root = el('div', 'game-sol');
  const top = el('div', 'game-sol-top');

  const stockEl = el('button', 'game-sol-slot game-sol-stock', '↺');
  stockEl.addEventListener('click', () => { if (stock.length) { waste.push(stock.pop() as Card); draw(top); } else { stock = waste.reverse(); waste = []; draw(top); } });
  const wasteEl = el('div', 'game-sol-slot');
  top.append(stockEl, wasteEl);
  for (let i = 0; i < 4; i++) top.append(el('div', 'game-sol-slot'));
  const rowsEl = el('div', 'game-sol-rows');
  root.append(top, rowsEl); host.append(root);

  const canPlaceFound = (card: Card, f: number) => {
    const t = foundations[f];
    if (!t.length) return card.v === 1;
    return card.s === t[t.length - 1].s && card.v === t[t.length - 1].v + 1;
  };

  function cardLabel(c: Card): string { return (c.v === 1 ? 'A' : c.v === 11 ? 'J' : c.v === 12 ? 'Q' : c.v === 13 ? 'K' : String(c.v)) + c.s; }

  function draw(topRow: HTMLElement) {
    wasteEl.textContent = waste.length ? cardLabel(waste[waste.length - 1]) : '';
    wasteEl.style.color = waste.length && red(waste[waste.length - 1].s) ? '#c0392b' : '#111';
    foundations.forEach((f, i) => { const s = topRow.children[i + 2] as HTMLElement; s.textContent = f.length ? cardLabel(f[f.length - 1]) : (suits[i] + '¤'); s.style.color = i < 2 ? '#c0392b' : '#111'; });
    rowsEl.innerHTML = '';
    tableau.forEach((col, ci) => {
      const colEl = el('div', 'game-sol-col');
      col.forEach((card, ri) => {
        const isOpen = tableauOpen[ci][ri];
        const c = el('button', 'game-sol-card', isOpen ? cardLabel(card) : '');
        c.style.color = isOpen && red(card.s) ? '#c0392b' : '#111';
        if (isOpen) {
          c.addEventListener('click', () => {
            for (let f = 0; f < 4; f++) if (canPlaceFound(card, f)) { col.pop(); foundations[f].push(card); draw(topRow); return; }
          });
          c.addEventListener('dblclick', () => {
            for (let f = 0; f < 4; f++) if (canPlaceFound(card, f)) { col.pop(); foundations[f].push(card); draw(topRow); break; }
          });
        }
        colEl.appendChild(c);
      });
      colEl.appendChild(el('div', 'game-sol-spacer'));
      rowsEl.appendChild(colEl);
    });
  }

  function deal() {
    stock = []; waste = [];
    foundations = [[],[],[],[]];
    tableau = Array.from({ length: 7 }, () => []);
    tableauOpen = Array.from({ length: 7 }, () => []);
    const deck: Card[] = [];
    for (let s = 0; s < 4; s++) for (let v = 1; v <= 13; v++) deck.push({ v, s: suits[s] });
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    let idx = 0;
    for (let i = 0; i < 7; i++) {
      tableauOpen[i] = Array(7).fill(false);
      for (let j = 0; j <= i; j++) { tableau[i].push(deck[idx++]); tableauOpen[i][j] = j === i; }
    }
    stock = deck.slice(idx);
    draw(root.querySelector('.game-sol-top') as HTMLElement);
  }
  deal();
}

const content: Record<GameId, (host: HTMLElement, g: GameId) => void> = {
  minesweeper: (h) => createMinesweeper(h),
  tetris: (h) => createTetris(h),
  pairs: (h) => createPairs(h),
  solitaire: (h) => createSolitaire(h),
};