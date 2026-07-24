import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import Leerdoelen from '../components/Leerdoelen.jsx'
import InfoBox from '../components/InfoBox.jsx'
import VerwerkingsOpdracht from '../components/VerwerkingsOpdracht.jsx'

import OefenBank from '../components/OefenBank.jsx'
import oefenbankLes14 from '../data/oefenbankLes14.js'

const tabel = [
  { leeftijd: '12-14 jaar', besteedbaar: '€30-€40', achterstand: '±3%', schuld: '€40-€60' },
  { leeftijd: '15-17 jaar', besteedbaar: '€70-€90', achterstand: '±8%', schuld: '€100-€150' },
  { leeftijd: '18-20 jaar (mbo/hbo, thuiswonend)', besteedbaar: '€280-€340', achterstand: '±17%', schuld: '€350-€500' },
  { leeftijd: '21-23 jaar (mbo/hbo, deels uitwonend)', besteedbaar: '€450-€520', achterstand: '±21%', schuld: '€600-€800' },
]

const stellingen = [
  {
    titel: '"Achteraf betalen onder de 18 jaar moet wettelijk verboden worden."',
    voor: [
      'Minderjarigen hebben nog geen volledig ontwikkeld risicobesef bij financiële beslissingen.',
      'Het voorkomt dat jongeren al vroeg een negatieve kredietregistratie opbouwen.',
      'Het beschermt tegen agressieve marketing gericht op jongeren.',
    ],
    tegen: [
      'Een verbod leert jongeren niet hóe ze verantwoord met krediet omgaan.',
      'Jongeren kunnen alsnog via omwegen (bijvoorbeeld ouders) achteraf betalen.',
      'Het beperkt de vrijheid van jongeren die wél verantwoord met geld omgaan.',
    ],
  },
  {
    titel: '"Fintech-bedrijven zoals Klarna moeten verplicht een duidelijke waarschuwing tonen vóór elke aankoop."',
    voor: [
      'Consumenten worden op het beslissende moment aan de risico\'s herinnerd.',
      'Analoog aan waarschuwingen bij gokken of alcohol.',
      'Verhoogt de transactiekosten net genoeg om overhaaste aankopen te verminderen.',
    ],
    tegen: [
      'Mensen wennen snel aan standaardwaarschuwingen en klikken ze weg (waarschuwings-moeheid).',
      'Het legt de verantwoordelijkheid eenzijdig bij de consument.',
      'Extra stappen vertragen legitieme, weloverwogen aankopen.',
    ],
  },
  {
    titel: '"Scholen moeten financiële geletterdheid als verplicht examenvak invoeren."',
    voor: [
      'Financiële beslissingen raken iedereen, ongeacht vervolgopleiding.',
      'Vroege kennis voorkomt problematische schulden later in het leven.',
      'Het compenseert verschillen tussen leerlingen in de thuisomgeving.',
    ],
    tegen: [
      'Het lesprogramma is al vol; een nieuw vak gaat ten koste van andere.',
      'Financiële geletterdheid kan geïntegreerd worden in bestaande vakken.',
      'Kennis alleen verandert niet automatisch gedrag.',
    ],
  },
]

export default function Les14() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Les 1.4</p>
      <h1 className="mb-8 text-slate-900">Nibud data-analyse &amp; debathal</h1>

      <Leerdoelen>
        Je interpreteert data kritisch en onderbouwt een standpunt in een debat over
        fintech-regulering.
      </Leerdoelen>

      <Section title="Kerntheorie">
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          ⚠️ <strong>Bronvermelding vereist:</strong> onderstaande cijfers zijn illustratieve
          richtgetallen gebaseerd op patronen uit Nibud-onderzoek. Ze zijn géén letterlijke publicatie.
          Docent: controleer en actualiseer vóór gebruik via nibud.nl/onderzoeksrapporten.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-slate-500">
                <th className="py-2 pr-4">Leeftijdscategorie</th>
                <th className="py-2 pr-4">Besteedbaar/maand</th>
                <th className="py-2 pr-4">% met achterstand</th>
                <th className="py-2 pr-4">Gem. schuld bij achterstand</th>
              </tr>
            </thead>
            <tbody>
              {tabel.map((r) => (
                <tr key={r.leeftijd} className="border-b border-border">
                  <td className="py-2 pr-4 font-medium text-slate-800">{r.leeftijd}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.besteedbaar}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.achterstand}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.schuld}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Praktijk" eyebrow="Data-analyse & debat">
        <h3 className="mb-3 text-slate-900">🔍 Data-analysevragen</h3>
        <ol className="mb-8 list-decimal space-y-2 pl-5 text-slate-700">
          <li>
            Welk patroon zie je tussen leeftijd en het percentage jongeren met een achterstallige
            betaling? Bedenk een verklaring.
          </li>
          <li>
            Vergelijk de verhouding tussen 'gemiddeld besteedbaar bedrag' en 'gemiddelde schuld bij
            achterstand' tussen 15-17 jaar en 18-20 jaar.
          </li>
          <li>Deze tabel toont gemiddeldes. Welke valkuil zit hierin?</li>
        </ol>

        <h3 className="mb-3 text-slate-900">🗣️ De Debathal</h3>
        <p className="mb-4 text-slate-700">
          Kies een stelling, verdeel de klas in voor/tegen, en debatteer met onderstaande argumenten
          als startpunt.
        </p>
        <div className="space-y-6">
          {stellingen.map((s, i) => (
            <div key={i} className="rounded-lg border border-border bg-white p-5">
              <h3 className="mb-3 text-slate-900">Stelling {i + 1}: {s.titel}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-green-700">Vóór</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {s.voor.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-docent">Tegen</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {s.tegen.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <VerwerkingsOpdracht
        titel="Opdracht: trek een conclusie en kies een standpunt"
        werkboekPagina="19"
        instructie="Voer onderstaande stappen uit en bereid je voor om je standpunt kort te verdedigen in de klas."
      >
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Formuleer één conclusie die je uit de Nibud-tabel trekt, met een verklaring waarom dit
            patroon volgens jou ontstaat.
          </li>
          <li>Kies één van de drie stellingen uit de Debathal.</li>
          <li>
            Bepaal je standpunt (eens/oneens) en onderbouw dit met minimaal twee eigen economische
            argumenten.
          </li>
          <li>
            Formuleer ook een tegenargument dat een klasgenoot zou kunnen geven, en leg uit waarom jij
            dat argument wel of niet overtuigend vindt.
          </li>
        </ol>
      </VerwerkingsOpdracht>

      <OefenBank lesTitel="Les 1.4" opdrachten={oefenbankLes14} />

      
    </PageShell>
  )
}
