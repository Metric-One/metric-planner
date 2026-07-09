// Strict allowlist validation for the 10 LOCKED onboarding answers.
// Nothing reaches Prisma that isn't an exact, expected value — this is the
// input-sanitization boundary (Part 3, layer 6). Do not add options here that
// aren't in the founder-locked question set (src/portals/onboarding/steps.js).

const ROLE = { 'Solo Founder': 'SOLO_FOUNDER', Agency: 'AGENCY', 'Team Leader': 'TEAM_LEADER' }
const TIER = { 'Free (V1 limits)': 'FREE', 'Trial Pro': 'PRO' }

const NORTH_STAR = ['Revenue', 'User Acquisition', 'Product Launch', 'Other']
const GROWTH_CHANNEL = ['LinkedIn', 'Google Ads', 'SEO', 'Cold Outreach', 'Other']
const PLANNING_HORIZON = ['Weekly Sprints', 'Monthly Goals', '90-Day Quarters']
const WORK_STYLE = ['Time-Blocking calendar', 'Flow-based Kanban-list']
const BOTTLENECK = ['Content', 'Lead Gen', 'Task Org', 'Data Tracking', 'Other']
const TOOL_STACK = ['Meta Ads', 'Google Ads', 'Amazon SP-API', 'Shopify']
const PRODUCTIVITY_PEAK = ['Morning', 'Afternoon', 'Night']

const oneOf = (list) => (v) => (list.includes(v) ? null : `must be one of: ${list.join(' | ')}`)
const mapped = (table) => (v) => (Object.hasOwn(table, v) ? null : `must be one of: ${Object.keys(table).join(' | ')}`)

const RULES = {
  role: mapped(ROLE),
  northStar: oneOf(NORTH_STAR),
  growthChannel: oneOf(GROWTH_CHANNEL),
  planningHorizon: oneOf(PLANNING_HORIZON),
  workStyle: oneOf(WORK_STYLE),
  deepWorkHours: (v) =>
    Number.isInteger(v) && v >= 0 && v <= 168 ? null : 'must be an integer between 0 and 168',
  bottleneck: oneOf(BOTTLENECK),
  toolStack: (v) =>
    Array.isArray(v) && v.length > 0 && v.every((t) => TOOL_STACK.includes(t)) && new Set(v).size === v.length
      ? null
      : `must be a non-empty unique subset of: ${TOOL_STACK.join(' | ')}`,
  productivityPeak: oneOf(PRODUCTIVITY_PEAK),
  tier: mapped(TIER)
}

// Returns { ok, errors, value } — `value` is DB-ready (labels mapped to enums).
export function validateOnboarding(body) {
  const errors = {}
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, errors: { _: 'body must be a JSON object' } }
  }
  for (const [field, check] of Object.entries(RULES)) {
    const problem = check(body[field])
    if (problem) errors[field] = problem
  }
  const extra = Object.keys(body).filter((k) => !Object.hasOwn(RULES, k))
  if (extra.length) errors._ = `unexpected field(s): ${extra.join(', ')}`

  if (Object.keys(errors).length) return { ok: false, errors }

  return {
    ok: true,
    errors: null,
    value: {
      role: ROLE[body.role],
      northStar: body.northStar,
      growthChannel: body.growthChannel,
      planningHorizon: body.planningHorizon,
      workStyle: body.workStyle,
      deepWorkHours: body.deepWorkHours,
      bottleneck: body.bottleneck,
      toolStack: body.toolStack,
      productivityPeak: body.productivityPeak,
      tier: TIER[body.tier]
    }
  }
}
