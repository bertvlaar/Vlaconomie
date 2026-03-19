/* vlaconomie.nl — examen-basis.js
   Verplaatst vanuit index.html
*/

/* ── Basis 2023 (bb23*) ── */
// ─────────────────────────────────────────────────────────────────
// HULPFUNCTIE: laad Chart.js on-demand (CDN, één keer)
// ─────────────────────────────────────────────────────────────────
let _chartjsGeladen = false;
let _chartjsCallbacks = [];
function laadChartJs(cb) {
  if (window.Chart) { if (cb) cb(); return; }
  if (_chartjsGeladen) { if (cb) _chartjsCallbacks.push(cb); return; }
  _chartjsGeladen = true;
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
  s.onload = () => { _chartjsCallbacks.forEach(f => f()); if (cb) cb(); };
  document.head.appendChild(s);
}

// ── Helpers ──
function fmt(n) { return '€ ' + Math.round(n).toLocaleString('nl-NL'); }
function pct(n)  { return n.toFixed(1) + '%'; }

// Koppel de vier tools aan het show()-systeem ────────────────────
(function () {
  const origShow = window.show;
  window.show = function (id) {
    if (typeof origShow === 'function') origShow(id);
    if (id === 's-bruto-netto') { setTimeout(() => { bnBereken(); }, 120); }
    if (id === 's-nudging')     { setTimeout(() => { nudgeInit(); }, 80); }
    if (id === 's-voetafdruk')  { setTimeout(() => { vfBereken(); }, 80); }
    if (id === 's-balans')      { setTimeout(() => { balansUpdate(); rrUpdate(); }, 120); }
  };
})();

// ─────────────────────────────────────────────────────────────────
// MODULE A — BRUTO-NETTO CALCULATOR 2026
// Belastingschijven 2026 (rijksoverheid.nl)
// Schijf 1: t/m €38.441  →  36,97%  (incl. volksverzekeringen)
// Schijf 2: boven €38.441 → 49,50%
// AOW-variant: schijf 1 zonder AOW-premie = 9,32%
// Arbeidskorting 2026: max €5.599 (afbouw boven €39.957)
// Algemene heffingskorting 2026: max €3.362 (afbouw boven €24.814)
// ─────────────────────────────────────────────────────────────────
let _bnPieChart = null, _bnLijnChart = null;

function bnBereken() {
  const bruto = parseFloat(document.getElementById('bn-brutoloon').value) || 0;
  document.getElementById('bn-slider').value = Math.min(bruto, 200000);

  const hk = document.getElementById('bn-heffingskorting').checked;
  const aow = document.getElementById('bn-aow').checked;

  const result = bnBelasting(bruto, hk, aow);

  document.getElementById('bn-uitkomst').style.display = 'block';
  document.getElementById('bn-netto-jaar').textContent = fmt(result.netto);
  document.getElementById('bn-netto-maand').textContent = fmt(result.netto / 12);
  document.getElementById('bn-belasting').textContent = fmt(result.totaalBelasting);
  document.getElementById('bn-druk').textContent = pct(bruto > 0 ? (result.totaalBelasting / bruto * 100) : 0);

  document.getElementById('bn-schijven-uitleg').innerHTML = bnSchijvenHtml(bruto, result, aow);

  laadChartJs(() => {
    bnTekenPie(bruto, result);
    bnTekenLijn(hk, aow);
  });
}

function bnBelasting(bruto, hk, aow) {
  // Schijven 2026
  const GRENS1 = 38441;
  const TARIEF1 = aow ? 0.0932 : 0.3697;  // zonder AOW = alleen IB
  const TARIEF2 = 0.495;

  let belasting = 0;
  if (bruto <= GRENS1) {
    belasting = bruto * TARIEF1;
  } else {
    belasting = GRENS1 * TARIEF1 + (bruto - GRENS1) * TARIEF2;
  }

  let ahk = 0, ark = 0;
  if (hk) {
    // Algemene heffingskorting 2026: max €3.362, afbouw bij inkomen > €24.814
    const AHK_MAX = 3362, AHK_GRENS = 24814, AHK_AFBOUW = 0.06230;
    if (bruto <= AHK_GRENS) ahk = AHK_MAX;
    else ahk = Math.max(0, AHK_MAX - (bruto - AHK_GRENS) * AHK_AFBOUW);

    // Arbeidskorting 2026: opbouw t/m €25.599 (max €5.599), afbouw boven €39.957
    const ARK_MAX = 5599, ARK_OPBOUW_GRENS = 25599, ARK_AFBOUW_GRENS = 39957, ARK_AFBOUW = 0.06510;
    if (bruto <= ARK_OPBOUW_GRENS) ark = bruto * 0.2188;
    else if (bruto <= ARK_AFBOUW_GRENS) ark = ARK_MAX;
    else ark = Math.max(0, ARK_MAX - (bruto - ARK_AFBOUW_GRENS) * ARK_AFBOUW);
  }

  const totaalBelasting = Math.max(0, belasting - ahk - ark);
  return {
    netto: bruto - totaalBelasting,
    totaalBelasting,
    belastingVoorKorting: belasting,
    ahk,
    ark
  };
}

function bnSchijvenHtml(bruto, r, aow) {
  const GRENS1 = 38441;
  const s1 = Math.min(bruto, GRENS1);
  const s2 = Math.max(0, bruto - GRENS1);
  const t1 = aow ? '9,32%' : '36,97%';
  return `<strong>📋 Belastingberekening 2026 — stap voor stap</strong><br><br>
Schijf 1 t/m €38.441 (${t1}): <strong>${fmt(s1 * (aow ? 0.0932 : 0.3697))}</strong>${s1 < GRENS1 ? '' : ''}<br>
${s2 > 0 ? `Schijf 2 boven €38.441 (49,50%): <strong>${fmt(s2 * 0.495)}</strong><br>` : ''}
Bruto belasting: <strong>${fmt(r.belastingVoorKorting)}</strong><br>
${r.ahk > 0 ? `Af: Algemene heffingskorting: <strong>−${fmt(r.ahk)}</strong><br>` : ''}
${r.ark > 0 ? `Af: Arbeidskorting: <strong>−${fmt(r.ark)}</strong><br>` : ''}
<hr style="border:none;border-top:1px solid #e5e7eb;margin:.4rem 0"/>
<strong>Netto te betalen belasting: ${fmt(r.totaalBelasting)}</strong>
<div style="margin-top:.5rem;font-size:.76rem;color:#888">Bron: Belastingdienst.nl, tarieven 2026. Vereenvoudigde berekening zonder bijdrage Zvw (5,32%), toeslagen en aftrekposten.</div>`;
}

function bnTekenPie(bruto, r) {
  const ctx = document.getElementById('bn-pie-chart').getContext('2d');
  if (_bnPieChart) _bnPieChart.destroy();
  _bnPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Nettoloon', 'Belasting & premies'],
      datasets: [{
        data: [Math.round(r.netto), Math.round(r.totaalBelasting)],
        backgroundColor: ['#1a7a4a', '#ef4444'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Lexend', size: 12 } } },
        tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.parsed) } }
      }
    }
  });
}

