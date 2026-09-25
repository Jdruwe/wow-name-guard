import type { Category } from './verdict'

export type ExampleName = {
  firstName: string
  surname: string
  label: string
  expected: Category
}

export const EXAMPLE_NAMES: ExampleName[] = [
  { firstName: 'Billy', surname: 'Thrallson', label: 'a wholesome adventurer', expected: 'clean' },
  { firstName: 'Jaina', surname: 'Proudmoor', label: 'a famous mage', expected: 'clean' },
  { firstName: 'Brom', surname: 'Beerbane', label: 'a dwarven brewer', expected: 'clean' },
  { firstName: 'Pe', surname: 'Nis', label: 'a compound split across both fields', expected: 'sexual' },
  { firstName: 'Mcsuck', surname: 'mahbal', label: 'the name from the WoW screenshot', expected: 'sexual' },
  { firstName: 'Luv', surname: 'Gonads', label: 'anatomy reference', expected: 'sexual' },
  { firstName: 'Kkk', surname: 'Master', label: 'hate movement reference', expected: 'racist' },
  { firstName: 'Gas', surname: 'Thejuice', label: 'racist dogwhistle', expected: 'racist' },
  { firstName: 'Sh1t', surname: 'Lord', label: 'leetspeak profanity', expected: 'inauthentic' },
  { firstName: 'Xx', surname: 'Slayerxx', label: 'harmless but tryhard', expected: 'clean' },
]
