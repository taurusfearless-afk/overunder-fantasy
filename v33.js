(()=>{
  const teamByName=name=>(window.OVERUNDER_DATA?.teams||[]).find(t=>t.name===name);
  const genericName=(id)=>`TEAM ${String(Number(String(id||'').replace(/\D/g,''))||0).padStart(2,'0')}`;
  function installEnhancements(){
    if(document.getElementById('ou-v49-enhancements'))return;
    const style=document.createElement('style');style.id='ou-v49-enhancements';style.textContent=`
      @media (hover:hover){.nav-card-v2,.season-dashboard,.card{transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}.nav-card-v2:hover{transform:translateY(-3px);border-color:rgba(255,214,104,.55)!important;box-shadow:0 14px 34px rgba(0,0,0,.42),0 0 20px rgba(226,182,77,.08)}.nav-card-v2:hover .go{transform:translateX(4px);color:#ffe28a}.nav-card-v2 .go{transition:transform .22s ease,color .22s ease}}
      .route-home .hero-mark img{animation:ouHeroGlow 5s ease-in-out infinite alternate}@keyframes ouHeroGlow{from{filter:drop-shadow(0 8px 18px rgba(0,0,0,.30)) drop-shadow(0 0 7px rgba(226,182,77,.07))}to{filter:drop-shadow(0 8px 18px rgba(0,0,0,.30)) drop-shadow(0 0 15px rgba(226,182,77,.17))}}
      @media(prefers-reduced-motion:reduce){.route-home .hero-mark img{animation:none!important}}
      @media (orientation:landscape) and (max-height:600px){.container{width:min(100% - 28px,1180px)!important}.topbar,.nav{height:48px!important}.brand-centered.brand-right{height:34px!important}.brand-right img{height:27px!important;width:170px!important}.page-head{min-height:78px!important;padding-top:14px!important;padding-bottom:8px!important}.page-head h1{font-size:38px!important}.page-head p{margin-top:2px!important}.stats{grid-template-columns:repeat(4,1fr)!important;gap:8px!important}.route-budget .table-wrap,.route-double .table-wrap,.route-league .table-wrap{overflow-x:visible!important}.route-budget table,.route-double table{min-width:0!important;width:100%!important;font-size:10.5px!important}.route-budget th,.route-budget td,.route-double th,.route-double td{padding:8px 5px!important;white-space:nowrap!important}.route-budget td.team{min-width:0!important}.budget-owner{font-size:8.5px!important}.route-league .desktop-table{display:block!important}.route-league .mobile-list{display:none!important}.route-league table{font-size:10px!important;min-width:0!important;width:100%!important}.route-league th,.route-league td{padding:7px 3px!important}.footer{padding-bottom:18px!important}}
    `;document.head.appendChild(style);
  }
  function hideTeamNamesOutsideBudget(shell){
    if(shell.classList.contains('route-budget')) return;
    (window.OVERUNDER_DATA?.teams||[]).forEach(t=>{
      if(!t?.name || /^TEAM \d+$/i.test(t.name)) return;
      const replacement=genericName(t.id);
      document.querySelectorAll('main td.team, main .teamline .name, main .team-card strong, main .record-hero h2, main .history td.team').forEach(el=>{if(el.textContent.includes(t.name)) el.textContent=el.textContent.replace(t.name,replacement);});
    });
  }
  function correctLeagueLabels(shell){
    if(shell.classList.contains('route-home')) document.querySelectorAll('.nav-card-v2 p').forEach(p=>{if(p.textContent.includes('Završnih 6 kola'))p.textContent='Završnih 8 kola · poslednjih 10 timova';});
    if(shell.classList.contains('route-league')){
      const p=document.querySelector('.page-head p');if(p)p.textContent='Završnih 8 kola · poslednjih 10 ekipa · R31–R38';
      const stats=document.querySelectorAll('.stats .stat b');if(stats[1])stats[1].textContent='8';if(stats[2])stats[2].textContent='R31';if(stats[3])stats[3].textContent='R38';
    }
  }
  function decorate(){
    installEnhancements();
    const shell=document.querySelector('.app-shell');if(!shell)return;
    const brand=document.querySelector('.brand-centered');
    if(brand){brand.classList.add('brand-right');const img=brand.querySelector('img');if(img){img.src='assets/logo-header-v2.png.png';img.alt='Over Under';}const text=brand.querySelector('.brand-text');if(text)text.style.display='none';}
    if(shell.classList.contains('route-home')){const heroImg=document.querySelector('.hero-mark img');if(heroImg){heroImg.src='assets/logo-main-transparent.png.png';heroImg.alt='Over Under EuroLeague Fantasy 2026/27';}}
    else{const head=document.querySelector('.page-head');if(head&&!head.querySelector('.page-watermark'))head.insertAdjacentHTML('beforeend','<img class="page-watermark" src="assets/logo-main-transparent.png.png" alt="">');}
    correctLeagueLabels(shell);hideTeamNamesOutsideBudget(shell);
    if(shell.classList.contains('route-budget')) document.querySelectorAll('tbody td.team').forEach(td=>{if(td.dataset.ownerAdded)return;const name=td.textContent.trim(),t=teamByName(name);td.dataset.ownerAdded='1';td.innerHTML=`<span class="budget-team-name">${name}</span>${t?.owner?`<span class="budget-owner">${t.owner}</span>`:''}`;});
    if(shell.classList.contains('route-rules')){const joke=document.querySelector('.rules-joke'),footer=document.querySelector('.footer');if(joke&&footer&&!footer.querySelector('.rules-joke')){joke.remove();footer.appendChild(joke)}}
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(decorate));obs.observe(document.getElementById('app'),{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(decorate,0));addEventListener('DOMContentLoaded',()=>setTimeout(decorate,0));setTimeout(decorate,50);
})();