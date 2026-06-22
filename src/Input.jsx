/**
 * Input.jsx — Reusable form input with label and error state.
 */
export function Input({ id, label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full px-3.5 py-2.5 rounded-lg text-sm text-ink',
          'bg-white border border-slate-border',
          'placeholder:text-slate-ui',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          'transition-shadow duration-150',
          error ? 'border-status-red ring-1 ring-status-red' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p className="text-xs text-status-red">{error}</p>
      )}
    </div>
  )
}
