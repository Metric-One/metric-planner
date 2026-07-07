import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Logo } from '@/shared/components/Logo.jsx'
import { cn } from '@/lib/cn'
import { ONBOARDING_STEPS, TOTAL_STEPS } from './steps.js'
import { useOnboardingStore } from '@/shared/stores/onboardingStore.js'

// Onboarding SHELL only. It collects the 10 locked answers into local Zustand
// state. No plan generation, no backend, no persistence yet (Day 2). Do not add
// invented copy, extra options, or the Sprint/Block/Task UI here.
export default function Onboarding() {
  const step = useOnboardingStore((s) => s.step)
  const answers = useOnboardingStore((s) => s.answers)
  const completed = useOnboardingStore((s) => s.completed)
  const setAnswer = useOnboardingStore((s) => s.setAnswer)
  const toggleMulti = useOnboardingStore((s) => s.toggleMulti)
  const next = useOnboardingStore((s) => s.next)
  const back = useOnboardingStore((s) => s.back)
  const finish = useOnboardingStore((s) => s.finish)
  const reset = useOnboardingStore((s) => s.reset)

  const q = ONBOARDING_STEPS[step]
  const value = answers[q.id]
  const isLast = step === TOTAL_STEPS - 1
  const answered =
    q.kind === 'multi' ? Array.isArray(value) && value.length > 0
      : q.kind === 'number' ? value !== null && value !== ''
      : value != null

  if (completed) {
    return (
      <main className="relative grid min-h-dvh place-items-center px-6 text-center">
        <div className="animate-fadeUp">
          <Logo className="justify-center" />
          <div className="glass mx-auto mt-8 max-w-md p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl icon-grad mx-auto"><Check size={20} /></span>
            <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Answers captured</h1>
            <p className="mt-2 text-sm text-fg-muted">
              Saved to local state only — no backend yet. Plan generation and
              persistence land once the schema is approved.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={reset} className="h-10 rounded-xl border border-line bg-surface-2 px-4 text-sm font-medium text-fg transition hover:text-primary focus-ring">Start over</button>
              <Link to="/" className="grid h-10 place-items-center rounded-xl bg-primary px-4 text-sm font-medium text-on-primary transition hover:opacity-90 focus-ring">Done</Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto grid min-h-dvh max-w-xl place-items-center px-6">
      <div className="w-full animate-fadeUp">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <span className="font-mono text-2xs text-fg-subtle">{step + 1} / {TOTAL_STEPS}</span>
        </div>

        {/* progress */}
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>

        <div className="glass p-6 sm:p-8">
          <p className="text-2xs font-medium uppercase tracking-[0.18em] text-primary">Question {step + 1}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">{q.prompt}</h1>

          <div className="mt-6">
            {q.kind === 'number' ? (
              <input
                type="number" inputMode="numeric" min={q.min} max={q.max} placeholder={q.placeholder}
                value={value ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value === '' ? null : Number(e.target.value))}
                className="h-12 w-full rounded-xl border border-line bg-surface-2 px-4 font-mono text-fg outline-none focus-ring"
              />
            ) : (
              <div className={cn('grid gap-2.5', q.options.length > 3 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
                {q.options.map((opt) => {
                  const selected = q.kind === 'multi' ? (Array.isArray(value) && value.includes(opt)) : value === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => (q.kind === 'multi' ? toggleMulti(q.id, opt) : setAnswer(q.id, opt))}
                      className={cn(
                        'flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-ring',
                        selected ? 'border-primary text-fg' : 'border-line text-fg-muted hover:text-fg'
                      )}
                    >
                      {opt}
                      {selected && <Check size={16} className="text-primary" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back} disabled={step === 0}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-fg-muted transition hover:text-fg disabled:opacity-40 focus-ring"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {isLast ? (
              <button
                onClick={finish} disabled={!answered}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-on-primary transition hover:opacity-90 disabled:opacity-40 focus-ring"
              >
                Finish <Check size={16} />
              </button>
            ) : (
              <button
                onClick={next} disabled={!answered}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-on-primary transition hover:opacity-90 disabled:opacity-40 focus-ring"
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
