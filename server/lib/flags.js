// READ-ONLY-FIRST (locked architecture principle): every write / publish /
// automation flag defaults FALSE and only flips ON with explicit founder approval.
//
// Onboarding is the FIRST approved write (Day 3, 2026-07-08). Everything else
// stays OFF until each is individually approved.
export const WRITE_FLAGS = {
  onboarding: true, // ✅ approved — create Workspace + OnboardingProfile
  sprints: false,
  blocks: false,
  tasks: false,
  publishPlan: false,
  aiAutoEdit: false
}

export function assertWriteAllowed(name) {
  if (!WRITE_FLAGS[name]) {
    const err = new Error(`Write flag "${name}" is disabled`)
    err.status = 403
    err.expose = true
    throw err
  }
}
