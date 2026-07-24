import React from 'react'
import PageShell from '../components/PageShell.jsx'

const planning = [
  { uur: 'Lesuur 1', inhoud: 'Les 1.1 + start Fase 1 project (enquête ontwerpen)' },
  { uur: 'Lesuur 2-3', inhoud: 'Les 1.2 + budgetlijn-simulator + rekenoefeningen 2F' },
  { uur: 'Lesuur 4', inhoud: 'Les 1.3 + escalatieladder; Fase 1 afronden (enquête afnemen)' },
  { uur: 'Lesuur 5', inhoud: 'Les 1.4 (data & debat) + start Fase 2 (survivalplan)' },
  { uur: 'Lesuur 6', inhoud: 'Werktijd Fase 2 + tussentijdse feedback' },
  { uur: 'Lesuur 7', inhoud: 'Eindquiz (diagnostisch) + start Fase 3 (campagne)' },
  { uur: 'Lesuur 8', inhoud: 'Presentaties Fase 3 + beoordeling met rubric' },
]

const kerndoelen = [
  {
    kd: 'Burgerschap · KD 4: Democratische cultuur & maatschappelijke betrokkenheid',
    tekst: 'leerlingen onderzoeken hoe commerciële en digitale actoren (platforms, BNPL-aanbieders) invloed hebben op keuzes en maatschappelijke vraagstukken (Les 1.1, 1.4, debat).',
  },
  {
    kd: 'Burgerschap · KD 6: Duurzame en solidaire samenleving / omgaan met schaarste',
    tekst: 'leerlingen redeneren over verdeling van schaarse middelen, koopkracht en de gevolgen van schulden voor deelname aan de samenleving (Les 1.2, 1.3, 1.4).',
  },
  {
    kd: 'Digitale geletterdheid · KD 3: Data, algoritmen en artificiële intelligentie',
    tekst: 'leerlingen leggen uit hoe algoritmes op TikTok/Klarna gegevens gebruiken om koopgedrag te sturen (Les 1.1, project fase 1).',
  },
  {
    kd: 'Digitale geletterdheid · KD 5: Digitaal burgerschap & mediawijsheid',
    tekst: 'leerlingen herkennen nudging en manipulatieve ontwerpkeuzes en nemen daar een onderbouwd standpunt over in (Les 1.1, quiz, debat).',
  },
  {
    kd: 'Rekenen/Wiskunde · KD 2 (verhoudingen & procenten)',
    tekst: 'leerlingen rekenen met procenten (btw 9/21%, WIK-incassokosten, inflatie/koopkracht) in een realistische context (Les 1.2, 1.3, simulator).',
  },
  {
    kd: 'Nederlands · KD 7 (argumenteren & standpunt innemen)',
    tekst: 'leerlingen bouwen in het debat en de campagne (fase 3) een onderbouwde argumentatie op basis van economische data en bronnen (Les 1.4, project fase 3).',
  },
]

export default function VoorDeDocent() {
  return (
    <PageShell tint>
      <div className="mb-8 flex items-center gap-3">
        <span className="rounded-md bg-docent px-3 py-1 text-sm font-bold text-white">Docentenpagina</span>
      </div>
      <h1 className="mb-8 text-slate-900">🧑‍🏫 Voor de docent: leerdoelen, planning &amp; toetsing</h1>

      <section className="mb-10 rounded-xl border border-red-100 bg-white p-6 lg:p-8">
        <h2 className="mb-4 text-slate-900">Leerdoelen</h2>
        <p className="mb-3 text-slate-700">De leerling kan na dit thema:</p>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          <li>het onderscheid tussen behoeften en middelen toepassen op een digitale koopomgeving;</li>
          <li>uitleggen wat nudging is en herkennen hoe dit consumentengedrag beïnvloedt;</li>
          <li>
            een budgetlijn tekenen, aflezen en de verschuiving ervan verklaren bij prijs-, btw- en
            inkomensveranderingen;
          </li>
          <li>het verschil tussen nominaal en reëel inkomen (koopkracht) toepassen in rekenopgaven;</li>
          <li>
            uitleggen waarom achteraf betalen een vorm van krediet is en de gevolgen van wanbetaling
            (procentueel) berekenen;
          </li>
          <li>
            data over jongerenschulden kritisch interpreteren en een onderbouwd standpunt innemen in een
            maatschappelijk debat over fintech-regulering.
          </li>
        </ul>
      </section>

      <section className="mb-10 rounded-xl border border-red-100 bg-white p-6 lg:p-8">
        <h2 className="mb-4 text-slate-900">Lesplanning (4 weken · 8 lesuren)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {planning.map((p) => (
                <tr key={p.uur} className="border-b border-border">
                  <td className="w-40 py-3 pr-4 font-semibold text-docent">{p.uur}</td>
                  <td className="py-3 text-slate-700">{p.inhoud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 rounded-xl border border-red-100 bg-white p-6 lg:p-8">
        <h2 className="mb-4 text-slate-900">Toetsing</h2>
        <p className="text-slate-700">
          De <strong>eindquiz</strong> is diagnostisch (geen cijfer); het <strong>project</strong> telt
          als praktische opdracht/SO via de rubric op de projectpagina. Overweeg een aparte theorietoets
          over de begrippen in de infoboxen.
        </p>
      </section>

      <section className="mb-10 rounded-xl border border-red-100 bg-white p-6 lg:p-8">
        <h2 className="mb-4 text-slate-900">📎 Aansluiting bij de nieuwe conceptkerndoelen onderbouw</h2>
        <p className="mb-4 text-slate-700">
          Deze module dekt (delen van) de volgende nieuwe conceptkerndoelen onderbouw (SLO, actualisatie
          2024/2025). De kerndoelen voor het leergebied Mens &amp; Maatschappij zijn nog in ontwikkeling;
          hieronder de vastgestelde leergebieden waar dit thema expliciet aan raakt.
        </p>
        <ul className="space-y-3 text-slate-700">
          {kerndoelen.map((k) => (
            <li key={k.kd}>
              <strong>{k.kd}</strong>: {k.tekst}
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
