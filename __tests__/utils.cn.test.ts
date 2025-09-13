import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names and tailwind variants', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', 'bg-blue-600', false && 'hidden')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    // tailwind-merge should keep the last bg-blue-600
    expect(result).toContain('bg-blue-600')
    expect(result).not.toContain('bg-blue-500')
  })
})
