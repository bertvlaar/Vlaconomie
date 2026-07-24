import React from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'


const lessen = [
  { to: '/thema-1/les-1-1', titel: 'Les 1.1', ondertitel: 'De algoritmische verleiding & nudging' },
  { to: '/thema-1/les-1-2', titel: 'Les 1.2', ondertitel: 'Jouw budget en de dynamische budgetlijn' },
  { to: '/thema-1/les-1-3', titel: 'Les 1.3', ondertitel: 'De financiële kater: krediet en de escalatieladder' },
  { to: '/thema-1/les-1-4', titel: 'Les 1.4', ondertitel: 'Nibud data-analyse & debathal' },
]

export default function Start() {
  return (
    <PageShell>
      <section className="mb-12 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Economie · Havo/Vwo onderbouw · Thema 1
        </p>
        <h1 className="mb-4 text-slate-900">Klarna &amp; TikTok-shops</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Online verleidingen, slimme algoritmes en de financiële keuzes die je portemonnee, en je
          toekomst, bepalen. Welkom in de economie van de scroll.
        </p>
      </section>

      <Section title="🎬 Introductievideo (± 3 min.)">
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/tkQ94YrCmVA"
            title="Zo rijk wordt Klarna van jouw schuld: NOS Stories"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-sm text-slate-500">
          "Zo rijk wordt Klarna van jouw schuld", NOS Stories
        </p>

        <h3 className="mb-3 mt-6 text-slate-900">Kijkvragen</h3>
        <ol className="list-decimal space-y-2 pl-5 text-slate-700">
          <li>Welk bedrag noemt de video als voorbeeld van een opgelopen schuld?</li>
          <li>Waar verdient Klarna volgens de video zijn geld mee, als de consument geen rente betaalt?</li>
          <li>
            Welk gevoel of gedrag zorgt er volgens de video voor dat mensen achteraf betalen uit het oog
            verliezen?
          </li>
        </ol>
      </Section>

      <Section title="Vier lessen, één thema">
        <div className="grid gap-4 sm:grid-cols-2">
          {lessen.map((les) => (
            <Link
              key={les.to}
              to={les.to}
              className="rounded-lg border border-border bg-pagebg p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <p className="text-sm font-semibold text-blue-700">{les.titel}</p>
              <p className="mt-1 font-medium text-slate-800">{les.ondertitel}</p>
            </Link>
          ))}
        </div>
        <Link
          to="/thema-1/begrippenlijst"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          📚 Bekijk de begrippenlijst van dit thema
        </Link>
      </Section>

    </PageShell>
  )
}
