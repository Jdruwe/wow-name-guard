import { loadDotEnv } from '../server/env'
import { askJev } from '../server/jev'
import { decide } from '../shared/verdict'
import { EXAMPLE_NAMES } from '../shared/examples'

loadDotEnv()

if (!process.env.OPENROUTER_API_KEY) {
  console.error('Set OPENROUTER_API_KEY before running the suite.')
  process.exit(1)
}

const rows: string[] = []
// Wall-clock time of each successful Jev round trip (network included).
// Calls run sequentially so they don't compete with each other.
const latencies: number[] = []
// usage.cost of each successful call, in USD.
const costs: number[] = []

for (const example of EXAMPLE_NAMES) {
  process.stdout.write(`Checking ${example.firstName} ${example.surname}... `)
  const start = performance.now()
  try {
    const answers = await askJev({ firstName: example.firstName, surname: example.surname })
    const ms = performance.now() - start
    latencies.push(ms)
    costs.push(answers.usage.cost)
    const result = decide(answers)
    rows.push(
      `| ${example.firstName} ${example.surname} | ${example.label} | ${result.verdict} | ${result.category} | ${result.noul.toFixed(2)} | ${result.severity.toFixed(2)} | ${example.expected} | ${formatMs(ms)} | ${formatUsd(answers.usage.cost)} |`,
    )
    console.log(`${result.verdict} (${formatMs(ms)}, ${formatUsd(answers.usage.cost)})`)
  } catch (err) {
    const ms = performance.now() - start
    console.log(`failed (${formatMs(ms)})`)
    rows.push(
      `| ${example.firstName} ${example.surname} | ${example.label} | ERROR | | | | ${example.expected} | ${formatMs(ms)} | |`,
    )
    console.error(`  ${(err as Error).message}`)
  }
}

console.log('')
console.log('| Full Name | Label | Verdict | Category | Noul | Severity | Expected | Latency | Cost |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const row of rows) console.log(row)

if (latencies.length > 0) {
  const sorted = [...latencies].sort((a, b) => a - b)
  const mean = sorted.reduce((sum, ms) => sum + ms, 0) / sorted.length
  console.log('')
  console.log(`Jev latency over ${sorted.length} successful calls:`)
  console.log('| Min | Median | Mean | p95 | Max |')
  console.log('| --- | --- | --- | --- | --- |')
  console.log(
    `| ${formatMs(sorted[0])} | ${formatMs(percentile(sorted, 50))} | ${formatMs(mean)} | ${formatMs(percentile(sorted, 95))} | ${formatMs(sorted[sorted.length - 1])} |`,
  )
}

if (costs.length > 0) {
  const total = costs.reduce((sum, usd) => sum + usd, 0)
  const mean = total / costs.length
  console.log('')
  console.log(`Jev cost over ${costs.length} successful calls (USD):`)
  console.log('| Total | Per check (mean) | Per 1,000 checks | Per 1M checks |')
  console.log('| --- | --- | --- | --- |')
  console.log(
    `| ${formatUsd(total)} | ${formatUsd(mean)} | $${(mean * 1_000).toFixed(4)} | $${(mean * 1_000_000).toFixed(2)} |`,
  )
}

function formatUsd(usd: number) {
  return `$${usd.toFixed(6)}`
}

function formatMs(ms: number) {
  return `${Math.round(ms)} ms`
}

// Nearest-rank percentile on an ascending-sorted list.
function percentile(sorted: number[], p: number) {
  const rank = Math.ceil((p / 100) * sorted.length)
  return sorted[Math.min(sorted.length, Math.max(1, rank)) - 1]
}
