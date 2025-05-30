// src/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatTime } from './utils'

describe('formatTime', () => {
  it('returns empty string for falsy input', () => {
    expect(formatTime('')).toBe('')
    expect(formatTime(null as any)).toBe('')
    expect(formatTime(undefined as any)).toBe('')
  })

  it('formats ISO string into "YYYY/MM/DD HH:mm" in Asia/Taipei timezone', () => {
    // 2025-05-29T05:00:00Z is 13:00 in Taipei (UTC+8)
    const iso = '2025-05-29T05:00:00Z'
    const formatted = formatTime(iso)
    // expect exactly "2025/05/29 13:00"
    expect(formatted).toMatch(/2025\/05\/29\s+13:00/)
  })

  it('pads month, day, hour, minute to two digits', () => {
    // midnight UTC gives 08:05 in Taipei
    const iso = '2025-01-01T00:05:00Z'
    const formatted = formatTime(iso)
    expect(formatted).toBe('2025/01/01 08:05')
  })
})
