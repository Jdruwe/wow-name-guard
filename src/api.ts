import type { CheckResult } from '../shared/verdict'

export type CheckResponse = {
  result: CheckResult | null
  error: string | null
}

export async function checkName(mainName: string, secondaryName: string): Promise<CheckResponse> {
  const response = await fetch('/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mainName, secondaryName }),
  })
  if (!response.ok && response.status !== 400) {
    throw new Error('The Name Guard could not be reached.')
  }
  return (await response.json()) as CheckResponse
}
