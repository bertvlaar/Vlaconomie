import React from 'react'
import { Link } from 'react-router-dom'
import themas from '../data/themas.js'

function ThemaKaart({ thema }) {
  const isLive = thema.status === 'live'
  const code = `THEMA·${String(thema.nummer).padStart(2, '0')}/10`

  const inner = (
    <>
      <div className="flex items-start justify-between">
        <span
          className={
            isLive
              ? 'inline-block h-6 w-9 rounded-[4px] bg-white/25'
              : 'inline-block h-6 w-9 rounded-[4px] border border-dashed border-slate-300'
          }
          aria-hidden="true"
        />
        {isLive ? (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white">
            Nu open
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            🔒 Binnenkort
          </span>
        )}
      </div>

      <p className={isLive ? 'mt-6 font-mono text-[11px] tracking-widest text-white/70' : 'mt-6 font-mono text-[11px] tracking-widest text-slate-400'}>
        {code}
      </p>
      <h3 className={isLive ? 'mt-1 font-display text-xl font-semibold text-white' : 'mt-1 font-display text-xl font-semibold text-slate-400'}>
        {thema.titel}
      </h3>
      <p className={isLive ? 'mt-1 text-sm text-white/85' : 'mt-1 text-sm text-slate-400'}>
        {thema.ondertitel}
      </p>

      {isLive && (
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white">
          Start dit thema
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      )}
    </>
  )

  const baseClasses =
    'group relative flex h-full flex-col rounded-2xl border p-5 transition-all duration-200'

  if (isLive) {
    return (
      <Link
        to={thema.to}
        className={`${baseClasses} border-transparent bg-gradient-to-br from-flash to-flashdark shadow-lg shadow-flash/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-flash/30`}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      className={`${baseClasses} cursor-not-allowed border-dashed border-slate-300 bg-white opacity-80`}
      aria-disabled="true"
    >
      {inner}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-pagebg">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-pagebg">
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-flash/10 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-[-5%] h-72 w-72 rounded-full bg-sky-300/20 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-content px-4 pt-8 lg:px-6">
          <span className="font-display text-lg font-bold tracking-tight text-header">
            Vlaconomie
          </span>
        </div>

        <header className="relative mx-auto max-w-content px-4 pb-24 pt-10 lg:px-6 lg:pb-28 lg:pt-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-flashdark">
            Economie onderbouw havo/vwo
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-header sm:text-5xl">
            Economie zoals jij 'm tegenkomt: scrollend, swipend en sparend.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Vlaconomie is een lesmethode economie voor de onderbouw havo en vwo, opgebouwd rond tien
            herkenbare thema's uit jouw eigen leven, van achteraf betalen tot je eerste bijbaantje.
            Elk thema is een compleet pakket: uitleg, opdrachten, rekenwerk en een eindquiz.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              🤖 Gemaakt door AI
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              ✅ Gecontroleerd door docenten
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              🎓 Onderbouw havo/vwo · economie
            </span>
          </div>
        </header>
      </div>

      {/* Verhaal: overlapt de rand tussen hero en pagina voor diepte */}
      <section className="relative mx-auto -mt-14 max-w-content px-4 lg:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 lg:p-8">
          <h2 className="font-display text-xl font-semibold text-header">Hoe deze methode ontstaat</h2>
          <p className="mt-3 text-slate-600">
            Elk thema wordt eerst volledig uitgewerkt door AI: de lesstof, de opdrachten, de
            rekenvragen en de eindquiz. Daarna gaat het pakket langs een docent economie, die
            controleert of alles klopt en aansluit bij het niveau van de onderbouw havo/vwo. Pas
            dan komt een thema live. Zo bouwen we snel én betrouwbaar aan een complete methode.
          </p>
        </div>
      </section>

      {/* Thema's */}
      <section className="mx-auto max-w-content px-4 py-10 lg:px-6 lg:py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold text-header">Kies je thema</h2>
          <span className="font-mono text-xs text-slate-400">1 / 10 beschikbaar</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {themas.map((thema) => (
            <ThemaKaart key={thema.nummer} thema={thema} />
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
        Vlaconomie: economie voor de onderbouw havo/vwo ·{' '}
        <Link to="/thema-1/voor-de-docent" className="underline underline-offset-2 hover:text-header">
          Informatie voor docenten
        </Link>
      </footer>
    </div>
  )
}