function bnTekenLijn(hk, aow) {
  const ctx = document.getElementById('bn-lijn-chart').getContext('2d');
  if (_bnLijnChart) _bnLijnChart.destroy();
  const inkPunten = [0, 10000, 20000, 24814, 30000, 38441, 45000, 60000, 80000, 100000];
  const drukData = inkPunten.map(bruto => {
    if (bruto === 0) return 0;
    const delta = 100;
    const r1 = bnBelasting(bruto, hk, aow);
    const r2 = bnBelasting(bruto + delta, hk, aow);
    return Math.min(100, ((r2.totaalBelasting - r1.totaalBelasting) / delta) * 100);
  });
  _bnLijnChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: inkPunten.map(n => '€' + (n/1000) + 'k'),
      datasets: [{
        label: 'Marginale druk (%)',
        data: drukData,
        borderColor: '#1a7a4a',
        backgroundColor: 'rgba(26,122,74,.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#1a7a4a'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%' } }
      },
      plugins: {
        legend: { labels: { font: { family: 'Lexend', size: 11 } } },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.y.toFixed(1) + '%' } }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────
// MODULE B — NUDGING-SIMULATOR
// ─────────────────────────────────────────────────────────────────
const NUDGE_DATA = [
  {
    juist: 1,
    uitleg: `<strong>Juist!</strong> Dit heet <em>default placement</em> of <em>prominence bias</em>. Door ongezond eten op ooghoogte te plaatsen, sturen supermarkten jouw keuze zonder jou iets te verbieden. Thaler noemt dit 'choice architecture'. 🎯`,
    fout: `Toeval? Dat denk jij. Supermarkten betalen soms tienduizenden euro's voor een plekje op ooghoogte. De positie van producten is een bewuste keuzearchitectuur-beslissing.`
  },
  {
    juist: 1,
    uitleg: `<strong>Correct!</strong> Het <em>decoy effect</em>: de Ultra-optie (€22) bestaat alleen om Premium (€13) voordelig te laten lijken. Dit wordt ook 'asymmetric dominance' genoemd. De prijs van Basis daalt zo in de perceptie van de koper. 🧠`,
    fout: `'POPULAIR' is geen neutrale informatie — het is een vorm van <em>social proof</em>: mensen nemen aan dat anderen de beste keuze al gemaakt hebben. Beide technieken beïnvloeden jou.`
  },
  {
    juist: 1,
    uitleg: `<strong>Goed!</strong> Optie B is een klassieke <em>opt-out nudge</em>: iedereen is standaard ingeschreven; uitschrijven kan, maar de meeste mensen doen dat niet door <em>inertia</em> (luiheid). Optie A is een wet — dat is dwang, geen nudge. 🏛️`,
    fout: `Nudges zijn juist <em>niet</em> verboden in Nederland! De overheid past ze steeds vaker toe. Bekende voorbeelden: orgaandonorregistratie (opt-out), energiebesparing via vergelijkingsberichten, standaard-pensioenspaarbijdrage.`
  },
  {
    juist: 1,
    uitleg: `<strong>Precies!</strong> Booking.com combineert twee krachtige biases: <em>scarcity bias</em> ("nog maar 2 kamers") en <em>social proof</em> ("14 andere mensen"). Beiden zijn empirisch bewezen effectief — ook bij mensen die weten dat ze bestaan! 📱`,
    fout: `Helaas. Deze technieken werken <em>juist</em> ook bij mensen die erover nadenken. De druk voelt reëel, ook al is de informatie niet altijd betrouwbaar. Dat maakt ze zo effectief en omstreden.`
  },
  {
    juist: 0,
    uitleg: `<strong>Precies!</strong> Plantaardig als standaard = <em>opt-out nudge</em> = nudge ✓. Vleesgerechtjes eerst = ook een keuzearchitectuur-nudge ✓. Een <em>vleestaks</em> is een financiële prikkel — dat is een <em>belastingmaatregel</em>, geen nudge. ✔️`,
    fout: `Let op de definitie: een nudge beïnvloedt keuzegedrag <em>zonder</em> financiële prikkel of verbod. Een belasting is een financiële prikkel — dat is géén nudge maar een accijns/beleidsinstrument.`
  }
];

let nudgeHuidig = 0, nudgeScore = 0;

function nudgeInit() {
  nudgeHuidig = 0; nudgeScore = 0;
  for (let i = 1; i <= 5; i++) {
    const s = document.getElementById('nudge-s' + i);
    if (s) s.style.display = i === 1 ? 'block' : 'none';
    const fb = document.getElementById('nudge-fb' + (i-1));
    if (fb) { fb.style.display = 'none'; fb.innerHTML = ''; }
    const btns = s ? s.querySelectorAll('.nudge-btn') : [];
    btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
  }
  const sw = document.getElementById('nudge-score-wrap');
  if (sw) sw.style.display = 'none';
}

function nudgeAntwoord(scenIdx, keuze) {
  const d = NUDGE_DATA[scenIdx];
  const goed = keuze === d.juist;
  if (goed) nudgeScore++;

  const fb = document.getElementById('nudge-fb' + scenIdx);
  fb.style.display = 'block';
  fb.style.background = goed ? '#f0fdf6' : '#fff5f5';
  fb.style.border = '1.5px solid ' + (goed ? '#22c55e' : '#ef4444');
  fb.style.borderRadius = '10px';
  fb.style.padding = '.8rem 1rem';
  fb.style.fontSize = '.84rem';
  fb.style.lineHeight = '1.65';
  fb.style.marginTop = '.6rem';
  fb.innerHTML = (goed ? '✅ ' : '❌ ') + (goed ? d.uitleg : d.fout);

  // Blokkeer alle knoppen van dit scenario
  const s = document.getElementById('nudge-s' + (scenIdx + 1));
  if (s) s.querySelectorAll('.nudge-btn').forEach(b => { b.disabled = true; b.style.opacity = '.55'; });

  nudgeHuidig = scenIdx + 1;
  setTimeout(() => {
    if (nudgeHuidig < 5) {
      const volgende = document.getElementById('nudge-s' + (nudgeHuidig + 1));
      if (volgende) volgende.style.display = 'block';
    } else {
      const sw = document.getElementById('nudge-score-wrap');
      if (sw) {
        sw.style.display = 'block';
        document.getElementById('nudge-score').textContent = nudgeScore;
        const tekst = nudgeScore >= 4
          ? '🎓 Uitstekend! Je bent een behavioral economist in de dop.'
          : nudgeScore >= 3
          ? '👍 Goed gedaan! Je hebt de kern van nudge-theory goed begrepen.'
          : '📖 Herhaal de uitleg hieronder — nudges zijn subtiel maar krachtig.';
        document.getElementById('nudge-score-tekst').textContent = tekst;
      }
    }
  }, 1600);
}

function nudgeReset() { nudgeInit(); }

// ─────────────────────────────────────────────────────────────────
// MODULE C — ECOLOGISCHE VOETAFDRUK
// CO2-factoren (kg per € uitgegeven, gemiddeld NL 2024):
//   Vliegen:    3.2 kg/€  (IPCC-factor × seat km schatting)
//   Auto:       0.8 kg/€
//   Vlees/zuivel: 1.4 kg/€
//   Fast fashion: 0.9 kg/€
//   Energie:    1.1 kg/€
//   Elektronica:0.7 kg/€
// ─────────────────────────────────────────────────────────────────
const VF_CATS = [
  { id:'vf-vliegen',    label:'Vliegen',       factor:3.2,  kleur:'#ef4444', emoji:'✈️' },
  { id:'vf-auto',       label:'Auto',          factor:0.8,  kleur:'#f97316', emoji:'🚗' },
  { id:'vf-vlees',      label:'Vlees & zuivel',factor:1.4,  kleur:'#a16207', emoji:'🥩' },
  { id:'vf-kleding',    label:'Kleding',       factor:0.9,  kleur:'#7c3aed', emoji:'👗' },
  { id:'vf-energie',    label:'Energie',       factor:1.1,  kleur:'#0284c7', emoji:'⚡' },
  { id:'vf-elektronica',label:'Elektronica',   factor:0.7,  kleur:'#6366f1', emoji:'📱' }
];
let _vfChart = null;

function vfBereken() {
  const waarden = VF_CATS.map(c => {
    const v = parseFloat(document.getElementById(c.id).value) || 0;
    return { ...c, euro: v, co2: v * c.factor };
  });
  const totaal = waarden.reduce((s, c) => s + c.co2, 0);

  document.getElementById('vf-resultaat').style.display = 'block';
  document.getElementById('vf-kg').textContent = Math.round(totaal) + ' kg';

  // Meter
  const MAX_METER = 2000;
  const pctMeter = Math.min(100, (totaal / MAX_METER) * 100);
  const bar = document.getElementById('vf-meter-bar');
  bar.style.width = pctMeter + '%';
  bar.style.background = totaal < 400 ? '#22c55e' : totaal < 900 ? '#f59e0b' : '#ef4444';
  document.getElementById('vf-label').textContent =
    totaal === 0 ? '– vul bedragen in –' :
    totaal < 400 ? '🌿 Lage voetafdruk — goed bezig!' :
    totaal < 900 ? '⚠️ Gemiddelde voetafdruk — ruimte voor verbetering' :
                   '🔴 Hoge voetafdruk — grote milieu-impact';

  // Tips
  const zwaarste = [...waarden].sort((a,b) => b.co2 - a.co2)[0];
  let tips = '<strong>💡 Verbeterstappen:</strong><ul style="margin:.4rem 0 0 1.1rem;padding:0">';
  if (waarden.find(c=>c.id==='vf-vliegen').co2 > 50)
    tips += '<li>✈️ <strong>Vliegen</strong> heeft de hoogste CO₂-impact per euro. Overweeg de trein voor Europese reizen (tot 90% minder CO₂).</li>';
  if (waarden.find(c=>c.id==='vf-vlees').co2 > 30)
    tips += '<li>🥩 <strong>Vlees & zuivel</strong> reduceren: één dag per week geen vlees = ~350 kg CO₂ per jaar bespaard.</li>';
  if (waarden.find(c=>c.id==='vf-kleding').co2 > 20)
    tips += '<li>👗 <strong>Fast fashion</strong> vervangen door tweedehands (Vinted, Marktplaats) halveert de kledingvoetafdruk.</li>';
  if (waarden.find(c=>c.id==='vf-energie').co2 > 40)
    tips += '<li>⚡ <strong>Groene stroom</strong> kiezen kan jouw energievoetafdruk met 70% verlagen.</li>';
  if (totaal === 0)
    tips += '<li>Vul de bedragen hierboven in om tips te zien.</li>';
  tips += '</ul>';
  document.getElementById('vf-tips').innerHTML = tips;

  laadChartJs(() => {
    const ctx = document.getElementById('vf-bar-chart').getContext('2d');
    if (_vfChart) _vfChart.destroy();
    _vfChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: waarden.map(c => c.emoji + ' ' + c.label),
        datasets: [{
          label: 'kg CO₂ / maand',
          data: waarden.map(c => Math.round(c.co2 * 10) / 10),
          backgroundColor: waarden.map(c => c.kleur),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ' ' + c.parsed.y + ' kg CO₂' } }
        },
        scales: {
          y: { title: { display: true, text: 'kg CO₂' }, beginAtZero: true }
        }
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────
// MODULE D — BALANS & RESULTATENREKENING
// ─────────────────────────────────────────────────────────────────
let _blChart = null, _rrChart = null;

function balansTab(panel) {
  ['balans','resultaat','kengetallen','puzzel'].forEach(p => {
    const el = document.getElementById('balans-panel-' + p);
    const btn = document.getElementById('balans-tab-' + (p === 'puzzel' ? 'p' : p.charAt(0)));
    if (el) el.style.display = p === panel ? 'block' : 'none';
    if (btn) {
      btn.style.background = p === panel ? 'var(--g)' : 'transparent';
      btn.style.color = p === panel ? '#fff' : 'var(--fg)';
    }
  });
  if (panel === 'kengetallen') kgUpdate();
  if (panel === 'puzzel') setTimeout(() => { if (!document.getElementById('bp-bank')?.innerHTML?.trim()) bpRender('starter'); }, 80);
}

function balansGet() {
  const g  = parseFloat(document.getElementById('bl-gebouw').value) || 0;
  const v  = parseFloat(document.getElementById('bl-voorraad').value) || 0;
  const k  = parseFloat(document.getElementById('bl-kas').value) || 0;
  const d  = parseFloat(document.getElementById('bl-debiteuren').value) || 0;
  const ev = parseFloat(document.getElementById('bl-ev').value) || 0;
  const ll = parseFloat(document.getElementById('bl-ll').value) || 0;
  const cr = parseFloat(document.getElementById('bl-crediteuren').value) || 0;
  return { g, v, k, d, ev, ll, cr,
    totActiva: g + v + k + d,
    totPassiva: ev + ll + cr };
}

function balansUpdate() {
  const b = balansGet();
  const klopt = Math.abs(b.totActiva - b.totPassiva) < 0.5;

  document.getElementById('bl-balans-tabel').innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:.82rem">
      <thead><tr>
        <th style="background:#1a7a4a;color:#fff;padding:.4rem .7rem;text-align:left">ACTIVA</th>
        <th style="background:#1a7a4a;color:#fff;padding:.4rem .7rem;text-align:right">Bedrag (€)</th>
        <th style="background:#6366f1;color:#fff;padding:.4rem .7rem;text-align:left">PASSIVA</th>
        <th style="background:#6366f1;color:#fff;padding:.4rem .7rem;text-align:right">Bedrag (€)</th>
      </tr></thead>
      <tbody>
        <tr style="background:#f8fffe"><td style="padding:.38rem .7rem;border-bottom:1px solid #e5e7eb">Gebouw</td><td style="padding:.38rem .7rem;text-align:right;border-bottom:1px solid #e5e7eb">${fmt(b.g)}</td><td style="padding:.38rem .7rem;border-bottom:1px solid #e5e7eb">Eigen vermogen</td><td style="padding:.38rem .7rem;text-align:right;border-bottom:1px solid #e5e7eb">${fmt(b.ev)}</td></tr>
        <tr><td style="padding:.38rem .7rem;border-bottom:1px solid #e5e7eb">Voorraden</td><td style="padding:.38rem .7rem;text-align:right;border-bottom:1px solid #e5e7eb">${fmt(b.v)}</td><td style="padding:.38rem .7rem;border-bottom:1px solid #e5e7eb">Langlopende lening</td><td style="padding:.38rem .7rem;text-align:right;border-bottom:1px solid #e5e7eb">${fmt(b.ll)}</td></tr>
        <tr style="background:#f8fffe"><td style="padding:.38rem .7rem;border-bottom:1px solid #e5e7eb">Kas / Bank</td><td style="padding:.38rem .7rem;text-align:right;border-bottom:1px solid #e5e7eb">${fmt(b.k)}</td><td style="padding:.38rem .7rem;border-bottom:1px solid #e5e7eb">Crediteuren</td><td style="padding:.38rem .7rem;text-align:right;border-bottom:1px solid #e5e7eb">${fmt(b.cr)}</td></tr>
        <tr><td style="padding:.38rem .7rem">Debiteuren</td><td style="padding:.38rem .7rem;text-align:right">${fmt(b.d)}</td><td style="padding:.38rem .7rem"></td><td></td></tr>
        <tr style="background:#f0f0f0;font-weight:800"><td style="padding:.5rem .7rem">TOTAAL ACTIVA</td><td style="padding:.5rem .7rem;text-align:right;color:#1a7a4a">${fmt(b.totActiva)}</td><td style="padding:.5rem .7rem">TOTAAL PASSIVA</td><td style="padding:.5rem .7rem;text-align:right;color:#6366f1">${fmt(b.totPassiva)}</td></tr>
      </tbody>
    </table>`;

  const check = document.getElementById('bl-check');
  check.style.background = klopt ? '#f0fdf6' : '#fff5f5';
  check.style.color = klopt ? '#15803d' : '#b91c1c';
  check.textContent = klopt
    ? '✅ Balans klopt — Activa = Passiva'
    : '⚠️ Balans klopt niet — controleer de bedragen. Verschil: ' + fmt(Math.abs(b.totActiva - b.totPassiva));

  laadChartJs(() => {
    const ctx = document.getElementById('bl-balans-chart').getContext('2d');
    if (_blChart) _blChart.destroy();
    _blChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Activa', 'Passiva'],
        datasets: [
          { label: 'Gebouw', data: [b.g, 0], backgroundColor: '#1a7a4a', stack: 's' },
          { label: 'Voorraden', data: [b.v, 0], backgroundColor: '#22c55e', stack: 's' },
          { label: 'Kas/Debiteuren', data: [b.k + b.d, 0], backgroundColor: '#86efac', stack: 's' },
          { label: 'Eigen vermogen', data: [0, b.ev], backgroundColor: '#6366f1', stack: 's' },
          { label: 'Lening', data: [0, b.ll], backgroundColor: '#a5b4fc', stack: 's' },
          { label: 'Crediteuren', data: [0, b.cr], backgroundColor: '#c7d2fe', stack: 's' }
        ]
      },
      options: {
        responsive: true,
        scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => '€' + (v/1000) + 'k' } } },
        plugins: { tooltip: { callbacks: { label: c => c.dataset.label + ': ' + fmt(c.parsed.y) } } }
      }
    });
  });

  kgUpdate();
}

function rrGet() {
  const omzet = parseFloat(document.getElementById('rr-omzet').value) || 0;
  const inkoop = parseFloat(document.getElementById('rr-inkoop').value) || 0;
  const personeel = parseFloat(document.getElementById('rr-personeel').value) || 0;
  const huur = parseFloat(document.getElementById('rr-huur').value) || 0;
  const afschr = parseFloat(document.getElementById('rr-afschrijving').value) || 0;
  const overig = parseFloat(document.getElementById('rr-overig').value) || 0;
  const rente = parseFloat(document.getElementById('rr-rente').value) || 0;
  const brutomarge = omzet - inkoop;
  const bedrijfskosten = personeel + huur + afschr + overig;
  const bedrijfsresultaat = brutomarge - bedrijfskosten;
  const resultaatVoorBelasting = bedrijfsresultaat + rente;
  const vennootschapsBelasting = Math.max(0, resultaatVoorBelasting * 0.19); // VPB lage tarief 2026
  const nettoResultaat = resultaatVoorBelasting - vennootschapsBelasting;
  return { omzet, inkoop, brutomarge, bedrijfskosten, bedrijfsresultaat, rente, resultaatVoorBelasting, vennootschapsBelasting, nettoResultaat };
}

function rrUpdate() {
  const r = rrGet();
  const kleur = (n) => n >= 0 ? '#15803d' : '#b91c1c';
  const plusmin = (n) => (n >= 0 ? '+' : '') + fmt(n);

  document.getElementById('rr-tabel').innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:.82rem">
      <tbody>
        <tr style="background:#f0fdf6"><td style="padding:.4rem .7rem;font-weight:700">Omzet</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:#15803d">${fmt(r.omzet)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">Af: inkoopkosten</td><td style="padding:.35rem .7rem;text-align:right;color:#b91c1c">−${fmt(r.inkoop)}</td></tr>
        <tr style="background:#e8f9ef"><td style="padding:.4rem .7rem;font-weight:700">Brutomarge</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleur(r.brutomarge)}">${plusmin(r.brutomarge)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">Af: personeelskosten</td><td style="padding:.35rem .7rem;text-align:right;color:#b91c1c">−${fmt(r.personeel)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">Af: huurkosten</td><td style="padding:.35rem .7rem;text-align:right;color:#b91c1c">−${fmt(r.huur)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">Af: afschrijvingen</td><td style="padding:.35rem .7rem;text-align:right;color:#b91c1c">−${fmt(r.afschr)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">Af: overige kosten</td><td style="padding:.35rem .7rem;text-align:right;color:#b91c1c">−${fmt(r.overig)}</td></tr>
        <tr style="background:#f0f6ff"><td style="padding:.4rem .7rem;font-weight:700">Bedrijfsresultaat (EBIT)</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleur(r.bedrijfsresultaat)}">${plusmin(r.bedrijfsresultaat)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">${r.rente >= 0 ? 'Rentebaten' : 'Rentekosten'}</td><td style="padding:.35rem .7rem;text-align:right;color:${r.rente >= 0 ? '#15803d' : '#b91c1c'}">${plusmin(r.rente)}</td></tr>
        <tr style="background:#f8f9ff"><td style="padding:.4rem .7rem;font-weight:700">Resultaat vóór belasting</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleur(r.resultaatVoorBelasting)}">${plusmin(r.resultaatVoorBelasting)}</td></tr>
        <tr><td style="padding:.35rem .7rem;color:#555">Af: vennootschapsbelasting (19%)</td><td style="padding:.35rem .7rem;text-align:right;color:#b91c1c">−${fmt(r.vennootschapsBelasting)}</td></tr>
        <tr style="background:${r.nettoResultaat >= 0 ? '#f0fdf6' : '#fff5f5'};border-top:2px solid #e5e7eb"><td style="padding:.5rem .7rem;font-weight:800;font-family:'Lexend',sans-serif">NETTORESULTAAT (winst/verlies)</td><td style="padding:.5rem .7rem;text-align:right;font-weight:800;font-size:1rem;color:${kleur(r.nettoResultaat)}">${plusmin(r.nettoResultaat)}</td></tr>
      </tbody>
    </table>`;

  laadChartJs(() => {
    const ctx = document.getElementById('rr-chart').getContext('2d');
    if (_rrChart) _rrChart.destroy();
    _rrChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Omzet','Inkoop','Personeel','Huur','Afschr.','Overig','EBIT','Nettowinst'],
        datasets: [{
          label: '€',
          data: [r.omzet, r.inkoop, r.personeel, r.huur, r.afschr, r.overig, r.bedrijfsresultaat, r.nettoResultaat],
          backgroundColor: [
            '#1a7a4a','#ef4444','#f97316','#f59e0b','#8b5cf6','#6366f1',
            r.bedrijfsresultaat >= 0 ? '#22c55e' : '#dc2626',
            r.nettoResultaat >= 0 ? '#16a34a' : '#b91c1c'
          ],
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + fmt(c.parsed.y) } } },
        scales: { y: { ticks: { callback: v => '€' + (v/1000).toFixed(0) + 'k' } } }
      }
    });
  });

  kgUpdate();
}

