import { prisma } from './prisma.js'

// ── Shared tenant-isolation primitive (metric-App + metric-planner) ──────────
// Every query against a tenant-scoped model MUST be constrained to a single
// workspace. `forWorkspace(id)` returns a Prisma client that auto-scopes what
// it safely can and THROWS on anything it can't prove is workspace-bound.

export const TENANT_MODELS = new Set([
  'Workspace', 'OnboardingProfile', 'Sprint', 'Block', 'Task'
])

// Filter-based read/bulk ops: their `where` must resolve to this workspace.
const FILTER_OPS = new Set([
  'findFirst', 'findFirstOrThrow', 'findMany',
  'updateMany', 'deleteMany', 'count', 'aggregate', 'groupBy'
])
// Single-row-by-unique ops: Prisma requires a unique selector (usually id) that
// generally can't include workspaceId, so we forbid them on tenant models and
// force the caller to the scoped form (findFirst / updateMany with workspaceId).
const UNIQUE_OPS = new Set(['findUnique', 'findUniqueOrThrow', 'update', 'delete', 'upsert'])
// Create ops: we stamp the workspace key into the row(s).
const CREATE_OPS = new Set(['create', 'createMany', 'createManyAndReturn'])

export class TenantIsolationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TenantIsolationError'
    this.status = 500 // a broken server invariant, never a client-facing 4xx
  }
}

// The Workspace model is the tenant ROOT — its own `id` IS the boundary.
// Every other tenant model carries a `workspaceId` column.
const keyFor = (model) => (model === 'Workspace' ? 'id' : 'workspaceId')

function whereHasKey(where, key, value) {
  if (!where || typeof where !== 'object') return false
  if (where[key] === value) return true
  if (Array.isArray(where.AND)) return where.AND.some((w) => whereHasKey(w, key, value))
  return false
}

// Raw SQL never reaches the $allModels query hook, so a scoped client MUST
// refuse it outright — otherwise `$queryRawUnsafe('SELECT * FROM "Sprint"')`
// silently reads every tenant. (Caught by tenant.test.js.)
const rawBlocked = (name) => () => {
  throw new TenantIsolationError(
    `${name} is forbidden on a workspace-scoped client — raw SQL bypasses tenant filtering. ` +
    `Use the model API, or the base prisma client behind an explicit workspace check.`
  )
}

export function forWorkspace(workspaceId) {
  if (typeof workspaceId !== 'string' || workspaceId.length === 0) {
    throw new TenantIsolationError('forWorkspace(workspaceId): a non-empty workspaceId is required')
  }

  return prisma.$extends({
    name: 'tenant-isolation',
    client: {
      $queryRaw: rawBlocked('$queryRaw'),
      $queryRawUnsafe: rawBlocked('$queryRawUnsafe'),
      $executeRaw: rawBlocked('$executeRaw'),
      $executeRawUnsafe: rawBlocked('$executeRawUnsafe')
    },
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Non-tenant models (future User/auth, etc.) pass through unguarded by design.
          if (!TENANT_MODELS.has(model)) return query(args)

          const key = keyFor(model)

          // 1) Filter ops → force-AND the workspace key, then assert it's present.
          if (FILTER_OPS.has(operation)) {
            args = { ...args, where: { AND: [{ [key]: workspaceId }, args?.where ?? {}] } }
            if (!whereHasKey(args.where, key, workspaceId)) {
              throw new TenantIsolationError(`${model}.${operation} blocked: missing ${key} filter`)
            }
            return query(args)
          }

          // 2) Create ops → stamp the workspace key; reject cross-tenant writes.
          if (CREATE_OPS.has(operation)) {
            if (model === 'Workspace') return query(args) // creating the tenant root itself
            return query(stampWorkspace(operation, args, key, workspaceId))
          }

          // 3) Unique-by-PK ops → forbidden, EXCEPT on the Workspace root pinned to its own id.
          if (UNIQUE_OPS.has(operation)) {
            if (model === 'Workspace' && whereHasKey(args?.where, 'id', workspaceId)) return query(args)
            throw new TenantIsolationError(
              `${model}.${operation} is forbidden on a tenant model — use the workspace-scoped form ` +
              `(findFirst / updateMany / deleteMany with ${key}).`
            )
          }

          // 4) Anything unrecognized on a tenant model → deny by default.
          throw new TenantIsolationError(`${model}.${operation} blocked: unrecognized op on a tenant model`)
        }
      }
    }
  })
}

function stampWorkspace(operation, args, key, workspaceId) {
  const stamp = (row = {}) => {
    if (row[key] !== undefined && row[key] !== workspaceId) {
      throw new TenantIsolationError(`create blocked: ${key} mismatch (cross-tenant write attempt)`)
    }
    return { ...row, [key]: workspaceId }
  }
  if (operation === 'create') return { ...args, data: stamp(args?.data) }
  // createMany / createManyAndReturn: data may be a single row or an array.
  const data = Array.isArray(args?.data) ? args.data.map(stamp) : stamp(args?.data)
  return { ...args, data }
}
