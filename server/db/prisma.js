import { PrismaClient } from '@prisma/client'

// Base Prisma client — mirrors metric-App (backend/src/lib/prisma.js).
// Use this DIRECTLY only for non-tenant models (e.g. a future User/auth table).
// For anything workspace-scoped, use forWorkspace() from ./tenant.js so the
// isolation guard applies. Lives under server/ (not src/) so Vite never bundles it.
export const prisma = new PrismaClient({ log: ['warn', 'error'] })
