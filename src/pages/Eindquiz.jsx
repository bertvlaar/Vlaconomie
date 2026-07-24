import React, { useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import eindquizVragen from '../data/eindquizVragen.js'

function QuizVraag({ nummer, vraag, opties, correct }) {
  const [gekozen, setGekozen] = useState(null)

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="mb-3 font-medium text-slate-800">
        <span className="mr-1 text-slate-400">{nummer}.</span> {vraag}
      </p>
      <div className="space-y-2">
        {opties.map((optie, i) => {
          const isGekozen = gekozen === i
          const isCorrect = i === correct
          let stateClasses = 'border-border hover:bg-slate-50'
          if (gekozen !== null) {
            if (isCorrect) stateClasses = 'border-green-400 bg-green-50'
            else if (isGekozen) stateClasses = 'border-red-300 bg-red-50'
          }
          return (
            <button
              key={i}
              onClick={() => setGekozen(i)}
              disabled={gekozen !== null}
              className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${stateClasses}`}
            >
              <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
              {optie}
            </button>
          )
        })}
      </div>
      {gekozen !== null && (
        <p className={`mt-3 text-sm font-medium ${gekozen === correct ? 'text-green-700' : 'text-red-700'}`}>
          {gekozen === correct
            ? '✅ Goed! '
            : `❌ Niet helemaal, het juiste antwoord is ${String.fromCharCode(65 + correct)}. `}
        </p>
      )}
    </div>
  )
}

export default function Eindquiz() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Thema 1</p>
      <h1 className="mb-3 text-slate-900">🎯 Interactieve diagnostische eindquiz</h1>
      <p className="mb-8 max-w-2xl text-slate-600">
        Test je begrip van alle vier de lessen. Klik een antwoord aan voor directe feedback. Deze quiz
        is diagnostisch: er wordt geen cijfer voor gegeven.
      </p>

      <Section>
        <div className="space-y-5">
          {eindquizVragen.map((q, i) => (
            <QuizVraag key={i} nummer={i + 1} {...q} />
          ))}
        </div>
      </Section>
    </PageShell>
  )
}
