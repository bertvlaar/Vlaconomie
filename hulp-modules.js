/* vlaconomie.nl — hulp-modules.js
   Bevat: scroll-fix, verbergGetallen, extra-theorie
   Laadt aan einde van body (na DOM en Supabase) */

/* ── Scroll-fix ── */
// ── Fix 1: Scroll altijd naar boven bij het laden van de pagina ──
// De show()-functie schrijft #s-lj in de URL — bij herladen scrolt de browser daarheen.
// We verwijderen de hash zodat de pagina altijd bovenaan start.
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

// ── Fix 2: Roep telBezoek() aan bij het eerste laden ──
// telBezoek() is al gedefinieerd in script.js maar wordt normaal alleen
// aangeroepen vanuit goHome(). We roepen het hier ook aan bij pageload.
document.addEventListener('DOMContentLoaded', function() {
  if (typeof telBezoek === 'function') {
    telBezoek();
  }
});


/* ── verbergGetallen IIFE ── */
(function () {
  'use strict';

  function verbergGetallen(container) {
    // Loop door alle directe children van elke kaart in tgrid
    const kaarten = container.querySelectorAll('[class]');
    kaarten.forEach(kaart => {
      // Zoek het eerste child-element dat alleen een getal bevat
      // en klein is (fontSize <= 14px of fontSize == '' en klein gepositioneerd)
      Array.from(kaart.childNodes).forEach(child => {
        if (child.nodeType === 1) {
          const tekst = child.textContent.trim();
          // Als het element alleen een getal bevat (0-999)
          if (/^\d{1,3}$/.test(tekst)) {
            child.style.display = 'none';
          }
        }
      });
    });
  }

  const tgrid = document.getElementById('tgrid');
  if (!tgrid) return;

  const obs = new MutationObserver(() => {
    verbergGetallen(tgrid);
  });
  obs.observe(tgrid, { childList: true, subtree: true });

  // Ook direct na show('s-ow') triggeren
  const origShowOW = window.show;
  window.show = function (id) {
    if (typeof origShowOW === 'function') origShowOW(id);
    if (id === 's-ow') {
      setTimeout(() => verbergGetallen(tgrid), 150);
    }
  };
})();


