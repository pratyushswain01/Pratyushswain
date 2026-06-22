/**
 * Button.jsx — Reusable button with variant and loading state.
 */
export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

  const variants = {
    primary: 'bg-ink text-white hover:bg-ink-soft active:scale-[0.98] disabled:opacity-40',
    ghost:   'bg-transparent text-ink-muted hover:bg-slate-surface active:bg-slate-border',
    danger:  'bg-status-red text-white hover:opacity-90',
  }

  return (
    <button
      disabled={disabled || loading}
      className={[base, variants[variant], className].join(' ')}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
