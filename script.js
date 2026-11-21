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
function budget(){const rows=budgetRows(),collected=rows.reduce((s,r)=>s+r.paid,0),out=rows.reduce((s,r)=>s+r.outstanding,0);const tr=rows.map((r,i)=>`<tr><td>${i+1}</td><td class="team">${nameOf(r.teamId)}</td><td>${fmt(r.participation)}</td><td>${fmt(r.league)}</td><td><b>${fmt(r.total)}</b></td><td><span class="status ${r.status}">${r.status==='paid'?'PLAĆENO':'DUGUJE'} · ${fmt(r.outstanding)} RSD</span></td></tr>`).join('');return shell(`<section class="page-head"><h1>BUDŽET</h1><p>Pregled uplata, dugovanja i stanja</p></section><section class="grid stats"><div class="card stat"><small>Učesnici</small><b>${rows.length}</b></div><div class="card stat"><small>Naplaćeno</small><b>${fmt(collected)} RSD</b></div><div class="card stat"><small>Dugovanje</small><b>${fmt(out)} RSD</b></div><div class="card stat"><small>Kotizacija</small><b>${fmt(DATA.meta.entryFee)} RSD</b></div></section>${podiumHtml}<div class="ou-standings-head"><h2>DONJI DEO TABELE</h2><div class="ou-standings-rule"></div><span>12—18. MESTO</span></div><div class="table-wrap"><table><thead><tr><th>#</th><th>NAZIV TIMA</th><th>UČEŠĆE</th><th>LIGA</th><th>UKUPNO</th><th>STATUS</th></tr></thead><tbody>${tr}</tbody></table></div><section class="card payment-card"><div><small>BROJ RAČUNA ZA UPLATU</small><h3>${DATA.payment.bank}</h3><strong>${DATA.payment.account}</strong><p>${DATA.payment.holder}</p></div><button class="copy-btn" onclick="navigator.clipboard?.writeText('${DATA.payment.account}');this.textContent='KOPIRANO ✓'">KOPIRAJ BROJ RAČUNA</button></section>`,'budget');}
function doublePage(){
 const d=DATA.doubleRounds[DATA.doubleRounds.length-1];
 const pending=d.entries.some(e=>e.scoreB==null);
 const ranked=d.entries.map(e=>({...e,total:(Number(e.scoreA)||0)+(Number(e.scoreB)||0)})).sort((a,b)=>b.total-a.total);
 const podium=ranked.slice(0,3);
 const podiumNumber=(d.label.match(/\d+/)||[])[0]||'';
 const podiumTitle='POBEDNIK '+(podiumNumber?podiumNumber+'. ':'')+'DUPLOG KOLA';
 const podiumCards=[1,0,2].map(idx=>{
  const e=podium[idx],place=idx+1;
  if(!e)return '';
  return `<div class="ou-podium-card ou-podium-${place}"><div class="ou-podium-medal">${`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M17 7h12l7 17H24L17 7Zm18 0h12l-7 17H28L35 7Z" fill="currentColor" fill-opacity=".23" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="32" cy="38" r="19" fill="currentColor" fill-opacity=".13" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="38" r="14" fill="none" stroke="currentColor" stroke-opacity=".42" stroke-width="1.5"/></svg><span class="ou-medal-number">${place}</span>`}</div><div class="ou-podium-place">${place}. MESTO</div><div class="ou-podium-team">${nameOf(e.teamId)}</div><div class="ou-podium-score">${pending?'—':e.total.toFixed(2)} <small>FPT</small></div></div>`;
 }).join('');
 const podiumHtml=`<section class="ou-podium"><div class="ou-podium-heading"><h2>${podiumTitle}</h2><span>${d.roundA}. + ${d.roundB}. KOLO</span></div><div class="ou-podium-grid">${podiumCards}</div>${pending?'<p class="ou-podium-pending">Privremeni TOP 3 nakon prvog kola. Konačan plasman posle drugog kola.</p>':''}</section>`;
 const entries=ranked.slice(-7);
 const n=ranked.length;
 const fmtScore=x=>x==null?'–':Number(x).toFixed(2).replace(/\.00$/,'');
 const boundaryGap=!pending&&ranked.length>=6?Math.max(0,ranked[n-6].total-ranked[n-5].total):null;
 const gapLabel=boundaryGap===null?'':boundaryGap.toFixed(2).replace('.',',');
 const mobileRows=entries.map((e,i)=>{
  const rank=n-6+i,safe=rank<=n-5,penalty=safe?'IZNAD CRTE':pending?'NA ČEKANJU':fmt(DATA.meta.doublePenalty)+' RSD';
  return `<article class="ou-rank-card ${safe?'ou-rank-safe':'ou-rank-penalty'}"><div class="ou-rank-top"><span class="ou-rank-position">${rank}<small>.</small></span><div class="ou-rank-team">${nameOf(e.teamId)}</div><span class="ou-rank-status">${penalty}</span></div><div class="ou-rank-bottom"><div><small>KOLO ${d.roundA}</small><strong>${fmtScore(e.scoreA)}</strong></div><div><small>KOLO ${d.roundB}</small><strong>${fmtScore(e.scoreB)}</strong></div><div class="ou-rank-total"><small>UKUPNO</small><strong>${pending?'—':e.total.toFixed(2)}</strong></div></div></article>`;
 }).join('');
 const rows=entries.map((e,i)=>{
  const rank=n-6+i,safe=rank<=n-5;
  const row=`<tr class="${safe?'ou-safe-row':'ou-penalty-row'}"><td class="rank">${rank}</td><td class="team">${nameOf(e.teamId)}</td><td>${fmtScore(e.scoreA)}</td><td>${fmtScore(e.scoreB)}</td><td><b>${pending?'–':e.total.toFixed(2)}</b></td><td>${safe?'—':pending?'NA ČEKANJU':fmt(DATA.meta.doublePenalty)+' RSD'}</td></tr>`;
  return row;
 }).join('');
 return shell(`<style>

 .route-double .ou-podium-medal{position:relative}
 .route-double .ou-medal-number{position:absolute;left:50%;top:60%;transform:translate(-50%,-50%);font:800 17px/1 Inter,Arial,sans-serif;color:currentColor;pointer-events:none}
 .route-double .ou-standings-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:26px 2px 12px}
 .route-double .ou-standings-head h2{margin:0;color:#e7c27a;font:800 clamp(18px,4vw,26px)/1.15 'Bebas Neue',Inter,sans-serif;letter-spacing:.055em}
 .route-double .ou-standings-head span{font:700 10px/1.3 Inter,Arial,sans-serif;letter-spacing:.12em;color:#b8aa91}
 .route-double .ou-standings-rule{height:1px;flex:1;background:linear-gradient(90deg,rgba(218,176,96,.38),transparent)}
 .route-double .table-wrap{border:1px solid rgba(218,174,94,.42)!important;border-radius:19px!important;background:#0a0909!important;box-shadow:0 14px 36px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,219,145,.09)!important}
 .route-double .table-wrap table{border-collapse:separate!important;border-spacing:0!important;width:100%}
 .route-double .table-wrap thead th{padding-top:19px!important;padding-bottom:19px!important;background:linear-gradient(180deg,#1b1915,#111111)!important;border-bottom:1px solid rgba(221,176,96,.28)!important;white-space:nowrap}
 .route-double .table-wrap tbody tr{transition:background .18s ease}
 .route-double .table-wrap tbody td{padding-top:13px!important;padding-bottom:13px!important;border-bottom:1px solid rgba(208,174,108,.12)!important;vertical-align:middle}
 .route-double .table-wrap tbody tr:last-child td{border-bottom:none!important}
 .route-double .table-wrap tbody td.rank{font-weight:850!important;font-variant-numeric:tabular-nums}
 .route-double .ou-safe-row{background:linear-gradient(90deg,rgba(118,126,138,.065),rgba(20,20,22,.2))!important;opacity:.82!important}
 .route-double .ou-penalty-row{background:linear-gradient(90deg,rgba(166,99,41,.11),rgba(29,18,11,.20))!important}
 .route-double .ou-penalty-row td.rank{color:#e9bb69!important}
 .route-double .ou-penalty-row td:last-child{color:#f3c776!important}
 .route-double .ou-penalty-row td:nth-last-child(2) b{color:#f6e5c1}
 .route-double .ou-safe-row td:last-child{color:#989898!important}
 .route-double .ou-penalty-row td:first-child{box-shadow:inset 3px 0 0 rgba(215,164,77,.30)}
 .route-double .ou-team-plate{border-radius:13px!important;background:linear-gradient(120deg,rgba(42,37,27,.72),rgba(10,10,11,.86))!important;border-color:rgba(213,174,102,.29)!important;box-shadow:inset 0 1px 0 rgba(255,226,157,.075)}
 .route-double .ou-team-mark{border-color:rgba(235,190,109,.45)!important}
 .route-double .ou-team-name{font-weight:750!important}
 .route-double .ou-gap-note{margin-top:16px!important;border-radius:14px!important}
 @media(hover:hover){.route-double .table-wrap tbody tr:hover{background:rgba(222,170,84,.12)!important}}
 @media(max-width:640px){.route-double .ou-standings-head{margin-top:20px}.route-double .table-wrap tbody td{padding-top:10px!important;padding-bottom:10px!important}.route-double .table-wrap thead th{padding-top:16px!important;padding-bottom:16px!important}}
 .route-double .ou-podium-team{font-family:Inter,system-ui,Arial,sans-serif!important;font-size:clamp(14px,3.5vw,19px)!important;font-weight:850!important;line-height:1.16!important;min-height:54px!important;letter-spacing:-.025em!important;padding:0 1px!important;text-wrap:balance}
 .route-double .ou-podium-card{padding-left:5px!important;padding-right:5px!important}
 .route-double .ou-podium-1 .ou-podium-team{font-size:clamp(15px,3.8vw,20px)!important}
 .route-double .ou-podium-medal{filter:none!important}
 .route-double .ou-podium-1 .ou-podium-medal{filter:drop-shadow(0 0 9px rgba(241,191,91,.26))!important}
 .route-double .ou-medal-number{top:60%!important;font-size:18px!important;font-weight:900!important}
 .route-double .ou-podium-1 .ou-medal-number{font-size:20px!important}
 .route-double .ou-podium-score{margin-top:10px!important}
 @media(max-width:390px){.route-double .ou-podium-team{font-size:13px!important}.route-double .ou-podium-1 .ou-podium-team{font-size:14px!important}}
 .route-double .ou-podium{margin:18px 0 24px;padding:18px 14px 16px;border:1px solid rgba(211,169,89,.35);border-radius:18px;background:linear-gradient(145deg,#16130e,#09090b 65%);box-shadow:0 12px 32px rgba(0,0,0,.25)}
 .route-double .ou-podium-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px;margin-bottom:17px}
 .route-double .ou-podium-heading h2{margin:0;color:#eecb82;font-size:clamp(17px,3.5vw,25px);font-weight:800;letter-spacing:.035em}
 .route-double .ou-podium-heading span{color:#a69a85;font-size:11px;letter-spacing:.07em}
 .route-double .ou-podium-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;align-items:end}
 .route-double .ou-podium-card{min-width:0;padding:15px 7px 13px;text-align:center;border-radius:13px;border:1px solid rgba(167,167,167,.34);background:linear-gradient(160deg,#1b1b1e,#0d0d0f);overflow-wrap:anywhere}
 .route-double .ou-podium-1{padding-top:20px;padding-bottom:19px;border-color:#cfa652;background:linear-gradient(160deg,#35280f,#16110a 70%);box-shadow:0 0 22px rgba(209,163,73,.12)}
 .route-double .ou-podium-2{border-color:#828992}
 .route-double .ou-podium-3{border-color:#996b50;background:linear-gradient(160deg,#261b16,#100e0d)}
 .route-double .ou-podium-medal{width:47px;height:47px;display:grid;place-items:center;margin:0 auto 3px;color:#bfc5ce;filter:drop-shadow(0 2px 9px rgba(200,200,200,.14))}
 .route-double .ou-podium-medal svg{display:block;width:45px;height:45px}
 .route-double .ou-podium-1 .ou-podium-medal{width:57px;height:57px;filter:drop-shadow(0 0 11px rgba(245,201,107,.32))}
 .route-double .ou-podium-1 .ou-podium-medal svg{width:56px;height:56px}
 .route-double .ou-podium-card{position:relative}
 .route-double .ou-podium-card:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,currentColor,transparent);opacity:.55}
 .route-double .ou-podium-1:before{opacity:.95}
 .route-double .ou-podium-1{transform:translateY(-5px)}
 .route-double .ou-podium-heading{padding-bottom:12px;border-bottom:1px solid rgba(215,174,95,.15)}
 .route-double .page-head p{max-width:560px;line-height:1.5}
 .route-double .grid.stats .card.stat{background:linear-gradient(155deg,rgba(20,19,18,.98),rgba(8,8,9,.98))!important;border-color:rgba(202,163,88,.28)!important;box-shadow:inset 0 1px 0 rgba(255,231,171,.045)}
 .route-double .grid.stats .card.stat small{letter-spacing:.11em}
 .route-double .grid.stats .card.stat b{line-height:1.1}
 /* Double round · polished metal rim system */
 .route-double .page-head{position:relative;padding-bottom:20px;margin-bottom:20px}
 .route-double .page-head:after{content:"";position:absolute;bottom:0;left:0;width:min(220px,55%);height:2px;background:linear-gradient(90deg,#f3cf7c,rgba(243,207,124,0))}
 .route-double .grid.stats{gap:12px;margin-bottom:22px}
 .route-double .grid.stats .card.stat{position:relative;overflow:hidden;isolation:isolate;border-radius:18px!important;transition:transform .2s ease,border-color .2s ease}
 .route-double .grid.stats .card.stat:before{content:"";position:absolute;pointer-events:none;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,rgba(248,212,139,.82),transparent);opacity:.78}
 .route-double .grid.stats .card.stat:after{content:"";position:absolute;pointer-events:none;inset:0;border-radius:inherit;background:radial-gradient(ellipse at 50% -18%,rgba(235,190,103,.12),transparent 68%);z-index:-1}
 .route-double .grid.stats .card.stat small{color:#aaa49a}
 .route-double .ou-podium{border-radius:21px;overflow:hidden}
 .route-double .ou-podium:before{content:"";position:absolute;pointer-events:none;top:0;left:7%;right:7%;height:2px;background:linear-gradient(90deg,transparent,rgba(245,207,130,.95),transparent);box-shadow:0 0 15px rgba(245,207,130,.3)}
 .route-double .ou-podium-card{isolation:isolate;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 9px 22px rgba(0,0,0,.22)}
 .route-double .ou-podium-card:before{height:3px;opacity:.88;box-shadow:0 0 11px currentColor}
 .route-double .ou-podium-card:after{content:"";position:absolute;pointer-events:none;inset:0;border-radius:inherit;background:radial-gradient(ellipse at 50% -10%,currentColor,transparent 55%);opacity:.075;z-index:-1}
 .route-double .ou-podium-2{color:#bfc6d0}
 .route-double .ou-podium-1{color:#f0c76b}
 .route-double .ou-podium-3{color:#c79776}
 .route-double .ou-podium-medal{filter:drop-shadow(0 0 7px currentColor)}
 .route-double .ou-podium-2 .ou-podium-medal{color:#c5cbd4}
 .route-double .ou-podium-3 .ou-podium-medal{color:#d0a184}
 .route-double .table-wrap{position:relative;box-shadow:0 12px 35px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,222,159,.07)}
 .route-double .table-wrap:before{content:"";position:absolute;top:0;left:8%;right:8%;height:2px;background:linear-gradient(90deg,transparent,rgba(239,199,117,.84),transparent);pointer-events:none;z-index:2}
 .route-double .ou-gap-note{position:relative;overflow:hidden;border-radius:13px;background:linear-gradient(130deg,rgba(28,23,14,.98),rgba(13,12,11,.98));padding:14px 12px}
 .route-double .ou-gap-note:before{content:"";position:absolute;inset:0 10% auto;height:1px;background:linear-gradient(90deg,transparent,rgba(245,204,124,.7),transparent)}
 @media(hover:hover){.route-double .grid.stats .card.stat:hover{transform:translateY(-2px);border-color:rgba(239,195,106,.55)!important}}
 @media(max-width:640px){.route-double .grid.stats{gap:10px}.route-double .ou-podium{margin-top:16px}.route-double .ou-podium-card{border-radius:15px}.route-double .ou-podium-heading h2{line-height:1.15}}
 @media(prefers-reduced-motion:reduce){.route-double .grid.stats .card.stat{transition:none}}
 .route-double .ou-podium{position:relative;isolation:isolate}
 .route-double .ou-podium:after{content:"";pointer-events:none;position:absolute;inset:0;border-radius:inherit;background:radial-gradient(ellipse at 50% 5%,rgba(214,162,66,.07),transparent 64%);z-index:-1}
 .route-double .table-wrap{border-color:rgba(205,166,91,.33)!important;border-radius:17px!important;overflow:auto}
 .route-double .table-wrap thead th{background:#141313!important}
 .route-double .ou-gap-note{box-shadow:inset 0 1px 0 rgba(243,206,136,.06)}

 .route-double .ou-podium-1 .ou-podium-medal{color:#f4c96b}
 .route-double .ou-podium-3 .ou-podium-medal{color:#cb9b7b}
 .route-double .ou-podium-place{font-size:10px;font-weight:800;letter-spacing:.09em;color:#aeb3ba;margin:7px 0}
 .route-double .ou-podium-1 .ou-podium-place{color:#f4c96b}
 .route-double .ou-podium-3 .ou-podium-place{color:#cb9b7b}
 .route-double .ou-podium-team{color:#f7f5f0;font-size:clamp(11px,2.6vw,15px);font-weight:750;line-height:1.3;min-height:38px;display:flex;align-items:center;justify-content:center}
 .route-double .ou-podium-score{color:#e4e4e4;font-weight:850;font-size:clamp(15px,3.6vw,23px);font-variant-numeric:tabular-nums;margin-top:9px;white-space:nowrap}
 .route-double .ou-podium-1 .ou-podium-score{color:#f5d48b}
 .route-double .ou-podium-score small{font-size:9px;font-weight:600;opacity:.8}
 .route-double .ou-podium-pending{font-size:11px;color:#bfb6a7;text-align:center;margin:13px 0 0}
 @media(max-width:380px){.route-double .ou-podium{padding:14px 9px}.route-double .ou-podium-grid{gap:5px}.route-double .ou-podium-card{padding-left:4px;padding-right:4px}.route-double .ou-podium-score{font-size:14px}}
 .route-double .table-wrap{background:rgba(4,4,5,.97)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
 .route-double .table-wrap table{background:rgba(5,5,6,.96)}
 .route-double .ou-team-plate{min-width:0!important;width:min(100%,360px)!important;min-height:0!important;padding:7px 10px 7px 7px!important}
 .route-double .ou-team-mark{width:30px!important;height:30px!important}
 .route-double .ou-team-name{font-size:14px!important}
 @media(orientation:landscape){body:has(.route-double) #ouLiveViewers{left:auto!important;right:12px!important;top:8px!important;transform:none!important}.route-double .ou-team-plate{width:min(100%,310px)!important}}
 .route-double .ou-safe-row{opacity:.67;background:rgba(115,115,115,.065)}
 .route-double .ou-safe-row td{color:#c7c4bc!important}
 .route-double .ou-safe-row td.rank{color:#aaa!important;text-shadow:none!important}
 .route-double .ou-penalty-row{background:rgba(130,69,29,.09)}
 .route-double .ou-penalty-row td:last-child{color:#f1c477;font-weight:750}
 .route-double .ou-safe-row td:last-child{color:#9b9b9b!important}
 .route-double .ou-gap-note{display:flex;align-items:center;justify-content:center;gap:9px;margin:12px 0 4px;padding:10px 12px;border:1px solid rgba(217,173,88,.28);border-radius:10px;background:rgba(217,173,88,.07);color:#e5c483;font-size:12px;font-weight:650;letter-spacing:.01em;text-align:center}
 .route-double .ou-gap-note strong{color:#ffe4a7}
 .route-double .ou-gap-note .ou-gap-icon{font-size:16px;line-height:1}
 @media(max-width:640px){.route-double .ou-gap-note{font-size:11px}}
 /* Final polish: calm the busy basketball wallpaper without losing the OverUnder identity. */
 .route-double .bg{filter:saturate(.72) contrast(.94) brightness(.70)!important;transform:scale(1.04)}
 .route-double .bg::after{background:linear-gradient(180deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.84) 35%,rgba(0,0,0,.91) 72%,rgba(0,0,0,.95) 100%)!important;backdrop-filter:blur(2.4px)!important;-webkit-backdrop-filter:blur(2.4px)!important}
 .route-double .bg::before{background:radial-gradient(ellipse at 50% 12%,rgba(218,172,78,.095),transparent 43%)!important}
 .route-double .page-head{text-shadow:0 2px 15px rgba(0,0,0,.85)}
 .route-double .ou-podium,.route-double .ou-rank-card{backdrop-filter:none;-webkit-backdrop-filter:none}
 @media(max-width:720px){.route-double .bg{filter:saturate(.65) contrast(.92) brightness(.63)!important}.route-double .bg::after{background:linear-gradient(180deg,rgba(0,0,0,.79),rgba(0,0,0,.88) 42%,rgba(0,0,0,.94))!important}}
 .route-double .ou-mobile-standings{display:none}
 @media(max-width:720px){
  .route-double .table-wrap{display:none!important}
  .route-double .ou-mobile-standings{display:grid;gap:9px;margin-top:8px}
  .route-double .ou-rank-card{position:relative;overflow:hidden;border-radius:17px;border:1px solid rgba(205,174,111,.24);background:linear-gradient(125deg,#191715,#0c0c0e 72%);padding:12px 13px 13px;box-shadow:inset 0 1px 0 rgba(255,233,177,.06),0 6px 18px rgba(0,0,0,.18)}
  .route-double .ou-rank-card:before{content:"";position:absolute;inset:0 14% auto;height:2px;background:linear-gradient(90deg,transparent,rgba(231,193,119,.55),transparent)}
  .route-double .ou-rank-safe{background:linear-gradient(120deg,#151619,#0b0c0e 76%);border-color:rgba(159,168,180,.22)}
  .route-double .ou-rank-safe:before{background:linear-gradient(90deg,transparent,rgba(175,184,194,.5),transparent)}
  .route-double .ou-rank-penalty{border-color:rgba(220,171,91,.34)}
  .route-double .ou-rank-top{display:flex;align-items:center;gap:10px;min-width:0}
  .route-double .ou-rank-position{flex:0 0 39px;font:800 30px/1 'Bebas Neue',Impact,sans-serif;color:#e9bd70;text-align:center}
  .route-double .ou-rank-safe .ou-rank-position{color:#a7a9b0}
  .route-double .ou-rank-position small{font-size:15px}
  .route-double .ou-rank-team{min-width:0;flex:1;color:#fff;font-size:16px;font-weight:800;line-height:1.15;overflow-wrap:anywhere}
  .route-double .ou-rank-status{flex:0 0 auto;max-width:95px;padding:6px 7px;border-radius:7px;background:rgba(218,163,78,.12);color:#f2c87e;font-size:10px;line-height:1.2;font-weight:800;text-align:center;white-space:normal}
  .route-double .ou-rank-safe .ou-rank-status{color:#b7bdc6;background:rgba(175,184,195,.09)}
  .route-double .ou-rank-bottom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:12px 0 0 49px;border-top:1px solid rgba(211,176,111,.12);padding-top:11px;gap:6px}
  .route-double .ou-rank-bottom>div{display:flex;flex-direction:column;gap:4px}
  .route-double .ou-rank-bottom small{font-size:10px;letter-spacing:.07em;color:#9f998d;font-weight:700}
  .route-double .ou-rank-bottom strong{font-size:16px;color:#dedbd6;font-weight:750;font-variant-numeric:tabular-nums}
  .route-double .ou-rank-bottom .ou-rank-total{padding-left:10px;border-left:1px solid rgba(215,174,99,.22)}
  .route-double .ou-rank-bottom .ou-rank-total strong{color:#f3cb83;font-size:19px}
  .route-double .ou-rank-safe .ou-rank-total strong{color:#c4c7cc}
  .route-double .ou-rank-card:nth-child(3){margin-top:8px}
 }
 @media(max-width:720px){
  .route-double .ou-mobile-standings{gap:7px!important}
  .route-double .ou-rank-card{padding:9px 12px 10px!important;border-radius:14px!important}
  .route-double .ou-rank-top{gap:8px!important}
  .route-double .ou-rank-position{flex-basis:34px!important;font-size:27px!important}
  .route-double .ou-rank-team{font-size:15px!important}
  .route-double .ou-rank-status{padding:5px 6px!important;font-size:9px!important}
  .route-double .ou-rank-bottom{margin:8px 0 0 42px!important;padding-top:8px!important;gap:5px!important}
  .route-double .ou-rank-bottom>div{gap:2px!important}
  .route-double .ou-rank-bottom small{font-size:9px!important}
  .route-double .ou-rank-bottom strong{font-size:15px!important}
  .route-double .ou-rank-bottom .ou-rank-total strong{font-size:17px!important}
  .route-double .ou-rank-card:nth-child(3){margin-top:5px!important}
 }
 @media(max-width:360px){.route-double .ou-rank-card{padding:11px 9px}.route-double .ou-rank-team{font-size:14px}.route-double .ou-rank-status{max-width:83px;font-size:9px}.route-double .ou-rank-bottom{margin-left:44px}.route-double .ou-rank-bottom strong{font-size:14px}.route-double .ou-rank-bottom .ou-rank-total strong{font-size:16px}}
 </style><section class="page-head"><h1>DUPLO KOLO</h1><p>${pending?'Privremeni poredak posle '+d.roundA+'. kola · konačan zbir nakon '+d.roundB+'. kola.':'Dva kola. Jedan zbir. Poslednjih pet plaća, dva tima iznad crte.'}</p></section><section class="grid stats"><div class="card stat"><small>Format</small><b>2 KOLA</b></div><div class="card stat"><small>Prikaz</small><b>7 TIMOVA</b></div><div class="card stat"><small>Penal</small><b>${pending?'NA ČEKANJU':fmt(DATA.meta.doublePenalty)+' RSD'}</b></div><div class="card stat"><small>Aktuelno</small><b>${d.label}</b></div></section>${podiumHtml}<div class="ou-mobile-standings">${mobileRows}</div><div class="table-wrap"><table><thead><tr><th>POS.</th><th>NAZIV TIMA</th><th>KOLO ${d.roundA}</th><th>KOLO ${d.roundB}</th><th>UKUPNO</th><th>PENAL</th></tr></thead><tbody>${rows}</tbody></table></div>${boundaryGap===null?'':`<div class="ou-gap-note"><span class="ou-gap-icon">✦</span><span>13. mesto izbeglo kaznu za <strong>${gapLabel} poena</strong></span></div>`}`,'double');
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
