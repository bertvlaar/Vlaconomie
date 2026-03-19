/* vlaconomie.nl — rekentrainer.js
   Verplaatst vanuit index.html
*/

/* ── Rekentrainer module v10.2 ── */
// ═══════════════════════════════════════════════════════════════════════
//  MODULE: REKENTRAINER — Big Five interactieve oefenmodule  (v10.2)
//  ─────────────────────────────────────────────────────────────────────
//  Nieuw in v10.2:
//    • Multi-select chips: leerling kiest 1..n categorieën
//    • Streak-teller 🔥 + hoogste streak in localStorage
//    • Confetti-effect bij 5 goed op rij
//    • Shake-animatie bij fout antwoord
//    • 'Kopieer berekening'-knop in stappenplan
//    • Getallen in stappenplan extra dikgedrukt (dyslexie-vriendelijk)
//  ─────────────────────────────────────────────────────────────────────
//  Publieke API (window.*):
//    rtToggleChip(btn)       — chip aan/uit zetten
//    rtAllesSelecteren()     — alle chips aan als geen actief, anders alles uit→alles aan
//    rtNieuweOpgave()        — genereer en toon nieuwe opgave
//    rtCheck()               — controleer het ingevulde antwoord
//    rtResetFeedback()       — wis feedback bij nieuwe invoer
//    rtResetScore()          — reset sessiescore én streak
//    rtKopieerBerekening()   — kopieer stappenplan naar klembord
// ═══════════════════════════════════════════════════════════════════════
(function(){
  'use strict';

  // ── State ──────────────────────────────────────────────────────────
  let rtHuidigeOpgave = null;
  let rtScore = { pogingen:0, goed:0, fout:0 };
  let rtStreak = 0;
  const RT_STREAK_KEY = 'rt_hoogste_streak';

  // ── Level-systeem ───────────────────────────────────────────────────
  const RT_LEVELS = [
    { vanaf:  0, naam: 'Consument',           icon: '🛍️' },
    { vanaf: 10, naam: 'Winkelier',            icon: '🏪' },
    { vanaf: 20, naam: 'Bankier',              icon: '🏦' },
    { vanaf: 30, naam: 'Minister van Financiën', icon: '💼' },
    { vanaf: 50, naam: 'Econoom',              icon: '🎓' },
    { vanaf: 80, naam: 'Nobel-laureaat',       icon: '🏅' },
  ];

  function rtGetLevel(goedAntwoorden) {
    let lv = RT_LEVELS[0];
    for (const l of RT_LEVELS) { if (goedAntwoorden >= l.vanaf) lv = l; }
    return lv;
  }

  function rtGetLevelNr(goedAntwoorden) {
    let nr = 1;
    for (let i = 0; i < RT_LEVELS.length; i++) { if (goedAntwoorden >= RT_LEVELS[i].vanaf) nr = i + 1; }
    return nr;
  }

  function rtUpdateLevelUI(animeer) {
    const lv   = rtGetLevel(rtScore.goed);
    const nr   = rtGetLevelNr(rtScore.goed);
    const icon = document.getElementById('rt-level-icon');
    const num  = document.getElementById('rt-level-num');
    const naam = document.getElementById('rt-level-naam');
    if (!icon) return;
    icon.textContent = lv.icon;
    num.textContent  = nr;
    naam.textContent = lv.naam;
    if (animeer) {
      const wrap = document.getElementById('rt-level-wrap');
      wrap.classList.remove('rt-levelup-anim');
      void wrap.offsetWidth;
      wrap.classList.add('rt-levelup-anim');
      wrap.addEventListener('animationend', () => wrap.classList.remove('rt-levelup-anim'), { once: true });
    }
  }

  // ── Hulpfuncties ────────────────────────────────────────────────────

  function rnd(min, max, stap) {
    stap = stap || 1;
    const n = Math.floor((max - min) / stap);
    return Math.round((min + Math.floor(Math.random() * (n + 1)) * stap) * 1e9) / 1e9;
  }

  function fmt2(n) { return Math.round(n * 100) / 100; }
  function fmt1(n) { return Math.round(n * 10)  / 10;  }

  function nfmt(n) {
    const r = fmt2(n);
    return Number.isInteger(r) ? String(r) : r.toFixed(2).replace('.', ',');
  }

  function fmtEur(n) {
    return '\u20ac\u202f' + fmt2(n).toLocaleString('nl-NL', {minimumFractionDigits:2, maximumFractionDigits:2});
  }

  function leesGetal(str) {
    if (!str && str !== 0) return NaN;
    let s = String(str).trim().replace(/[^\d.,''\-]/g, '');
    if (s.includes('.') && s.includes(',')) {
      const pi = s.indexOf('.'), ki = s.indexOf(',');
      if (pi < ki) { s = s.replace(/\./g, '').replace(',', '.'); }
      else         { s = s.replace(/,/g, ''); }
    } else {
      s = s.replace(',', '.');
    }
    return parseFloat(s);
  }

  function dicht(invoer, juist) {
    const abs = Math.abs(invoer - juist);
    const rel = juist !== 0 ? abs / Math.abs(juist) : abs;
    return abs <= 0.02 || rel <= 0.005;
  }

  // ── Actieve categorieën ophalen uit chips ───────────────────────────
  function getActieveCats() {
    const chips = document.querySelectorAll('#rt-chips .rt-chip.active');
    if (!chips.length) return Object.keys(rtGenerators); // fallback: alles
    return Array.from(chips).map(c => c.dataset.cat);
  }

  // ── Chip-interactie ─────────────────────────────────────────────────
  window.rtToggleChip = function(btn) {
    const actief = document.querySelectorAll('#rt-chips .rt-chip.active');
    // Voorkom dat de laatste chip uit wordt gezet
    if (actief.length === 1 && btn.classList.contains('active')) return;
    btn.classList.toggle('active');
    rtNieuweOpgave();
  };

  window.rtAllesSelecteren = function() {
    const chips = document.querySelectorAll('#rt-chips .rt-chip');
    const aantalActief = document.querySelectorAll('#rt-chips .rt-chip.active').length;
    // Als alles al aan is → zet alles aan (zelfde); anders: zet alles aan
    chips.forEach(c => c.classList.add('active'));
    rtNieuweOpgave();
  };

  // ── Streak-logica ───────────────────────────────────────────────────
  function rtStreakGoed() {
    const vorigeLevel = rtGetLevelNr(rtScore.goed - 1); // goed al verhoogd vóór deze call
    rtStreak++;
    rtUpdateStreakUI();
    if (rtStreak % 5 === 0) rtConfetti(); // confetti bij 5, 10, 15, …
    // Level-up check
    const nieuwLevel = rtGetLevelNr(rtScore.goed);
    rtUpdateLevelUI(nieuwLevel > vorigeLevel);
    // Sla hoogste streak op
    const huidigRecord = parseInt(localStorage.getItem(RT_STREAK_KEY) || '0', 10);
    if (rtStreak > huidigRecord) localStorage.setItem(RT_STREAK_KEY, rtStreak);
  }

  function rtStreakFout() {
    rtStreak = 0;
    rtUpdateStreakUI();
  }

  function rtUpdateStreakUI() {
    const numEl = document.getElementById('rt-streak-num');
    const recEl = document.getElementById('rt-streak-record');
    if (numEl) numEl.textContent = rtStreak;
    if (recEl) {
      const rec = parseInt(localStorage.getItem(RT_STREAK_KEY) || '0', 10);
      recEl.textContent = rec > 0 ? `(record: ${rec})` : '';
    }
  }

  // ── Shake-animatie ──────────────────────────────────────────────────
  function rtShake(el) {
    if (!el) return;
    el.classList.remove('rt-shake');
    void el.offsetWidth; // reflow forceren
    el.classList.add('rt-shake');
    el.addEventListener('animationend', () => el.classList.remove('rt-shake'), { once: true });
  }

  // ── Confetti-effect ─────────────────────────────────────────────────
  function rtConfetti() {
    const canvas = document.getElementById('rt-confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const kleuren = ['#1a7a4a','#2ecc71','#f59e0b','#3b82f6','#ec4899','#fbbf24','#a78bfa'];
    const deeltjes = Array.from({length: 90}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * .5,
      w: 7 + Math.random() * 9,
      h: 5 + Math.random() * 7,
      kleur: kleuren[Math.floor(Math.random() * kleuren.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - .5) * 3,
      vy: 2.5 + Math.random() * 3.5,
      vr: (Math.random() - .5) * .15,
    }));

    let frames = 0;
    function teken() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;
      let nogActief = false;
      deeltjes.forEach(d => {
        d.x  += d.vx;
        d.y  += d.vy;
        d.rot += d.vr;
        d.vy += .07; // zwaartekracht
        if (d.y < canvas.height + 20) nogActief = true;
        ctx.save();
        ctx.translate(d.x + d.w/2, d.y + d.h/2);
        ctx.rotate(d.rot);
        ctx.fillStyle = d.kleur;
        ctx.globalAlpha = Math.max(0, 1 - frames / 120);
        ctx.fillRect(-d.w/2, -d.h/2, d.w, d.h);
        ctx.restore();
      });
      if (nogActief && frames < 130) requestAnimationFrame(teken);
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
      }
    }
    requestAnimationFrame(teken);
  }

  // ── Pijl-SVG bij procentuele verandering ───────────────────────────
  function rtToonPijl(opgave) {
    const wrap = document.getElementById('rt-pijl-wrap');
    const tekst = document.getElementById('rt-pijl-tekst');
    const path  = document.getElementById('rt-pijl-path');
    if (!wrap || !opgave) { if (wrap) wrap.style.display = 'none'; return; }
    // Toon pijl alleen als het een procentuele-verandering-opgave is
    if (!opgave._pctRichting) { wrap.style.display = 'none'; return; }
    const omhoog = opgave._pctRichting === 'stijging';
    wrap.className = 'rt-pijl-wrap ' + (omhoog ? 'stijging' : 'daling');
    wrap.style.display = 'flex';
    // SVG pijl omhoog of omlaag
    path.setAttribute('d', omhoog
      ? 'M14 6l7 9h-4.5v7h-5v-7H7z'   // pijl omhoog
      : 'M14 22l-7-9h4.5v-7h5v7H21z'  // pijl omlaag
    );
    tekst.textContent = omhoog
      ? `Stijging verwacht → antwoord is positief`
      : `Daling verwacht → gebruik een minteken`;
  }

  // ── Kopieer berekening ──────────────────────────────────────────────
  window.rtKopieerBerekening = function() {
    if (!rtHuidigeOpgave) return;
    const vraag  = rtHuidigeOpgave.vraag.replace(/<[^>]+>/g, '');
    const stappen = rtHuidigeOpgave.stappen
      .map((s, i) => `${i+1}. ${s.replace(/<[^>]+>/g, '')}`)
      .join('\n');
    const tekst = `📝 Berekening – ${rtHuidigeOpgave.cat}\n\nVraag: ${vraag}\n\n${stappen}\n\nAntwoord: ${nfmt(rtHuidigeOpgave.antwoord)}${rtHuidigeOpgave.eenheid ? ' ' + rtHuidigeOpgave.eenheid : ''}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(tekst).then(() => {
        const btn = document.querySelector('.rt-kopieer-btn');
        if (btn) { btn.textContent = '✅ Gekopieerd!'; setTimeout(() => { btn.textContent = '📋 Kopieer berekening'; }, 2000); }
      }).catch(() => rtKopieerFallback(tekst));
    } else {
      rtKopieerFallback(tekst);
    }
  };

  function rtKopieerFallback(tekst) {
    const ta = document.createElement('textarea');
    ta.value = tekst;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  // ══════════════════════════════════════════════
  //  CATEGORIE 1 — PROCENTEN  (6 typen)
  // ══════════════════════════════════════════════
  function genProcenten() {
    const type = rnd(0, 5, 1);

    // Type 0 — Procentuele verandering (nieuw−oud)/oud × 100
    if (type === 0) {
      const namen = ['Jayden','Fatima','Sven','Nora','Daan','Yasmine','Luca','Imani'];
      const naam  = namen[rnd(0, namen.length - 1, 1)];
      const contexten = [
        (o,n) => `${naam} koopt regelmatig döner kebab. Vorig jaar kostte een döner €<strong>${o}</strong>, nu €<strong>${n}</strong>.`,
        (o,n) => `Een PlayStation Plus-abonnement kostte vorig jaar €<strong>${o}</strong> per jaar. Nu betaal je €<strong>${n}</strong>.`,
        (o,n) => `${naam} verkoopt zijn oude sneakers op Vinted voor €<strong>${n}</strong>. Hij betaalde er zelf €<strong>${o}</strong> voor.`,
        (o,n) => `De huurprijs van een studentenkamer ging van €<strong>${o}</strong> naar €<strong>${n}</strong> per maand.`,
        (o,n) => `Een bioscoopkaartje kostte vorig jaar €<strong>${o}</strong>. Nu staat de prijs op €<strong>${n}</strong>.`,
        (o,n) => `Een frietje bij de snackbar kostte vorig jaar €<strong>${o}</strong>. Nu betaal je er €<strong>${n}</strong> voor.`,
      ];
      const oud  = rnd(3, 120, 1);
      const richting = Math.random() < 0.55 ? 'stijging' : 'daling';
      const delta = rnd(1, Math.max(2, Math.floor(oud * 0.4)), 1);
      const nieuw = richting === 'stijging' ? oud + delta : oud - delta;
      const verschil  = fmt2(nieuw - oud);
      const antwoord  = fmt2(verschil / oud * 100);
      const ctx = contexten[rnd(0, contexten.length - 1, 1)](oud, nieuw);
      return {
        cat: '📊 Procenten',
        _pctRichting: richting,
        vraag: `${ctx} Bereken de procentuele verandering. Gebruik een minteken (−) bij een daling. Rond af op 2 decimalen.`,
        antwoord,
        eenheid: '%',
        stappen: [
          `<strong>Formule:</strong> procentuele verandering = (nieuw − oud) ÷ oud × 100`,
          `<strong>Invullen:</strong> (<strong>${nieuw}</strong> − <strong>${oud}</strong>) ÷ <strong>${oud}</strong> × 100`,
          `Stap 1 &mdash; teller: ${nieuw} − ${oud} = <strong>${verschil}</strong>`,
          `Stap 2 &mdash; delen: ${verschil} ÷ ${oud} = <strong>${fmt2(verschil/oud)}</strong>`,
          `Stap 3 &mdash; ×100: ${fmt2(verschil/oud)} × 100 = <strong>${antwoord}%</strong>`,
          antwoord < 0 ? `<em>⚠️ Negatief getal = prijsdaling — vergeet het minteken niet!</em>` : `<em>✅ Positief getal = prijsstijging.</em>`,
        ],
      };
    }

    // Type 1 — Breuk naar procent
    if (type === 1) {
      const teller = rnd(1, 9, 1);
      const noemer = rnd(teller + 1, 30, 1);
      const antwoord = fmt2(teller / noemer * 100);
      const contexten1 = [
        `In een klas van <strong>${noemer}</strong> leerlingen hebben <strong>${teller}</strong> leerlingen een onvoldoende voor economie.`,
        `Van de <strong>${noemer}</strong> volgers van een TikTok-account hebben <strong>${teller}</strong> een bericht gedeeld.`,
        `In een buurt van <strong>${noemer}</strong> huishoudens zijn er <strong>${teller}</strong> die zonnepanelen hebben.`,
        `Van <strong>${noemer}</strong> sollicitanten worden er <strong>${teller}</strong> uitgenodigd voor een gesprek.`,
      ];
      const ctx1 = contexten1[rnd(0, contexten1.length - 1, 1)];
      return {
        cat: '📊 Procenten',
        vraag: `${ctx1} Bereken welk percentage dit is. Rond af op 2 decimalen.`,
        antwoord,
        eenheid: '%',
        stappen: [
          `<strong>Formule:</strong> percentage = (deel ÷ geheel) × 100`,
          `<strong>Invullen:</strong> (<strong>${teller}</strong> ÷ <strong>${noemer}</strong>) × 100`,
          `Stap 1: ${teller} ÷ ${noemer} = <strong>${fmt2(teller/noemer)}</strong>`,
          `Stap 2: × 100 = <strong>${antwoord}%</strong>`,
        ],
      };
    }

    // Type 2 — Terugrekenen naar 100%
    if (type === 2) {
      const pct  = rnd(5, 40, 5);
      const contexten2 = [
        { ctx: (d) => `Een webshop geeft aan dat <strong>${pct}%</strong> van de totale jaaromzet overeenkomt met €<strong>${d}</strong>.`, deel: rnd(50, 500, 25) },
        { ctx: (d) => `Sven spaart <strong>${pct}%</strong> van zijn maandloon. Dit maand heeft hij €<strong>${d}</strong> gespaard.`,         deel: rnd(20, 150, 10) },
        { ctx: (d) => `<strong>${pct}%</strong> van de leerlingen op school fietst. Dat zijn <strong>${d}</strong> leerlingen.`,              deel: rnd(20, 80, 5),  eenheid: 'leerlingen', geenEuro: true },
      ];
      const c2   = contexten2[rnd(0, contexten2.length - 1, 1)];
      const deel = c2.deel;
      const heel = fmt2(deel / (pct / 100));
      return {
        cat: '📊 Procenten',
        vraag: `${c2.ctx(deel)} Bereken het totaal (100%). Rond af op 2 decimalen.`,
        antwoord: heel,
        eenheid: c2.geenEuro ? '' : '€',
        stappen: [
          `<strong>Gegeven:</strong> ${pct}% = ${c2.geenEuro ? '' : '€'}${deel}`,
          `Stap 1 &mdash; 1%: ${c2.geenEuro ? '' : '€'}<strong>${deel}</strong> ÷ <strong>${pct}</strong> = <strong>${c2.geenEuro ? '' : '€'}${fmt2(deel/pct)}</strong>`,
          `Stap 2 &mdash; 100%: ${fmt2(deel/pct)} × 100 = <strong>${c2.geenEuro ? '' : '€'}${heel}</strong>`,
        ],
      };
    }

    // Type 3 — x% van een bedrag berekenen
    if (type === 3) {
      const pct    = rnd(5, 50, 5);
      const contexten3 = [
        { ctx: (p,b) => `Nora besteedt <strong>${p}%</strong> van haar zakgeld van €<strong>${b}</strong> per maand aan eten en drinken.`,   bedrag: rnd(50, 200, 10) },
        { ctx: (p,b) => `Een webshop geeft <strong>${p}%</strong> korting op een artikel van €<strong>${b}</strong>.`,                        bedrag: rnd(20, 150, 5)  },
        { ctx: (p,b) => `De overheid heft <strong>${p}%</strong> belasting op een extra inkomen van €<strong>${b}</strong>.`,                 bedrag: rnd(500, 2000, 50)},
        { ctx: (p,b) => `Daan betaalt <strong>${p}%</strong> van zijn netto-loon van €<strong>${b}</strong> aan huur.`,                       bedrag: rnd(1800, 3500, 50)},
      ];
      const c3 = contexten3[rnd(0, contexten3.length - 1, 1)];
      const bedrag   = c3.bedrag;
      const antwoord = fmt2(bedrag * pct / 100);
      return {
        cat: '📊 Procenten',
        vraag: `${c3.ctx(pct, bedrag)} Bereken het bedrag in euro. Rond af op 2 decimalen.`,
        antwoord,
        eenheid: '€',
        stappen: [
          `<strong>Formule:</strong> deel = percentage ÷ 100 × geheel`,
          `<strong>Invullen:</strong> <strong>${pct}</strong> ÷ 100 × <strong>${bedrag}</strong>`,
          `= ${fmt2(pct/100)} × ${bedrag} = <strong>€${antwoord}</strong>`,
        ],
      };
    }

    // Type 4 — Inclusief percentage terugrekenen
    if (type === 4) {
      const p          = [5, 10, 15, 20, 25][rnd(0, 4, 1)];
      const inclBedrag = rnd(20, 300, 5);
      const exclBedrag = fmt2(inclBedrag / (1 + p / 100));
      const contexten4 = [
        `Je ziet op je bankrekening dat er €<strong>${inclBedrag}</strong> is afgeschreven inclusief <strong>${p}%</strong> servicekosten.`,
        `Een ticket inclusief <strong>${p}%</strong> administratiekosten kost €<strong>${inclBedrag}</strong>.`,
        `Je factuur bedraagt €<strong>${inclBedrag}</strong> inclusief <strong>${p}%</strong> toeslag voor spoedlevering.`,
      ];
      const ctx4 = contexten4[rnd(0, contexten4.length - 1, 1)];
      return {
        cat: '📊 Procenten',
        vraag: `${ctx4} Bereken het bedrag exclusief de toeslag. Rond af op 2 decimalen.`,
        antwoord: exclBedrag,
        eenheid: '€',
        stappen: [
          `<strong>Redenering:</strong> €${inclBedrag} = <strong>${100+p}%</strong> (= 100% + ${p}%)`,
          `Stap 1 &mdash; 1%: €<strong>${inclBedrag}</strong> ÷ <strong>${100+p}</strong> = <strong>€${fmt2(inclBedrag/(100+p))}</strong>`,
          `Stap 2 &mdash; 100%: €${fmt2(inclBedrag/(100+p))} × 100 = <strong>€${exclBedrag}</strong>`,
          `<em>Sneltruc: €${inclBedrag} ÷ ${fmt2(1+p/100)} = €${exclBedrag}</em>`,
        ],
      };
    }

    // Type 5 — Reëel loon / koopkracht
    {
      const namen = ['Fatima','Daan','Sven','Nora','Jayden','Amira'];
      const naam = namen[rnd(0, namen.length - 1, 1)];
      const beroepen = [
        ['werkt als kassamedewerker bij de Albert Heijn', 1900, 2600, 50],
        ['is verpleegkundige in een ziekenhuis',          2800, 3800, 50],
        ['werkt als vrachtwagenchauffeur',                2600, 3500, 50],
        ['is leraar op een middelbare school',            3000, 4500, 100],
        ['werkt bij de gemeente als baliemedewerker',     2400, 3200, 50],
      ];
      const beroep = beroepen[rnd(0, beroepen.length - 1, 1)];
      const nominaalOud   = rnd(beroep[1], beroep[2], beroep[3]);
      const loonStijging  = rnd(1, 8, 1);
      const inflatie      = rnd(1, 9, 1);
      const nominaalNieuw = fmt2(nominaalOud * (1 + loonStijging / 100));
      const prijspeil     = fmt2(1 + inflatie / 100);
      const reeel         = fmt2(nominaalNieuw / prijspeil);
      const koopkrachtPct = fmt2((reeel - nominaalOud) / nominaalOud * 100);
      const richting = koopkrachtPct >= 0 ? 'stijging' : 'daling';
      return {
        cat: '📊 Procenten',
        _pctRichting: richting,
        vraag: `${naam} ${beroep[0]}. Haar nominale loon stijgt van €<strong>${nominaalOud}</strong> naar €<strong>${nominaalNieuw}</strong> per maand (+${loonStijging}%). De inflatie is <strong>${inflatie}%</strong>. Bereken de procentuele verandering van haar koopkracht. Gebruik een minteken bij daling. Rond af op 2 decimalen.`,
        antwoord: koopkrachtPct,
        eenheid: '%',
        stappen: [
          `<strong>Formule:</strong> reëel loon = nominaal loon ÷ prijspeil`,
          `<strong>Prijspeil:</strong> 1 + ${inflatie}/100 = <strong>${prijspeil}</strong>`,
          `<strong>Reëel loon:</strong> €<strong>${nominaalNieuw}</strong> ÷ <strong>${prijspeil}</strong> = <strong>€${reeel}</strong>`,
          `<strong>Koopkrachtverandering:</strong> (${reeel} − ${nominaalOud}) ÷ ${nominaalOud} × 100 = <strong>${koopkrachtPct}%</strong>`,
          koopkrachtPct > 0
            ? `<em>✅ Koopkracht stijgt: loonstijging overtreft inflatie.</em>`
            : `<em>⚠️ Koopkracht daalt: inflatie overtreft loonstijging — ${naam} kan minder kopen!</em>`,
        ],
      };
    }
  }

  // ══════════════════════════════════════════════
  //  CATEGORIE 2 — INDEXCIJFERS  (3 typen)
  // ══════════════════════════════════════════════
  function genIndexcijfers() {
    const basisjaar   = 2015 + rnd(0, 5, 1);
    const nieuwjaar   = basisjaar + rnd(2, 6, 1);
    const type = rnd(0, 2, 1);

    // Herkenbare mandjes voor het CBS-prijsindexcijfer
    const mandjes = [
      { naam: 'een boodschappenmand bij de supermarkt', basis: rnd(80, 120, 5) },
      { naam: 'een bioscoopkaartje',                    basis: rnd(10, 14, 1)  },
      { naam: 'een maandabonnement op een streamingdienst', basis: rnd(8, 13, 1) },
      { naam: 'de maandelijkse huur van een studentenkamer', basis: rnd(450, 700, 25) },
      { naam: 'een gemiddeld mandje dagelijkse boodschappen', basis: rnd(60, 100, 5)  },
    ];
    const mandje = mandjes[rnd(0, mandjes.length - 1, 1)];
    const basiswaarde = mandje.basis;

    if (type === 0) {
      const index       = rnd(88, 155, 1);
      const nieuwwaarde = fmt2(basiswaarde * index / 100);
      return {
        cat: '📈 Indexcijfers',
        vraag: `Het CBS gebruikt <strong>${basisjaar}</strong> als basisjaar (= 100) voor de prijs van ${mandje.naam}: €<strong>${basiswaarde}</strong>. In <strong>${nieuwjaar}</strong> kost dit €<strong>${nieuwwaarde}</strong>. Bereken het indexcijfer voor ${nieuwjaar}. Rond af op 1 decimaal.`,
        antwoord: fmt1(index),
        eenheid: '',
        stappen: [
          `<strong>Formule:</strong> indexcijfer = (waarde nieuw jaar ÷ basiswaarde) × 100`,
          `<strong>Invullen:</strong> (€<strong>${nieuwwaarde}</strong> ÷ €<strong>${basiswaarde}</strong>) × 100`,
          `Stap 1: ${nieuwwaarde} ÷ ${basiswaarde} = <strong>${fmt2(nieuwwaarde/basiswaarde)}</strong>`,
          `Stap 2: × 100 = <strong>${fmt1(index)}</strong>`,
          index > 100
            ? `<em>📈 Indexcijfer > 100: ${mandje.naam} is duurder geworden dan in ${basisjaar}.</em>`
            : `<em>📉 Indexcijfer < 100: ${mandje.naam} is goedkoper geworden dan in ${basisjaar}.</em>`,
        ],
      };
    }

    if (type === 1) {
      const index       = rnd(88, 155, 1);
      const nieuwwaarde = fmt2(basiswaarde * index / 100);
      return {
        cat: '📈 Indexcijfers',
        vraag: `In <strong>${basisjaar}</strong> kostte ${mandje.naam} €<strong>${basiswaarde}</strong> (basisjaar = 100). In <strong>${nieuwjaar}</strong> is het indexcijfer <strong>${index}</strong>. Bereken wat dit nu kost. Rond af op 2 decimalen.`,
        antwoord: nieuwwaarde,
        eenheid: '€',
        stappen: [
          `<strong>Formule:</strong> nieuwe waarde = (indexcijfer ÷ 100) × basiswaarde`,
          `<strong>Invullen:</strong> (<strong>${index}</strong> ÷ 100) × €<strong>${basiswaarde}</strong>`,
          `= ${fmt2(index/100)} × ${basiswaarde} = <strong>€${nieuwwaarde}</strong>`,
        ],
      };
    }

    // Type 2 — Procentuele verandering via indexcijfers + pijl
    const indexA = rnd(90, 118, 1);
    const richting = Math.random() < 0.6 ? 'stijging' : 'daling';
    const indexB = richting === 'stijging'
      ? rnd(indexA + 3, indexA + 40, 1)
      : rnd(Math.max(70, indexA - 40), indexA - 3, 1);
    const pctVer = fmt2((indexB - indexA) / indexA * 100);
    return {
      cat: '📈 Indexcijfers',
      _pctRichting: richting,
      vraag: `Het prijsindexcijfer voor ${mandje.naam} was in <strong>${basisjaar}</strong>: <strong>${indexA}</strong> en in <strong>${nieuwjaar}</strong>: <strong>${indexB}</strong>. Bereken de procentuele verandering. Gebruik een minteken bij daling. Rond af op 2 decimalen.`,
      antwoord: pctVer,
      eenheid: '%',
      stappen: [
        `<strong>Formule:</strong> %verandering = (nieuw − oud) ÷ oud × 100`,
        `<strong>Invullen:</strong> (<strong>${indexB}</strong> − <strong>${indexA}</strong>) ÷ <strong>${indexA}</strong> × 100`,
        `Stap 1: ${indexB} − ${indexA} = <strong>${fmt2(indexB - indexA)}</strong>`,
        `Stap 2: ${fmt2(indexB - indexA)} ÷ ${indexA} = <strong>${fmt2((indexB-indexA)/indexA)}</strong>`,
        `Stap 3: × 100 = <strong>${pctVer}%</strong>`,
        pctVer < 0 ? `<em>⚠️ Negatieve waarde = prijsdaling — vergeet het minteken niet!</em>` : `<em>✅ Positieve waarde = prijsstijging.</em>`,
      ],
    };
  }

  // ══════════════════════════════════════════════
  //  CATEGORIE 3 — BTW & MARGES  (4 typen)
  // ══════════════════════════════════════════════
  function genBtw() {
    const type = rnd(0, 3, 1);

    if (type === 0) {
      // Laag tarief 9%: voedsel, bioscoop, boeken, sport; hoog tarief 21%: elektronica, kleding, games
      const productenLaag = [
        { naam: 'een bioscoopkaartje',           prijs: rnd(11, 16, 1)  },
        { naam: 'een zak friet bij de snackbar', prijs: rnd(2, 4, 1)    },
        { naam: 'een kapper-behandeling',        prijs: rnd(20, 45, 5)  },
        { naam: 'een e-book',                    prijs: rnd(5, 15, 1)   },
      ];
      const productenHoog = [
        { naam: 'een nieuwe controller voor je console', prijs: rnd(50, 70, 5)   },
        { naam: 'een hoodie',                            prijs: rnd(30, 60, 5)   },
        { naam: 'een Spotify Premium-abonnement (maand)',prijs: rnd(10, 14, 1)   },
        { naam: 'een paar sneakers',                     prijs: rnd(60, 120, 10) },
        { naam: 'een Netflix-abonnement (maand)',        prijs: rnd(13, 18, 1)   },
        { naam: 'een tweedehands telefoon van een winkel', prijs: rnd(150, 350, 25) },
      ];
      const btw = Math.random() < 0.5 ? 9 : 21;
      const keuze = btw === 9
        ? productenLaag[rnd(0, productenLaag.length - 1, 1)]
        : productenHoog[rnd(0, productenHoog.length - 1, 1)];
      const excl      = keuze.prijs;
      const incl      = fmt2(excl * (1 + btw / 100));
      const btwBedrag = fmt2(incl - excl);
      return {
        cat: '🧾 BTW & Marges',
        vraag: `Een winkel verkoopt ${keuze.naam} voor €<strong>${excl}</strong> exclusief <strong>${btw}%</strong> btw. Hoeveel betaal je aan de kassa inclusief btw? Rond af op 2 decimalen.`,
        antwoord: incl,
        eenheid: '€',
        stappen: [
          `<strong>Formule:</strong> prijs incl. btw = prijs excl. btw × (1 + btw% ÷ 100)`,
          `<strong>Invullen:</strong> €<strong>${excl}</strong> × ${fmt2(1+btw/100)}`,
          `Btw-bedrag: €${excl} × ${fmt2(btw/100)} = <strong>€${btwBedrag}</strong>`,
          `Prijs incl. btw: €${excl} + €${btwBedrag} = <strong>€${incl}</strong>`,
          `<em>💡 ${btw}% btw = ${btw === 9 ? 'laag tarief (voedsel, cultuur, sport)' : 'hoog tarief (kleding, elektronica, diensten)'}.</em>`,
        ],
      };
    }

    if (type === 1) {
      const btw = Math.random() < 0.5 ? 9 : 21;
      const incl      = rnd(10, 200, 1);
      const excl      = fmt2(incl / (1 + btw / 100));
      const btwBedrag = fmt2(incl - excl);
      return {
        cat: '🧾 BTW & Marges',
        vraag: `Op jouw kassabon staat €<strong>${incl}</strong> inclusief <strong>${btw}%</strong> btw. Bereken de prijs exclusief btw. Rond af op 2 decimalen.`,
        antwoord: excl,
        eenheid: '€',
        stappen: [
          `<strong>Formule:</strong> prijs excl. btw = prijs incl. btw ÷ (1 + btw% ÷ 100)`,
          `<strong>Invullen:</strong> €<strong>${incl}</strong> ÷ <strong>${fmt2(1+btw/100)}</strong>`,
          `= <strong>€${excl}</strong>`,
          `<em>Controle:</em> btw-bedrag = €${incl} − €${excl} = <strong>€${btwBedrag}</strong>`,
        ],
      };
    }

    if (type === 2) {
      const webshops = [
        { naam: 'verkoopt tweedehands kleding via Vinted',    ink: rnd(5, 30, 1),   marge: rnd(20, 80, 5)  },
        { naam: 'koopt sneakers in bij een groothandel',      ink: rnd(40, 80, 5),  marge: rnd(30, 70, 5)  },
        { naam: 'verkoopt zelfgemaakte sieraden op Etsy',     ink: rnd(3, 12, 1),   marge: rnd(50, 150, 10) },
        { naam: 'heeft een kiosk op school',                  ink: rnd(1, 4, 1),    marge: rnd(30, 80, 5)  },
      ];
      const ws = webshops[rnd(0, webshops.length - 1, 1)];
      const inkoop  = ws.ink;
      const marge   = ws.marge;
      const verkoop = fmt2(inkoop * (1 + marge / 100));
      const winst   = fmt2(verkoop - inkoop);
      return {
        cat: '🧾 BTW & Marges',
        vraag: `Een leerling ${ws.naam} en koopt in voor €<strong>${inkoop}</strong>. Hij hanteert een winstmarge van <strong>${marge}%</strong> op de inkoopprijs. Bereken de verkoopprijs. Rond af op 2 decimalen.`,
        antwoord: verkoop,
        eenheid: '€',
        stappen: [
          `<strong>Formule:</strong> verkoopprijs = inkoopprijs × (1 + marge% ÷ 100)`,
          `<strong>Invullen:</strong> €<strong>${inkoop}</strong> × <strong>${fmt2(1+marge/100)}</strong>`,
          `Winstbedrag: €${inkoop} × ${fmt2(marge/100)} = <strong>€${winst}</strong>`,
          `Verkoopprijs: €${inkoop} + €${winst} = <strong>€${verkoop}</strong>`,
        ],
      };
    }

    // Type 3 — Winstmarge% terugrekenen
    const scenario = [
      { context: 'Een tweedehands PS5-controller', ink: rnd(25, 50, 5), vrkMin: 10, vrkMax: 60 },
      { context: 'Een vintage jas van de kringloopwinkel', ink: rnd(4, 12, 2), vrkMin: 5, vrkMax: 25 },
      { context: 'Een zelfgemaakte sleutelhanger', ink: rnd(1, 3, 1), vrkMin: 2, vrkMax: 8 },
      { context: 'Een paar sneakers ingekocht bij een groothandel', ink: rnd(30, 60, 5), vrkMin: 15, vrkMax: 50 },
    ];
    const sc      = scenario[rnd(0, scenario.length - 1, 1)];
    const inkoop  = sc.ink;
    const verkoop = inkoop + rnd(sc.vrkMin, sc.vrkMax, 1);
    const marge   = fmt2((verkoop - inkoop) / inkoop * 100);
    return {
      cat: '🧾 BTW & Marges',
      vraag: `${sc.context} wordt ingekocht voor €<strong>${inkoop}</strong> en verkocht voor €<strong>${verkoop}</strong>. Bereken de winstmarge als percentage van de inkoopprijs. Rond af op 2 decimalen.`,
      antwoord: marge,
      eenheid: '%',
      stappen: [
        `<strong>Formule:</strong> winstmarge% = (verkoopprijs − inkoopprijs) ÷ inkoopprijs × 100`,
        `Winstbedrag: €<strong>${verkoop}</strong> − €<strong>${inkoop}</strong> = <strong>€${fmt2(verkoop-inkoop)}</strong>`,
        `Marge%: ${fmt2(verkoop-inkoop)} ÷ ${inkoop} × 100 = <strong>${marge}%</strong>`,
      ],
    };
  }

  // ══════════════════════════════════════════════
  //  CATEGORIE 4 — VALUTA  (3 typen)
  // ══════════════════════════════════════════════
  function genValuta() {
    const paren = [
      {
        naam: 'Turkse lira', code: 'TRY',
        koers: fmt2(rnd(3200, 3500, 10) / 100),
        vakantieland: 'Turkije',
        context0: (e,k,a) => `Jayden gaat met zijn familie op vakantie naar Turkije. Hij wisselt €<strong>${e}</strong> om bij de bank. De wisselkoers is 1 EUR = <strong>${k} TRY</strong>. Hoeveel Turkse lira krijgt hij? Rond af op 2 decimalen.`,
        context2: (p,k,a) => `Een item op TikTok Shop kost <strong>${a} TRY</strong>. De wisselkoers is 1 EUR = <strong>${k} TRY</strong>. Hoeveel betaal je in euro? Rond af op 2 decimalen.`,
      },
      {
        naam: 'Amerikaanse dollar', code: 'USD',
        koers: fmt2(rnd(104, 112, 1) / 100),
        vakantieland: 'de VS',
        context0: (e,k,a) => `Nora koopt iets op een Amerikaanse webshop. Ze betaalt €<strong>${e}</strong> en de wisselkoers is 1 EUR = <strong>${k} USD</strong>. Hoeveel dollar wordt er afgeschreven? Rond af op 2 decimalen.`,
        context2: (p,k,a) => `Een product op een Amerikaanse webshop kost <strong>${a} USD</strong>. De wisselkoers is 1 EUR = <strong>${k} USD</strong>. Hoeveel euro betaal je? Rond af op 2 decimalen.`,
      },
      {
        naam: 'Brits pond', code: 'GBP',
        koers: fmt2(rnd(84, 89, 1) / 100),
        vakantieland: 'het Verenigd Koninkrijk',
        context0: (e,k,a) => `Daan gaat naar Londen en wisselt €<strong>${e}</strong> om. De koers is 1 EUR = <strong>${k} GBP</strong>. Hoeveel pond krijgt hij? Rond af op 2 decimalen.`,
        context2: (p,k,a) => `Een concertticket in Londen kost <strong>${a} GBP</strong>. De wisselkoers is 1 EUR = <strong>${k} GBP</strong>. Hoeveel euro is dat? Rond af op 2 decimalen.`,
      },
    ];
    const v    = paren[rnd(0, paren.length - 1, 1)];
    const type = rnd(0, 2, 1);

    if (type === 0) {
      const euros    = rnd(50, 500, 25);
      const antwoord = fmt2(euros * v.koers);
      return {
        cat: '💱 Valuta',
        vraag: v.context0(euros, v.koers, antwoord),
        antwoord,
        eenheid: v.code,
        stappen: [
          `<strong>Formule:</strong> buitenlands bedrag = euro's × wisselkoers`,
          `<strong>Invullen:</strong> <strong>${euros}</strong> × <strong>${v.koers}</strong>`,
          `= <strong>${antwoord} ${v.code}</strong>`,
          `<em>💡 Meer euro's wisselen = meer ${v.code} ontvangen.</em>`,
        ],
      };
    }

    if (type === 1) {
      const buitenlands = rnd(50, 2000, 25);
      const antwoord    = fmt2(buitenlands / v.koers);
      return {
        cat: '💱 Valuta',
        vraag: `Na een reis naar ${v.vakantieland} heeft Fatima nog <strong>${buitenlands} ${v.code}</strong> over. De wisselkoers is 1 EUR = <strong>${v.koers} ${v.code}</strong>. Hoeveel euro krijgt ze terug? Rond af op 2 decimalen.`,
        antwoord,
        eenheid: '€',
        stappen: [
          `<strong>Formule:</strong> euro's = buitenlands bedrag ÷ wisselkoers`,
          `<strong>Invullen:</strong> <strong>${buitenlands}</strong> ÷ <strong>${v.koers}</strong>`,
          `= <strong>€${antwoord}</strong>`,
        ],
      };
    }

    // Type 2 — omrekenen vanuit buitenlandse valuta
    const bedragBuit = v.code === 'TRY' ? rnd(500, 3000, 100) : rnd(20, 300, 10);
    const antwoord   = fmt2(bedragBuit / v.koers);
    return {
      cat: '💱 Valuta',
      vraag: v.context2(null, v.koers, bedragBuit),
      antwoord,
      eenheid: '€',
      stappen: [
        `<strong>Formule:</strong> euro's = buitenlands bedrag ÷ wisselkoers`,
        `<strong>Invullen:</strong> <strong>${bedragBuit} ${v.code}</strong> ÷ <strong>${v.koers}</strong>`,
        `= <strong>€${antwoord}</strong>`,
        `<em>💡 Sterkere euro → lagere europrijs → gunstig voor importeurs.</em>`,
      ],
    };
  }

  // ══════════════════════════════════════════════
  //  CATEGORIE 5 — TO / TK / WINST  (4 typen)
  // ══════════════════════════════════════════════
  function genWinst() {
    const type = rnd(0, 3, 1);

    if (type === 0) {
      // TO berekenen — herkenbare verkoopsituaties
      const scenario = [
        { ctx: (p,q) => `Sven verkoopt <strong>${q}</strong> skins op een game-platform voor €<strong>${p}</strong> per stuk.`,  P: rnd(2, 15, 1),  Q: rnd(5, 50, 1)   },
        { ctx: (p,q) => `Nora verkoopt <strong>${q}</strong> zelfgemaakte armbandjes op de schoolmarkt voor €<strong>${p}</strong> per stuk.`, P: rnd(3, 10, 1), Q: rnd(10, 60, 5) },
        { ctx: (p,q) => `Een snackbar verkoopt <strong>${q}</strong> broodjes voor €<strong>${p}</strong> per stuk.`,            P: rnd(3, 6, 1),   Q: rnd(20, 100, 10) },
        { ctx: (p,q) => `Daan verkoopt <strong>${q}</strong> tweedehands boeken via Marktplaats voor €<strong>${p}</strong> per stuk.`, P: rnd(3, 12, 1), Q: rnd(5, 30, 1) },
        { ctx: (p,q) => `Een frietkraam op de kermis verkoopt <strong>${q}</strong> zakjes friet voor €<strong>${p}</strong> per zak.`, P: rnd(3, 5, 1), Q: rnd(50, 200, 10) },
      ];
      const sc = scenario[rnd(0, scenario.length - 1, 1)];
      const TO = sc.P * sc.Q;
      return {
        cat: '💰 Kosten & Winst',
        vraag: `${sc.ctx(sc.P, sc.Q)} Bereken de totale omzet (TO).`,
        antwoord: TO,
        eenheid: '€',
        stappen: [
          `<strong>Formule: TO = P × Q</strong>`,
          `<strong>Invullen:</strong> €<strong>${sc.P}</strong> × <strong>${sc.Q}</strong> stuks`,
          `TO = <strong>€${TO}</strong>`,
        ],
      };
    }

    if (type === 1) {
      // Winst berekenen — Vinted/Etsy/schoolmarkt
      const scenario = [
        { naam: 'Imani', platform: 'Vinted', prod: 'jas',      P: rnd(15, 40, 5),  Q: rnd(3, 12, 1)  },
        { naam: 'Luca',  platform: 'Etsy',   prod: 'poster',   P: rnd(8, 18, 2),   Q: rnd(10, 40, 5) },
        { naam: 'Amira', platform: 'de schoolmarkt', prod: 'lunchbox', P: rnd(5, 12, 1), Q: rnd(10, 30, 5) },
        { naam: 'Jayden', platform: 'Marktplaats', prod: 'gamecontroller', P: rnd(20, 50, 5), Q: rnd(2, 8, 1) },
      ];
      const sc  = scenario[rnd(0, scenario.length - 1, 1)];
      const TO  = sc.P * sc.Q;
      // TK altijd een heel getal om afrondingsproblemen te vermijden
      const TKpct = rnd(40, 85, 5);
      const TK    = Math.round(TO * TKpct / 100);
      const winst = TO - TK;
      return {
        cat: '💰 Kosten & Winst',
        vraag: `${sc.naam} verkoopt via ${sc.platform} <strong>${sc.Q}</strong> stuks ${sc.prod} voor €<strong>${sc.P}</strong> per stuk. De totale kosten (TK) zijn €<strong>${TK}</strong>. Bereken de winst of het verlies. Gebruik een minteken bij verlies.`,
        antwoord: winst,
        eenheid: '€',
        stappen: [
          `<strong>Stap 1 — Totale omzet:</strong> TO = €<strong>${sc.P}</strong> × <strong>${sc.Q}</strong> = <strong>€${TO}</strong>`,
          `<strong>Stap 2 — Winst = TO − TK</strong>`,
          `Invullen: €<strong>${TO}</strong> − €<strong>${TK}</strong> = <strong>€${winst}</strong>`,
          winst < 0 ? `<em>⚠️ Negatief = verlies! ${sc.naam} heeft meer uitgegeven dan verdiend.</em>` : `<em>✅ Positief = winst! ${sc.naam} heeft €${winst} verdiend.</em>`,
        ],
      };
    }

    if (type === 2) {
      // Break-evenpunt — herkenbaar bedrijfstype
      const bedrijven = [
        { naam: 'een foodtruck',      P: rnd(8, 14, 1),   GVK: rnd(2, 5, 1),   VK: rnd(600, 1500, 50)  },
        { naam: 'een webshop',        P: rnd(15, 40, 5),  GVK: rnd(5, 12, 1),  VK: rnd(500, 2000, 100) },
        { naam: 'een kapperszaak',    P: rnd(20, 45, 5),  GVK: rnd(3, 8, 1),   VK: rnd(1000, 3000, 100)},
        { naam: 'een snoepkraam op de kermis', P: rnd(2, 5, 1), GVK: rnd(1, 2, 1), VK: rnd(200, 600, 50) },
      ];
      const b   = bedrijven[rnd(0, bedrijven.length - 1, 1)];
      const BEP = fmt2(b.VK / (b.P - b.GVK));
      return {
        cat: '💰 Kosten & Winst',
        vraag: `De eigenaar van ${b.naam} heeft vaste kosten van €<strong>${b.VK}</strong> per maand. De verkoopprijs is €<strong>${b.P}</strong> en de variabele kosten per product zijn €<strong>${b.GVK}</strong>. Bereken het break-evenpunt. Rond af op 2 decimalen.`,
        antwoord: BEP,
        eenheid: 'stuks',
        stappen: [
          `<strong>Formule: BEP = Vaste Kosten ÷ (Prijs − Variabele Kosten per stuk)</strong>`,
          `<strong>Invullen:</strong> €<strong>${b.VK}</strong> ÷ (€<strong>${b.P}</strong> − €<strong>${b.GVK}</strong>)`,
          `Dekking per stuk: €${b.P} − €${b.GVK} = <strong>€${b.P - b.GVK}</strong>`,
          `BEP: €${b.VK} ÷ €${b.P - b.GVK} = <strong>${BEP} stuks</strong>`,
          `<em>💡 Onder het break-evenpunt = verlies; erboven = winst.</em>`,
        ],
      };
    }

    // Type 3 — Bereken TK (integer, geen afrondingsfout)
    const sc3 = [
      { ctx: (p,q) => `Een snackbar verkoopt <strong>${q}</strong> döners voor €<strong>${p}</strong> per stuk`, P: rnd(6,10,1), Q: rnd(30,100,10) },
      { ctx: (p,q) => `Een bakkerij verkoopt <strong>${q}</strong> taarten voor €<strong>${p}</strong> per stuk`, P: rnd(8,18,2), Q: rnd(10,50,5) },
      { ctx: (p,q) => `Een kiosk verkoopt <strong>${q}</strong> blikjes frisdrank voor €<strong>${p}</strong> per blikje`, P: rnd(1,3,1), Q: rnd(50,200,10) },
    ];
    const sc   = sc3[rnd(0, sc3.length - 1, 1)];
    const TO   = sc.P * sc.Q;
    // winst altijd in hele euro's, garantie TK ≥ 0
    const winst = rnd(5, Math.max(10, Math.floor(TO * 0.35)), 5);
    const TK    = TO - winst;
    return {
      cat: '💰 Kosten & Winst',
      vraag: `${sc.ctx(sc.P, sc.Q)} en maakt een winst van €<strong>${winst}</strong>. Bereken de totale kosten (TK).`,
      antwoord: TK,
      eenheid: '€',
      stappen: [
        `<strong>Stap 1 — Totale omzet:</strong> TO = €<strong>${sc.P}</strong> × <strong>${sc.Q}</strong> = <strong>€${TO}</strong>`,
        `<strong>Formule: TK = TO − Winst</strong>`,
        `Invullen: €<strong>${TO}</strong> − €<strong>${winst}</strong> = <strong>€${TK}</strong>`,
      ],
    };
  }

  // ══════════════════════════════════════════════
  //  GENERATOR-REGISTER & PUBLIEKE API
  // ══════════════════════════════════════════════
  const rtGenerators = {
    procenten:    genProcenten,
    indexcijfers: genIndexcijfers,
    btw:          genBtw,
    valuta:       genValuta,
    winst:        genWinst,
  };

  // rtKiesCat blijft beschikbaar voor achterwaartse compatibiliteit
  window.rtKiesCat = function(cat, btn) {
    document.querySelectorAll('#rt-chips .rt-chip').forEach(c => {
      c.classList.toggle('active', cat === 'alle' || c.dataset.cat === cat);
    });
    rtNieuweOpgave();
  };

  window.rtNieuweOpgave = function() {
    const actief = getActieveCats();
    const cat    = actief[Math.floor(Math.random() * actief.length)];
    rtHuidigeOpgave = rtGenerators[cat]();

    const el = document.getElementById('rt-vraag');
    if (el) el.innerHTML = rtHuidigeOpgave.vraag;

    const lbl = document.getElementById('rt-cat-label');
    if (lbl) lbl.textContent = rtHuidigeOpgave.cat;

    const inp = document.getElementById('rt-antwoord-input');
    if (inp) {
      inp.value = '';
      inp.style.borderColor = '';
      // Bugfix #5: altijd focus terug, ook na 'Volgende'
      requestAnimationFrame(() => { inp.focus(); });
    }

    const fb = document.getElementById('rt-feedback');
    const sp = document.getElementById('rt-stappenplan');
    if (fb) fb.style.display = 'none';
    if (sp) sp.style.display = 'none';

    // Pijl-SVG tonen bij procentuele-verandering-sommen
    rtToonPijl(rtHuidigeOpgave);
  };

  window.rtResetFeedback = function() {
    const inp = document.getElementById('rt-antwoord-input');
    if (inp) inp.style.borderColor = '';
    const fb = document.getElementById('rt-feedback');
    const sp = document.getElementById('rt-stappenplan');
    if (fb) fb.style.display = 'none';
    if (sp) sp.style.display = 'none';
  };

  window.rtCheck = function() {
    if (!rtHuidigeOpgave) return;
    const inp    = document.getElementById('rt-antwoord-input');
    const rawVal = leesGetal(inp.value);

    if (isNaN(rawVal)) {
      inp.style.borderColor = '#e74c3c';
      inp.placeholder = 'Voer een getal in, bijv. 12,50';
      rtShake(document.getElementById('rt-opgave-wrap'));
      return;
    }

    const juist  = rtHuidigeOpgave.antwoord;
    const isGoed = dicht(rawVal, juist);

    rtScore.pogingen++;
    if (isGoed) { rtScore.goed++; rtStreakGoed(); }
    else        { rtScore.fout++; rtStreakFout(); }
    rtUpdateScore();

    const fbEl = document.getElementById('rt-feedback');
    fbEl.style.display = 'block';

    if (isGoed) {
      const complimenten = [
        '🎉 Uitstekend! Dat klopt helemaal!',
        '✅ Goed gedaan! Correct berekend!',
        '🏆 Top! Je hebt het goed!',
        '👍 Precies! Goed berekend!',
        '⭐ Perfect! Dat is het juiste antwoord!',
      ];
      fbEl.style.cssText = 'display:block;background:#f0fdf4;border:2px solid #27ae60;border-radius:12px;padding:1rem 1.1rem;margin-bottom:1rem;font-size:.9rem;line-height:1.6;color:#15803d';
      const streakTekst = rtStreak >= 5
        ? `<br><small style="color:#d97706;font-weight:700">🔥 ${rtStreak} op rij! Je bent op dreef!</small>`
        : '';
      fbEl.innerHTML = complimenten[Math.floor(Math.random() * complimenten.length)]
        + `<br><small style="color:#22c55e;font-size:.82rem">Correct antwoord: <strong>${nfmt(juist)}</strong>${rtHuidigeOpgave.eenheid ? ' ' + rtHuidigeOpgave.eenheid : ''}</small>`
        + streakTekst;
      inp.style.borderColor = '#27ae60';
      document.getElementById('rt-stappenplan').style.display = 'none';
      setTimeout(() => rtNieuweOpgave(), 2200);
    } else {
      fbEl.style.cssText = 'display:block;background:#fff5f5;border:2px solid #e74c3c;border-radius:12px;padding:1rem 1.1rem;margin-bottom:1rem;font-size:.9rem;line-height:1.6;color:#b91c1c';
      fbEl.innerHTML = `❌ Niet helemaal goed. Jouw antwoord: <strong>${nfmt(rawVal)}</strong> &mdash; correct antwoord: <strong>${nfmt(juist)}${rtHuidigeOpgave.eenheid ? ' ' + rtHuidigeOpgave.eenheid : ''}</strong><br><small style="font-size:.82rem">Bekijk het stappenplan hieronder. 👇</small>`;
      inp.style.borderColor = '#e74c3c';
      rtShake(document.getElementById('rt-opgave-wrap'));

      const sp = document.getElementById('rt-stappenplan');
      sp.style.display = 'block';
      document.getElementById('rt-stappen-tekst').innerHTML =
        rtHuidigeOpgave.stappen.map((s, i) =>
          `<div style="margin-bottom:.55rem;padding:.35rem 0;border-bottom:1px solid #dbe8f7;line-height:1.7">${i + 1}. ${s}</div>`
        ).join('');
    }
  };

  window.rtResetScore = function() {
    rtScore  = { pogingen: 0, goed: 0, fout: 0 };
    rtStreak = 0;
    rtUpdateScore();
    rtUpdateStreakUI();
    rtUpdateLevelUI(false);
  };

  function rtUpdateScore() {
    const p = document.getElementById('rt-score-pogingen');
    const g = document.getElementById('rt-score-goed');
    const f = document.getElementById('rt-score-fout');
    if (p) p.textContent = rtScore.pogingen + ' opgaven';
    if (g) g.textContent = rtScore.goed + ' \u2714';
    if (f) f.textContent = rtScore.fout  + ' \u2716';
  }

  // Initialisatie: laad streak-record bij opstarten
  function rtInit() {
    rtUpdateStreakUI();
    rtUpdateLevelUI(false);
    rtNieuweOpgave();
  }

  // Hook in op show()
  const origShow = window.show;
  window.show = function(id) {
    if (typeof origShow === 'function') origShow(id);
    if (id === 's-rekentrainer') setTimeout(rtInit, 60);
  };

})();

