import React, { useState } from 'react'

/**
 * Numerieke rekenopdracht met directe feedback.
 * `antwoord` = correcte waarde (getal), `eenheid` = bv. '€' of '%' of 'weken'
 * `tolerantie` = toegestane afwijking (default 0.01)
 */
export default function RekenOpdracht({ nummer, niveau, vraag, antwoord, eenheid = '€', tolerantie = 0.01, uitleg }) {
  const [invoer, setInvoer] = useState('')
  const [status, setStatus] = useState(null) // null | 'goed' | 'fout'
  const [toonUitleg, setToonUitleg] = useState(false)

  const check = () => {
    const normalized = invoer.replace(',', '.').replace(/[^\d.\-]/g, '')
    const waarde = parseFloat(normalized)
    if (isNaN(waarde)) {
      setStatus('fout')
      return
    }
    if (Math.abs(waarde - antwoord) <= tolerantie) {
      setStatus('goed')
    } else {
      setStatus('fout')
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="font-medium text-slate-800">
          <span className="mr-1 text-slate-400">{nummer}.</span> {vraag}
        </p>
        {niveau && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              niveau === '3F' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {niveau}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">{eenheid !== '%' ? eenheid : ''}</span>
        <input
          type="text"
          inputMode="decimal"
          value={invoer}
          onChange={(e) => {
            setInvoer(e.target.value)
            setStatus(null)
          }}
          placeholder="jouw antwoord"
          className="w-32 rounded-md border border-border bg-pagebg p-2 text-sm text-slate-800 focus:border-blue-500"
        />
        {eenheid === '%' && <span className="text-sm text-slate-500">%</span>}
        <button
          onClick={check}
          className="rounded-md bg-action px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Check
        </button>
      </div>

      {status === 'goed' && (
        <p className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800">
          ✅ Goed! Dat klopt.
        </p>
      )}
      {status === 'fout' && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-medium">❌ Nog niet helemaal goed. Controleer je berekening.</p>
          <button
            onClick={() => setToonUitleg((v) => !v)}
            className="mt-2 text-xs font-semibold text-red-700 underline underline-offset-2"
          >
            {toonUitleg ? 'Verberg uitleg' : 'Toon uitleg'}
          </button>
          {toonUitleg && <p className="mt-2 text-slate-700">{uitleg}</p>}
        </div>
      )}
    </div>
  )
}
