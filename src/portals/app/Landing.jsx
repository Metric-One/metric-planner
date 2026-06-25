import { CalendarClock, ArrowUpRight } from 'lucide-react'
import { Logo } from '@/shared/components/Logo.jsx'

const siteUrl = (import.meta.env.VITE_SITE_URL || 'http://localhost:5174').replace(/\/+$/, '')

export default function Landing() {
  return (
    <main className="relative grid min-h-dvh place-items-center px-6 text-center">
      <div className="animate-fadeUp">
        <Logo className="justify-center" />
        <span className="glass mt-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-fg-muted">
          <CalendarClock size={13} className="text-primary" /> Part of the Metric ecosystem
        </span>
        <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          Metric <span className="text-primary" style={{ textShadow: 'var(--glow)' }}>Planner</span>
        </h1>
        <p className="mt-4 text-2xl font-medium text-fg-muted sm:text-3xl">Coming soon.</p>
        <p className="mx-auto mt-4 max-w-md text-fg-muted">
          The productivity companion to AdMetrics — turn your net-profit insights into a plan you actually execute.
        </p>
        <a href={siteUrl} className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface-2 px-5 text-sm font-medium text-fg transition hover:text-primary focus-ring">
          Explore Metrics <ArrowUpRight size={16} />
        </a>
      </div>
    </main>
  )
}
