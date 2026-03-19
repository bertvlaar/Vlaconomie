/* vlaconomie.nl — examen-kader.js
   Verplaatst vanuit index.html
*/

/* ── Kader 2023 (kb23*) ── */
<script>
// ─── KB 2023 State & functies ─────────────────────────────
const kb23Scores  = {};
const KB23_TOTAAL = 49;

function kb23TotaalScore() { return Object.values(kb23Scores).reduce((a,b)=>a+b,0); }

function kb23UpdateBalk() {
  const score = kb23TotaalScore();
  const pct   = Math.round(score / KB23_TOTAAL * 100);
  const els   = { badge:'kb23-score-badge', tekst:'kb23-score-tekst', balk:'kb23-score-balk',
                  eind:'kb23-eind-score', eindb:'kb23-eind-balk', eindt:'kb23-eind-tekst' };
  const g = id => document.getElementById(id);
  if(g(els.badge)) g(els.badge).textContent = `Score: ${score} / ${KB23_TOTAAL} pt`;
  if(g(els.tekst)) g(els.tekst).textContent = `${score} van ${KB23_TOTAAL} punten`;
  if(g(els.balk))  g(els.balk).style.width  = pct + '%';
  if(g(els.eind))  g(els.eind).textContent  = `${score} / ${KB23_TOTAAL}`;
  if(g(els.eindb)) g(els.eindb).style.width = pct + '%';
  if(g(els.eindt)) {
    let t = pct>=90?'🏆 Uitstekend!':pct>=75?'😊 Goed bezig!':pct>=55?'👍 Voldoende':pct>=30?'📚 Blijven oefenen':'Beantwoord de vragen om je score te zien.';
    g(els.eindt).textContent = t;
  }
}

function kb23MC(nr, gekozen, juist) {
  const c = document.getElementById('kb23-mc'+nr);
  if(!c) return;
  c.querySelectorAll('.ex25-mc-btn').forEach(k=>{
    k.disabled=true;
    const l=k.textContent.trim().charAt(0);
    if(l===juist) k.classList.add('correct');
    if(l===gekozen&&gekozen!==juist) k.classList.add('fout');
  });
  const fb = document.getElementById('kb23-fb'+nr);
  if(fb){ fb.style.display='block';
    if(gekozen===juist){fb.className='ex25-mc-feedback goed';fb.textContent='✅ Goed! Het juiste antwoord is '+juist+'.';kb23Scores[nr]=1;}
    else{fb.className='ex25-mc-feedback fout';fb.textContent='❌ Helaas — het juiste antwoord is '+juist+'.';kb23Scores[nr]=0;}
  }
  kb23UpdateBalk();
}

function kb23ToonAntwoord(nr) {
  const ab=document.getElementById('kb23-ab'+nr);
  if(ab) ab.style.display='block';
  const btn=ab?ab.previousElementSibling:null;
  if(btn&&btn.classList.contains('ex25-antwoord-btn')) btn.style.display='none';
}

function kb23Punt(nr, punten, max) {
  kb23Scores[nr]=punten;
  const zb=document.getElementById('kb23-zb'+nr);
  if(zb){ zb.querySelectorAll('.ex25-zb-btn').forEach(k=>k.classList.remove('geselecteerd'));
    const kk=zb.querySelectorAll('.ex25-zb-btn');
    if(kk[punten]) kk[punten].classList.add('geselecteerd');
  }
  kb23UpdateBalk();
}

function startExamenKB2023() {
  Object.keys(kb23Scores).forEach(k=>delete kb23Scores[k]);
  kb23UpdateBalk();
  show('s-examen-kb-2023');
  setTimeout(tekenBron1KB23, 80);
}

// ─── Donut-diagrammen bron 1 ──────────────────────────────
function tekenDonut(canvasId, titel, totaalLabel, segments, colors) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx=97, cy=110, rBuiten=75, rBinnen=40;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Titel
  ctx.font='bold 13px Arial'; ctx.textAlign='center'; ctx.fillStyle='#000';
  ctx.fillText(titel, cx, 14);

  // Totaal in het midden
  ctx.font='bold 12px Arial'; ctx.fillStyle='#333';
  ctx.fillText(totaalLabel.split(' ')[0], cx, cy-4);
  ctx.font='11px Arial';
  ctx.fillText(totaalLabel.split(' ').slice(1).join(' '), cx, cy+10);

  // Segmenten
  let angle = -Math.PI/2;
  segments.forEach((seg,i)=>{
    const sweep = (seg.pct/100)*2*Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,rBuiten,angle,angle+sweep);
    ctx.closePath();
    ctx.fillStyle=colors[i]; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();

    // Gaatje (donut)
    ctx.beginPath();
    ctx.arc(cx,cy,rBinnen,0,2*Math.PI);
    ctx.fillStyle='#fff'; ctx.fill();

    // % label in segment
    const mid = angle + sweep/2;
    const lr  = (rBuiten+rBinnen)/2;
    const lx  = cx + Math.cos(mid)*lr;
    const ly  = cy + Math.sin(mid)*lr;
    ctx.font='bold 11px Arial'; ctx.fillStyle= i===2?'#fff':'#fff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(seg.pct+'%', lx, ly);
    angle+=sweep;
  });

  // Ondertitel
  ctx.font='11px Arial'; ctx.fillStyle='#555'; ctx.textBaseline='alphabetic';
  ctx.textAlign='center';
  ctx.fillText(totaalLabel.split(' ')[0]+' '+(totaalLabel.split(' ')[1]||''), cx, 205);
  ctx.fillText((totaalLabel.split(' ')[2]||'')+(totaalLabel.split(' ')[3]?' '+totaalLabel.split(' ')[3]:''), cx, 218);
}

function tekenBron1KB23() {
  // Import: Duitsland 8%, rest EU-28 13%, rest wereld 79%
  // (Uit de bijlage: het grote witte stuk is 79% = rest van de wereld,
  //  donkergrijs 8% = Duitsland, lichtgrijs 13% = rest EU-28)
  tekenDonut('kb23-bron1-import', 'import', '270 miljoen euro',
    [{pct:8},{pct:13},{pct:79}],
    ['#555','#bbb','#e8e8e8']);

  // Export: Duitsland 50%, rest EU-28 43%, rest wereld 7%
  tekenDonut('kb23-bron1-export', 'export', '1.544 miljoen euro',
    [{pct:50},{pct:43},{pct:7}],
    ['#555','#bbb','#888']);
}

