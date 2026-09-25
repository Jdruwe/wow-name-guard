import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { askJev } from './jev'
import { loadDotEnv } from './env'
import { decide, MAX_NAME_LENGTH } from '../shared/verdict'

loadDotEnv()

const app = new Hono()

app.use('/api/*', cors({ origin: 'http://localhost:5173' }))

app.post('/api/check', async (c) => {
  const body = await c.req.json<{ firstName?: string; surname?: string }>()
  const firstName = (body.firstName ?? '').trim()
  const surname = (body.surname ?? '').trim()

  if (!firstName || !surname) {
    return c.json({ error: 'Both a first name and a surname are required.' }, 400)
  }
  if (firstName.length > MAX_NAME_LENGTH || surname.length > MAX_NAME_LENGTH) {
    return c.json({ error: `Each name part can be at most ${MAX_NAME_LENGTH} characters.` }, 400)
  }

  const answers = await askJev({ firstName, surname })
  return c.json({ result: decide(answers), error: null })
})

app.onError((err, c) => {
  console.error(err)
  return c.json({ result: null, error: 'The Name Guard could not reach the decision model.' }, 500)
})

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Name Guard server listening on http://localhost:${info.port}`)
})
