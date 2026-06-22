/**
 * Auth.jsx
 * Page-level auth container.
 * Renders the AuthForm alongside the branding panel.
 * Split-screen on desktop, stacked on mobile.
 */
import { AuthForm } from './AuthForm'

export function Auth() {
  return (
    <main className="min-h-screen flex">
      {/* ── Left: Branding panel ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-ink p-12">
        {/* Logo / wordmark */}
        <div>
          <span className="font-mono text-white/40 text-xs tracking-widest uppercase">
            Mastery Matrix
          </span>
        </div>

        {/* Stats block — inspirational but grounded */}
        <div>
          <p className="font-mono text-white/20 text-[11px] tracking-widest uppercase mb-6">
            JAM 2026 Syllabus
          </p>
          <ul className="space-y-4">
            {[
              { n: '7', label: 'Core sections' },
              { n: '∞', label: 'Practice problems' },
              { n: '1', label: 'Seat to claim' },
            ].map(({ n, label }) => (
              <li key={label} className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-medium text-white">{n}</span>
                <span className="text-sm text-white/40">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer quote */}
        <p className="text-white/25 text-xs leading-relaxed">
          "The more you know, the more you realize you don't know." — Aristotle
        </p>
      </aside>

      {/* ── Right: Form panel ────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center p-6 bg-white">
        <AuthForm />
      </section>
    </main>
  )
}
