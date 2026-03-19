/* vlaconomie.nl — examen-vwo.js
   Verplaatst vanuit index.html
*/

/* ── VWO 2025 (vwo25*) ── */
<script>
const vwo25Scores = {};
const vwo25Max    = {};
const VWO25_TOTAAL = 59;

function vwo25TotaalScore() {
  return Object.values(vwo25Scores).reduce((a,b) => a + b, 0);
}

function vwo25UpdateBalk() {
  const score = vwo25TotaalScore();
  const pct   = Math.round(score / VWO25_TOTAAL * 100);
  const els = {
    badge: document.getElementById('vwo25-score-badge'),
    tekst: document.getElementById('vwo25-score-tekst'),
    balk:  document.getElementById('vwo25-score-balk'),
    eind:  document.getElementById('vwo25-eind-score'),
    eindB: document.getElementById('vwo25-eind-balk'),
    eindT: document.getElementById('vwo25-eind-tekst')
  };
  if (els.badge) els.badge.textContent = `Score: ${score} / ${VWO25_TOTAAL} pt`;
  if (els.tekst) els.tekst.textContent = `${score} van ${VWO25_TOTAAL} punten`;
  if (els.balk)  els.balk.style.width  = pct + '%';
  if (els.eind)  els.eind.textContent  = `${score} / ${VWO25_TOTAAL}`;
  if (els.eindB) els.eindB.style.width = pct + '%';
  if (els.eindT) {
    let t = pct >= 90 ? '🏆 Uitstekend!' : pct >= 75 ? '😊 Goed bezig!' : pct >= 55 ? '👍 Voldoende' : pct >= 30 ? '📚 Meer oefenen' : 'Beantwoord de vragen om je score te zien.';
    els.eindT.textContent = t;
  }
}

function vwo25ToonAntwoord(n) {
  const ab  = document.getElementById('vwo25-ab' + n);
  if (ab) ab.style.display = 'block';
  const btn = ab ? ab.previousElementSibling : null;
  if (btn && btn.classList.contains('ex25-antwoord-btn')) btn.style.display = 'none';
}

function vwo25Punt(n, punten, max) {
  vwo25Scores[n] = punten;
  vwo25Max[n]    = max;
  const zb = document.getElementById('vwo25-zb' + n);
  if (zb) {
    zb.querySelectorAll('.ex25-zb-btn').forEach(k => k.classList.remove('geselecteerd'));
    const knoppen = zb.querySelectorAll('.ex25-zb-btn');
    if (knoppen[punten]) knoppen[punten].classList.add('geselecteerd');
  }
  vwo25UpdateBalk();
}

function startExamenVwo2025() {
  Object.keys(vwo25Scores).forEach(k => delete vwo25Scores[k]);
  Object.keys(vwo25Max).forEach(k => delete vwo25Max[k]);
  vwo25UpdateBalk();
  show('s-examen-vwo-2025');
}

