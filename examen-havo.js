/* vlaconomie.nl — examen-havo.js */

/* ── HAVO 2025 ── */
const havo25Scores = {};
const havo25Max    = {};
const HAVO25_TOTAAL = 56;

function havo25TotaalScore() {
  return Object.values(havo25Scores).reduce((a,b) => a + b, 0);
}

function havo25UpdateBalk() {
  const score = havo25TotaalScore();
  const pct   = Math.round(score / HAVO25_TOTAAL * 100);
  const badge = document.getElementById('havo25-score-badge');
  const tekst = document.getElementById('havo25-score-tekst');
  const balk  = document.getElementById('havo25-score-balk');
  const eind  = document.getElementById('havo25-eind-score');
  const eindB = document.getElementById('havo25-eind-balk');
  const eindT = document.getElementById('havo25-eind-tekst');
  if (badge) badge.textContent  = `Score: ${score} / ${HAVO25_TOTAAL} pt`;
  if (tekst) tekst.textContent  = `${score} van ${HAVO25_TOTAAL} punten`;
  if (balk)  balk.style.width   = pct + '%';
  if (eind)  eind.textContent   = `${score} / ${HAVO25_TOTAAL}`;
  if (eindB) eindB.style.width  = pct + '%';
  if (eindT) {
    let t = '';
    if (pct >= 90)      t = '🏆 Uitstekend! Jij bent klaar voor het examen.';
    else if (pct >= 75) t = '😊 Goed bezig! Bijna volledig.';
    else if (pct >= 55) t = '👍 Voldoende — herhaal de onderdelen die je miste.';
    else if (pct >= 30) t = '📚 Nog wat oefenen — bekijk de uitleggen opnieuw.';
    else                t = 'Beantwoord de vragen om je score te zien.';
    eindT.textContent = t;
  }
}

function havo25ToonAntwoord(vraagNr) {
  const ab  = document.getElementById('havo25-ab'  + vraagNr);
  if (ab) ab.style.display = 'block';
  const btn = ab ? ab.previousElementSibling : null;
  if (btn && btn.classList.contains('ex25-antwoord-btn')) btn.style.display = 'none';
}

function havo25Punt(vraagNr, punten, max) {
  havo25Scores[vraagNr] = punten;
  havo25Max[vraagNr]    = max;
  const zbWrap = document.getElementById('havo25-zb' + vraagNr);
  if (zbWrap) {
    zbWrap.querySelectorAll('.ex25-zb-btn').forEach(k => k.classList.remove('geselecteerd'));
    const knoppen = zbWrap.querySelectorAll('.ex25-zb-btn');
    if (knoppen[punten]) knoppen[punten].classList.add('geselecteerd');
  }
  havo25UpdateBalk();
}

function startExamenHavo2025() {
  Object.keys(havo25Scores).forEach(k => delete havo25Scores[k]);
  Object.keys(havo25Max).forEach(k => delete havo25Max[k]);
  havo25UpdateBalk();
  show('s-examen-havo-2025');
}

