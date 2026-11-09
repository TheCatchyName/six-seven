import { expect, test } from 'claude-code/testing'

import { has67, Tail } from './match'

test('matches standalone 67 forms', () => {
  for (const t of ['67', 'it was 67 degrees', '6 7!', '6-7', 'Six Seven', 'task MG-67 is done', '(67)', 'ok 67.']) {
    expect(has67(t)).toBe(true)
  }
})

test('skips years, numbers, money, line refs and code', () => {
  for (const t of ['1967', '670', '$67.50', 'file.ts:67', '67.5', '167', 'pages 1-67', '`x = 67`', '```\nconst a = 67\n```', 'sixseven', '67%']) {
    expect(has67(t)).toBe(false)
  }
})

test('streamed tail joins chunks and waits for what follows', () => {
  const a = new Tail()
  expect(a.push('it is 6')).toBe(false)
  expect(a.push('7')).toBe(false)
  expect(a.push(' now')).toBe(true)
  expect(a.push(' and more')).toBe(false)

  const b = new Tail()
  expect(b.push('room 67')).toBe(false)
  expect(b.push('0')).toBe(false)

  const c = new Tail()
  expect(c.push('```\n67')).toBe(false)
  expect(c.push(' x\n')).toBe(false)
})
