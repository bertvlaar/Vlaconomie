# Vlaconomie: Economie onderbouw havo/vwo

Vite + React + Tailwind + React Router project voor Vlaconomie: een economiemethode voor de
onderbouw havo/vwo, opgebouwd uit tien thema's. Elk thema wordt eerst volledig uitgewerkt door AI en
daarna gecontroleerd door een docent economie, volgens een vast "gedegen format".

## Lokaal draaien

```bash
npm install
npm run dev
```

## Structuur

- `src/pages/Home.jsx`: de homepage met het verhaal achter de methode en de 10 thema-knoppen.
- `src/data/themas.js`: de lijst van alle 10 thema's. Zet `status` op `'live'` en vul `to` in
  zodra een nieuw thema klaarstaat, dan verschijnt de knop automatisch actief op de homepage.
- `src/components/Thema1Layout.jsx`: plaatst de vaste lesnavigatie (`Header`) boven alle
  pagina's van thema 1.
- `src/pages/`: de pagina's van thema 1: Start, Les 1.1 t/m 1.4, Extra Rekenopdrachten,
  Eindquiz, Project, Voor de docent (bereikbaar via `/thema-1/...`).
- `src/components/`: herbruikbare bouwstenen die op élke lespagina hetzelfde format vormen:
  `Leerdoelen`, `InfoBox` (theorie/definitie/VWO-challenge/juridisch), `SchrijfDitOp`,
  `OefenBank` (open opdrachten met invulveld + Check-knop), `RekenOpdracht` (numerieke 2F-opgave
  met automatische nakijk-check), `DownloadKnop`, `Header`.
- `src/data/`: alle vraag- en opgavecontent van thema 1, los van de weergave.

## Nieuw thema toevoegen

1. Maak een map/route voor het thema (bijvoorbeeld `/thema-2`) naar analogie van
   `Thema1Layout.jsx` + de pagina's in `src/pages/`.
2. Voeg de route toe in `src/App.jsx`.
3. Zet het thema in `src/data/themas.js` op `status: 'live'` met het juiste `to`-pad. De
   homepage-knop wordt dan automatisch actief.

## Belangrijk: PDF-downloads zijn placeholders

De downloadknoppen verwijzen naar bestanden in `public/downloads/`. Zet daar de echte
werkboek/werkblad-PDF's neer met exact deze bestandsnamen:

- `werkboek-thema1.pdf`
- `werkblad-les-1-1.pdf`
- `werkblad-les-1-2.pdf`
- `werkblad-les-1-3.pdf`
- `werkblad-les-1-4.pdf`
- `werkblad-rekenopdrachten-2f.pdf`

## Deployen

Dit is een standaard statische Vite-build (`npm run build` genereert een `dist/`-map). Elke
statische host (Netlify, Vercel, Cloudflare Pages, GitHub Pages) kan dit project bouwen en
serveren, met een custom domain zoals vlaconomie.nl.