function kgUpdate() {
  const b = balansGet();
  const r = rrGet();
  if (!document.getElementById('kg-tabel')) return;

  const ev = b.ev;
  const vv = b.ll + b.cr;
  const totPas = b.totPassiva;
  const solv = totPas > 0 ? (ev / totPas * 100) : 0;
  const liq1 = b.cr > 0 ? ((b.k + b.d) / b.cr) : 0;
  const liq2 = b.cr > 0 ? ((b.k + b.d + b.v) / b.cr) : 0;
  const rentab = b.totActiva > 0 ? (r.bedrijfsresultaat / b.totActiva * 100) : 0;

  function kleurKg(val, groen, oranje) {
    if (val >= groen) return '#15803d';
    if (val >= oranje) return '#b45309';
    return '#b91c1c';
  }

  document.getElementById('kg-tabel').innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:.83rem">
      <thead><tr>
        <th style="background:#1a7a4a;color:#fff;padding:.4rem .7rem;text-align:left">Kengetal</th>
        <th style="background:#1a7a4a;color:#fff;padding:.4rem .7rem;text-align:right">Waarde</th>
        <th style="background:#1a7a4a;color:#fff;padding:.4rem .7rem;text-align:right">Norm</th>
        <th style="background:#1a7a4a;color:#fff;padding:.4rem .7rem;text-align:left">Betekenis</th>
      </tr></thead>
      <tbody>
        <tr><td style="padding:.4rem .7rem;border-bottom:1px solid #e5e7eb">Solvabiliteit</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleurKg(solv,30,20)}">${solv.toFixed(1)}%</td><td style="padding:.4rem .7rem;text-align:right;color:#888">≥ 30%</td><td style="padding:.4rem .7rem;font-size:.78rem;color:#555">Kan het bedrijf schulden terugbetalen?</td></tr>
        <tr style="background:#fafafa"><td style="padding:.4rem .7rem;border-bottom:1px solid #e5e7eb">Liquiditeit 1 (current ratio)</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleurKg(liq2,1.5,1.0)}">${liq2.toFixed(2)}</td><td style="padding:.4rem .7rem;text-align:right;color:#888">≥ 1,5</td><td style="padding:.4rem .7rem;font-size:.78rem;color:#555">Kan korte schulden snel betalen?</td></tr>
        <tr><td style="padding:.4rem .7rem;border-bottom:1px solid #e5e7eb">Liquiditeit 2 (quick ratio)</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleurKg(liq1,1.0,0.7)}">${liq1.toFixed(2)}</td><td style="padding:.4rem .7rem;text-align:right;color:#888">≥ 1,0</td><td style="padding:.4rem .7rem;font-size:.78rem;color:#555">Zonder voorraad te verkopen</td></tr>
        <tr style="background:#fafafa"><td style="padding:.4rem .7rem">Rentabiliteit totaal vermogen</td><td style="padding:.4rem .7rem;text-align:right;font-weight:700;color:${kleurKg(rentab,8,3)}">${rentab.toFixed(1)}%</td><td style="padding:.4rem .7rem;text-align:right;color:#888">≥ 8%</td><td style="padding:.4rem .7rem;font-size:.78rem;color:#555">Hoeveel verdien je op elke € bezit?</td></tr>
      </tbody>
    </table>`;
}

// ─────────────────────────────────────────────────────────────────
// STIJLEN voor de nieuwe modules
// ─────────────────────────────────────────────────────────────────
(function() {
  const css = `
