import { cn } from '@/lib/cn'

export function Logo({ className, word = 'METRIC', withWord = true }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-on-primary shadow-[var(--glow)]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 11.5 6 6l3 3 5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {withWord && <span className="font-display text-lg font-semibold tracking-tight">{word}</span>}
    </span>
  )
}
