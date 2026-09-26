import type { Category } from './verdict'

export type ExampleName = {
  mainName: string
  secondaryName: string
  label: string
  expected: Category
}

// The dice cycles through these in order: the first three show one of each
// verdict (clean, suspicious, flagged), so a demo hits every outcome quickly.
export const EXAMPLE_NAMES: ExampleName[] = [
  { mainName: 'Billy', secondaryName: 'Thrallson', label: 'a wholesome adventurer', expected: 'clean' },
  { mainName: 'Harry', secondaryName: 'Balls', label: 'borderline pun (suspicious)', expected: 'sexual' },
  { mainName: 'Pe', secondaryName: 'Nis', label: 'a compound split across both fields', expected: 'sexual' },
  { mainName: 'Jaina', secondaryName: 'Proudmoor', label: 'a famous mage', expected: 'clean' },
  { mainName: 'Brom', secondaryName: 'Beerbane', label: 'a dwarven brewer', expected: 'clean' },
  { mainName: 'Mcsuck', secondaryName: 'mahbal', label: 'the name from the WoW screenshot', expected: 'sexual' },
  { mainName: 'Luv', secondaryName: 'Gonads', label: 'anatomy reference', expected: 'sexual' },
  { mainName: 'Kkk', secondaryName: 'Master', label: 'hate movement reference', expected: 'racist' },
  { mainName: 'Gas', secondaryName: 'Thejuice', label: 'racist dogwhistle', expected: 'racist' },
  { mainName: 'Sh1t', secondaryName: 'Lord', label: 'leetspeak profanity', expected: 'inauthentic' },
  { mainName: 'Anita', secondaryName: 'Bath', label: 'borderline pun (suspicious)', expected: 'sexual' },
  { mainName: 'Butthead', secondaryName: 'Brewer', label: 'mild insult (suspicious)', expected: 'offensive' },
  { mainName: 'Xx', secondaryName: 'Slayerxx', label: 'harmless but tryhard', expected: 'clean' },
]
