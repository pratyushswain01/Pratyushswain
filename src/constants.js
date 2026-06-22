/**
 * constants.js
 * Static application data: JAM syllabus sections.
 * These mirror the seeded rows in supabase `syllabus_sections`.
 * Used for UI rendering without an extra DB round-trip.
 */

export const JAM_SECTIONS = [
  {
    id: 1,
    slug: 'mathematical-physics',
    title: 'Mathematical Physics',
    description: 'Vector calculus · Linear algebra · Complex analysis · ODEs & PDEs · Fourier methods · Special functions',
    icon: '∂',
    color: 'blue',   // maps to Tailwind config accent
  },
  {
    id: 2,
    slug: 'mechanics-general-properties',
    title: 'Mechanics & General Properties',
    description: 'Newtonian mechanics · Conservation laws · Rigid body dynamics · Oscillations · Special relativity',
    icon: '⚙',
    color: 'violet',
  },
  {
    id: 3,
    slug: 'oscillations-waves-optics',
    title: 'Oscillations, Waves & Optics',
    description: 'SHM · Superposition · Interference · Diffraction · Polarisation · Lasers',
    icon: '〜',
    color: 'cyan',
  },
  {
    id: 4,
    slug: 'electricity-magnetism',
    title: 'Electricity & Magnetism',
    description: "Electrostatics · Gauss's law · Magnetostatics · Maxwell's equations · EM waves · AC circuits",
    icon: '⚡',
    color: 'amber',
  },
  {
    id: 5,
    slug: 'kinetic-theory-thermodynamics',
    title: 'Kinetic Theory & Thermodynamics',
    description: 'Kinetic theory · Laws of thermodynamics · Entropy · Thermodynamic potentials · Statistical basics',
    icon: '◎',
    color: 'orange',
  },
  {
    id: 6,
    slug: 'modern-physics',
    title: 'Modern Physics',
    description: 'Quantum mechanics · Hydrogen atom · Nuclear physics · Radioactivity · Elementary particles',
    icon: '⚛',
    color: 'green',
  },
  {
    id: 7,
    slug: 'solid-state-electronics',
    title: 'Solid State & Electronics',
    description: 'Crystal structure · Band theory · Semiconductors · p-n junction · Transistors · Logic gates',
    icon: '▦',
    color: 'rose',
  },
]

export const TASK_STATUS = {
  TODO:        'todo',
  IN_PROGRESS: 'in_progress',
  DONE:        'done',
}

export const MASTERY_LABELS = [
  { min: 0,  max: 29,  label: 'Not Started', className: 'text-slate-ui' },
  { min: 30, max: 59,  label: 'Familiar',    className: 'text-status-amber' },
  { min: 60, max: 79,  label: 'Practiced',   className: 'text-accent' },
  { min: 80, max: 100, label: 'Mastered',    className: 'text-status-green' },
]

export function getMasteryLabel(score = 0) {
  return MASTERY_LABELS.find(l => score >= l.min && score <= l.max) ?? MASTERY_LABELS[0]
}
