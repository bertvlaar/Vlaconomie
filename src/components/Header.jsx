import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/thema-1', label: 'Start' },
  { to: '/thema-1/les-1-1', label: 'Les 1.1' },
  { to: '/thema-1/les-1-2', label: 'Les 1.2' },
  { to: '/thema-1/les-1-3', label: 'Les 1.3' },
  { to: '/thema-1/les-1-4', label: 'Les 1.4' },
  { to: '/thema-1/begrippenlijst', label: 'Begrippenlijst' },
  { to: '/thema-1/extra-rekenopdrachten', label: 'Rekenopdrachten' },
  { to: '/thema-1/eindquiz', label: 'Eindquiz' },
  { to: '/thema-1/project', label: 'Project' },
  { to: '/thema-1/voor-de-docent', label: 'Voor de docent', accent: true },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      {/* Let op: deze balk gebruikt bewust een ruimere breedte dan max-w-content
          (de leesbreedte van de pagina's), omdat er logo + badge + 8 tabs +
          downloadknop in passen moeten. De nav zelf heeft daarnaast een
          overflow-x-auto vangnet, zodat tabs bij weinig ruimte horizontaal
          scrollen in plaats van over elkaar heen te vallen. */}
      <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-4 py-3 lg:px-6 xl:gap-6">
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-header"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Alle thema's</span>
          </Link>
          <span className="hidden h-5 w-px shrink-0 bg-slate-200 sm:block" aria-hidden="true" />
          <Link
            to="/thema-1"
            className="shrink-0 text-base font-bold leading-none tracking-tight text-header transition-colors hover:text-flashdark"
          >
            Thema 1
          </Link>
          <span className="hidden shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium leading-none text-slate-500 xl:inline-block">
            Havo/Vwo onderbouw
          </span>
        </div>

        {/* Desktop nav: scrollt horizontaal i.p.v. te overlappen als de breedte krap is */}
        <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  link.accent
                    ? isActive
                      ? 'bg-docent/10 text-docent'
                      : 'text-docent/80 hover:bg-docent/10 hover:text-docent'
                    : isActive
                    ? 'bg-slate-100 text-header'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-header',
                ].join(' ')
              }
              end={link.to === '/thema-1'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <a
          href="/downloads/werkboekje-klarnacomie.pdf"
          className="hidden shrink-0 items-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 lg:flex"
        >
          📥 Download Werkboek (PDF)
        </a>

        {/* Mobile menu button */}
        <button
          className="ml-auto shrink-0 rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Menu openen of sluiten"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            <span className="mb-1 mt-1 inline-block w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-500">
              Havo/Vwo onderbouw
            </span>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 text-sm font-medium',
                    link.accent
                      ? 'text-docent hover:bg-docent/10'
                      : isActive
                      ? 'bg-slate-100 text-header'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-header',
                  ].join(' ')
                }
                end={link.to === '/thema-1'}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="/downloads/werkboekje-klarnacomie.pdf"
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-white"
            >
              📥 Download Werkboek (PDF)
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
