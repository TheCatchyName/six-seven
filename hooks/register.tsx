import { atom, read, update } from 'claude-code'
import type { EngineInterface, Hook, Register } from 'claude-code'

import type { Burst } from '../types'
import { has67, Tail } from './match'

const burst = atom({ plugin: 'six-seven', key: 'burst' } as const, { id: null, frame: -1 } as Burst)
const seen = atom({ plugin: 'six-seven', key: 'seen' } as const, [] as string[])

const HANDS = ['🙌', '🖐️', '🤲']
const FRAMES = 10 // 10 × 200ms ≈ 2s
const COOLDOWN = 8000

const row = (f: number) =>
  Array.from({ length: 1 + (f % 5) * 2 }, (_, i) => HANDS[(i + f) % 3]).join(' ')

let surface = 'terminal'
let last = 0
let ticking: { cancel: () => void } | undefined

// id: a message id (burst drawn in that bubble) or 'band' (above the prompt).
async function start($: EngineInterface, id: string) {
  // Cooldown only for the streaming band; each message bursts once anyway (seen).
  if (id === 'band') {
    const now = await $.clock.now()
    if (now - last < COOLDOWN) return
    last = now
  } else await update($, seen, s => [...s.slice(-200), id])
  if (surface !== 'terminal' && surface !== 'desktop') return void $.ui.toast('🙌 6 7 🤲')
  ticking?.cancel()
  await update($, burst, () => ({ id, frame: 0 }))
  const tick = (ticking = $.clock.every(200, () => {
    void update($, burst, b => {
      if (b.frame + 1 >= FRAMES) {
        tick.cancel()
        return { id: null, frame: -1 }
      }
      return { ...b, frame: b.frame + 1 }
    })
  }))
}

// Burst inside the bubble the first time a 67 message is on screen.
const message: Hook<'ui.render'> = async ($, e, next) => {
  if (e.component !== 'AssistantMessage' && e.component !== 'UserMessage') return next(e)
  if (!has67(e.props.text) || e.props.onScreen === null) return next(e)
  const b = await read($, burst)
  if (b.id === e.requestId) {
    // shortcut: cast, TS loses the surface × component pairing on spread
    return next({ ...e, props: { ...e.props, text: `${row(b.frame)}\n\n${e.props.text}` } } as typeof e)
  }
  if (!(await read($, seen)).includes(e.requestId)) {
    $.clock.after(0, () => void start($, e.requestId))
  }
  return next(e)
}

export const register: Register = on => {
  on('session.start', ($, e, next) => {
    surface = e.surface ?? surface
    return next(e)
  })

  on('ui.render', message)

  // Live text: no bubble burst can run yet while it streams, so use the band.
  on('turn.step', async function* ($, e, next) {
    const tail = new Tail()
    for await (const c of next(e)) {
      if (c.kind === 'text' && tail.push(c.text)) void start($, 'band')
      yield c
    }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const b = await read($, burst)
    if (b.id === null || e.props.hasSurvey) return next(e)
    const { Text } = $.ui.resolve(e)
    return <Text>{row(b.frame)}</Text>
  })
}
