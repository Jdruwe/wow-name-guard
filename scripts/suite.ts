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

for (const example of EXAMPLE_NAMES) {
  process.stdout.write(`Checking ${example.firstName} ${example.surname}... `)
  try {
    const answers = await askJev({ firstName: example.firstName, surname: example.surname })
    const result = decide(answers)
    rows.push(
      `| ${example.firstName} ${example.surname} | ${example.label} | ${result.verdict} | ${result.category} | ${result.noul.toFixed(2)} | ${result.severity.toFixed(2)} | ${example.expected} |`,
    )
    console.log(result.verdict)
  } catch (err) {
    console.log('failed')
    rows.push(`| ${example.firstName} ${example.surname} | ${example.label} | ERROR | | | | ${example.expected} |`)
    console.error(`  ${(err as Error).message}`)
  }
}

console.log('')
console.log(
  '| Full Name | Label | Verdict | Category | Noul | Severity | Expected |',
)
console.log('| --- | --- | --- | --- | --- | --- | --- |')
for (const row of rows) console.log(row)
