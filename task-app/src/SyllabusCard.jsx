/**
 * SyllabusCard.jsx
 * Displays one JAM section with mastery score and progress bar.
 * Props:
 *   section  — from JAM_SECTIONS constant
 *   score    — 0-100 mastery score (from section_progress table)
 *   onClick  — navigate to section detail view
 */
import { getMasteryLabel } from './constants'

const COLOR_MAP = {
  blue: { bar: 'bg-accent', bg: 'bg-accent-subtle', icon: 'text-accent' },
  violet: { bar: 'bg-violet-500', bg: 'bg-violet-50', icon: 'text-violet-500' },
  cyan: { bar: 'bg-cyan-500', bg: 'bg-cyan-50', icon: 'text-cyan-500' },
  amber: { bar: 'bg-amber-400', bg: 'bg-amber-50', icon: 'text-amber-500' },
  orange: { bar: 'bg-orange-500', bg: 'bg-orange-50', icon: 'text-orange-500' },
  green: { bar: 'bg-status-green', bg: 'bg-green-50', icon: 'text-status-green' },
  rose: { bar: 'bg-rose-500', bg: 'bg-rose-50', icon: 'text-rose-500' },
}

export function SyllabusCard({ section, score = 0, onClick }) {
  const colors = COLOR_MAP[section.color] ?? COLOR_MAP.blue
  const mastery = getMasteryLabel(score)

  return (
    <button
      onClick={onClick}
      className={[
        'group relative flex flex-col p-5 rounded-card text-left',
        'bg-white border border-slate-border',
        'shadow-card hover:shadow-card-hover',
        'transition-all duration-200 active:scale-[0.99]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      ].join(' ')}
      aria-label={`${section.title} — ${mastery.label} (${score}%)`}
    >
      {/* Icon badge */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl ${colors.bg}`}>
        <span className={colors.icon}>{section.icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-ink leading-tight mb-1">
        {section.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-ui leading-relaxed mb-5 line-clamp-2">
        {section.description}
      </p>

      {/* Mastery footer */}
      <div className="mt-auto w-full">
        {/* Score row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-medium ${mastery.className}`}>
            {mastery.label}
          </span>
          <span className="font-mono text-xs text-slate-ui">{score}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
            style={{ width: `${score}%` }}
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Hover arrow */}
      <span className="absolute top-5 right-5 text-slate-border group-hover:text-slate-ui transition-colors text-xs">
        →
      </span>
    </button>
  )
}
