export function useAudioFeedback() {
  const playSound = (sound: 'click' | 'minimize' | 'restore' | 'error') => {
    if (!import.meta.client) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      const now = ctx.currentTime
      if (sound === 'click') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, now)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
        osc.start(now)
        osc.stop(now + 0.04)
      } else if (sound === 'minimize') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, now)
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
        osc.start(now)
        osc.stop(now + 0.12)
      } else if (sound === 'restore') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(250, now)
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.12)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
        osc.start(now)
        osc.stop(now + 0.12)
      } else if (sound === 'error') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(150, now)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
      }
    } catch {
      // AudioContext autoplay restriction guard
    }
  }

  const playStartupChime = () => {
    if (!import.meta.client) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const notes: [number, number][] = [[523.25, 0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.36]]
      notes.forEach(([f, t]) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = f
        g.gain.setValueAtTime(0.0001, now + t)
        g.gain.exponentialRampToValueAtTime(0.12, now + t + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.5)
        o.connect(g)
        g.connect(ctx.destination)
        o.start(now + t)
        o.stop(now + t + 0.55)
      })
    } catch {
      // Audio unavailable
    }
  }

  return { playSound, playStartupChime }
}
