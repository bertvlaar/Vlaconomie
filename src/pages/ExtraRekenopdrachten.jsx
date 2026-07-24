import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import RekenOpdracht from '../components/RekenOpdracht.jsx'

import extraRekenopdrachten from '../data/extraRekenopdrachten.js'

export default function ExtraRekenopdrachten() {
  const opdrachten2F = extraRekenopdrachten.filter((o) => o.niveau === '2F')
  const opdrachten3F = extraRekenopdrachten.filter((o) => o.niveau === '3F')

  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Extra</p>
      <h1 className="mb-3 text-slate-900">Rekenopdrachten</h1>
      <p className="mb-8 max-w-2xl text-slate-600">
        Los van de lesstof: extra oefeningen in nieuwe alledaagse contexten, op twee niveaus. Elke
        opdracht toont het niveau (2F of 3F) als badge.
      </p>

      <Section title="Niveau 2F">
        <p className="mb-4 text-sm text-slate-500">Fundamenteel niveau: procenten, verhoudingen, rekenen met geld.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {opdrachten2F.map((r) => (
            <RekenOpdracht key={`2f-${r.nummer}`} {...r} />
          ))}
        </div>
      </Section>

      <Section title="Niveau 3F">
        <p className="mb-4 text-sm text-slate-500">
          Verdieping: rente-op-rente, verhoudingen in delen, opeenvolgende percentages en negatieve
          getallen.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {opdrachten3F.map((r) => (
            <RekenOpdracht key={`3f-${r.nummer}`} {...r} />
          ))}
        </div>
      </Section>

    </PageShell>
  )
}
