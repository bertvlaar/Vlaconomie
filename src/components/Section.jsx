import React from 'react'

export default function Section({ id, title, eyebrow, children, className = '' }) {
  return (
    <section id={id} className={`mb-10 rounded-xl border border-border bg-white p-6 lg:p-8 ${className}`}>
      {eyebrow && (
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-700">{eyebrow}</p>
      )}
      {title && <h2 className="mb-4 text-slate-900">{title}</h2>}
      {children}
    </section>
  )
}
