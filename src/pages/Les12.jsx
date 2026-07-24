import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import Leerdoelen from '../components/Leerdoelen.jsx'
import InfoBox from '../components/InfoBox.jsx'
import VerwerkingsOpdracht from '../components/VerwerkingsOpdracht.jsx'

import OefenBank from '../components/OefenBank.jsx'
import RekenOpdracht from '../components/RekenOpdracht.jsx'
import BudgetlijnSimulator from '../components/BudgetlijnSimulator.jsx'
import oefenbankLes12 from '../data/oefenbankLes12.js'
import rekenLes12 from '../data/rekenLes12.js'

export default function Les12() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Les 1.2</p>
      <h1 className="mb-8 text-slate-900">Jouw budget en de dynamische budgetlijn</h1>

      <Leerdoelen>
        Je tekent en leest een budgetlijn af en verklaart de verschuiving ervan bij prijs- en
        inkomensveranderingen.
      </Leerdoelen>

      <Section title="Kerntheorie">
        <p className="mb-4 text-slate-700">
          Stel: je hebt €60,- te besteden aan twee dingen die je leuk vindt op een TikTok-shop:
          kleding en accessoires. Elke euro die je aan kleding uitgeeft, kun je niet meer aan
          accessoires uitgeven. Deze afruil kunnen we heel precies in beeld brengen met een{' '}
          <strong>budgetlijn</strong>.
        </p>

        <InfoBox type="definitie" title="Definitie: budgetlijn">
          <p>
            Een <strong>budgetlijn</strong> is een lijn in een grafiek die laat zien welke combinaties
            van twéé producten je precies kunt kopen als je al je geld uitgeeft.
          </p>
          <p>
            <strong>De formule:</strong> Budget = Px × x + Py × y
          </p>
          <p>
            <strong>Voorbeeld:</strong> Budget €60, kleding €20, accessoires €10. Alléén kleding? Dan
            max 60/20 = 3 stuks. Alléén accessoires? Dan 60/10 = 6 stuks. De budgetlijn verbindt die
            twee uitersten.
          </p>
        </InfoBox>

        <p className="mb-6 text-slate-700">
          Er is een belangrijk verschil tussen <strong>nominaal inkomen</strong> (het bedrag in euro's
          op je rekening) en <strong>reëel inkomen</strong> (wat je er écht mee kunt kopen). Als alle
          prijzen stijgen maar je zakgeld gelijk blijft, kun je met diezelfde €60,- minder producten
          kopen dan vorig jaar. Dat noemen we een daling van je <strong>koopkracht</strong>.
        </p>

        <InfoBox type="definitie" title="Formule: koopkracht (reëel inkomen)">
          <p>Reëel inkomen = (Nominaal inkomen / Prijsindexcijfer) × 100</p>
          <p>
            Het <strong>prijsindexcijfer</strong> laat zien hoe duur het leven is geworden vergeleken
            met een basisjaar (basisjaar = 100).
          </p>
          <p>
            <strong>Voorbeeld:</strong> Je zakgeld is €60 (nominaal). De prijzen zijn 10% gestegen
            (indexcijfer 110). Reëel inkomen = (60 / 110) × 100 ≈ <strong>€54,55</strong>.
          </p>
        </InfoBox>

        <InfoBox type="vwo" title="VWO-Challenge: welvaart in ruime zin en de helling">
          <p>
            De <strong>helling</strong> van de budgetlijn is de prijsverhouding Px/Py: de{' '}
            <strong>opofferingskosten</strong> van kleding, uitgedrukt in accessoires. Economen spreken
            van <strong>welvaart in ruime zin</strong> wanneer ze naast materiële welvaart ook
            niet-materiële zaken meewegen zoals vrije tijd, gezondheid en mentale rust.
          </p>
        </InfoBox>
      </Section>

      <Section title="Praktijk" eyebrow="Interactieve simulator">
        <p className="mb-4 text-slate-700">
          Verschuif de sliders en zie live hoe de budgetlijn kantelt of verschuift.
        </p>
        <BudgetlijnSimulator />
      </Section>

      <VerwerkingsOpdracht
        titel="Opdracht: bereken en teken je eigen budgetlijn"
        werkboekPagina="9"
        instructie="Voer onderstaande stappen uit en lever je berekening en tekening in bij je docent."
      >
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Leg in je eigen woorden uit wat de formule van de <strong>budgetlijn</strong> betekent en
            wat elk onderdeel voorstelt.
          </li>
          <li>
            Kies zelf een budget en twee producten met bijpassende prijzen (bijvoorbeeld twee soorten
            sneakers of twee soorten concerttickets).
          </li>
          <li>
            Bereken met de formule minstens drie combinaties van beide producten die precies binnen je
            budget passen.
          </li>
          <li>
            Teken je budgetlijn op basis van deze combinaties, met correct benoemde assen.
          </li>
        </ol>
      </VerwerkingsOpdracht>

      <OefenBank lesTitel="Les 1.2" opdrachten={oefenbankLes12} />

      <section className="mb-10">
        <h2 className="mb-1 text-slate-900">🧮 Extra rekenoefeningen (niveau 2F)</h2>
        <p className="mb-6 text-sm text-slate-500">
          {rekenLes12.length} basisrekenvaardigheden met geld, procenten en verhoudingen.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {rekenLes12.map((r) => (
            <RekenOpdracht key={r.nummer} {...r} />
          ))}
        </div>
      </section>

      
    </PageShell>
  )
}