.nudge-scenario { background:var(--bg2); border-radius:14px; padding:1.1rem 1.2rem; margin-bottom:1rem; }
.nudge-nr { font-size:.73rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); margin-bottom:.55rem; }
.nudge-vraag { font-size:.87rem; line-height:1.65; margin-bottom:.9rem; }
.nudge-emoji { font-size:1.4rem; margin-right:.4rem; }
.nudge-opties { display:flex; flex-direction:column; gap:.5rem; }
.nudge-btn { text-align:left; background:var(--white); border:1.5px solid #d1d5db; border-radius:10px; padding:.65rem .9rem; font-size:.83rem; font-family:'DM Sans',sans-serif; cursor:pointer; transition:border-color .18s,background .18s; line-height:1.4; }
.nudge-btn:hover:not(:disabled) { border-color:#1a7a4a; background:#f0fdf6; }
.balans-invoer-rij { display:grid; grid-template-columns:1fr 1fr; gap:.4rem; align-items:center; margin-bottom:.45rem; }
.balans-invoer-rij label { font-size:.8rem; color:var(--muted); line-height:1.3; }
.balans-invoer-rij input { padding:.4rem .55rem; border:1.5px solid #d1d5db; border-radius:8px; font-size:.85rem; text-align:right; background:var(--white); color:var(--fg); width:100%; box-sizing:border-box; }
.balans-invoer-rij input:focus { outline:none; border-color:#1a7a4a; }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────────
// KNOPJES toevoegen aan het REKENMENU (s-rekenen)
// Wordt uitgevoerd zodra de pagina geladen is
// ─────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
// VLACONOMIE.NL — v13.0 UITBREIDINGEN
// Nieuwe modules (bestaande variabelen ONGEWIJZIGD):
//   1. Gestapelde staafgrafiek bruto→netto (bn-stacked-chart)
//   2. Scenario-engine: Economische Schokken
//   3. Brede Welvaart-index + CO2-factor + geluksfactor
//   4. Input-validatie met didactische popovers
// ══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// 1. BELASTINGSCHIJVEN 2026 — GESTAPELDE STAAFGRAFIEK
//    Kerndoel: EC/K/5A 'Arbeid en productie' + EC/V/1 'Verrijkingsstof'
//    Leerling ziet direct: netto / loonheffing / pensioen
// ─────────────────────────────────────────────────────────────────
let _bnStackedChart = null;

/**
 * bnBerekeningUitgebreid — berekent netto, belasting én pensioenafdracht
 * @param {number} bruto  Jaarbrutoloon
 * @param {boolean} hk    Heffingskortingen toepassen
 * @param {boolean} aow   AOW-leeftijd (geen AOW-premie)
 * @param {Object} [overrides]  Optionele schijf/korting-overrides voor scenario's
 */
const bnBerekeningUitgebreid = (bruto, hk, aow, overrides = {}) => {
  const grens1   = overrides.grens1   ?? 38441;
  const tarief1  = aow ? 0.0932 : 0.3697;
  const tarief2  = 0.495;
  const ahkMax   = overrides.ahkMax   ?? 3362;
  const ahkGrens = 24814;
  const ahkAfbouw = 0.06230;
  const arkMax   = 5599;
  const arkOpbouwGrens  = 25599;
  const arkAfbouwGrens  = 39957;
  const arkAfbouw = 0.06510;
  const pensioenpct = 0.045; // indicatief 4,5%

  let belasting = bruto <= grens1
    ? bruto * tarief1
    : grens1 * tarief1 + (bruto - grens1) * tarief2;

  let ahk = 0, ark = 0;
  if (hk) {
    ahk = bruto <= ahkGrens ? ahkMax : Math.max(0, ahkMax - (bruto - ahkGrens) * ahkAfbouw);
    if (bruto <= arkOpbouwGrens)      ark = bruto * 0.2188;
    else if (bruto <= arkAfbouwGrens) ark = arkMax;
    else                              ark = Math.max(0, arkMax - (bruto - arkAfbouwGrens) * arkAfbouw);
  }

  const totaalBelasting = Math.max(0, belasting - ahk - ark);
  const pensioen = bruto * pensioenpct;
  const netto = bruto - totaalBelasting - pensioen;

  return { netto: Math.max(0, netto), totaalBelasting, pensioen, bruto, ahk, ark };
};

/** Teken de gestapelde staafgrafiek (bruto = netto + belasting + pensioen) */
const bnTekenStacked = (bruto, hk, aow, overrides = {}) => {
  const r = bnBerekeningUitgebreid(bruto, hk, aow, overrides);
  if (!document.getElementById('bn-stacked-chart')) return;
  const ctx = document.getElementById('bn-stacked-chart').getContext('2d');
  if (_bnStackedChart) _bnStackedChart.destroy();

  _bnStackedChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jouw brutoloon'],
      datasets: [
        {
          label: 'Nettoloon',
          data: [Math.round(r.netto)],
          backgroundColor: '#1a7a4a',
          borderRadius: 4,
          stack: 'brutoloon'
        },
        {
          label: 'Loonheffing',
          data: [Math.round(r.totaalBelasting)],
          backgroundColor: '#ef4444',
          borderRadius: 0,
          stack: 'brutoloon'
        },
        {
          label: 'Pensioenafdracht (~4,5%)',
          data: [Math.round(r.pensioen)],
          backgroundColor: '#6366f1',
          borderRadius: 4,
          stack: 'brutoloon'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Lexend', size: 11 } } },
        tooltip: {
          callbacks: {
            label: c => ' ' + c.dataset.label + ': ' + fmt(c.parsed.x)
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { callback: v => '€' + (v / 1000).toFixed(0) + 'k' }
        },
        y: { stacked: true, display: false }
      }
    }
  });
};

// ─────────────────────────────────────────────────────────────────
// 2. SCENARIO-ENGINE: ECONOMISCHE SCHOKKEN
//    Kerndoel: EC/K/7 'Internationale ontwikkelingen' + EC/V/1
//    Simuleert beleids- en conjunctuurschokken op nettoloon
// ─────────────────────────────────────────────────────────────────

/** Verzameling van scenario-definities */
const BN_SCENARIOS = {
  inflatie: {
    label: '📈 Inflatie +4%',
    beschrijving: (basis, nieuw) =>
      `<strong>Inflatie-scenario (+4%):</strong> Door prijsstijging daalt je <em>koopkracht</em> met 4%, ook al blijft je brutoloon hetzelfde. ` +
      `Je nettoloon is nominaal ${fmt(nieuw.netto)}, maar koopt effectief ${fmt(nieuw.netto / 1.04)} aan goederen — ` +
      `een koopkrachtverlies van ${fmt(nieuw.netto - nieuw.netto / 1.04)}. ` +
      `<em>Prijscompensatie</em> (loonsverhoging gelijk aan inflatie) zou dit verlies opvangen (EC/V/1).`,
    overrides: {}
  },
  schijf_lager: {
    label: '📉 Schijfgrens −€5.000',
    beschrijving: (basis, nieuw) => {
      const verschil = nieuw.totaalBelasting - basis.totaalBelasting;
      return `<strong>Beleidswijziging:</strong> De grens van schijf 1 daalt van €38.441 naar €33.441. ` +
        `Daardoor valt meer van je inkomen in het hoge tarief (49,5%). ` +
        `Je betaalt ${fmt(verschil)} <em>meer</em> belasting per jaar. ` +
        `Nettoloon daalt van ${fmt(basis.netto)} naar ${fmt(nieuw.netto)}. ` +
        `Dit laat zien hoe beleid direct invloed heeft op jouw beschikbaar inkomen (EC/V/1 & EC/K/6).`;
    },
    overrides: { grens1: 33441 }
  },
  ahk_bezuiniging: {
    label: '✂️ Heffingskorting −€500',
    beschrijving: (basis, nieuw) => {
      const verschil = nieuw.totaalBelasting - basis.totaalBelasting;
      return `<strong>Bezuiniging heffingskorting:</strong> De algemene heffingskorting daalt met €500 (van €3.362 naar €2.862). ` +
        `Dit betekent dat je €${Math.round(verschil)} meer belasting betaalt. ` +
        `Nettoloon: ${fmt(nieuw.netto)} (was ${fmt(basis.netto)}). ` +
        `Heffingskortingen zijn er om lagere inkomens te ondersteunen — bezuinigen treft hen relatief het hardst.`;
    },
    overrides: { ahkMax: 2862 }
  }
};

/** Activeer een scenario en toon de conclusie */
window.bnScenario = function(scenarioKey) {
  const bruto = parseFloat(document.getElementById('bn-brutoloon').value) || 38000;
  const hk    = document.getElementById('bn-heffingskorting').checked;
  const aow   = document.getElementById('bn-aow').checked;
  const conclEl = document.getElementById('bn-scenario-conclusie');

  if (scenarioKey === 'reset') {
    conclEl.style.display = 'none';
    laadChartJs(() => bnTekenStacked(bruto, hk, aow));
    return;
  }

  const sc = BN_SCENARIOS[scenarioKey];
  if (!sc) return;

  const basis = bnBerekeningUitgebreid(bruto, hk, aow);
  const nieuw  = bnBerekeningUitgebreid(bruto, hk, aow, sc.overrides);

  laadChartJs(() => bnTekenStacked(bruto, hk, aow, sc.overrides));

  conclEl.style.display = 'block';
  conclEl.innerHTML = `
    <strong style="font-size:.85rem">${sc.label} — Conclusie</strong><br>
    <div style="margin-top:.5rem;font-size:.83rem;line-height:1.65">${sc.beschrijving(basis, nieuw)}</div>
    <div style="margin-top:.55rem;display:flex;gap:.7rem;flex-wrap:wrap;font-size:.78rem">
      <span style="background:#dcfce7;padding:2px 8px;border-radius:6px">Netto basis: ${fmt(basis.netto)}</span>
      <span style="background:#fee2e2;padding:2px 8px;border-radius:6px">Netto scenario: ${fmt(nieuw.netto)}</span>
      <span style="background:#fef9c3;padding:2px 8px;border-radius:6px">Verschil: ${fmt(nieuw.netto - basis.netto)}</span>
    </div>`;
};

// ─────────────────────────────────────────────────────────────────
// 3. BREDE WELVAART-INDEX
//    Kerndoel: EC/K/8 'Natuur en milieu' + SLO 7.3 'Economische groei'
//    Elke categorie krijgt CO2-factor + geluksfactor
//    Progress-bars kleuren van groen → rood op basis van score
// ─────────────────────────────────────────────────────────────────

/**
 * CO2-factoren: kg CO₂ per euro per maand (indicatief, gebaseerd op CE Delft 2023)
 * Geluksfactoren: bijdrage aan subjectief welzijn (schaal 0–1, gebaseerd op WHR-data)
 */
const VF_FACTOREN = {
  vlees:        { co2: 0.012, geluk: 0.55 },
  zuivel:       { co2: 0.008, geluk: 0.60 },
  groente:      { co2: 0.002, geluk: 0.80 },
  transport:    { co2: 0.025, geluk: 0.40 },
  vliegen:      { co2: 0.180, geluk: 0.65 },
  kleding:      { co2: 0.015, geluk: 0.50 },
  energie:      { co2: 0.020, geluk: 0.45 },
  elektronica:  { co2: 0.030, geluk: 0.55 }
};

/**
 * Berekent de brede welvaart-index en tekent de progress-bars
 * Wordt aangeroepen vanuit vfBereken() via hook
 */
const wiUpdate = () => {
  const ids = Object.keys(VF_FACTOREN);
  let totaalCO2 = 0, totaalGeluk = 0, totaalBudget = 0;

  ids.forEach(id => {
    const el = document.getElementById('vf-' + id);
    if (!el) return;
    const bedrag = parseFloat(el.value) || 0;
    totaalCO2    += bedrag * VF_FACTOREN[id].co2;
    totaalGeluk  += bedrag * VF_FACTOREN[id].geluk;
    totaalBudget += bedrag;
  });

  if (totaalBudget === 0) return;

  // Financiële score: hoe dicht bij een sluitend budget?
  const finScore  = Math.min(100, 100);                           // nvt hier, altijd 100% ingevuld
  // Geluksscore: gewogen gemiddelde (max geluk = alle budget naar geluk=1.0)
  const gelukScore = Math.min(100, Math.round((totaalGeluk / totaalBudget) * 100));
  // CO2-score: hoe laag is de CO2 (0 = goed; >1000kg = slecht)
  const co2Pct = Math.min(100, Math.round((totaalCO2 / 1000) * 100));

  const kleurBar = (pct, inversed = false) => {
    const p = inversed ? 100 - pct : pct;
    if (p >= 70) return '#22c55e';   // groen
    if (p >= 40) return '#f59e0b';   // oranje
    return '#ef4444';                 // rood
  };

  const setBar = (baseId, pct, inversed = false) => {
    const bar = document.getElementById(baseId + '-bar');
    const lbl = document.getElementById(baseId + '-pct');
    if (!bar || !lbl) return;
    bar.style.width = pct + '%';
    bar.style.background = kleurBar(pct, inversed);
    lbl.textContent = pct + '%';
  };

  setBar('vf-wi-fin',  100);
  setBar('vf-wi-geluk', gelukScore);
  setBar('vf-wi-co2',   co2Pct, true);  // inversed: hoger = slechter

  const conclusie = document.getElementById('vf-wi-conclusie');
  if (!conclusie) return;

  let tekst = '';
  if (gelukScore >= 65 && co2Pct <= 35) {
    tekst = '🌟 <strong>Hoge brede welvaart:</strong> Je keuzes scoren goed op zowel geluk als lage CO₂-impact. Dit sluit aan bij wat economen "duurzame welvaart" noemen.';
  } else if (co2Pct > 60) {
    tekst = '⚠️ <strong>Hoge planeet-impact:</strong> Je CO₂-voetafdruk is fors. Kleine verschuivingen (minder vlees, minder vliegen) kunnen je impact sterk verlagen zonder je geluk te schaden.';
  } else if (gelukScore < 40) {
    tekst = '💡 <strong>Lage geluks-score:</strong> Veel van je uitgaven leveren relatief weinig welzijn op. Denk aan: meer besteden aan sociale activiteiten of gezond eten vs. elektronica.';
  } else {
    tekst = '📊 <strong>Gemiddelde brede welvaart:</strong> Er is ruimte om zowel gelukkiger als duurzamer te leven. Kijk welke categorie je kunt aanpassen voor de meeste winst.';
  }
  tekst += `<div style="margin-top:.4rem;font-size:.75rem;color:var(--muted)">CO₂/maand: ~${Math.round(totaalCO2)} kg · Geluksgewogen budget: ${Math.round(totaalGeluk/totaalBudget*100)}% · Kerndoel EC/K/8</div>`;
  conclusie.innerHTML = tekst;

  document.getElementById('vf-welvaart-wrap').style.display = 'block';
};

// Koppel wiUpdate aan de bestaande vfBereken via event-hook
(function() {
  const origVfBereken = window.vfBereken;
  window.vfBereken = function() {
    if (typeof origVfBereken === 'function') origVfBereken();
    setTimeout(wiUpdate, 50);
  };
})();

// ─────────────────────────────────────────────────────────────────
// 4. INPUT-VALIDATIE MET DIDACTISCHE POPOVERS
//    Kerndoel: EC/K/2 'Basisvaardigheden' — rekenvaardigheden
//    Geeft leerling contextuele feedback bij onmogelijke invoer
// ─────────────────────────────────────────────────────────────────

/** Minimumuurloon 2026: €14,16; 40 uur/week × 52 weken = ~€29.453 jaarloon */
const MINIMUMLOON_2026 = 29453;
const MODAAL_2026      = 44000;   // modaal inkomen 2026 (CBS indicatie)

/** Toon een didactische popover bij een invoerveld */
const toonValidatiePopover = (inputEl, tekst) => {
  // Verwijder bestaande popover
  const bestaand = document.getElementById('bn-validatie-popover');
  if (bestaand) bestaand.remove();

  const pop = document.createElement('div');
  pop.id = 'bn-validatie-popover';
  pop.style.cssText = `
    position:absolute; z-index:9999; background:#fffbe6; border:2px solid #f59e0b;
    border-radius:12px; padding:.8rem 1rem; font-size:.82rem; line-height:1.55;
    max-width:320px; box-shadow:0 4px 20px rgba(0,0,0,.12); font-family:'DM Sans',sans-serif;
  `;
  pop.innerHTML = `<div style="font-weight:700;margin-bottom:.3rem;color:#92400e">💡 Economische check</div>${tekst}
    <button onclick="document.getElementById('bn-validatie-popover').remove()"
      style="margin-top:.5rem;display:block;font-size:.75rem;background:none;border:none;color:#b45309;cursor:pointer;font-weight:700">✕ Sluiten</button>`;

  // Positioneer relatief aan het input-element
  const rect = inputEl.getBoundingClientRect();
  pop.style.top  = (rect.bottom + window.scrollY + 6) + 'px';
  pop.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 340) + 'px';
  document.body.appendChild(pop);

  // Auto-verwijder na 8 seconden
  setTimeout(() => { if (document.getElementById('bn-validatie-popover')) document.getElementById('bn-validatie-popover').remove(); }, 8000);
};

/** Valideer het brutoloon-invoerveld */
const bnValideerInvoer = (el) => {
  const waarde = parseFloat(el.value);
  if (isNaN(waarde) || waarde === 0) return true; // leeg veld: geen validatie

  if (waarde < 0) {
    toonValidatiePopover(el, `Een brutoloon kan niet negatief zijn. Voer een positief getal in.`);
    return false;
  }
  if (waarde > 0 && waarde < MINIMUMLOON_2026) {
    toonValidatiePopover(el, `
      Het minimumuurloon in 2026 is <strong>€14,16</strong>. Bij een 40-urige werkweek is het
      <em>minimumloon per jaar</em> <strong>€${MINIMUMLOON_2026.toLocaleString('nl-NL')}</strong>.
      Dit inkomen ligt daar ver onder — in Nederland is dit wettelijk niet toegestaan.<br>
      <small>Bron: Rijksoverheid, Wet minimumloon 2026 (EC/K/5A)</small>
    `);
    return false;
  }
  if (waarde > 300000) {
    toonValidatiePopover(el, `
      Dit inkomen is hoger dan het wettelijke maximum voor topbestuurders bij 
      de overheid (<em>Balkenende-norm</em>: ~€233.000 in 2026). Controleer je invoer.
      De calculator werkt tot <strong>€300.000</strong>.
    `);
    return false;
  }
  return true;
};

// Hoog de bestaande bnBereken-functie op met validatie
(function() {
  const origBnBereken = window.bnBereken;
  window.bnBereken = function() {
    const el = document.getElementById('bn-brutoloon');
    if (el && !bnValideerInvoer(el)) return; // stop bij ongeldige invoer
    if (typeof origBnBereken === 'function') origBnBereken();
    // Teken ook de gestapelde grafiek
    const bruto = parseFloat(document.getElementById('bn-brutoloon').value) || 0;
    const hk    = document.getElementById('bn-heffingskorting').checked;
    const aow   = document.getElementById('bn-aow').checked;
    laadChartJs(() => bnTekenStacked(bruto, hk, aow));
  };
})();


// ══════════════════════════════════════════════════════
// VMBO-BB ECONOMIE 2023 — JavaScript
// ══════════════════════════════════════════════════════
const bb23Scores = {};
const BB23_MAX = 42;

function bb23UpdateBalk() {
  const totaal = Object.values(bb23Scores).reduce((a,b)=>a+b,0);
  const pct = Math.round(totaal/BB23_MAX*100);
  const el = document.getElementById('bb23-score-balk');
  const badge = document.getElementById('bb23-score-badge');
  const tekst = document.getElementById('bb23-score-tekst');
  const eind = document.getElementById('bb23-eindstand');
  const cijfer = document.getElementById('bb23-eindcijfer');
  if(el) el.style.width = pct+'%';
  if(badge) badge.textContent = 'Score: '+totaal+' / '+BB23_MAX+' pt';
  if(tekst) tekst.textContent = totaal+' van '+BB23_MAX+' punten';
  if(eind) eind.textContent = totaal+' / '+BB23_MAX+' punten';
  if(cijfer) {
    const c = Math.round((totaal/BB23_MAX)*9+1);
    cijfer.textContent = 'Indicatief cijfer: ' + Math.min(10,Math.max(1,c));
  }
}

function bb23MC(vraagNr, gekozen, goed) {
  const wrap = document.getElementById('bb23-mc'+vraagNr);
  const fb   = document.getElementById('bb23-fb'+vraagNr);
  if(!wrap || wrap.dataset.gedaan) return;
  wrap.dataset.gedaan = '1';
  // Kleur knoppen: goed = groen met vinkje-klasse, fout gekozen = rood
  Array.from(wrap.querySelectorAll('.ex25-mc-btn')).forEach(btn => {
    btn.disabled = true;
    const letter = btn.textContent.trim().charAt(0);
    if(letter === goed)                           btn.classList.add('correct');
    if(letter === gekozen && gekozen !== goed)    btn.classList.add('fout');
  });
  const juist = gekozen === goed;
  bb23Scores['v'+vraagNr] = juist ? 1 : 0;
  // Feedbackbalk — zelfde aanpak als kb23MC
  if(fb) {
    fb.style.display = 'block';
    if(juist) {
      fb.className = 'ex25-mc-feedback goed';
      fb.textContent = '✅ Goed! Het juiste antwoord is ' + goed + '.';
    } else {
      fb.className = 'ex25-mc-feedback fout';
      fb.textContent = '❌ Helaas — het juiste antwoord is ' + goed + '.';
    }
  }
  bb23UpdateBalk();
}

function bb23ToonAntwoord(nr) {
  const ab = document.getElementById('bb23-ab'+nr);
  if(ab) ab.style.display = 'block';
}

function bb23Punt(nr, punten, max) {
  bb23Scores['v'+nr] = punten;
  const zbEl = document.getElementById('bb23-zb'+nr);
  if(zbEl) {
    Array.from(zbEl.querySelectorAll('.ex25-zb-btn')).forEach(b => {
      b.style.background = '';
      b.style.color = '';
    });
    const knoppen = zbEl.querySelectorAll('.ex25-zb-btn');
    knoppen.forEach(b => {
      if(parseInt(b.textContent) === punten) {
        b.style.background = '#1a7a4a';
        b.style.color = '#fff';
      }
    });
  }
  bb23UpdateBalk();
}

function bb23Reset() {
  Object.keys(bb23Scores).forEach(k => delete bb23Scores[k]);
  // Reset MC knoppen
  document.querySelectorAll('[id^="bb23-mc"]').forEach(wrap => {
    delete wrap.dataset.gedaan;
    Array.from(wrap.querySelectorAll('.ex25-mc-btn')).forEach(btn => {
      btn.disabled = false;
      btn.style.background = '';
      btn.classList.remove('correct', 'fout');
    });
  });
  // Verberg feedback
  document.querySelectorAll('[id^="bb23-fb"]').forEach(el => el.style.display='none');
  // Verberg antwoordboxen (open vragen + kruistabellen)
  document.querySelectorAll('[id^="bb23-ab"]').forEach(el => el.style.display='none');
  // Reset textareas
  document.querySelectorAll('[id^="bb23-ta"]').forEach(el => el.value='');
  // Reset kruistabel cellen
  document.querySelectorAll('[id^="bb23-kr-"]').forEach(el => { el.textContent=''; el.style.background=''; });
  // Reset zelfbeoordeling knoppen kruistabellen
  [1,9,15,22].forEach(function(n) {
    var zb = document.getElementById('bb23-zb'+n);
    if(zb) zb.querySelectorAll('.ex25-zb-btn').forEach(function(b){ b.classList.remove('geselecteerd'); });
  });
  // Reset zelfbeoordeling knoppen
  document.querySelectorAll('[id^="bb23-zb"] .ex25-zb-btn').forEach(b => {
    b.style.background=''; b.style.color='';
  });
  bb23UpdateBalk();
  window.scrollTo(0,0);
}

function bb23Kruis(cel) {
  // Schakel kruisje aan/uit
  if (cel.textContent === '✗') {
    cel.textContent = '';
    cel.style.background = '';
  } else {
    // Verwijder kruisje uit andere cellen in dezelfde rij
    var rij = cel.parentElement;
    rij.querySelectorAll('td[id^="bb23-kr-"]').forEach(function(td) {
      td.textContent = '';
      td.style.background = '';
    });
    cel.textContent = '✗';
    cel.style.background = '#e8f4fd';
  }
}

function startExamenBB2023() {
  bb23Reset();
  show('s-examen-bb-2023');
}

// ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // Wacht tot het mgrid van s-rekenen aanwezig is
  const mgrid = document.querySelector('#s-rekenen .mgrid');

  if (!mgrid) return;

  const nieuweKaarten = [
    {
      onclick: "show('s-bruto-netto')",
      label: "💰 Bruto-Netto 2026 — Kerndoel 27A",
      kleur: "#1a7a4a",
      achtergrond: "#f0fdf4",
      badge: "HAVO/VWO",
      badgekleur: "#1a7a4a",
      sub: "Belastingschijven 2026 + grafiek",
      icon: "💰"
    },
    {
      onclick: "show('s-nudging')",
      label: "🧠 Nudging-Simulator — Kerndoel 27B",
      kleur: "#7c3aed",
      achtergrond: "#faf5ff",
      badge: "HAVO/VWO",
      badgekleur: "#7c3aed",
      sub: "Gedragseconomie & keuzearchitectuur",
      icon: "🧠"
    },
    {
      onclick: "show('s-voetafdruk')",
      label: "🌍 Ecologische Voetafdruk",
      kleur: "#15803d",
      achtergrond: "#f0fdf4",
      badge: "Duurzaamheid",
      badgekleur: "#15803d",
      sub: "CO₂-impact van jouw uitgaven",
      icon: "🌍"
    },
    {
      onclick: "show('s-balans')",
      label: "📋 Balans & Resultatenrekening",
      kleur: "#6366f1",
      achtergrond: "#f8f9ff",
      badge: "HAVO/VWO",
      badgekleur: "#6366f1",
      sub: "Financiële geletterdheid mini-onderneming",
      icon: "📋"
    }
  ];

  // Voeg scheidingslabel toe
  const label = document.createElement('div');
  label.style.cssText = 'grid-column:span 3;font-family:"Lexend",sans-serif;font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:.8rem;padding-bottom:.2rem;border-bottom:1px solid var(--border,#e5e7eb)';
  label.textContent = '✦ HAVO/VWO Kerndoel 27 Modules';
  mgrid.appendChild(label);

  nieuweKaarten.forEach(k => {
    const div = document.createElement('div');
    div.className = 'mcard';
    div.setAttribute('onclick', k.onclick);
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', k.label);
    div.style.cssText = `border:2px solid ${k.kleur};background:${k.achtergrond}`;
    div.innerHTML = `<div class="mi">${k.icon}</div><h3 style="color:${k.kleur}">${k.label.replace(/^[^ ]+ /,'').split(' — ')[0]} <span style="background:${k.badgekleur};color:#fff;font-size:.65rem;padding:.15rem .5rem;border-radius:20px;font-weight:700;vertical-align:middle">${k.badge}</span></h3><p>${k.sub}</p>`;
    mgrid.appendChild(div);
  });
});

