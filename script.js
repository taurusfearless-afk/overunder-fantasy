const RAW = window.OVERUNDER_DATA;
// One-time refresh: discard stale admin preview data so live GitHub data is shown.
if (!localStorage.getItem('ou_live_data_refresh_20261001')) {
  localStorage.removeItem('overunder_data_override');
  localStorage.setItem('ou_live_data_refresh_20261001','1');
}
let DATA;
try {
  const local = localStorage.getItem('overunder_data_override');
  DATA = local ? JSON.parse(local) : structuredClone(RAW);
  // Published league finances, double-round results and records are authoritative.
  // An old local admin preview must never overwrite these official values.
  DATA.budget = structuredClone(RAW.budget);
  DATA.doubleRounds = structuredClone(RAW.doubleRounds);
  DATA.highScores = structuredClone(RAW.highScores);
  DATA.hallOfFame = structuredClone(RAW.hallOfFame);
} catch(e) { DATA = structuredClone(RAW); }
const $ = s => document.querySelector(s);
const teamMap = () => Object.fromEntries(DATA.teams.map(t=>[t.id,t]));
const nameOf = id => teamMap()[id]?.name || 'TBD';
const fmt = n => new Intl.NumberFormat('sr-RS').format(Number(n||0));
const route = () => (location.hash.replace('#/','') || 'home').split('?')[0];
const bgMap = {home:'home-bg.png',league:'league-bg.png',cup:'cup-bg.png',double:'double-bg.png',budget:'budget-bg.png',record:'record-bg.png',hall:'record-bg.png',rules:'rules-bg.png'};
function shell(content,active){
  const items=[['home','POČETNA'],['league','LIGA'],['cup','KUP'],['double','DUPLO KOLO'],['budget','BUDŽET'],['record','NAJVIŠE POENA'],['hall','KUĆA SLAVNIH'],['rules','PRAVILA & NAGRADE']];
  return `<div class="app-shell route-${active}"><div class="bg" style="background-image:url('assets/${bgMap[active]||bgMap.home}')"></div><header class="topbar"><div class="container nav"><button class="hamb" id="hamb" aria-label="Otvori meni"><span></span><span></span><span></span></button><a class="brand brand-centered" href="#/home"><img src="assets/logo.png" alt="OverUnder logo"><span class="brand-text">OVER UNDER</span></a><nav class="menu" id="menu">${items.map(([r,l])=>`<a class="${r===active?'active':''}" href="#/${r}">${l}</a>`).join('')}</nav><div class="nav-spacer"></div></div></header><div class="menu-backdrop" id="menuBackdrop"></div><main class="container">${content}</main><footer class="footer"><div class="container"><b>OVER UNDER</b> · EuroLeague Fantasy · ${DATA.meta.season}</div></footer><a class="admin-link" href="admin.html" title="Edit podataka">⚙</a></div>`;
}
function initNav(){const h=$('#hamb'),m=$('#menu'),b=$('#menuBackdrop');const close=()=>{m?.classList.remove('open');h?.classList.remove('open');b?.classList.remove('open')};const toggle=()=>{const open=!m?.classList.contains('open');m?.classList.toggle('open',open);h?.classList.toggle('open',open);b?.classList.toggle('open',open)};if(h)h.onclick=toggle;if(b)b.onclick=close;document.querySelectorAll('.menu a').forEach(a=>a.onclick=close);}
function homeIcon(r,ic){if(r==='hall')return '<svg class="ou-card-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v7a5 5 0 0 1-10 0V4ZM7 6H4v3a4 4 0 0 0 4 4M17 6h3v3a4 4 0 0 1-4 4"/></svg>';if(r==='rules')return '<svg class="ou-card-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>';return ic;}
function home(){const rows=budgetRows(),out=rows.reduce((a,r)=>a+r.outstanding,0),history=[...DATA.highScores].sort((a,b)=>b.points-a.points),rec=history[0];const cards=[['league','▥','LIGA','Završnih 6 kola · poslednjih 10 timova'],['cup','♛','OVERUNDER KUP','18 timova · prvi do 3 pobede'],['budget','◉','BUDŽET','Uplate, dugovanja i status'],['double','×2','DUPLO KOLO','Pet najnižih zbirnih rezultata'],['record','★','NAJVIŠE POENA','Automatski rekord sezone'],['hall','♛','KUĆA SLAVNIH','Šampioni i istorija OverUnder lige'],['rules','☷','PRAVILA & NAGRADE','Pravila, penali i nagrade']];return shell(`<section class="hero hero-v2"><div class="hero-mark"><img src="assets/logo.png" alt=""></div><h1 class="league-title"><span class="gold">OVER</span><span class="silver">UNDER</span></h1><div class="league-sub">EUROLEAGUE FANTASY</div><div class="season-line">SEASON ${DATA.meta.season}</div><div class="accent-line"></div><div class="comeback">THE GAME IS <span>BACK.</span></div><p class="hero-copy">Privatna EuroLeague Fantasy liga.<br>Jedna sezona. 38 kola. Jedan šampion.</p></section><section class="season-dashboard"><div><b>${DATA.meta.participantCount}</b><span>UČESNIKA</span></div><div><b>38</b><span>KOLA</span></div><div><b>${rec?rec.points:'—'}</b><span>REKORD</span></div><div><b>${fmt(out)}</b><span>RSD DUG</span></div></section><section class="grid home-grid home-grid-v2">${cards.map(([r,ic,t,p])=>`<a class="card nav-card nav-card-v2" href="#/${r}"><div class="nav-icon">${homeIcon(r,ic)}</div><div class="nav-copy"><h3>${t}</h3><p>${p}</p></div><span class="go">→</span></a>`).join('')}</section>`,'home');}
function leagueRows(){return DATA.league.participants.map((p,i)=>{const total=DATA.league.rounds.reduce((s,r)=>s+(Number(p.scores[r])||0),0);return {...p,total,seed:i}}).sort((a,b)=>b.total-a.total||a.seed-b.seed)}
function league(){const rows=leagueRows();const desktop=`<div class="table-wrap desktop-table"><table><thead><tr><th>POS.</th><th>NAZIV TIMA</th>${DATA.league.rounds.map(r=>`<th>R${r}</th>`).join('')}<th>UKUPNO</th></tr></thead><tbody>${rows.map((p,i)=>`<tr><td class="rank">${i+1}</td><td class="team">${nameOf(p.teamId)}</td>${DATA.league.rounds.map(r=>`<td><span class="score-pill">${p.scores[r]??'–'}</span></td>`).join('')}<td><b>${p.total.toFixed(1).replace('.0','')}</b></td></tr>`).join('')}</tbody></table></div>`;const mobile=`<div class="mobile-list">${rows.map((p,i)=>`<div class="card team-card"><div class="row"><strong>#${i+1} ${nameOf(p.teamId)}</strong><b style="color:var(--gold2)">${p.total.toFixed(1).replace('.0','')} pts</b></div><div class="rounds">${DATA.league.rounds.map(r=>`<div class="mini"><span>R${r}</span><b>${p.scores[r]??'–'}</b></div>`).join('')}</div></div>`).join('')}</div>`;return shell(`<section class="page-head"><h1>LIGA</h1><p>Završnih 6 kola · poslednjih 10 ekipa · R33–R38</p></section><section class="grid stats"><div class="card stat"><small>Učesnici</small><b>10</b></div><div class="card stat"><small>Kola</small><b>6</b></div><div class="card stat"><small>Start</small><b>R33</b></div><div class="card stat"><small>Kraj</small><b>R38</b></div></section>${desktop}${mobile}`,'league');}
function allCupMatches(){return [...DATA.cup.prelim,...DATA.cup.r16,...DATA.cup.quarters,...DATA.cup.semis,...DATA.cup.final]}
function findMatch(id){return allCupMatches().find(m=>m.id===id)}
function resolveTeamRef(ref){if(typeof ref==='string')return ref;if(ref&&ref.winnerOf)return winnerOf(ref.winnerOf);return null}
function winnerOf(id){const m=findMatch(id);if(!m)return null;if(Number(m.winsA)>=DATA.cup.winsNeeded)return resolveTeamRef(m.teamA);if(Number(m.winsB)>=DATA.cup.winsNeeded)return resolveTeamRef(m.teamB);return null}
function matchCard(m,label){const a=resolveTeamRef(m.teamA),b=resolveTeamRef(m.teamB),wa=Number(m.winsA)||0,wb=Number(m.winsB)||0,aw=wa>=DATA.cup.winsNeeded,bw=wb>=DATA.cup.winsNeeded;return `<div class="match"><div style="font-size:11px;color:#999;margin-bottom:5px">${label||m.id.toUpperCase()}</div><div class="teamline ${aw?'winner':''}"><span class="name">${a?nameOf(a):'TBD'}</span><span class="result">${wa}:${wb}</span></div><div class="teamline ${bw?'winner':''}"><span class="name">${b?nameOf(b):'TBD'}</span><span class="result">${wb}:${wa}</span></div></div>`}
function cup(){
 const rounds=[['PRELIMINARNA',DATA.cup.prelim],['ROUND OF 16',DATA.cup.r16],['ČETVRTFINALE',DATA.cup.quarters],['POLUFINALE',DATA.cup.semis],['FINALE',DATA.cup.final]],champ=winnerOf('f1');
 const chips=(DATA.teams||[]).map(t=>`<span class="draw-chip">${t.name}</span>`).join('');
 return shell(`<section class="page-head"><h1>OVERUNDER KUP</h1><p>18 učesnika · prvi do 3 pobede · trenutni rezultat se prikazuje automatski</p></section>
 <section class="cup-draw card" id="cupDraw">
  <div class="draw-top"><div><div class="eyebrow">TEST MODE · PREMIUM LIVE DRAW</div><h2>ŽREB ZA OVERUNDER KUP</h2><p>Svaka kuglica odmah dobija svoje mesto. Prvo Play-In, zatim direktno punimo kostur glavnog žreba.</p></div><div class="draw-status" id="drawStatus">SPREMNO</div></div>
  <div class="draw-stage">
   <div class="draw-machine" id="drawMachine"><div class="draw-rings"><i></i><i></i><i></i></div><div class="draw-ball premium-asset" id="drawBall"><img src="assets/ou-ball-premium.webp" alt="OverUnder premium basketball"></div><div class="draw-sparks"></div><small>OVERUNDER</small></div>
   <div class="draw-reveal"><small id="drawStep">Klikni „Pokreni žreb”</small><strong id="drawName">KO ĆE PRVI?</strong><div class="draw-search" id="drawSearch">ČEKA SE POČETAK ŽREBA</div><div class="draw-counter" id="drawCounter">0 / 18</div></div><div class="vs-lock" id="vsLock"><small>PAR JE ZAKLJUČAN</small><div><strong id="vsA">TIM A</strong><b>VS</b><strong id="vsB">TIM B</strong></div></div><div class="draw-final" id="drawFinal"><small>KONAČAN ŽREB</small><h2>OVERUNDER KUP</h2><div id="drawFinalPairs"></div><div class="final-countdown">ZATVARANJE ZA <b id="finalCountdown">10</b>s</div></div>
  </div>
  <div class="draw-actions"><button class="draw-btn primary" id="drawStart" onclick="cupDrawStart()">POKRENI ŽREB</button><button class="draw-btn" id="drawNext" onclick="cupDrawNext()" disabled>IZVUCI SLEDEĆI TIM</button><button class="draw-btn danger" onclick="cupDrawReset()">RESET TESTA</button></div>
  <div class="draw-note">TEST MODE · ništa se ne upisuje u zvanični Kup dok ne odobrimo finalnu verziju.</div>
  <div class="draw-pool" id="drawPool">${chips}</div>
  <div class="live-bracket">
   <section class="playin-board"><h3>PLAY-IN · 4 TIMA</h3><div class="bracket-match"><b>PLAY-IN 1</b><span id="slot1">ČEKA ŽREB</span><em>VS</em><span id="slot2">ČEKA PROTIVNIKA</span></div><div class="bracket-match"><b>PLAY-IN 2</b><span id="slot3">ČEKA ŽREB</span><em>VS</em><span id="slot4">ČEKA PROTIVNIKA</span></div></section>
   <section class="r16-board"><h3>ROUND OF 16 · GLAVNI ŽREB</h3><div class="r16-grid">
    <div class="bracket-match"><b>R16 · 1</b><span id="slot5">ČEKA ŽREB</span><em>VS</em><span id="slot6">ČEKA PROTIVNIKA</span></div>
    <div class="bracket-match"><b>R16 · 2</b><span id="slot7">ČEKA ŽREB</span><em>VS</em><span id="slot8">ČEKA PROTIVNIKA</span></div>
    <div class="bracket-match"><b>R16 · 3</b><span id="slot9">ČEKA ŽREB</span><em>VS</em><span id="slot10">ČEKA PROTIVNIKA</span></div>
    <div class="bracket-match"><b>R16 · 4</b><span id="slot11">ČEKA ŽREB</span><em>VS</em><span id="slot12">ČEKA PROTIVNIKA</span></div>
    <div class="bracket-match"><b>R16 · 5</b><span id="slot13">ČEKA ŽREB</span><em>VS</em><span id="slot14">ČEKA PROTIVNIKA</span></div>
    <div class="bracket-match"><b>R16 · 6</b><span id="slot15">ČEKA ŽREB</span><em>VS</em><span id="slot16">ČEKA PROTIVNIKA</span></div>
    <div class="bracket-match"><b>R16 · 7</b><span id="slot17">ČEKA ŽREB</span><em>VS</em><span>POBEDNIK PLAY-IN 1</span></div>
    <div class="bracket-match"><b>R16 · 8</b><span id="slot18">ČEKA ŽREB</span><em>VS</em><span>POBEDNIK PLAY-IN 2</span></div>
   </div></section>
  </div>
 </section>
 <section class="grid stats"><div class="card stat"><small>Učesnici</small><b>18</b></div><div class="card stat"><small>Format</small><b>BEST OF 5</b></div><div class="card stat"><small>Za prolaz</small><b>3 POBEDE</b></div><div class="card stat"><small>Početak</small><b>${DATA.meta.cupStartText}</b></div></section><div class="cup-columns">${rounds.map(([t,ms])=>`<section class="cup-round"><h3>${t}</h3>${ms.map((m,i)=>matchCard(m,`${t} ${i+1}`)).join('')}</section>`).join('')}</div><div class="card record-hero" style="margin-top:16px"><div class="eyebrow">CHAMPION</div><h2>${champ?nameOf(champ):'TBD'}</h2></div>`,'cup');
}
let CUP_DRAW={order:[],index:0,started:false,busy:false};
function cupDrawShuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function cupDrawStart(){if(CUP_DRAW.started)return;CUP_DRAW={order:cupDrawShuffle(DATA.teams||[]),index:0,started:true,busy:false};document.getElementById('drawStart').disabled=true;document.getElementById('drawNext').disabled=false;document.getElementById('drawStatus').textContent='LIVE · ŽREB U TOKU';document.getElementById('drawStep').textContent='Prva 4 tima određuju Play-In';cupDrawNext()}
function cupDrawNext(){
 if(!CUP_DRAW.started||CUP_DRAW.busy||CUP_DRAW.index>=18)return;
 CUP_DRAW.busy=true;const machine=document.getElementById('drawMachine'),name=document.getElementById('drawName'),next=document.getElementById('drawNext'),search=document.getElementById('drawSearch');next.disabled=true;machine.classList.add('spinning');name.textContent='?';search.classList.add('active');
 const target=CUP_DRAW.order[CUP_DRAW.index],slot=CUP_DRAW.index+1,isOpponent=slot%2===0;
 const messages=isOpponent?['BUBANJ SE OKREĆE…','TRAŽIMO PROTIVNIKA…','KO IDE NA MEGDAN?','POSLEDNJE KUGLICE U POKRETU…','PROTIVNIK JE…']:['BUBANJ SE OKREĆE…','KUGLICE SU U POKRETU…','IZBOR JE SVE BLIŽI…','KO IZLAZI SLEDEĆI?','IZVUČEN JE…'];
 let mi=0;search.textContent=messages[0];const msgTimer=setInterval(()=>{mi=Math.min(mi+1,messages.length-1);search.textContent=messages[mi]},1000);
 const flicker=setInterval(()=>{const pool=CUP_DRAW.order.slice(CUP_DRAW.index);if(pool.length)name.textContent=pool[Math.floor(Math.random()*pool.length)].name},145);
 setTimeout(()=>{clearInterval(msgTimer);clearInterval(flicker);name.textContent=target.name;search.textContent=isOpponent?'PROTIVNIK PRONAĐEN':'TIM IZVUČEN';search.classList.remove('active');document.getElementById('drawCounter').textContent=`${slot} / 18`;document.getElementById('drawStep').textContent=slot<=4?`PLAY-IN · KUGLICA ${slot}`:`ROUND OF 16 · KUGLICA ${slot}`;const dest=document.getElementById(`slot${slot}`);if(dest){dest.textContent=target.name;dest.classList.add('revealed')}const chip=[...document.querySelectorAll('#drawPool .draw-chip')].find(x=>x.textContent===target.name);if(chip)chip.classList.add('drawn');CUP_DRAW.index=slot;CUP_DRAW.busy=false;machine.classList.remove('spinning');if(slot%2===0){const lock=document.getElementById('vsLock'),a=document.getElementById('vsA'),b=document.getElementById('vsB');a.textContent=CUP_DRAW.order[slot-2].name;b.textContent=target.name;lock.classList.remove('show');void lock.offsetWidth;lock.classList.add('show');setTimeout(()=>lock.classList.remove('show'),5000)}if(slot===18){document.getElementById('drawStatus').textContent='ŽREB ZAVRŠEN';document.getElementById('drawStep').textContent='KOSTUR JE KOMPLETIRAN';search.textContent='SREĆNO SVIMA';next.disabled=true;setTimeout(cupDrawFinalShow,5200)}else{next.disabled=false;if(slot%2===1)next.textContent='PRONAĐI PROTIVNIKA';else next.textContent='IZVUCI SLEDEĆI TIM'}},5000)
}
function cupDrawReset(){CUP_DRAW={order:[],index:0,started:false,busy:false};for(let i=1;i<=18;i++){const el=document.getElementById(`slot${i}`);if(el){el.textContent=i%2===0?'ČEKA PROTIVNIKA':'ČEKA ŽREB';el.classList.remove('revealed')}}document.querySelectorAll('#drawPool .draw-chip').forEach(x=>x.classList.remove('drawn'));document.getElementById('drawCounter').textContent='0 / 18';document.getElementById('drawName').textContent='KO ĆE PRVI?';document.getElementById('drawStep').textContent='Klikni „Pokreni žreb”';document.getElementById('drawSearch').textContent='ČEKA SE POČETAK ŽREBA';document.getElementById('drawStatus').textContent='SPREMNO';document.getElementById('vsLock')?.classList.remove('show');document.getElementById('drawFinal')?.classList.remove('show');document.getElementById('drawStart').disabled=false;document.getElementById('drawNext').disabled=true;document.getElementById('drawNext').textContent='IZVUCI SLEDEĆI TIM'}

function cupDrawFinalShow(){if(CUP_DRAW.index!==18)return;const box=document.getElementById('drawFinal'),pairs=document.getElementById('drawFinalPairs');let html='<div class="final-section"><h3>PLAY-IN</h3>';html+=`<div><span>${CUP_DRAW.order[0].name}</span><b>VS</b><span>${CUP_DRAW.order[1].name}</span></div><div><span>${CUP_DRAW.order[2].name}</span><b>VS</b><span>${CUP_DRAW.order[3].name}</span></div></div><div class="final-section"><h3>ROUND OF 16</h3>`;for(let i=4;i<16;i+=2)html+=`<div><span>${CUP_DRAW.order[i].name}</span><b>VS</b><span>${CUP_DRAW.order[i+1].name}</span></div>`;html+=`<div><span>${CUP_DRAW.order[16].name}</span><b>VS</b><span>POBEDNIK PLAY-IN 1</span></div><div><span>${CUP_DRAW.order[17].name}</span><b>VS</b><span>POBEDNIK PLAY-IN 2</span></div></div>`;pairs.innerHTML=html;box.classList.add('show');let n=10;document.getElementById('finalCountdown').textContent=n;const timer=setInterval(()=>{n--;const el=document.getElementById('finalCountdown');if(el)el.textContent=Math.max(0,n);if(n<=0){clearInterval(timer);box.classList.remove('show')}},1000)}

function budgetRows(){return DATA.budget.map((b,i)=>{const total=(Number(b.participation)||0)+(Number(b.league)||0),paid=Number(b.paid)||0,outstanding=Math.max(0,total-paid),status=outstanding===0?'paid':'owes';return {...b,total,paid,outstanding,status,seed:i}})}
function budget(){const rows=budgetRows(),collected=rows.reduce((s,r)=>s+r.paid,0),out=rows.reduce((s,r)=>s+r.outstanding,0);const tr=rows.map((r,i)=>`<tr><td>${i+1}</td><td class="team">${nameOf(r.teamId)}</td><td>${fmt(r.participation)}</td><td>${fmt(r.league)}</td><td><b>${fmt(r.total)}</b></td><td><span class="status ${r.status}">${r.status==='paid'?'PLAĆENO':'DUGUJE'} · ${fmt(r.outstanding)} RSD</span></td></tr>`).join('');return shell(`<section class="page-head"><h1>BUDŽET</h1><p>Pregled uplata, dugovanja i stanja</p></section><section class="grid stats"><div class="card stat"><small>Učesnici</small><b>${rows.length}</b></div><div class="card stat"><small>Naplaćeno</small><b>${fmt(collected)} RSD</b></div><div class="card stat"><small>Dugovanje</small><b>${fmt(out)} RSD</b></div><div class="card stat"><small>Kotizacija</small><b>${fmt(DATA.meta.entryFee)} RSD</b></div></section><div class="table-wrap"><table><thead><tr><th>#</th><th>NAZIV TIMA</th><th>UČEŠĆE</th><th>LIGA</th><th>UKUPNO</th><th>STATUS</th></tr></thead><tbody>${tr}</tbody></table></div><section class="card payment-card"><div><small>BROJ RAČUNA ZA UPLATU</small><h3>${DATA.payment.bank}</h3><strong>${DATA.payment.account}</strong><p>${DATA.payment.holder}</p></div><button class="copy-btn" onclick="navigator.clipboard?.writeText('${DATA.payment.account}');this.textContent='KOPIRANO ✓'">KOPIRAJ BROJ RAČUNA</button></section>`,'budget');}
function doublePage(){
 const d=DATA.doubleRounds[DATA.doubleRounds.length-1];
 const pending=d.entries.some(e=>e.scoreB==null);
 const ranked=d.entries.map(e=>({...e,total:(Number(e.scoreA)||0)+(Number(e.scoreB)||0)})).sort((a,b)=>b.total-a.total);
 const entries=ranked.slice(-7);
 const n=ranked.length;
 const fmtScore=x=>x==null?'–':Number(x).toFixed(2).replace(/\\.00$/,'');
 const rows=entries.map((e,i)=>{
  const rank=n-6+i, safe=rank<=n-5;
  return `<tr class="${safe?'ou-safe-row':'ou-penalty-row'} ${rank===n-5?'ou-first-penalty':''}"><td class="rank">${rank}</td><td class="team">${nameOf(e.teamId)}</td><td>${fmtScore(e.scoreA)}</td><td>${fmtScore(e.scoreB)}</td><td><b>${pending?'–':e.total.toFixed(2)}</b></td><td>${safe?'—':pending?'NA ČEKANJU':fmt(DATA.meta.doublePenalty)+' RSD'}</td></tr>`;
 }).join('');
 return shell(`<style>
 .route-double .ou-safe-row{opacity:.62;background:rgba(115,115,115,.075)}
 .route-double .ou-safe-row td{color:#c7c4bc!important}
 .route-double .ou-safe-row td.rank{color:#aaa!important;text-shadow:none!important}
 .route-double .ou-first-penalty td{border-top:3px solid #d9ad58!important}
 .route-double .ou-penalty-row{background:rgba(130,69,29,.09)}
 .route-double .ou-penalty-row td:last-child{color:#f1c477;font-weight:750}
 .route-double .ou-safe-row td:last-child{color:#9b9b9b!important}
 @media(max-width:640px){.route-double .ou-first-penalty td{border-top-width:2px!important}}
 </style><section class="page-head"><h1>DUPLO KOLO</h1><p>${pending?'Privremeni poredak posle '+d.roundA+'. kola · konačan zbir nakon '+d.roundB+'. kola.':'Dva kola. Jedan zbir. Poslednjih pet plaća, dva tima iznad crte.'}</p></section><section class="grid stats"><div class="card stat"><small>Format</small><b>2 KOLA</b></div><div class="card stat"><small>Prikaz</small><b>7 TIMOVA</b></div><div class="card stat"><small>Penal</small><b>${pending?'NA ČEKANJU':fmt(DATA.meta.doublePenalty)+' RSD'}</b></div><div class="card stat"><small>Aktuelno</small><b>${d.label}</b></div></section><div class="table-wrap"><table><thead><tr><th>POS.</th><th>NAZIV TIMA</th><th>KOLO ${d.roundA}</th><th>KOLO ${d.roundB}</th><th>UKUPNO</th><th>PENAL</th></tr></thead><tbody>${rows}</tbody></table></div>`,'double');
}
function record(){const history=[...DATA.highScores].sort((a,b)=>b.points-a.points),rec=history[0]||null;return shell(`<section class="page-head"><h1>NAJVIŠE POENA</h1><p>Rekord sezone ${DATA.meta.season}</p></section><div class="card record-hero"><div class="eyebrow">SEZONSKI REKORD</div><div class="pts">${rec?rec.points:'000'}</div><h2>${rec?nameOf(rec.teamId):'TEAM 01'}</h2><p>${rec?`KOLO ${rec.round}`:'KOLO 00'}</p></div><div class="card history"><h3 style="font-family:'Bebas Neue';font-size:30px;color:var(--gold2);margin-top:0">ISTORIJA REKORDA</h3>${history.length?`<div class="table-wrap"><table><thead><tr><th>#</th><th>TIM</th><th>KOLO</th><th>POENI</th></tr></thead><tbody>${history.map((h,i)=>`<tr><td>${i+1}</td><td class="team">${nameOf(h.teamId)}</td><td>${h.round}</td><td><b>${h.points}</b></td></tr>`).join('')}</tbody></table></div>`:`<div class="notice">Još nema unetih rezultata. Rekord će se pojaviti automatski čim dodaš prvi rezultat.</div>`}</div>`,'record');}
function rules(){const blocks=[['UČESTVOVANJE',DATA.rules.participation],['PENALI',DATA.rules.penalties],['LIGA',DATA.rules.leagueFinal],['KUP',DATA.rules.cup],['POSEBNE NAPOMENE',DATA.rules.special]];return shell(`<section class="page-head"><h1>PRAVILA & NAGRADE</h1><p>Over Under Fantasy Liga · ${DATA.meta.season}</p></section><div class="grid rules-grid">${blocks.map(([t,arr])=>`<section class="card"><h3>${t}</h3><ul>${arr.map(x=>`<li>${x}</li>`).join('')}</ul></section>`).join('')}<section class="card"><h3>NAGRADE</h3><div class="prizes">${DATA.prizes.map((p,i)=>`<div class="prize"><div class="medal">${i+1}</div><div><b>${p.title}</b><div>${p.text}</div></div></div>`).join('')}</div></section></div><div class="notice">Napomena: žurka je planirana za <b>24.04.2027.</b> Datum nije konačan i može doći do pomeranja u zavisnosti od dogovora i mogućnosti članova lige.</div><div class="rules-joke">${DATA.footerJoke||''}</div>`,'rules');}
function hall(){
  const h=DATA.hallOfFame||{league:[],cup:[],league31:[]};
  const all=[...(h.league||[]).map(x=>({...x,type:'Liga'})),...(h.cup||[]).map(x=>({...x,type:'Kup'})),...(h.league31||[]).map(x=>({...x,type:'Liga 31'}))];
  const names=[...new Set(all.map(x=>x.winner))];
  const ranking=names.map(name=>({name,league:h.league.filter(x=>x.winner===name).length,cup:h.cup.filter(x=>x.winner===name).length,league31:h.league31.filter(x=>x.winner===name).length})).map(x=>({...x,total:x.league+x.cup+x.league31})).sort((a,b)=>b.total-a.total||b.league-a.league||a.name.localeCompare(b.name,'sr'));
  const seasons=[...new Set(all.map(x=>x.season))].sort((a,b)=>parseInt(b)-parseInt(a));
  const item=(x,i)=>`<div class="hof-entry"><span class="hof-position">${String(i+1).padStart(2,'0')}</span><span class="hof-entry-copy"><b>${x.winner}</b><small>SEZONA ${x.season}</small></span><span class="hof-entry-trophy">🏆</span></div>`;
  const section=(id,title,subtitle,arr)=>`<section class="hof-section" id="${id}"><div class="hof-section-heading"><span class="hof-section-icon">♛</span><div><h2>${title}</h2><p>${subtitle}</p></div></div><div class="hof-entries">${arr.length?arr.map(item).join(''):'<p class="hof-empty">Podaci će biti dopunjeni.</p>'}</div></section>`;
  return shell(`<section class="hof-hero"><div class="hof-kicker">OVERUNDER · ISTORIJA LIGE</div><div class="hof-hero-icon">♛</div><h1>KUĆA <span>SLAVNIH</span></h1><p>Istorija se ne zaboravlja. Šampioni se pamte.</p><div class="hof-hero-rule"></div><div class="hof-stats"><div><b>${seasons.length}</b><small>SEZONA</small></div><div><b>${all.length}</b><small>TROFEJA</small></div><div><b>${names.length}</b><small>OSVAJAČA</small></div></div></section>
  <div class="hof-menu"><a href="#/hall" data-hof-target="hall-league"><span>♛</span><b>ŠAMPIONI LIGE</b><small>${h.league.length} titula</small></a><a href="#/hall" data-hof-target="hall-cup"><span>🏆</span><b>OSVAJAČI KUPA</b><small>${h.cup.length} trofeja</small></a><a href="#/hall" data-hof-target="hall-records"><span>★</span><b>REKORDI</b><small>Večna lista</small></a><a href="#/hall" data-hof-target="hall-archive"><span>▤</span><b>ARHIVA SEZONA</b><small>Po sezonama</small></a></div>
  ${section('hall-league','ŠAMPIONI LIGE','Osvajači glavnog takmičenja',h.league)}
  ${section('hall-cup','OSVAJAČI KUPA','Pobednici OverUnder kupa',h.cup)}
  ${section('hall-league31','LIGA 31','Šampioni završnog dela sezone',h.league31)}
  <section class="hof-section" id="hall-records"><div class="hof-section-heading"><span class="hof-section-icon">★</span><div><h2>VEČNA LISTA TROFEJA</h2><p>Ukupan broj osvojenih takmičenja</p></div></div><div class="hof-entries">${ranking.map((x,i)=>`<div class="hof-ranking"><span class="hof-rank">${i+1}.</span><div><b>${x.name}</b><small>Liga ${x.league} · Kup ${x.cup} · Liga 31 ${x.league31}</small></div><strong>${x.total} <span>🏆</span></strong></div>`).join('')}</div><a class="hof-record-link" href="#/record">Pogledaj rekord poena →</a></section>
  <section class="hof-section" id="hall-archive"><div class="hof-section-heading"><span class="hof-section-icon">▤</span><div><h2>ARHIVA SEZONA</h2><p>Pregled svih zabeleženih osvajača</p></div></div><div class="hof-archive">${seasons.map(s=>`<div class="hof-season"><h3>${s}</h3>${[['Liga',h.league],['Kup',h.cup],['Liga 31',h.league31]].map(([t,a])=>{const x=a.find(z=>z.season===s);return x?`<div><span>${t}</span><b>${x.winner}</b></div>`:''}).join('')}</div>`).join('')}</div></section><p class="hof-footnote">Kuća slavnih se dopunjava novim podacima i završenim sezonama.</p>`,'hall');
}
document.addEventListener('click',function(event){const link=event.target.closest('[data-hof-target]');if(!link)return;event.preventDefault();const target=document.getElementById(link.dataset.hofTarget);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});});
function render(){const r=route(),fn={home,league,cup,double:doublePage,budget,record,hall,rules}[r]||home;document.getElementById('app').innerHTML=fn();initNav();window.scrollTo(0,0)}document.getElementById('app').addEventListener('click',function(event){
  const link=event.target.closest('[data-hof-target]');
  if(!link)return;
  event.preventDefault();
  const id=link.getAttribute('data-hof-target');
  const target=document.getElementById(id);
  if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
});
window.addEventListener('hashchange',render);render();

/* LIVE VIEWERS · Supabase Realtime Presence */
(function(){
  const URL='https://tlvgnjqoqkfkayhkjahd.supabase.co';
  const KEY='sb_publishable_lYb4XZhqFi_7OJ14zcBt9w_8aoxD1LU';
  function setLive(n,status){
    const el=document.getElementById('ouLiveViewers'); if(!el)return;
    const num=el.querySelector('.ou-live-num');
    if(num) num.textContent=String(Math.max(0,n||0));
    el.classList.toggle('is-connected',status==='connected');
  }
  async function start(){
    if(!window.supabase||!window.supabase.createClient)return;
    const client=window.supabase.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    const id=(crypto&&crypto.randomUUID)?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now();
    const channel=client.channel('overunder-live-site',{config:{presence:{key:id}}});
    const sync=()=>{
      const state=channel.presenceState();
      const count=Object.keys(state||{}).length;
      setLive(count,'connected');
    };
    channel.on('presence',{event:'sync'},sync)
      .on('presence',{event:'join'},sync)
      .on('presence',{event:'leave'},sync)
      .subscribe(async status=>{
        if(status==='SUBSCRIBED'){await channel.track({online_at:new Date().toISOString()});sync();}
      });
    window.addEventListener('pagehide',()=>{try{channel.untrack();}catch(e){}},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
