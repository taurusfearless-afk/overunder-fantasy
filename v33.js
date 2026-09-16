(()=>{
  const teamByName=name=>(window.OVERUNDER_DATA?.teams||[]).find(t=>t.name===name);
  const genericName=(id)=>`TEAM ${String(Number(String(id||'').replace(/\D/g,''))||0).padStart(2,'0')}`;
  function hideTeamNamesOutsideBudget(shell){
    if(shell.classList.contains('route-budget')) return;
    (window.OVERUNDER_DATA?.teams||[]).forEach(t=>{
      if(!t?.name || /^TEAM \d+$/i.test(t.name)) return;
      const replacement=genericName(t.id);
      document.querySelectorAll('main td.team, main .teamline .name, main .team-card strong, main .record-hero h2, main .history td.team').forEach(el=>{
        if(el.textContent.includes(t.name)) el.textContent=el.textContent.replace(t.name,replacement);
      });
    });
  }
  function correctLeagueLabels(shell){
    if(shell.classList.contains('route-home')){
      document.querySelectorAll('.nav-card-v2 p').forEach(p=>{if(p.textContent.includes('Završnih 6 kola'))p.textContent='Završnih 8 kola · poslednjih 10 timova';});
    }
    if(shell.classList.contains('route-league')){
      const p=document.querySelector('.page-head p'); if(p)p.textContent='Završnih 8 kola · poslednjih 10 ekipa · R31–R38';
      const stats=document.querySelectorAll('.stats .stat b');
      if(stats[1])stats[1].textContent='8';
      if(stats[2])stats[2].textContent='R31';
      if(stats[3])stats[3].textContent='R38';
    }
  }
  function decorate(){
    const shell=document.querySelector('.app-shell'); if(!shell)return;
    const brand=document.querySelector('.brand-centered');
    if(brand){
      brand.classList.add('brand-right');
      const img=brand.querySelector('img');
      if(img){img.src='assets/logo-header-v2.png.png';img.alt='Over Under';}
      const text=brand.querySelector('.brand-text'); if(text) text.style.display='none';
    }
    if(shell.classList.contains('route-home')){
      const heroImg=document.querySelector('.hero-mark img');
      if(heroImg){heroImg.src='assets/logo-main-transparent.png.png';heroImg.alt='Over Under EuroLeague Fantasy 2026/27';}
    }else{
      const head=document.querySelector('.page-head');
      if(head&&!head.querySelector('.page-watermark')) head.insertAdjacentHTML('beforeend','<img class="page-watermark" src="assets/logo-main-transparent.png.png" alt="">');
    }
    correctLeagueLabels(shell);
    hideTeamNamesOutsideBudget(shell);
    if(shell.classList.contains('route-budget')){
      document.querySelectorAll('tbody td.team').forEach(td=>{
        if(td.dataset.ownerAdded)return;
        const name=td.textContent.trim(),t=teamByName(name);td.dataset.ownerAdded='1';
        td.innerHTML=`<span class="budget-team-name">${name}</span>${t?.owner?`<span class="budget-owner">${t.owner}</span>`:''}`;
      });
    }
    if(shell.classList.contains('route-rules')){
      const joke=document.querySelector('.rules-joke'),footer=document.querySelector('.footer');
      if(joke&&footer&&!footer.querySelector('.rules-joke')){joke.remove();footer.appendChild(joke)}
    }
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(decorate));
  obs.observe(document.getElementById('app'),{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(decorate,0));
  addEventListener('DOMContentLoaded',()=>setTimeout(decorate,0));
  setTimeout(decorate,50);
})();