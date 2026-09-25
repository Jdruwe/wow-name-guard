import type { Category } from '../shared/verdict'

const JEVO_MODEL = 'typesafe/jev-1.13'
const DECISIONS_URL = 'https://openrouter.ai/api/alpha/decisions'

export type JevRequest = {
  firstName: string
  surname: string
}

type DecisionsResponse = {
  answers: {
    inappropriate: { type: 'noul'; noul: number }
    category: { type: 'choice'; choice: string }
    severity: { type: 'score'; score: number }
  }
}

const CATEGORIES: Category[] = ['clean', 'sexual', 'racist', 'offensive', 'inauthentic']

// Questions in a Jev request are answered independently, so every question
// must restate this context itself.
const JUDGING_CONTEXT =
  'The name was entered as two parts; also consider joined_name, which is both parts concatenated into one word, because banned words may only appear when the parts are joined. Judge the whole name, including words hidden by compound names, unusual casing or leetspellings.'

export async function askJev({ firstName, surname }: JevRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }

  const joinedName = (firstName + surname)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

  const response = await fetch(DECISIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: JEVO_MODEL,
      state: {
        first_name: firstName,
        surname,
        full_name: `${firstName} ${surname}`,
        joined_name: joinedName,
      },
      questions: {
        inappropriate: {
          type: 'noul',
          instructions: `Does this character name contain content that would get it banned from a game? ${JUDGING_CONTEXT}`,
          criteria: {
            true: 'The name contains sexual content, racist content, slurs, profanity or other offensive material.',
            false: 'The name is innocent and appropriate for a fantasy game.',
          },
        },
        category: {
          type: 'choice',
          instructions: `What best describes this character name? ${JUDGING_CONTEXT}`,
          criteria: {
            clean: 'An innocent name appropriate for a fantasy game.',
            sexual: 'The name references sexual acts, anatomy or innuendo.',
            racist: 'The name contains racial or ethnic slurs, or racist references.',
            offensive: 'The name contains other offensive content such as profanity, violence or real-world hate.',
            inauthentic: 'The name itself is harmless but its spelling hides or imitates banned content, e.g. leetspeak or mangled casing.',
          },
        },
        severity: {
          type: 'score',
          instructions: `How severe is the content of this character name? ${JUDGING_CONTEXT}`,
          criteria: [
            'Perfectly fine as a character name',
            'Borderline, a human moderator would squint at it',
            'Clear ban-worthy violation',
          ],
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Jev request failed: ${response.status} ${await response.text()}`)
  }

  const data = (await response.json()) as DecisionsResponse
  const category = data.answers.category.choice as Category
  if (!CATEGORIES.includes(category)) {
    throw new Error(`Jev returned an unknown category: ${category}`)
  }

  return {
    inappropriate: { noul: data.answers.inappropriate.noul },
    category: { choice: category },
    severity: { score: data.answers.severity.score },
  }
}
