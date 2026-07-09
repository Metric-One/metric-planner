import express from 'express'
import rateLimit from 'express-rate-limit'
import { onboardingRouter } from './routes/onboarding.js'
import { logger } from './lib/logger.js'
import { TenantIsolationError } from './db/tenant.js'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1) // behind a reverse proxy in prod; needed for correct rate-limit IPs
  app.disable('x-powered-by')
  app.use(express.json({ limit: '16kb' })) // onboarding payload is tiny

  // Baseline throttle across the whole API (layer 9 refinement comes post-V1).
  app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false }))

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api/onboarding', onboardingRouter)

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

  // Central error handler (layer 7). A tenant-isolation breach is a server bug:
  // log it loudly, never leak details to the client.
  app.use((err, req, res, _next) => {
    if (err instanceof TenantIsolationError) {
      logger.error('tenant_isolation_violation', { path: req.path, msg: err.message })
      return res.status(500).json({ error: 'Internal error' })
    }
    const status = err.status || 500
    logger[status >= 500 ? 'error' : 'warn']('request_failed', {
      path: req.path, status, msg: err.message, ...(status >= 500 ? { stack: err.stack } : {})
    })
    return res.status(status).json({ error: err.expose ? err.message : status >= 500 ? 'Internal error' : err.message })
  })

  return app
}
