import type { Category } from './verdict'

export type ExampleName = {
  firstName: string
  surname: string
  label: string
  expected: Category
}

// The dice cycles through these in order: the first three show one of each
// verdict (clean, suspicious, flagged), so a demo hits every outcome quickly.
export const EXAMPLE_NAMES: ExampleName[] = [
  { firstName: 'Billy', surname: 'Thrallson', label: 'a wholesome adventurer', expected: 'clean' },
  { firstName: 'Harry', surname: 'Balls', label: 'borderline pun (suspicious)', expected: 'sexual' },
  { firstName: 'Pe', surname: 'Nis', label: 'a compound split across both fields', expected: 'sexual' },
  { firstName: 'Jaina', surname: 'Proudmoor', label: 'a famous mage', expected: 'clean' },
  { firstName: 'Brom', surname: 'Beerbane', label: 'a dwarven brewer', expected: 'clean' },
  { firstName: 'Mcsuck', surname: 'mahbal', label: 'the name from the WoW screenshot', expected: 'sexual' },
  { firstName: 'Luv', surname: 'Gonads', label: 'anatomy reference', expected: 'sexual' },
  { firstName: 'Kkk', surname: 'Master', label: 'hate movement reference', expected: 'racist' },
  { firstName: 'Gas', surname: 'Thejuice', label: 'racist dogwhistle', expected: 'racist' },
  { firstName: 'Sh1t', surname: 'Lord', label: 'leetspeak profanity', expected: 'inauthentic' },
  { firstName: 'Anita', surname: 'Bath', label: 'borderline pun (suspicious)', expected: 'sexual' },
  { firstName: 'Butthead', surname: 'Brewer', label: 'mild insult (suspicious)', expected: 'offensive' },
  { firstName: 'Xx', surname: 'Slayerxx', label: 'harmless but tryhard', expected: 'clean' },
]
