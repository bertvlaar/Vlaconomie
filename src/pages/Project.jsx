import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'

const rubric = [
  { criterium: 'Fase 1: Onderzoek', onvoldoende: 'Geen/onduidelijke enquête', voldoende: 'Enquête aanwezig, beperkte analyse', goed: 'Heldere enquête + resultaten geanalyseerd', uitmuntend: 'Diepgaande analyse + economische begrippen correct toegepast' },
  { criterium: 'Fase 2: Survivalplan', onvoldoende: 'Geen werkende tool', voldoende: 'Basale budgettool', goed: 'Praktische, bruikbare tool met uitleg', uitmuntend: 'Originele, doordachte tool met concrete koopkracht-berekeningen' },
  { criterium: 'Fase 3: Presentatie', onvoldoende: 'Onvoorbereid, onduidelijk', voldoende: 'Correct maar weinig overtuigend', goed: 'Overtuigend en helder gepresenteerd', uitmuntend: 'Zeer overtuigend, creatief en professioneel' },
  { criterium: 'Vakinhoud', onvoldoende: 'Begrippen niet/fout gebruikt', voldoende: 'Enkele begrippen correct', goed: 'Meeste begrippen correct toegepast', uitmuntend: 'Alle begrippen correct + vwo-niveau verdieping' },
  { criterium: 'Samenwerking', onvoldoende: 'Ongelijke inzet, geen overleg', voldoende: 'Redelijke taakverdeling', goed: 'Goede samenwerking en planning', uitmuntend: 'Uitstekende samenwerking, iedereen zichtbaar bijgedragen' },
]

export default function Project() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">4-weken groepsproject</p>
      <h1 className="mb-3 text-slate-900">De TikTok-Shop Rebel</h1>
      <p className="mb-8 max-w-2xl text-slate-600">
        Onderzoek marketingtrucs, bouw een survivalplan en maak jongeren bewust, in drie fases.
      </p>

      <Section title="Fase 1: Marketingtrucs-onderzoek" eyebrow="Week 1">
        <p className="mb-3 text-slate-700">
          Ontwerp een enquête (min. 8 vragen) en neem deze af in de eigen klas of school. Onderzoek
          welke nudging-technieken medeleerlingen herkennen en hoe vaak ze impulsaankopen doen via
          social media.
        </p>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          ⚠️ Neem de enquête altijd <strong>anoniem</strong> af en vraag <strong>geen exacte
          schuldbedragen of persoonsgegevens</strong>: gebruik antwoordcategorieën ('0-10 euro',
          '10-50 euro').
        </div>
      </Section>

      <Section title="Fase 2: Financieel survivalplan" eyebrow="Week 2-3">
        <p className="text-slate-700">
          Ontwerp een eigen budgetteertool (op papier, in een spreadsheet, of digitaal) voor jongeren,
          met tips om nudging te weerstaan en verantwoord met achteraf betalen om te gaan.
        </p>
      </Section>

      <Section title="Fase 3: Bewustwordingscampagne" eyebrow="Week 4">
        <p className="text-slate-700">
          Maak een eindpresentatie, TikTok-video of poster die medeleerlingen bewust maakt van
          algoritmische verleiding en de risico's van achteraf betalen.
        </p>
      </Section>

      <Section title="📋 Beoordelingsrubric (voor de docent)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-slate-500">
                <th className="py-2 pr-4">Criterium</th>
                <th className="py-2 pr-4">Onvoldoende (1-2)</th>
                <th className="py-2 pr-4">Voldoende (3)</th>
                <th className="py-2 pr-4">Goed (4)</th>
                <th className="py-2 pr-4">Uitmuntend (5)</th>
              </tr>
            </thead>
            <tbody>
              {rubric.map((r) => (
                <tr key={r.criterium} className="border-b border-border align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800">{r.criterium}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.onvoldoende}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.voldoende}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.goed}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.uitmuntend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  )
}
