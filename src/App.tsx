import { useState } from 'react'
import { checkName } from './api'
import { MAX_NAME_LENGTH, type CheckResult, type Verdict } from '../shared/verdict'
import { EXAMPLE_NAMES } from '../shared/examples'

type Status = 'idle' | 'loading' | 'error' | 'done'

const VERDICT_MESSAGES: Record<Verdict, string> = {
  clean: 'That name is yours to claim.',
  suspicious: 'Hmm... are you sure about that name?',
  flagged: 'You cannot use that name!',
}

const CATEGORY_LABELS = {
  clean: 'Clean',
  sexual: 'Sexual content',
  racist: 'Racist content',
  offensive: 'Other offensive content',
  inauthentic: 'Obscured content (leetspeak / casing)',
} as const

export default function App() {
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [diceIndex, setDiceIndex] = useState(0)

  async function check(first = firstName, last = surname) {
    if (!first.trim() || !last.trim()) return
    setStatus('loading')
    try {
      const response = await checkName(first.trim(), last.trim())
      if (response.result) {
        setResult(response.result)
        setError(null)
        setStatus('done')
      } else {
        setError(response.error ?? 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setError('The Name Guard could not be reached.')
      setStatus('error')
    }
  }

  function rollDice() {
    const example = EXAMPLE_NAMES[diceIndex % EXAMPLE_NAMES.length]
    setDiceIndex((diceIndex + 1) % EXAMPLE_NAMES.length)
    setFirstName(example.firstName)
    setSurname(example.surname)
  }

  return (
    <main className="backdrop">
      <section className="name-panel">
        <header className="name-panel__title">Full Name</header>
        <div className="name-panel__row">
          <button
            type="button"
            className="dice"
            title="Roll an example name"
            onClick={rollDice}
            disabled={status === 'loading'}
          >
            🎲
          </button>
          <input
            className="name-input"
            value={firstName}
            maxLength={MAX_NAME_LENGTH}
            placeholder="First Name"
            onChange={(event) => setFirstName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void check()
            }}
          />
          <input
            className="name-input"
            value={surname}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Surname"
            onChange={(event) => setSurname(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void check()
            }}
          />
        </div>
        <button
          type="button"
          className="check-button"
          onClick={() => void check()}
          disabled={status === 'loading' || !firstName.trim() || !surname.trim()}
        >
          {status === 'loading' ? 'Consulting the oracles...' : 'Check Name'}
        </button>
      </section>

      {status === 'error' && <p className="verdict verdict--error">{error}</p>}
      {status === 'done' && result && (
        <>
          <p className={`verdict verdict--${result.verdict}`}>
            {VERDICT_MESSAGES[result.verdict]}
          </p>
          <details className="detail-panel">
            <summary>Detail Panel</summary>
            <dl>
              <dt>Verdict</dt>
              <dd className={`verdict-text verdict-text--${result.verdict}`}>{result.verdict}</dd>
              <dt>Category</dt>
              <dd>{CATEGORY_LABELS[result.category]}</dd>
              <dt>Inappropriate (noul)</dt>
              <dd>{result.noul.toFixed(2)}</dd>
              <dt>Severity (score)</dt>
              <dd>{result.severity.toFixed(2)} / 2.00</dd>
            </dl>
          </details>
        </>
      )}
    </main>
  )
}
