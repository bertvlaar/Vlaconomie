import React, { useState } from 'react'

const levelMeta = {
  brons: { label: 'Brons: Kennis & Begrip', icon: '🥉', ring: 'ring-amber-300', chip: 'bg-amber-100 text-amber-900' },
  zilver: { label: 'Zilver: Toepassing & Rekenen', icon: '🥈', ring: 'ring-slate-300', chip: 'bg-slate-200 text-slate-800' },
  goud: { label: 'Goud: Analyse & Evaluatie (verplicht vwo)', icon: '🥇', ring: 'ring-yellow-300', chip: 'bg-yellow-100 text-yellow-900' },
}

function OefenVraag({ nummer, vraag, modelantwoord }) {
  const [antwoord, setAntwoord] = useState('')
  const [checked, setChecked] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="mb-3 font-medium text-slate-800">
        <span className="mr-1 text-slate-400">{nummer}.</span> {vraag}
      </p>
      <textarea
        value={antwoord}
        onChange={(e) => setAntwoord(e.target.value)}
        rows={3}
        placeholder="Typ hier je antwoord..."
        className="w-full rounded-md border border-border bg-pagebg p-3 text-sm text-slate-800 focus:border-blue-500"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setChecked(true)}
          className="rounded-md bg-action px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Check
        </button>
      </div>
      {checked && (
        <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
          <span className="font-semibold">Modelantwoord ter controle: </span>
          {modelantwoord}
        </div>
      )}
    </div>
  )
}

export default function OefenBank({ lesTitel, opdrachten }) {
  const totaal = opdrachten.length
  const grouped = ['brons', 'zilver', 'goud'].map((level) => ({
    level,
    items: opdrachten.filter((o) => o.level === level),
  }))

  return (
    <section className="mb-10">
      <h2 className="mb-1 text-slate-900">📚 Oefenbank {lesTitel}</h2>
      <p className="mb-6 text-sm text-slate-500">{totaal} opdrachten. Voltooi minimaal het brons- en zilverniveau.</p>
      <div className="space-y-8">
        {grouped.map(
          (g) =>
            g.items.length > 0 && (
              <div key={g.level}>
                <span className={`mb-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${levelMeta[g.level].chip}`}>
                  {levelMeta[g.level].icon} {levelMeta[g.level].label}
                </span>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {g.items.map((o, i) => (
                    <OefenVraag key={i} nummer={o.nummer} vraag={o.vraag} modelantwoord={o.modelantwoord} />
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    </section>
  )
}
