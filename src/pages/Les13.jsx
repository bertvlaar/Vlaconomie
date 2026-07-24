import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import Leerdoelen from '../components/Leerdoelen.jsx'
import InfoBox from '../components/InfoBox.jsx'
import VerwerkingsOpdracht from '../components/VerwerkingsOpdracht.jsx'

import OefenBank from '../components/OefenBank.jsx'
import RekenOpdracht from '../components/RekenOpdracht.jsx'
import Escalatieladder from '../components/Escalatieladder.jsx'
import oefenbankLes13 from '../data/oefenbankLes13.js'
import rekenLes13 from '../data/rekenLes13.js'

export default function Les13() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Les 1.3</p>
      <h1 className="mb-8 text-slate-900">De financiële kater: krediet en de escalatieladder</h1>

      <Leerdoelen>
        Je legt uit waarom BNPL krediet is en berekent de procentuele stijging van een schuld door
        boetes en incassokosten.
      </Leerdoelen>

      <Section title="Kerntheorie">
        <p className="mb-4 text-slate-700">
          Bij diensten als Klarna kun je iets bestellen en pas 14 of 30 dagen later betalen. Dit heet{' '}
          <strong>Buy Now, Pay Later (BNPL)</strong>: "koop nu, betaal later". Economisch gezien is dit
          een vorm van <strong>krediet</strong>: je leent (tijdelijk) geld van Klarna en belooft het
          later terug te betalen. Ook al zie je geen rente, het blíjft een lening.
        </p>
        <p className="mb-6 text-slate-700">
          Wat hier gebeurt noemen economen een <strong>ruil over de tijd</strong>: je haalt consumptie
          van later naar nu, maar je koopkracht van morgen wordt kleiner. Het probleem ontstaat als je
          de betaaldatum vergeet, of het geld op dat moment simpelweg niet hebt.
        </p>

        <InfoBox type="juridisch" title="Juridisch: BNPL wordt gereguleerd krediet (CCD2, vanaf november 2026)">
          <p>
            Tot nu toe hoefden Klarna en concurrenten zich niet aan de gewone kredietregels te houden.
            Dat verandert. De herziene richtlijn <strong>CCD2</strong> brengt BNPL vanaf{' '}
            <strong>20 november 2026</strong> onder dezelfde regels als andere leningen: Klarna moet
            vooraf checken of je het wel kunt terugbetalen, moet duidelijk alle kosten laten zien, en
            jongeren onder de 18 krijgen extra bescherming.
          </p>
        </InfoBox>

        <InfoBox type="definitie" title="Formule: procentuele verandering">
          <p>% verandering = (Nieuw − Oud) / Oud × 100%</p>
          <p>
            <strong>Rekenvoorbeeld: de jas van €90.</strong> Betaal je te laat, dan gelden wettelijke
            incassokosten van 15% × €90 = €13,50, maar het wettelijk minimum is €40,-. De schuld wordt
            €90 + €40 = €130. Stijging: (130 − 90)/90 × 100% ≈ <strong>44,4%</strong>.
          </p>
          <p>
            <strong>Rekenvoorbeeld: de schuld van €40.</strong> Bij een hoofdsom van €40,- is 15%
            slechts €6,-, maar door het minimum van €40,- verdubbelt je schuld naar €80,-. Hoe kleiner
            het originele bedrag, hoe zwaarder het minimumtarief tikt.
          </p>
        </InfoBox>

        <InfoBox type="vwo" title="VWO-Challenge: welvaart in ruime zin & registraties">
          <p>
            Een oplopende schuld raakt niet alleen je portemonnee. Stress beïnvloedt je slaap en
            concentratie, allemaal onderdelen van <strong>welvaart in ruime zin</strong>. Een negatieve
            BKR-registratie kan jaren later nog een telefoonabonnement, autolening of hypotheek
            bemoeilijken.
          </p>
        </InfoBox>
      </Section>

      <Section title="Praktijk" eyebrow="Interactieve simulator">
        <p className="mb-4 text-slate-700">
          Een gemiste betaling van €50,- kan in 60 dagen tijd flink oplopen. Klik door de fases heen.
        </p>
        <Escalatieladder />
      </Section>

      <VerwerkingsOpdracht
        titel="Opdracht: analyseer een oplopende schuld"
        werkboekPagina="14"
        instructie="Voer onderstaande stappen uit en noteer je berekening en antwoord."
      >
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Leg uit waarom "achteraf betalen" economisch gezien een vorm van <strong>krediet</strong>{' '}
            is. Gebruik het begrip <strong>ruil over de tijd</strong> in je antwoord.
          </li>
          <li>Kies zelf een startbedrag tussen €30,- en €100,- voor een gemiste betaling.</li>
          <li>
            Bereken met de formule voor <strong>procentuele verandering</strong> hoe dit bedrag oploopt
            na een aanmaning en na incassokosten, aan de hand van de escalatieladder hierboven.
          </li>
          <li>
            Beantwoord: bij welke stap van de escalatieladder loopt de schuld verhoudingsgewijs het
            hardst op, en waarom?
          </li>
        </ol>
      </VerwerkingsOpdracht>

      <OefenBank lesTitel="Les 1.3" opdrachten={oefenbankLes13} />

      <section className="mb-10">
        <h2 className="mb-1 text-slate-900">🧮 Extra rekenoefeningen (niveau 2F)</h2>
        <p className="mb-6 text-sm text-slate-500">
          {rekenLes13.length} basisrekenvaardigheden met schulden, boetes en procenten.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {rekenLes13.map((r) => (
            <RekenOpdracht key={r.nummer} {...r} />
          ))}
        </div>
      </section>

      
    </PageShell>
  )
}
