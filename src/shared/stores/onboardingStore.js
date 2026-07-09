import { create } from 'zustand'
import { TOTAL_STEPS } from '@/portals/onboarding/steps.js'
import { saveOnboarding, getOnboarding } from '@/api/client.js'

// Onboarding state. As of Day 3 the answers PERSIST: finish() POSTs them to
// /api/onboarding (Workspace + OnboardingProfile, via the tenant-scoped client)
// and reads the stored row straight back.
//
// READ-ONLY-FIRST (locked): every write / publish flag defaults FALSE and stays
// FALSE until the founder approves it. `persistToBackend` is the FIRST approved
// write; the rest remain OFF.
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

export const useOnboardingStore = create((set, get) => ({
  step: 0,
  answers: { ...EMPTY_ANSWERS },
  completed: false,
  workspaceId: null,
  profile: null,
  saving: false,
  error: null,

  // Write flags — FALSE until the founder greenlights each one individually.
  flags: {
    persistToBackend: true, // ✅ approved Day 3 — onboarding save is the first write
    publishPlan: false,     // future: expose generated plan
    aiAutoEdit: false       // future: let the AI edit the plan
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

  // Persist the 10 answers, then read the row straight back from the DB so the
  // UI shows what was actually stored (not just what we hoped we sent).
  finish: async () => {
    if (!get().flags.persistToBackend) return set({ completed: true })
    set({ saving: true, error: null })
    try {
      const { workspaceId } = await saveOnboarding(get().answers)
      const { profile } = await getOnboarding(workspaceId)
      set({ workspaceId, profile, completed: true, saving: false })
    } catch (err) {
      set({ saving: false, error: err.message || 'Could not save onboarding' })
    }
  },

  reset: () =>
    set({ step: 0, answers: { ...EMPTY_ANSWERS }, completed: false, workspaceId: null, profile: null, error: null })
}))
