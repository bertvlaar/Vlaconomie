import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import begrippenThema1 from '../data/begrippenThema1.js'

export default function Begrippenlijst() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
        Thema 1 · Naslagwerk
      </p>
      <h1 className="mb-4 text-slate-900">Begrippenlijst</h1>
      <p className="mb-10 max-w-2xl text-lg text-slate-600">
        Alle belangrijke economische begrippen uit dit thema, gegroepeerd per les. Gebruik deze
        pagina om een begrip snel op te zoeken, of om je voor te bereiden op de eindquiz.
      </p>

      {begrippenThema1.map((groep) => (
        <Section key={groep.les} eyebrow={groep.les} title={groep.titel}>
          <dl className="divide-y divide-border">
            {groep.begrippen.map((b) => (
              <div key={b.term} className="py-4 first:pt-0 last:pb-0">
                <dt className="mb-1 flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                  {b.term}
                  {b.vwo && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                      vwo
                    </span>
                  )}
                </dt>
                <dd className="text-slate-700">{b.definitie}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}
    </PageShell>
  )
}
