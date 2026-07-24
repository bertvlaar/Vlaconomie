import React, { useState } from 'react'

const fases = [
  {
    dag: 0,
    bedrag: 50.0,
    titel: 'Aankoop / factuur ontvangen',
    tekst: 'Je bestelt via Klarna. De betalingstermijn is 14 dagen. Alles is nog onder controle.',
  },
  {
    dag: 14,
    bedrag: 50.0,
    titel: 'Betalingstermijn verstreken',
    tekst: 'De rekening is niet betaald. Je ontvangt een eerste (kosteloze) herinnering.',
  },
  {
    dag: 30,
    bedrag: 90.0,
    titel: 'Officiële aanmaning',
    tekst:
      'Er volgt een wettelijke aanmaning met incassokosten: 15% × €50 = €7,50, maar het wettelijk minimum van €40,- geldt. Schuld: €50 + €40 = €90,-.',
  },
  {
    dag: 45,
    bedrag: 104.5,
    titel: 'Overdracht aan incassobureau',
    tekst:
      'De vordering wordt overgedragen aan een incassobureau. Daar komen wettelijke rente en administratiekosten bovenop: schuld stijgt naar ongeveer €104,50.',
  },
  {
    dag: 60,
    bedrag: 120.0,
    titel: 'Dreiging BKR-registratie / deurwaarder',
    tekst:
      'Bij aanhoudende niet-betaling dreigt een negatieve kredietregistratie (BKR) en kunnen deurwaarderskosten volgen. Schuld inmiddels ruim €120,-, meer dan het dubbele van de oorspronkelijke €50,-.',
  },
]

export default function Escalatieladder() {
  const [stap, setStap] = useState(0)
  const fase = fases[stap]

  return (
    <div className="rounded-lg border border-border bg-pagebg p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Dag 0</span>
        <span>Dag 60</span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-docent transition-all"
          style={{ width: `${(fase.dag / 60) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-semibold text-docent">Dag {fase.dag}</p>
        <p className="mt-1 text-3xl font-extrabold text-slate-900">€{fase.bedrag.toFixed(2)}</p>
        <h3 className="mt-3 text-slate-900">{fase.titel}</h3>
        <p className="mt-2 text-slate-700">{fase.tekst}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {stap < fases.length - 1 ? (
          <button
            onClick={() => setStap((s) => Math.min(s + 1, fases.length - 1))}
            className="rounded-md bg-action px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Volgende fase →
          </button>
        ) : (
          <span className="rounded-md bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500">
            Einde van de ladder
          </span>
        )}
        <button
          onClick={() => setStap(0)}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ↺ Begin opnieuw
        </button>
      </div>
    </div>
  )
}
