// The 10 LOCKED onboarding questions (Metric One — AI Planner).
// These prompts + options are provided by the founder and are LOCKED:
// do NOT paraphrase a prompt or invent options beyond what is listed here.
// `kind`: 'single' | 'multi' | 'number'.
export const ONBOARDING_STEPS = [
  { id: 'role',             kind: 'single', prompt: 'Your role',
    options: ['Solo Founder', 'Agency', 'Team Leader'] },
  { id: 'northStar',        kind: 'single', prompt: 'North Star metric this quarter',
    options: ['Revenue', 'User Acquisition', 'Product Launch', 'Other'] },
  { id: 'growthChannel',    kind: 'single', prompt: 'Core growth channel',
    options: ['LinkedIn', 'Google Ads', 'SEO', 'Cold Outreach', 'Other'] },
  { id: 'planningHorizon',  kind: 'single', prompt: 'Planning horizon',
    options: ['Weekly Sprints', 'Monthly Goals', '90-Day Quarters'] },
  { id: 'workStyle',        kind: 'single', prompt: 'Work style',
    options: ['Time-Blocking calendar', 'Flow-based Kanban-list'] },
  { id: 'deepWorkHours',    kind: 'number', prompt: 'Deep-work hours per week',
    min: 0, max: 168, placeholder: 'e.g. 20' },
  { id: 'bottleneck',       kind: 'single', prompt: 'Biggest bottleneck',
    options: ['Content', 'Lead Gen', 'Task Org', 'Data Tracking', 'Other'] },
  // Q8 "etc." in the brief — only the four named tools are locked; more are TBD (ask founder).
  { id: 'toolStack',        kind: 'multi',  prompt: 'Tool stack to unify',
    options: ['Meta Ads', 'Google Ads', 'Amazon SP-API', 'Shopify'] },
  { id: 'productivityPeak', kind: 'single', prompt: 'Productivity peak',
    options: ['Morning', 'Afternoon', 'Night'] },
  { id: 'tier',             kind: 'single', prompt: 'Tier',
    options: ['Free (V1 limits)', 'Trial Pro'] }
]

export const TOTAL_STEPS = ONBOARDING_STEPS.length
