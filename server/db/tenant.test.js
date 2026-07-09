import test, { before, after, describe } from 'node:test'
import assert from 'node:assert/strict'
import { prisma } from './prisma.js'
import { forWorkspace, TenantIsolationError } from './tenant.js'

// Security proof for the $extends tenant guard. Seeds two workspaces (A, B)
// with the UNSCOPED base client, then attacks B's data using A's scoped client.
// Nothing here may ever see, mutate, or delete B's rows.

const A_ID = 'test_ws_a'
const B_ID = 'test_ws_b'
const day = (d) => new Date(`2026-07-0${d}T09:00:00Z`)

async function seed(id) {
  await prisma.workspace.create({
    data: { id, ownerUserId: `owner_${id}`, role: 'SOLO_FOUNDER', tier: 'FREE' }
  })
  const sprint = await prisma.sprint.create({
    data: { workspaceId: id, name: `sprint_${id}`, startDate: day(1), endDate: day(7) }
  })
  const block = await prisma.block.create({
    data: { workspaceId: id, sprintId: sprint.id, title: `block_${id}`, date: day(1), startTime: day(1), endTime: day(2) }
  })
  const task = await prisma.task.create({
    data: { workspaceId: id, sprintId: sprint.id, blockId: block.id, title: `task_${id}` }
  })
  return { sprint, block, task }
}

let A, B, dbA

before(async () => {
  await prisma.workspace.deleteMany({ where: { id: { in: [A_ID, B_ID] } } })
  A = await seed(A_ID)
  B = await seed(B_ID)
  dbA = forWorkspace(A_ID)
})

after(async () => {
  await prisma.workspace.deleteMany({ where: { id: { in: [A_ID, B_ID] } } })
  await prisma.$disconnect()
})

describe('A cannot READ B', () => {
  test('bare findMany() with no where returns only A (Sprint/Block/Task)', async () => {
    for (const model of ['sprint', 'block', 'task']) {
      const rows = await dbA[model].findMany()
      assert.ok(rows.length > 0, `${model}: expected A's own rows`)
      assert.ok(rows.every((r) => r.workspaceId === A_ID), `${model}: leaked a foreign workspaceId`)
    }
  })

  test("findFirst targeting B's row by id returns null", async () => {
    assert.equal(await dbA.sprint.findFirst({ where: { id: B.sprint.id } }), null)
    assert.equal(await dbA.block.findFirst({ where: { id: B.block.id } }), null)
    assert.equal(await dbA.task.findFirst({ where: { id: B.task.id } }), null)
  })

  test('count/aggregate never include B', async () => {
    assert.equal(await dbA.sprint.count(), 1)
    assert.equal(await dbA.block.count(), 1)
  })

  test('Block is filterable without a Sprint join (denormalized workspaceId)', async () => {
    const blocks = await dbA.block.findMany({ where: { title: `block_${B_ID}` } })
    assert.equal(blocks.length, 0)
  })
})

describe('A cannot MUTATE B', () => {
  test("updateMany targeting B's sprint affects 0 rows and leaves B intact", async () => {
    const res = await dbA.sprint.updateMany({ where: { id: B.sprint.id }, data: { name: 'hacked' } })
    assert.equal(res.count, 0)
    const fresh = await prisma.sprint.findUnique({ where: { id: B.sprint.id } })
    assert.equal(fresh.name, `sprint_${B_ID}`)
  })

  test("deleteMany targeting B's task affects 0 rows and B's task survives", async () => {
    const res = await dbA.task.deleteMany({ where: { id: B.task.id } })
    assert.equal(res.count, 0)
    assert.ok(await prisma.task.findUnique({ where: { id: B.task.id } }))
  })
})

describe('guard throws', () => {
  test('create() stamping a different workspaceId throws', async () => {
    await assert.rejects(
      () => dbA.sprint.create({ data: { workspaceId: B_ID, name: 'x', startDate: day(1), endDate: day(7) } }),
      TenantIsolationError
    )
  })

  test('create() without workspaceId is auto-stamped to A', async () => {
    const s = await dbA.sprint.create({ data: { name: 'stamped', startDate: day(1), endDate: day(7) } })
    assert.equal(s.workspaceId, A_ID)
    await prisma.sprint.delete({ where: { id: s.id } })
  })

  test('by-PK findUnique on a tenant model throws (forbidden)', async () => {
    await assert.rejects(() => dbA.sprint.findUnique({ where: { id: A.sprint.id } }), TenantIsolationError)
    await assert.rejects(() => dbA.task.update({ where: { id: A.task.id }, data: { title: 'y' } }), TenantIsolationError)
  })

  // Raw SQL is refused synchronously (fails loud, before any DB round-trip).
  test('raw SQL cannot bypass the guard', () => {
    assert.throws(() => dbA.$queryRawUnsafe('SELECT * FROM "Sprint"'), TenantIsolationError)
    assert.throws(() => dbA.$executeRawUnsafe('DELETE FROM "Sprint"'), TenantIsolationError)
  })
})
