/* vlaconomie.nl — examen-tl.js
   Verplaatst vanuit index.html
*/

/* ── drawPie + initBron8 ── */
      (function() {
        function drawPie(canvasId, titel, bedrag, segments) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const cx = 100, cy = 110, r = 80;
          const colors = ['#444','#888','#ccc'];
          const total = segments.reduce((s,x)=>s+x.pct,0);
          let startAngle = -Math.PI/2; // start bovenaan

          // Titel
          ctx.font = 'bold 13px Arial';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000';
          ctx.fillText(titel, cx, 14);

          // Bedrag
          ctx.font = '11px Arial';
          ctx.fillStyle = '#555';
          ctx.fillText(bedrag, cx, 210);

          // Segmenten
          segments.forEach((seg, i) => {
            const angle = (seg.pct / 100) * 2 * Math.PI;
            const endAngle = startAngle + angle;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label in segment (midden van het segment)
            const midAngle = startAngle + angle/2;
            const labelR = r * 0.65;
            const lx = cx + Math.cos(midAngle) * labelR;
            const ly = cy + Math.sin(midAngle) * labelR;
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = i < 2 ? '#fff' : '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(seg.pct + '%', lx, ly);

            startAngle = endAngle;
          });
        }

        function initBron8() {
          drawPie('bron8-import', 'import', '61,4 miljard euro', [
            {pct: 40},  // Duitsland
            {pct: 42},  // rest EU-27
            {pct: 18}   // rest wereld
          ]);
          drawPie('bron8-export', 'export', '90,3 miljard euro', [
            {pct: 25},  // Duitsland
            {pct: 52},  // rest EU-27
            {pct: 23}   // rest wereld
          ]);
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initBron8);
        } else {
          initBron8();
        }
      })();

/* ── TL 2025 tijdvak 1 (ex25*) ── */
// ─── State ───────────────────────────────────────────────
const ex25Scores = {}; // vraagnummer -> behaalde punten
const ex25Max    = {}; // vraagnummer -> max punten
const EX25_TOTAAL = 54;

function ex25TotaalScore() {
  return Object.values(ex25Scores).reduce((a,b)=>a+b, 0);
}

function ex25UpdateBalk() {
  const score = ex25TotaalScore();
  const pct   = Math.round(score / EX25_TOTAAL * 100);
  document.getElementById('ex25-score-badge').textContent  = `Score: ${score} / ${EX25_TOTAAL} pt`;
  document.getElementById('ex25-score-tekst').textContent  = `${score} van ${EX25_TOTAAL} punten`;
  document.getElementById('ex25-score-balk').style.width   = pct + '%';
  document.getElementById('ex25-eind-score').textContent   = `${score} / ${EX25_TOTAAL}`;
  document.getElementById('ex25-eind-balk').style.width    = pct + '%';
  // Eindtekst
  let tekst = '';
  if (pct >= 90) tekst = '🏆 Uitstekend! Jij bent klaar voor het examen.';
  else if (pct >= 75) tekst = '😊 Goed bezig! Bijna volledig.';
  else if (pct >= 55) tekst = '👍 Voldoende — herhaal de onderdelen die je miste.';
  else if (pct >= 30) tekst = '📚 Nog wat oefenen — bekijk de uitleggen opnieuw.';
  else tekst = 'Beantwoord de vragen om je score te zien.';
  document.getElementById('ex25-eind-tekst').textContent = tekst;
}

// ─── Meerkeuze ────────────────────────────────────────────
function ex25MC(vraagNr, gekozen, juist) {
  const container = document.getElementById('ex25-mc' + vraagNr);
  if (!container) return;
  const knoppen = container.querySelectorAll('.ex25-mc-btn');
  knoppen.forEach(k => {
    k.disabled = true;
    const letter = k.textContent.trim().charAt(0);
    if (letter === juist)  k.classList.add('correct');
    if (letter === gekozen && gekozen !== juist) k.classList.add('fout');
  });
  const fb = document.getElementById('ex25-fb' + vraagNr);
  if (fb) {
    fb.style.display = 'block';
    if (gekozen === juist) {
      fb.className = 'ex25-mc-feedback goed';
      fb.textContent = '✅ Goed! Het juiste antwoord is ' + juist + '.';
      ex25Scores[vraagNr] = 1;
    } else {
      fb.className = 'ex25-mc-feedback fout';
      fb.textContent = '❌ Helaas — het juiste antwoord is ' + juist + '.';
      ex25Scores[vraagNr] = 0;
    }
  }
  ex25UpdateBalk();
}

// ─── Open vragen: toon antwoord ──────────────────────────
function ex25ToonAntwoord(vraagNr) {
  const ab = document.getElementById('ex25-ab' + vraagNr);
  if (ab) ab.style.display = 'block';
  const btn = ab ? ab.previousElementSibling : null;
  if (btn && btn.classList.contains('ex25-antwoord-btn')) btn.style.display = 'none';
}

