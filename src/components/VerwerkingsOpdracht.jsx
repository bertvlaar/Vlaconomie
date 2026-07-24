import React from 'react'

/**
 * Actieve verwerkingsopdracht aan het einde van een les.
 * Vervangt het oude passieve "Schrijf dit op in je werkboekje"-blok door een
 * volwaardige opdracht met een duidelijke, professionele instructie.
 *
 * `titel`          = korte naam van de opdracht (bv. "Opdracht: ontleed een advertentie")
 * `werkboekPagina` = optioneel paginanummer in het downloadbare werkboek, voor wie op papier werkt
 * `instructie`     = korte openingszin die het doel/de werkwijze van de opdracht schetst
 */
export default function VerwerkingsOpdracht({ titel = 'Verwerkingsopdracht', werkboekPagina, instructie, children }) {
  return (
    <div className="mb-10 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-6 lg:p-8">
      <h3 className="mb-2 flex flex-wrap items-center gap-2 text-amber-900">
        📝 {titel}
        {werkboekPagina && (
          <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            werkboek p. {werkboekPagina}
          </span>
        )}
      </h3>
      {instructie && <p className="mb-3 text-sm font-medium text-amber-900/80">{instructie}</p>}
      <div className="space-y-2 text-slate-700">{children}</div>
    </div>
  )
}
