import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import rateLimit from 'express-rate-limit'
import { forWorkspace } from '../db/tenant.js'
import { validateOnboarding } from '../lib/validate.js'
import { assertWriteAllowed } from '../lib/flags.js'
import { logger } from '../lib/logger.js'

// ⚠️ UNAUTHENTICATED (Day 3). There is no auth in this repo yet, so this route
// must NOT be exposed publicly until auth lands and `ownerUserId` comes from a
// verified session instead of being minted here. Local/dev only.
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // a user onboards once; 10 per 15min per IP is generous
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many onboarding attempts, try again later' }
})

const readLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false })

export const onboardingRouter = Router()

// POST /api/onboarding — the FIRST approved write. Creates the tenant root
// (Workspace) + its OnboardingProfile, both through the workspace-scoped client.
onboardingRouter.post('/', writeLimiter, async (req, res, next) => {
  try {
    assertWriteAllowed('onboarding')

    const { ok, errors, value } = validateOnboarding(req.body)
    if (!ok) {
      logger.warn('onboarding.validation_failed', { errors })
      return res.status(400).json({ error: 'Invalid onboarding payload', fields: errors })
    }

    const workspaceId = randomUUID()
    const ownerUserId = `anon_${randomUUID()}` // TEMPORARY — replace with session user
    const db = forWorkspace(workspaceId)

    await db.$transaction(async (tx) => {
      await tx.workspace.create({
        data: { id: workspaceId, ownerUserId, role: value.role, tier: value.tier }
      })
      // workspaceId passed explicitly so it matches the pinned tenant; the guard
      // would stamp it anyway, and rejects any mismatch.
      await tx.onboardingProfile.create({ data: { workspaceId, ...value } })
    })

    logger.info('onboarding.created', { workspaceId })
    return res.status(201).json({ workspaceId })
  } catch (err) {
    return next(err)
  }
})

// GET /api/onboarding/:workspaceId — read-back through the same scoped client.
onboardingRouter.get('/:workspaceId', readLimiter, async (req, res, next) => {
  try {
    const { workspaceId } = req.params
    const db = forWorkspace(workspaceId)
    // findFirst (not findUnique) — by-PK ops are forbidden on tenant models.
    const profile = await db.onboardingProfile.findFirst()
    if (!profile) return res.status(404).json({ error: 'Onboarding profile not found' })
    return res.json({ profile })
  } catch (err) {
    return next(err)
  }
})
