import React from 'react'

export default function Leerdoelen({ children }) {
  return (
    <section className="mb-10 rounded-xl border border-border bg-blue-50/50 p-6 lg:p-8">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-700">Leerdoel</p>
      <div className="text-lg font-medium text-slate-800">{children}</div>
    </section>
  )
}
