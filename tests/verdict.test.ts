import { describe, expect, it } from 'vitest'
import { decide, THRESHOLDS, type JevAnswers } from '../shared/verdict'

function answers(overrides: Partial<JevAnswers> = {}): JevAnswers {
  return {
    inappropriate: { noul: 0.01 },
    category: { choice: 'clean' },
    severity: { score: 0.1 },
    ...overrides,
  }
}

describe('decide', () => {
  it('is clean when everything is low', () => {
    expect(decide(answers())).toEqual({
      verdict: 'clean',
      noul: 0.01,
      category: 'clean',
      severity: 0.1,
    })
  })

  it(`is flagged when noul >= ${THRESHOLDS.flagged}`, () => {
    const result = decide(answers({ inappropriate: { noul: THRESHOLDS.flagged } }))
    expect(result.verdict).toBe('flagged')
  })

  it(`is suspicious when noul in [${THRESHOLDS.suspicious}, ${THRESHOLDS.flagged})`, () => {
    const result = decide(answers({ inappropriate: { noul: 0.55 } }))
    expect(result.verdict).toBe('suspicious')
  })

  it(`is suspicious when severity reaches the top band even with low noul`, () => {
    const result = decide(answers({ severity: { score: THRESHOLDS.severeBandStart } }))
    expect(result.verdict).toBe('suspicious')
  })

  it('is clean just below the suspicious threshold', () => {
    const result = decide(answers({ inappropriate: { noul: THRESHOLDS.suspicious - 0.01 } }))
    expect(result.verdict).toBe('clean')
  })

  it('is flagged regardless of severity band', () => {
    const result = decide(answers({ inappropriate: { noul: 0.9 }, severity: { score: 0.2 } }))
    expect(result.verdict).toBe('flagged')
  })
})