/* ── Extra-theorie IIFE ── */
(function () {
  'use strict';

  // ── Extra theorie per onderwerp-sleutelwoord ──────────────────
  // Elke entry: { match: [zoekwoorden in de onderwerptitel],
  //               niveaus: ['tl/havo','havo/vwo'] of 'alle',
  //               html: de extra uitleg }
  const EXTRA_THEORIE = [

    // ── MARKT & VRAAG/AANBOD ──────────────────────────────────
    {
      match: ['markt', 'vraag', 'aanbod', 'prijs'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">📈 Dieper de markt in — voor tl/havo &amp; havo/vwo</div>

          <p><strong>Elasticiteit: hoe gevoelig is de vraag?</strong><br>
          Soms verandert de vraag naar een product heel veel als de prijs stijgt — soms nauwelijks.
          Dat noemen we <em>prijselasticiteit van de vraag</em>.</p>

          <div class="th-extra-formule">
            <strong>Formule:</strong><br>
            E<sub>v</sub> = procentuele verandering vraag ÷ procentuele verandering prijs
          </div>

          <p><strong>Wat zegt de uitkomst?</strong></p>
          <ul class="th-extra-lijst">
            <li><strong>E &lt; −1</strong> → <em>elastisch</em>: een kleine prijsstijging zorgt voor een grote daling van de vraag (luxeproducten, merkkleding)</li>
            <li><strong>−1 &lt; E &lt; 0</strong> → <em>inelastisch</em>: mensen blijven kopen ook al wordt het duurder (benzine, medicijnen, sigaretten)</li>
            <li><strong>E = −1</strong> → <em>eenheidselastisch</em>: vraag en prijs veranderen even hard</li>
          </ul>

          <p>💡 <strong>Onthoud:</strong> de uitkomst is altijd negatief (prijs omhoog → vraag omlaag), maar in de praktijk kijk je naar de absolute waarde.</p>

          <p><strong>Marktvormen</strong><br>
          Niet elke markt werkt hetzelfde. Er zijn vier basisvormen:</p>
          <div class="th-extra-tabel">
            <table>
              <thead><tr><th>Marktvorm</th><th>Aantal aanbieders</th><th>Macht over prijs?</th><th>Voorbeeld</th></tr></thead>
              <tbody>
                <tr><td>Volledige mededinging</td><td>Veel</td><td>Geen</td><td>Groenteboer, boer</td></tr>
                <tr><td>Monopolie</td><td>Eén</td><td>Heel veel</td><td>NS (spoor), energienet</td></tr>
                <tr><td>Oligopolie</td><td>Weinig</td><td>Gedeeld</td><td>Benzinepompen, telecom</td></tr>
                <tr><td>Monopolistische mededinging</td><td>Veel, maar onderscheidend</td><td>Beetje</td><td>Restaurants, kapsalons</td></tr>
              </tbody>
            </table>
          </div>

          <p>Bij havo/vwo leer je ook over <em>consumentensurplus</em> (wat je over hebt voor een product boven de prijs die je betaalt) en <em>producentensurplus</em> (extra winst boven de minimale prijs die een aanbieder wil). Samen vormen die de <strong>totale welvaart</strong> op een markt.</p>
        </div>`
    },

    // ── BEDRIJF, PRODUCTIE & KOSTEN ───────────────────────────
    {
      match: ['bedrijf', 'productie', 'kosten', 'winst', 'omzet', 'bep', 'break'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">🏭 Kosten en winst: verder kijken — tl/havo &amp; havo/vwo</div>

          <p><strong>Vaste en variabele kosten</strong><br>
          Kosten zijn niet allemaal hetzelfde. Vaste kosten betaal je altijd, ook als je niets maakt.
          Variabele kosten hangen af van hoeveel je produceert.</p>
          <ul class="th-extra-lijst">
            <li><strong>Vaste kosten (FK):</strong> huur, verzekering, afschrijving machines — veranderen niet met de productie</li>
            <li><strong>Variabele kosten (VK):</strong> grondstoffen, verpakking, energie — stijgen als je meer maakt</li>
            <li><strong>Totale kosten (TK):</strong> FK + VK</li>
          </ul>

          <div class="th-extra-formule">
            <strong>Break-evenpunt (BEP):</strong><br>
            BEP (in stuks) = Vaste kosten ÷ (Verkoopprijs − Variabele kosten per stuk)
          </div>

          <p>Op het BEP maakt een bedrijf precies <em>geen winst en geen verlies</em>. Daarboven beginnen de winsten, daaronder zijn er verliezen.</p>

          <p><strong>Dekkingsbijdrage</strong><br>
          De dekkingsbijdrage per product (ook: <em>contributiemarge</em>) is het verschil tussen de verkoopprijs en de variabele kosten per stuk. Elk product dat je verkoopt, draagt bij aan het dekken van de vaste kosten.</p>

          <div class="th-extra-formule">
            Dekkingsbijdrage per stuk = Verkoopprijs − VK per stuk
          </div>

          <p>💡 <strong>Waarom is dit handig?</strong> Bedrijven gebruiken dit om te beslissen of een product de moeite waard is om te maken, zelfs als de totale winst nog laag is.</p>

          <p><strong>Afschrijving</strong><br>
          Machines en gebouwen worden ouder en minder waard. Die waardevermindering heet <em>afschrijving</em>.
          Je telt dit mee als kosten, ook al geef je er op dat moment geen geld aan uit.</p>
          <div class="th-extra-formule">
            Afschrijving per jaar = (Aankoopprijs − Restwaarde) ÷ Levensduur in jaren
          </div>
        </div>`
    },

    // ── INKOMEN, BELASTING & ARBEID ──────────────────────────
    {
      match: ['inkomen', 'belasting', 'arbeid', 'loon', 'werkloosheid', 'arbeidsmarkt'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">💶 Inkomen en belasting: de details — tl/havo &amp; havo/vwo</div>

          <p><strong>Progressieve belasting</strong><br>
          In Nederland betaal je over hogere inkomens een hoger percentage aan belasting.
          Dat heet een <em>progressief belastingstelsel</em>. Hoe meer je verdient, hoe groter het deel dat
          naar de overheid gaat.</p>

          <ul class="th-extra-lijst">
            <li><strong>Marginale belastingdruk:</strong> het percentage dat je over de <em>laatste euro</em> die je verdient betaalt</li>
            <li><strong>Gemiddelde belastingdruk:</strong> hoeveel procent van je <em>totale inkomen</em> je in totaal afdraagt</li>
          </ul>

          <p><strong>Bruto vs. netto inkomen</strong><br>
          Bruto is wat je verdient vóór aftrek. Netto is wat je overhoudt ná belasting en premies.</p>

          <div class="th-extra-formule">
            Netto inkomen = Bruto inkomen − belasting − sociale premies + toeslagen
          </div>

          <p><strong>Inkomensverdeling en Lorenz-curve</strong><br>
          De <em>Lorenz-curve</em> laat zien hoe gelijk (of ongelijk) het inkomen verdeeld is in een land.
          Hoe verder de curve van de diagonale lijn afwijkt, hoe ongelijker de verdeling.
          De <em>Gini-coëfficiënt</em> drukt dit uit in één getal: 0 = perfecte gelijkheid, 1 = maximale ongelijkheid.</p>

          <p><strong>Soorten werkloosheid</strong><br>
          Bij havo/vwo leer je drie soorten onderscheiden:</p>
          <ul class="th-extra-lijst">
            <li><strong>Conjuncturele werkloosheid:</strong> door een economische neergang (recessie) zijn er tijdelijk te weinig banen</li>
            <li><strong>Structurele werkloosheid:</strong> het soort werk dat mensen kunnen, bestaat niet meer — denk aan automatisering</li>
            <li><strong>Frictiewerkloosheid:</strong> tijdelijk zonder werk tussen twee banen in — hoort erbij in een gezonde economie</li>
          </ul>
        </div>`
    },

    // ── GELD, INFLATIE & RENTE ────────────────────────────────
    {
      match: ['geld', 'inflatie', 'rente', 'sparen', 'lenen', 'koopkracht'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">🏦 Geld en inflatie: verder — tl/havo &amp; havo/vwo</div>

          <p><strong>Wat veroorzaakt inflatie?</strong><br>
          Er zijn twee hoofdoorzaken:</p>
          <ul class="th-extra-lijst">
            <li><strong>Vraaginflatie:</strong> de vraag naar goederen en diensten stijgt sneller dan het aanbod — mensen hebben meer geld en willen meer kopen, prijzen stijgen</li>
            <li><strong>Kosteninflatie:</strong> de productiekosten stijgen (hogere lonen, duurder energie) en bedrijven geven dat door in hogere prijzen</li>
          </ul>

          <p><strong>Reële vs. nominale rente</strong><br>
          Als je spaargeld 3% rente oplevert maar de prijzen stijgen met 4%, dan gaat je koopkracht er toch op achteruit.
          Dat verschil heet de <em>reële rente</em>.</p>
          <div class="th-extra-formule">
            Reële rente ≈ Nominale rente − Inflatie
          </div>
          <p>Is de reële rente negatief? Dan groeit je spaargeld in koopkracht gezien <em>niet</em>, zelfs als je bank wel rente betaalt.</p>

          <p><strong>De centrale bank en monetaire politiek</strong><br>
          In de eurozone bepaalt de <em>Europese Centrale Bank (ECB)</em> de rente.
          Als de ECB de rente verhoogt, wordt lenen duurder → mensen lenen minder → er circuleert minder geld → inflatie daalt.
          Omgekeerd stimuleert een lagere rente de economie.</p>

          <p>💡 <strong>Koopkracht berekenen:</strong></p>
          <div class="th-extra-formule">
            Koopkrachtstijging (%) = ((1 + loongroei) ÷ (1 + inflatie) − 1) × 100
          </div>
          <p>Of in een eenvoudige benadering: koopkracht % ≈ loongroei % − inflatie %</p>
        </div>`
    },

    // ── OVERHEID & BELEID ─────────────────────────────────────
    {
      match: ['overheid', 'beleid', 'rijksbegroting', 'miljoenennota', 'begrotingstekort'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">🏛️ Overheid en beleid: meer diepgang — tl/havo &amp; havo/vwo</div>

          <p><strong>Automatische stabilisatoren</strong><br>
          Sommige overheidsuitgaven en -inkomsten reageren vanzelf op de economie, zonder dat de overheid ingrijpt.
          Dat noemen we <em>automatische stabilisatoren</em>:</p>
          <ul class="th-extra-lijst">
            <li>Bij een recessie: meer mensen krijgen een uitkering (hogere uitgaven), minder belasting binnenkomt (lagere inkomsten) → de overheid pompt automatisch geld in de economie</li>
            <li>Bij hoogconjunctuur: minder uitkeringen, meer belastingopbrengsten → overheid remt de economie automatisch af</li>
          </ul>

          <p><strong>Begrotingssaldo</strong><br>
          Het begrotingssaldo is het verschil tussen inkomsten en uitgaven van de overheid.</p>
          <ul class="th-extra-lijst">
            <li><strong>Begrotingstekort:</strong> uitgaven &gt; inkomsten — overheid leent geld</li>
            <li><strong>Begrotingsoverschot:</strong> inkomsten &gt; uitgaven — overheid lost schulden af</li>
            <li><strong>Staatsschuld:</strong> de opgestapelde tekorten uit het verleden</li>
          </ul>

          <p><strong>Soorten overheidsinkomsten</strong><br>
          De overheid haalt geld op via:</p>
          <ul class="th-extra-lijst">
            <li><strong>Directe belastingen:</strong> geheven op inkomen of vermogen (inkomstenbelasting, vennootschapsbelasting)</li>
            <li><strong>Indirecte belastingen:</strong> geheven op bestedingen (BTW, accijns op benzine en alcohol)</li>
            <li><strong>Premies sociale verzekeringen:</strong> voor WW, AOW, Zorgverzekeringswet</li>
          </ul>

          <p><strong>Externe effecten</strong><br>
          Soms heeft productie of consumptie gevolgen voor anderen die niet in de prijs zitten.
          Dat zijn <em>externe effecten</em>.</p>
          <ul class="th-extra-lijst">
            <li><strong>Negatief extern effect:</strong> vervuiling door een fabriek — anderen lijden eronder, maar de fabriek betaalt er niet voor</li>
            <li><strong>Positief extern effect:</strong> iemand plant een boom in de tuin → buren genieten mee zonder te betalen</li>
          </ul>
          <p>De overheid kan ingrijpen via belastingen (bijv. CO₂-heffing) of subsidies om externe effecten te corrigeren.</p>
        </div>`
    },

    // ── INTERNATIONALE HANDEL & CONJUNCTUUR ───────────────────
    {
      match: ['internationaal', 'handel', 'buitenland', 'conjunctuur', 'wisselkoers', 'globalisering', 'eu'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">🌍 Internationale economie — tl/havo &amp; havo/vwo</div>

          <p><strong>Absolute en comparatieve voordelen</strong><br>
          Landen handelen met elkaar omdat ze niet alles even efficiënt kunnen produceren.</p>
          <ul class="th-extra-lijst">
            <li><strong>Absoluut voordeel:</strong> een land produceert een goed goedkoper dan alle andere landen</li>
            <li><strong>Comparatief voordeel:</strong> een land is relatief beter in het produceren van een goed dan in andere goederen — ook al is een ander land absoluut goedkoper</li>
          </ul>
          <p>Dankzij comparatieve voordelen loont het voor <em>alle</em> landen om handel te drijven en te specialiseren.</p>

          <p><strong>Betalingsbalans</strong><br>
          De betalingsbalans houdt bij wat een land exporteert en importeert. De twee belangrijkste onderdelen:</p>
          <ul class="th-extra-lijst">
            <li><strong>Lopende rekening:</strong> in- en uitvoer van goederen en diensten, plus inkomens en overdrachten</li>
            <li><strong>Kapitaalrekening:</strong> investeringen vanuit en naar het buitenland</li>
          </ul>
          <p>Nederland heeft traditioneel een <em>overschot op de lopende rekening</em>: we exporteren meer dan we importeren.</p>

          <p><strong>Conjunctuurcyclus</strong><br>
          De economie beweegt in golven tussen groei en krimp:</p>
          <div class="th-extra-tabel">
            <table>
              <thead><tr><th>Fase</th><th>Kenmerken</th></tr></thead>
              <tbody>
                <tr><td>Hoogconjunctuur</td><td>Groei, lage werkloosheid, risico op inflatie</td></tr>
                <tr><td>Recessie</td><td>Krimp (min 2 kwartalen op rij), stijgende werkloosheid</td></tr>
                <tr><td>Laagconjunctuur / depressie</td><td>Langdurige krimp, hoge werkloosheid</td></tr>
                <tr><td>Herstel</td><td>Groei trekt aan, werkloosheid daalt</td></tr>
              </tbody>
            </table>
          </div>

          <p><strong>Wisselkoersen</strong><br>
          De wisselkoers bepaalt hoeveel je van de ene valuta krijgt voor de andere. Een <em>sterke euro</em> maakt import goedkoper maar export duurder voor het buitenland.
          </p>
          <div class="th-extra-formule">
            Prijs in vreemde valuta = Prijs in euro's × wisselkoers (buitenlandse valuta per euro)
          </div>
        </div>`
    },

    // ── RISICO, MORAL HAZARD & BELEGGEN ──────────────────────
    {
      match: ['verzeker', 'risico', 'moral hazard', 'beleggen', 'averechtse', 'informatie'],
      niveaus: 'alle',
      html: `
        <div class="th-extra-havovwo" style="border-color:#e67e22;background:linear-gradient(135deg,#fffaf4,#fff3e0)">
          <div class="th-extra-titel" style="color:#b45309;border-color:#f0c070">🛡️ Risico, verzekeren en moral hazard</div>

          <p><strong>Waarom verzeker je je?</strong><br>
          Je weet niet altijd wat er morgen gebeurt. Een ongeluk, ziekte of brand kost veel geld.
          Een verzekering laat je dat risico delen met anderen — je betaalt een <em>premie</em>, en als er iets misgaat, krijg je een <em>uitkering</em>.</p>

          <ul class="th-extra-lijst">
            <li><strong>Premie:</strong> het bedrag dat je regelmatig betaalt voor de verzekering</li>
            <li><strong>Eigen risico:</strong> het bedrag dat je zelf betaalt als je schade hebt, voordat de verzekeraar bijspringt</li>
            <li><strong>Uitkering:</strong> het bedrag dat je ontvangt als het risico zich voordoet</li>
          </ul>

          <p><strong>Verplicht of vrijwillig?</strong><br>
          Sommige verzekeringen zijn <em>verplicht</em> — de overheid schrijft voor dat je ze moet hebben:</p>
          <ul class="th-extra-lijst">
            <li>🏥 <strong>Zorgverzekering</strong> — verplicht voor iedere Nederlander</li>
            <li>🚗 <strong>WA-verzekering</strong> — verplicht als je een auto hebt</li>
          </ul>
          <p>Andere verzekeringen zijn <em>vrijwillig</em>, zoals een reisverzekering of inboedelverzekering.</p>

          <p><strong>De afweging: kosten, risico's en opbrengsten</strong><br>
          Of je een verzekering afsluit hangt af van drie dingen:</p>
          <ul class="th-extra-lijst">
            <li><strong>Kosten:</strong> hoe hoog is de premie? Past dat in je budget?</li>
            <li><strong>Risico:</strong> hoe groot is de kans dat er iets misgaat? Hoe groot is de schade dan?</li>
            <li><strong>Opbrengsten:</strong> wat krijg je terug als het risico zich voordoet?</li>
          </ul>
          <p>Kleine risico's met lage schade verzeker je vaak <em>niet</em> — de premie is relatief te duur. Grote risico's (zoals brand of arbeidsongeschiktheid) verzeker je wél, want de schade is niet zelf te dragen.</p>

          <p><strong>Moral hazard — moreel risico</strong><br>
          Als je weet dat je verzekerd bent, pas je soms minder goed op. Dat heet <em>moral hazard</em> (ook wel: moreel gevaar of averechtse prikkel).</p>

          <ul class="th-extra-lijst">
            <li>🚗 Je rijdt roekelozer als je weet dat je autoverzekering alle schade betaalt</li>
            <li>🏥 Je gaat sneller naar de dokter als de zorgverzekering alles vergoedt</li>
            <li>🏠 Je sluit je deur minder goed af als je een inbraakverzekering hebt</li>
          </ul>

          <p>Verzekeraars lossen dit op met een <strong>eigen risico</strong> of een <strong>no-claimkorting</strong>: zo blijf jij financieel gemotiveerd om voorzichtig te zijn.</p>

          <p><strong>Averechtse selectie</strong><br>
          Een ander probleem: mensen die het meeste risico lopen, sluiten het vaakst een verzekering af.
          Daardoor wordt de verzekering duur voor iedereen. Dat heet <em>averechtse selectie</em>.
          Voorbeeld: mensen die weten dat ze ongezond zijn, sluiten eerder een aanvullende zorgverzekering af.</p>

          <div class="th-extra-formule" style="background:#fff7ed;border-color:#f59e0b">
            Moral hazard = gedragsverandering ná het afsluiten van een verzekering<br>
            Averechtse selectie = risicovolle mensen sluiten vaker een verzekering af
          </div>
        </div>`
    },

    {
      match: ['verzeker', 'risico', 'moral hazard', 'beleggen', 'averechtse', 'informatie'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">📈 Beleggen en risico — tl/havo &amp; havo/vwo</div>

          <p><strong>Wat is beleggen?</strong><br>
          Beleggen is geld inzetten met als doel het te laten groeien, maar met een kans op verlies.
          Dat is het verschil met sparen: bij sparen is je geld (vrijwel) zeker veilig, bij beleggen neem je risico voor mogelijk meer rendement.</p>

          <ul class="th-extra-lijst">
            <li><strong>Aandelen:</strong> je koopt een klein stukje van een bedrijf. Als het bedrijf goed draait, stijgt de koers en ontvang je <em>dividend</em>. Gaat het slecht, dan verlies je geld.</li>
            <li><strong>Obligaties:</strong> je leent geld uit aan een bedrijf of overheid. Je ontvangt rente en aan het einde je geld terug. Minder risico dan aandelen, maar ook minder rendement.</li>
            <li><strong>Beleggingsfonds:</strong> je belegt samen met anderen in een mix van aandelen en obligaties — spreiding vermindert risico.</li>
          </ul>

          <p><strong>Risico en rendement</strong><br>
          In de economie geldt een ijzeren wet: <em>meer kans op rendement = meer risico</em>. Er is geen gratis lunch.</p>

          <div class="th-extra-tabel">
            <table>
              <thead><tr><th>Belegging</th><th>Risico</th><th>Verwacht rendement</th></tr></thead>
              <tbody>
                <tr><td>Spaarrekening</td><td>Laag</td><td>Laag (≈ inflatie)</td></tr>
                <tr><td>Obligaties</td><td>Middel</td><td>Middel</td></tr>
                <tr><td>Aandelen</td><td>Hoog</td><td>Hoog (maar kan negatief)</td></tr>
                <tr><td>Cryptovaluta</td><td>Zeer hoog</td><td>Zeer variabel</td></tr>
              </tbody>
            </table>
          </div>

          <p><strong>Risicospreiding (diversificatie)</strong><br>
          "Leg niet al je eieren in één mandje." Door in meerdere verschillende beleggingen te investeren, verminder je het risico.
          Als één aandeel keldert, hoeft je totale portefeuille niet mee te dalen.</p>

          <p><strong>Verband met informatie</strong><br>
          Beleggers nemen beslissingen op basis van informatie. Wie betere of eerdere informatie heeft, kan hogere rendementen behalen.
          Vandaar dat <em>voorkennis</em> (insider trading) verboden is — het is oneerlijk en ondermijnt het vertrouwen in de markt.</p>

          <div class="th-extra-formule">
            Rendement (%) = (verkoopprijs − aankoopprijs + dividend) ÷ aankoopprijs × 100
          </div>
        </div>`
    },

    // ── BEHOEFTEN & SCHAARSTE ─────────────────────────────────
    {
      match: ['behoeften', 'schaarste', 'keuzes', 'economisch handelen', 'alternatieve aanwending'],
      niveaus: ['tl/havo', 'havo/vwo'],
      html: `
        <div class="th-extra-havovwo">
          <div class="th-extra-titel">🎯 Schaarste en keuzes: verder nadenken — tl/havo &amp; havo/vwo</div>

          <p><strong>Opportuniteitskosten</strong><br>
          Elke keuze heeft een prijs: wat je laat liggen. Als je besluit een avond te studeren in plaats van met vrienden uit te gaan,
          zijn de opportuniteitskosten het plezier van dat uitje. In de economie heet dit de <em>alternatieve aanwending</em>.</p>

          <div class="th-extra-formule">
            Opportuniteitskosten = de waarde van het beste alternatief dat je opgeeft
          </div>

          <p>💡 Bedrijven en overheden gebruiken dit principe voortdurend: elke euro die aan iets wordt uitgegeven, kan niet ook aan iets anders worden besteed.</p>

          <p><strong>Economische subjecten</strong><br>
          De economie kent drie soorten actoren (subjecten) die beslissingen nemen:</p>
          <ul class="th-extra-lijst">
            <li><strong>Huishoudens:</strong> bieden arbeid aan en vragen goederen en diensten</li>
            <li><strong>Bedrijven:</strong> vragen arbeid aan en bieden goederen en diensten</li>
            <li><strong>Overheid:</strong> stuurt via belastingen, regels en uitgaven</li>
          </ul>
          <p>In de <em>kringlooptheorie</em> zie je hoe geld en goederen tussen deze drie groepen stromen.</p>

          <p><strong>Het huishoudboekje: inkomsten en uitgaven</strong><br>
          Een huishouden heeft inkomsten (loon, uitkering, toeslagen) en uitgaven (huur, boodschappen, kleding).
          Als de uitgaven hoger zijn dan de inkomsten, is er een <em>tekort</em> — je moet dan sparen of lenen.
          Een sluitend huishoudboekje betekent: inkomsten = uitgaven.</p>
          <div class="th-extra-formule">
            Saldo = Inkomsten − Uitgaven &nbsp;·&nbsp; Positief = spaargeld &nbsp;·&nbsp; Negatief = tekort
          </div>

          <p><strong>Gezin en bedrijf: overeenkomsten en verschillen</strong><br>
          Zowel gezinnen als bedrijven maken economische beslissingen over inkomsten en uitgaven:</p>
          <div class="th-extra-tabel">
            <table>
              <thead><tr><th></th><th>Gezin</th><th>Bedrijf</th></tr></thead>
              <tbody>
                <tr><td><strong>Inkomsten</strong></td><td>Loon, uitkering, toeslagen</td><td>Omzet, winst</td></tr>
                <tr><td><strong>Uitgaven</strong></td><td>Huur, boodschappen, kleding</td><td>Lonen, huur, grondstoffen</td></tr>
                <tr><td><strong>Doel</strong></td><td>Welvaart / geluk</td><td>Winst / continuïteit</td></tr>
                <tr><td><strong>Overeenkomst</strong></td><td colspan="2">Beide maken keuzes bij beperkt budget</td></tr>
              </tbody>
            </table>
          </div>
          <p>Het grote verschil: een bedrijf wil winst maken, een gezin wil zo goed mogelijk leven met het beschikbare inkomen.</p>

          <p><strong>Groeiende schaarste en duurzaamheid</strong><br>
          Grondstoffen, schone lucht en ruimte zijn eindig. Bij havo/vwo kijk je ook naar de <em>economische kant van duurzaamheid</em>:
          hoe kan de samenleving groeien zonder de draagkracht van de aarde te overschrijden?
          Begrippen als <em>externe effecten</em>, <em>publieke goederen</em> en <em>duurzame ontwikkeling</em> horen daarbij.</p>
        </div>`
    }
  ];

  // ── CSS voor de extra blokken ──────────────────────────────────
  const EXTRA_STIJL = `
    .th-extra-havovwo {
      margin-top: 1.8rem;
      border: 2px solid #2ecc71;
      border-radius: 14px;
      padding: 1.2rem 1.3rem 1rem;
      background: linear-gradient(135deg, #f0fdf6, #e8f9ef);
      position: relative;
    }
    .th-extra-titel {
      font-family: 'Lexend', sans-serif;
      font-weight: 800;
      font-size: .92rem;
      color: #0f5e2e;
      margin-bottom: .85rem;
      padding-bottom: .5rem;
      border-bottom: 1px solid #b8e4cc;
    }
    .th-extra-havovwo p {
      font-size: .86rem;
      line-height: 1.7;
      color: #1a2e1e;
      margin: 0 0 .8rem;
    }
    .th-extra-lijst {
      margin: .3rem 0 .9rem 1.2rem;
      padding: 0;
      font-size: .85rem;
      line-height: 1.75;
      color: #1a2e1e;
    }
    .th-extra-formule {
      background: #fff;
      border-left: 4px solid #1a7a4a;
      border-radius: 0 8px 8px 0;
      padding: .65rem 1rem;
      margin: .5rem 0 .9rem;
      font-size: .84rem;
      line-height: 1.7;
      color: #0c3d20;
    }
    .th-extra-tabel {
      overflow-x: auto;
      margin: .5rem 0 .9rem;
    }
    .th-extra-tabel table {
      width: 100%;
      border-collapse: collapse;
      font-size: .82rem;
    }
    .th-extra-tabel th {
      background: #1a7a4a;
      color: #fff;
      padding: .45rem .7rem;
      text-align: left;
      font-weight: 700;
    }
    .th-extra-tabel td {
      padding: .4rem .7rem;
      border-bottom: 1px solid #d8f0e4;
      vertical-align: top;
      line-height: 1.5;
      color: #1a2e1e;
    }
    .th-extra-tabel tr:nth-child(even) td { background: #f4fdf7; }
    .th-extra-badge {
      position: absolute;
      top: -12px;
      right: 14px;
      background: linear-gradient(135deg, #1a7a4a, #2ecc71);
      color: #fff;
      font-family: 'Lexend', sans-serif;
      font-size: .68rem;
      font-weight: 700;
      letter-spacing: .04em;
      padding: .2rem .65rem;
      border-radius: 20px;
    }
  `;

  // ── Stijl injecteren ──────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = EXTRA_STIJL;
  document.head.appendChild(styleEl);

  // ── Hulpfuncties ──────────────────────────────────────────────
  function huidigNiveau() {
    // script.js slaat niveau op in window.OW of window.huidigNv of window.nv
    // We proberen alle bekende variabelen
    const kandidaten = [
      window.OW && window.OW.nv,
      window.huidigNv,
      window.nv,
      window.huidigOW && window.huidigOW.nv,
    ];
    for (const k of kandidaten) {
      if (typeof k === 'string' && k.length > 0) return k.toLowerCase();
    }
    // Fallback: check #th-sub voor de niveautekst
    const sub = document.getElementById('th-sub');
    if (sub) return sub.textContent.toLowerCase();
    return '';
  }

  function huidigOnderwerp() {
    const sub = document.getElementById('th-sub');
    const titel = document.getElementById('md-title');
    const bronnen = [
      sub && sub.textContent,
      titel && titel.textContent,
      document.title,
    ];
    return bronnen.filter(Boolean).join(' ').toLowerCase();
  }

  function niveauIsTlHavoOfHoger(nv) {
    return /tl|havo|vwo|h\/v|tl\/h/.test(nv);
  }

  function zoekPassendeExtra(onderwerp, nv) {
    return EXTRA_THEORIE.filter(item => {
      const nvOk = item.niveaus === 'alle' || item.niveaus.some(n => nv.includes(n));
      const owOk = item.match.some(w => onderwerp.includes(w));
      return nvOk && owOk;
    });
  }

  function injecteerExtra(container) {
    // Verwijder vorige injecties
    container.querySelectorAll('.th-extra-havovwo').forEach(el => el.remove());

    const nv = huidigNiveau();
    if (!niveauIsTlHavoOfHoger(nv)) return;

    const onderwerp = huidigOnderwerp();
    const extras = zoekPassendeExtra(onderwerp, nv);
    if (!extras.length) return;

    extras.forEach(extra => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = extra.html.trim();
      const blok = wrapper.firstElementChild;
      // Voeg badge toe
      const badge = document.createElement('div');
      badge.className = 'th-extra-badge';
      badge.textContent = '✦ TL/HAVO · HAVO/VWO extra';
      blok.appendChild(badge);
      container.appendChild(blok);
    });
  }

  // ── MutationObserver: reageer zodra #th-content gevuld wordt ──
  const thContent = document.getElementById('th-content');
  if (thContent) {
    const observer = new MutationObserver(() => {
      // Kleine vertraging zodat script.js klaar is met renderen
      setTimeout(() => injecteerExtra(thContent), 80);
    });
    observer.observe(thContent, { childList: true, subtree: false });
  }

  // ── Ook triggeren als het theorie-scherm via show() getoond wordt ──
  const origShow2 = window.show;
  window.show = function (id) {
    if (typeof origShow2 === 'function') origShow2(id);
    if (id === 's-th') {
      setTimeout(() => {
        const c = document.getElementById('th-content');
        if (c && c.children.length > 0) injecteerExtra(c);
      }, 200);
    }
  };

})();

