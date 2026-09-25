export type Verdict = 'clean' | 'suspicious' | 'flagged'

export type Category = 'clean' | 'sexual' | 'racist' | 'offensive' | 'inauthentic'

export type JevAnswers = {
  inappropriate: { noul: number }
  category: { choice: Category }
  severity: { score: number }
}

export type CheckResult = {
  verdict: Verdict
  noul: number
  category: Category
  severity: number
}

export const THRESHOLDS = {
  flagged: 0.7,
  suspicious: 0.4,
  severeBandStart: 1.5,
} as const

export const MAX_NAME_LENGTH = 12

export function decide(answers: JevAnswers): CheckResult {
  const { noul } = answers.inappropriate
  const { score: severity } = answers.severity

  let verdict: Verdict
  if (noul >= THRESHOLDS.flagged) {
    verdict = 'flagged'
  } else if (noul >= THRESHOLDS.suspicious || severity >= THRESHOLDS.severeBandStart) {
    verdict = 'suspicious'
  } else {
    verdict = 'clean'
  }

  return {
    verdict,
    noul,
    category: answers.category.choice,
    severity,
  }
}