// ─── Zelfbeoordeling punten invoeren ─────────────────────
function ex25Punt(vraagNr, punten, max) {
  ex25Scores[vraagNr] = punten;
  ex25Max[vraagNr]    = max;
  // Markeer geselecteerde knop
  const zbWrap = document.getElementById('ex25-zb' + vraagNr);
  if (zbWrap) {
    zbWrap.querySelectorAll('.ex25-zb-btn').forEach(k => k.classList.remove('geselecteerd'));
    const idx = punten; // index = punten (0, 1, 2)
    const knoppen = zbWrap.querySelectorAll('.ex25-zb-btn');
    if (knoppen[idx]) knoppen[idx].classList.add('geselecteerd');
  }
  ex25UpdateBalk();
}

// ─── Start-functie tijdvak 1 ──────────────────────────────
function startExamenTL2025() {
  Object.keys(ex25Scores).forEach(k => delete ex25Scores[k]);
  Object.keys(ex25Max).forEach(k => delete ex25Max[k]);
  ex25UpdateBalk();
  show('s-examen-tl-2025');
}

// ─── Start-functie tijdvak 2 ──────────────────────────────
function startExamenTL2025TV2() {
  Object.keys(ex25tv2Scores).forEach(k => delete ex25tv2Scores[k]);
  ex25tv2UpdateBalk();
  show('s-examen-tl-2025-tv2');
}

/* ── TL 2025 tijdvak 2 (ex25tv2*) ── */
// ─── Tijdvak 2 State & functies ───────────────────────────
const ex25tv2Scores = {};
const EX25TV2_TOTAAL = 56;

function ex25tv2TotaalScore() {
  return Object.values(ex25tv2Scores).reduce((a,b)=>a+b, 0);
}

function ex25tv2UpdateBalk() {
  const score = ex25tv2TotaalScore();
  const pct   = Math.round(score / EX25TV2_TOTAAL * 100);
  const badge = document.getElementById('ex25tv2-score-badge');
  const tekst = document.getElementById('ex25tv2-score-tekst');
  const balk  = document.getElementById('ex25tv2-score-balk');
  const eind  = document.getElementById('ex25tv2-eind-score');
  const eindb = document.getElementById('ex25tv2-eind-balk');
  const eindt = document.getElementById('ex25tv2-eind-tekst');
  if(badge) badge.textContent = `Score: ${score} / ${EX25TV2_TOTAAL} pt`;
  if(tekst) tekst.textContent = `${score} van ${EX25TV2_TOTAAL} punten`;
  if(balk)  balk.style.width  = pct + '%';
  if(eind)  eind.textContent  = `${score} / ${EX25TV2_TOTAAL}`;
  if(eindb) eindb.style.width = pct + '%';
  if(eindt) {
    let t = '';
    if(pct>=90) t='🏆 Uitstekend! Jij bent klaar voor het examen.';
    else if(pct>=75) t='😊 Goed bezig! Bijna volledig.';
    else if(pct>=55) t='👍 Voldoende — herhaal de onderdelen die je miste.';
    else if(pct>=30) t='📚 Nog wat oefenen — bekijk de uitleggen opnieuw.';
    else t='Beantwoord de vragen om je score te zien.';
    eindt.textContent = t;
  }
}

function ex25tv2MC(vraagNr, gekozen, juist) {
  const container = document.getElementById('ex25tv2-mc' + vraagNr);
  if (!container) return;
  container.querySelectorAll('.ex25-mc-btn').forEach(k => {
    k.disabled = true;
    const letter = k.textContent.trim().charAt(0);
    if (letter === juist) k.classList.add('correct');
    if (letter === gekozen && gekozen !== juist) k.classList.add('fout');
  });
  const fb = document.getElementById('ex25tv2-fb' + vraagNr);
  if (fb) {
    fb.style.display = 'block';
    if (gekozen === juist) {
      fb.className = 'ex25-mc-feedback goed';
      fb.textContent = '✅ Goed! Het juiste antwoord is ' + juist + '.';
      ex25tv2Scores[vraagNr] = 1;
    } else {
      fb.className = 'ex25-mc-feedback fout';
      fb.textContent = '❌ Helaas — het juiste antwoord is ' + juist + '.';
      ex25tv2Scores[vraagNr] = 0;
    }
  }
  ex25tv2UpdateBalk();
}

function ex25tv2ToonAntwoord(vraagNr) {
  const ab = document.getElementById('ex25tv2-ab' + vraagNr);
  if (ab) ab.style.display = 'block';
  const btn = ab ? ab.previousElementSibling : null;
  if (btn && btn.classList.contains('ex25-antwoord-btn')) btn.style.display = 'none';
}

function ex25tv2Punt(vraagNr, punten, max) {
  ex25tv2Scores[vraagNr] = punten;
  const zbWrap = document.getElementById('ex25tv2-zb' + vraagNr);
  if (zbWrap) {
    zbWrap.querySelectorAll('.ex25-zb-btn').forEach(k => k.classList.remove('geselecteerd'));
    const knoppen = zbWrap.querySelectorAll('.ex25-zb-btn');
    if (knoppen[punten]) knoppen[punten].classList.add('geselecteerd');
  }
  ex25tv2UpdateBalk();
}

