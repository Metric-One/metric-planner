import { create } from 'zustand'
import { TOTAL_STEPS } from '@/portals/onboarding/steps.js'

// Local-only onboarding state (Day 1). There is NO backend persistence yet —
// that lands Day 2, once the Prisma schema is approved and migrated. Answers
// live in memory only.
//
// READ-ONLY-FIRST (locked): every write / publish / persist flag defaults FALSE
// and stays FALSE until the founder explicitly approves it.
const EMPTY_ANSWERS = {
  role: null,
  northStar: null,
  growthChannel: null,
  planningHorizon: null,
  workStyle: null,
  deepWorkHours: null,
  bottleneck: null,
  toolStack: [], // multi-select
  productivityPeak: null,
  tier: null
}

export const useOnboardingStore = create((set) => ({
  step: 0,
  answers: { ...EMPTY_ANSWERS },
  completed: false,

  // Write flags — LOCKED FALSE until the founder greenlights each one.
  flags: {
    persistToBackend: false, // Day 2: save OnboardingProfile via API
    publishPlan: false,      // future: expose generated plan
    aiAutoEdit: false        // future: let the AI edit the plan
  },

  setAnswer: (id, value) =>
    set((s) => ({ answers: { ...s.answers, [id]: value } })),

  toggleMulti: (id, value) =>
    set((s) => {
      const arr = Array.isArray(s.answers[id]) ? s.answers[id] : []
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { answers: { ...s.answers, [id]: next } }
    }),

  next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS - 1) })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
  finish: () => set({ completed: true }), // local flag only — no network call
  reset: () => set({ step: 0, answers: { ...EMPTY_ANSWERS }, completed: false })
}))
