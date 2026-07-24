import React from 'react'
import PageShell from '../components/PageShell.jsx'
import Section from '../components/Section.jsx'
import Leerdoelen from '../components/Leerdoelen.jsx'
import InfoBox from '../components/InfoBox.jsx'
import VerwerkingsOpdracht from '../components/VerwerkingsOpdracht.jsx'

import OefenBank from '../components/OefenBank.jsx'
import oefenbankLes11 from '../data/oefenbankLes11.js'

export default function Les11() {
  return (
    <PageShell>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Les 1.1</p>
      <h1 className="mb-8 text-slate-900">De algoritmische verleiding &amp; nudging</h1>

      <Leerdoelen>
        Je legt uit hoe nudging inspeelt op behoeften en middelen, en herkent dit in een concreet
        voorbeeld.
      </Leerdoelen>

      <Section title="Kerntheorie">
        <p className="mb-4 text-slate-700">
          Open TikTok en binnen drie video's staat er een shop-icoontje op je scherm dat exact het
          truitje toont waar je gisteren toevallig even naar keek op Instagram. Toeval? Nee: een
          algoritme. Elke like, elke seconde kijktijd, elke swipe wordt geregistreerd en gebruikt om
          jou het product te tonen waarvan het systeem inschat dat jíj het meest waarschijnlijk koopt.
          Dat is geen samenzwering, het is gewoon slimme <strong>marketing</strong>: bedrijven proberen
          hun product zo te <strong>promoten</strong> en te <strong>presenteren</strong> dat het perfect
          aansluit bij jouw persoonlijke <strong>behoeften</strong>.
        </p>
        <p className="mb-6 text-slate-700">
          En daar zit het economische probleem. Jouw behoeften zijn in principe onbegrensd: je kunt
          altijd nóg iets leuks bedenken om te willen hebben. Maar jouw <strong>middelen</strong> (je
          geld, je tijd, je spaargeld) zijn beperkt. Dat spanningsveld tussen onbegrensde behoeften en
          schaarse middelen is de kern van alle economie, en TikTok-shops zijn ontworpen om precies op
          dat spanningsveld te drukken. Hoe? Via <strong>nudging</strong>.
        </p>

        <InfoBox type="definitie" title="Definitie: de marketingmix (4 P's)">
          <p>
            De marketingmix is de set knoppen waaraan een bedrijf kan draaien om jou tot koper te
            maken. De basis bestaat uit vier P's:
          </p>
          <p>
            <strong>1. Product</strong>: wát je verkoopt en hoe het eruitziet, voelt of werkt.
            <br />
            <strong>2. Prijs</strong>: hoeveel het kost, én de trucs eromheen: kortingen,
            "van/voor"-prijzen, betalen in termijnen via Klarna.
            <br />
            <strong>3. Plaats</strong>: wáár je het kunt kopen: nu vooral een TikTok-shop of webshop,
            24/7 bereikbaar in je broekzak.
            <br />
            <strong>4. Promotie</strong>: hoe het bedrijf jouw aandacht trekt: reclame, influencers,
            en het <strong>algoritme</strong> dat bepaalt welke video jij te zien krijgt.
          </p>
          <p>
            👉 Bij een TikTok-shop grijpt het algoritme vooral in op <strong>Promotie</strong> en op{' '}
            <strong>Plaats</strong>.
          </p>
        </InfoBox>

        <InfoBox type="verdieping" title="Verdieping: de 7 P's (voor diensten)">
          <p>
            Bij een dienst (bv. Klarna zelf) voegen marketeers drie extra P's toe:
          </p>
          <p>
            <strong>5. Personeel (People)</strong>: de mensen die de dienst leveren of gezicht geven.
            <br />
            <strong>6. Proces</strong>: de stappen die jij als klant doorloopt. Eén knop "Koop nu met
            Klarna" is een proces dat expres zo kort mogelijk is gemaakt.
            <br />
            <strong>7. Presentatie (Physical evidence)</strong>: de tastbare bewijzen dat de dienst
            betrouwbaar is: een strakke website, reviews met sterren, keurmerken.
          </p>
          <p>
            💡 Als je herkent aan wélke P een bedrijf draait om jou te overtuigen, kun je bewuster
            kiezen of je écht wilt kopen, of alleen wordt geduwd door slimme marketing.
          </p>
        </InfoBox>

        <InfoBox type="definitie" title="Definitie: nudging">
          <p>
            Nudging betekent letterlijk "een duwtje geven": de manier waarop een bedrijf of overheid,
            zonder je iets te verbieden of te verplichten, je gedrag toch subtiel stuurt. Denk aan een
            aftellende timer, een rode "Koop nu, 1 klik"-knop of een tevredenheids-review die precies
            op het juiste moment verschijnt.
          </p>
          <p>
            Normaal denk je bij een grotere aankoop na: heb ik dit wel echt nodig? Dat noemen we{' '}
            <strong>rationeel</strong> keuzegedrag. Een 1-klik-koopknop is precies ontworpen om die
            denkstap te omzeilen. Het resultaat is een <strong>impulsaankoop</strong>.
          </p>
        </InfoBox>

        <InfoBox type="vwo" title="VWO-Challenge: transactiekosten en consumentensurplus">
          <p>
            Economen gebruiken de term <strong>transactiekosten</strong> voor alle moeite, tijd en
            energie die het kost om tot een aankoop te komen. Een 1-klik-koopknop verlaagt de
            transactiekosten tot bijna nul.
          </p>
          <p>
            Platformen weten via jouw data ongeveer hoeveel jij bereid bent te betalen (
            <strong>betalingsbereidheid</strong>). Perfecte prijsdiscriminatie kan het{' '}
            <strong>consumentensurplus</strong> (jouw voordeeltje) volledig naar het bedrijf
            verschuiven.
          </p>
        </InfoBox>
      </Section>

      <Section title="Praktijk" eyebrow="Interactieve opdracht">
        <p className="mb-3 text-slate-700">
          Open (in gedachten of echt, als het mag van je docent) een social-media-app met een
          shop-functie. Bekijk drie video's of advertenties die je krijgt voorgeschoteld.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          <li>Noteer welk nudging-element je herkent (timer, voorraadmelding, 1-klik-knop, reviews...).</li>
          <li>Bepaal bij elk voorbeeld welke van de 7 P's het sterkst wordt ingezet.</li>
          <li>Bespreek met je buurman/buurvrouw: werkte de nudge bij jou? Waarom wel of niet?</li>
        </ul>
      </Section>

      <VerwerkingsOpdracht
        titel="Opdracht: ontleed een TikTok-advertentie"
        werkboekPagina="4"
        instructie="Voer onderstaande stappen uit en werk je antwoorden uit in je werkboekje of schrift."
      >
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Beschrijf in je eigen woorden wat <strong>nudging</strong> betekent en welke nudge je
            herkent in de advertentie die je bij "Praktijk" hebt bekeken.
          </li>
          <li>
            Vul voor diezelfde advertentie de <strong>4 P's</strong> van de marketingmix in (Product,
            Prijs, Plaats, Promotie), met bij elke P een concreet voorbeeld uit de advertentie.
          </li>
          <li>
            Formuleer een advies: welke aanpassing zou de aanbieder kunnen maken om de nudge nóg
            sterker te maken, en welke aanpassing zou jou juist weerbaarder maken tegen deze nudge?
          </li>
        </ol>
      </VerwerkingsOpdracht>

      <OefenBank lesTitel="Les 1.1" opdrachten={oefenbankLes11} />

      
    </PageShell>
  )
}
