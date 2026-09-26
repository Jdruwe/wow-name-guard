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
  const [mainName, setMainName] = useState('')
  const [secondaryName, setSecondaryName] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [diceIndex, setDiceIndex] = useState(0)

  async function check(main = mainName, secondary = secondaryName) {
    if (!main.trim() || !secondary.trim()) return
    setStatus('loading')
    try {
      const response = await checkName(main.trim(), secondary.trim())
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
    setMainName(example.mainName)
    setSecondaryName(example.secondaryName)
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
            aria-label="Roll an example name"
            onClick={rollDice}
            disabled={status === 'loading'}
          >
            <DiceIcon />
          </button>
          <input
            className="name-input"
            value={mainName}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Main Name"
            onChange={(event) => setMainName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void check()
            }}
          />
          <input
            className="name-input"
            value={secondaryName}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Secondary Name"
            onChange={(event) => setSecondaryName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void check()
            }}
          />
        </div>
      </section>

      <button
        type="button"
        className="check-button"
        onClick={() => void check()}
        disabled={status === 'loading' || !mainName.trim() || !secondaryName.trim()}
      >
        {status === 'loading' ? 'Consulting the oracles...' : 'Check Name'}
      </button>

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

function DiceIcon() {
  return (
    <svg className="dice__icon" viewBox="0 0 24 24" aria-hidden="true">
      <g stroke="#6b4700" strokeWidth="0.6" strokeLinejoin="round">
        <path d="M12 2.5 20.5 6.8 12 11.1 3.5 6.8Z" fill="#ffeb7a" />
        <path d="M3.5 6.8 12 11.1V21.5L3.5 17.2Z" fill="#f4c21c" />
        <path d="M12 11.1 20.5 6.8V17.2L12 21.5Z" fill="#c99209" />
      </g>
      <g fill="#6b4200">
        <ellipse cx="12" cy="6.8" rx="1.5" ry="0.8" />
        <ellipse cx="6" cy="10.9" rx="0.9" ry="1.2" />
        <ellipse cx="9.5" cy="12.7" rx="0.9" ry="1.2" />
        <ellipse cx="6" cy="15.3" rx="0.9" ry="1.2" />
        <ellipse cx="9.5" cy="17.1" rx="0.9" ry="1.2" />
        <ellipse cx="14.6" cy="12.7" rx="0.9" ry="1.2" />
        <ellipse cx="18" cy="15.3" rx="0.9" ry="1.2" />
      </g>
    </svg>
  )
}
