/**
 * Dashboard.jsx
 * Main authenticated view. Shows:
 *  - Greeting header
 *  - Aggregate mastery stats strip
 *  - 7-section syllabus grid (SyllabusCard × 7)
 *
 * Data: fetches section_progress for the current user.
 * Falls back to score=0 for sections with no progress row yet.
 */
import { useState, useEffect } from 'react'
// Assuming these are all now inside task-app/src/
import { JAM_SECTIONS } from './constants'
import { SyllabusCard } from './SyllabusCard' // If in the same folder
import { supabase } from './supabaseClient'
import { useAuth } from './useAuth'
import { Button } from './Button'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [progressMap, setProgressMap] = useState({})   // { section_id: score }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchProgress() {
      const { data, error } = await supabase
        .from('section_progress')
        .select('section_id, mastery_score')
        .eq('user_id', user.id)

      if (!error && data) {
        const map = {}
        data.forEach(row => { map[row.section_id] = row.mastery_score })
        setProgressMap(map)
      }
      setLoading(false)
    }

    fetchProgress()
  }, [user])

  // Derived stats
  const scores = JAM_SECTIONS.map(s => progressMap[s.id] ?? 0)
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const masteredCount = scores.filter(s => s >= 80).length
  const activeCount = scores.filter(s => s > 0 && s < 80).length

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'there'

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top nav ───────────────────────────────────────── */}
      <header className="border-b border-slate-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-ui tracking-widest uppercase">
            Mastery Matrix
          </span>
          <span className="text-slate-border">·</span>
          <span className="text-xs text-slate-ui">JAM 2026 Physics</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-ui hidden sm:block">{user?.email}</span>
          <Button variant="ghost" onClick={signOut} className="text-xs px-3 py-1.5">
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Greeting ───────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            Good to see you, {firstName}.
          </h1>
          <p className="text-sm text-slate-ui mt-1">
            {overallScore > 0
              ? `You're at ${overallScore}% overall mastery. Keep building momentum.`
              : 'Pick a section below to start logging your progress.'}
          </p>
        </div>

        {/* ── Stats strip ────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-10 p-5 rounded-card border border-slate-border bg-slate-surface/40">
          {[
            { value: `${overallScore}%`, label: 'Overall mastery' },
            { value: masteredCount, label: `Section${masteredCount !== 1 ? 's' : ''} mastered` },
            { value: activeCount, label: 'In progress' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-mono text-2xl font-medium text-ink">{value}</p>
              <p className="text-xs text-slate-ui mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Section label ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono text-slate-ui tracking-widest uppercase">
            Syllabus — 7 Sections
          </h2>
          <span className="text-xs text-slate-ui">
            {loading ? 'Loading…' : `${scores.filter(s => s > 0).length} / 7 started`}
          </span>
        </div>

        {/* ── Grid ───────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-card bg-slate-surface animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JAM_SECTIONS.map(section => (
              <SyllabusCard
                key={section.id}
                section={section}
                score={progressMap[section.id] ?? 0}
                onClick={() => {
                  // Phase 2: navigate to /section/:slug
                  console.log('Navigate to', section.slug)
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
