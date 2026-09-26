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
  const body = await c.req.json<{ mainName?: string; secondaryName?: string }>()
  const mainName = (body.mainName ?? '').trim()
  const secondaryName = (body.secondaryName ?? '').trim()

  if (!mainName || !secondaryName) {
    return c.json({ error: 'Both a main name and a secondary name are required.' }, 400)
  }
  if (mainName.length > MAX_NAME_LENGTH || secondaryName.length > MAX_NAME_LENGTH) {
    return c.json({ error: `Each name part can be at most ${MAX_NAME_LENGTH} characters.` }, 400)
  }

  const answers = await askJev({ mainName, secondaryName })
  return c.json({ result: decide(answers), error: null })
})

app.onError((err, c) => {
  console.error(err)
  return c.json({ result: null, error: 'The Name Guard could not reach the decision model.' }, 500)
})

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Name Guard server listening on http://localhost:${info.port}`)
})
