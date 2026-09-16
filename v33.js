(()=>{
  const teamByName=name=>(window.OVERUNDER_DATA?.teams||[]).find(t=>t.name===name);
  const genericName=(id)=>`TEAM ${String(Number(String(id||'').replace(/\D/g,''))||0).padStart(2,'0')}`;
  function hideTeamNamesOutsideBudget(shell){
    if(shell.classList.contains('route-budget')) return;
    /* Until each competition starts, real fantasy-team names live only on Budget. */
    (window.OVERUNDER_DATA?.teams||[]).forEach(t=>{
      if(!t?.name || /^TEAM \d+$/i.test(t.name)) return;
      const replacement=genericName(t.id);
      document.querySelectorAll('main td.team, main .teamline .name, main .team-card strong, main .record-hero h2, main .history td.team').forEach(el=>{
        if(el.textContent.includes(t.name)) el.textContent=el.textContent.replace(t.name,replacement);
      });
    });
  }
  function decorate(){
    const shell=document.querySelector('.app-shell'); if(!shell)return;
    const brand=document.querySelector('.brand-centered');
    if(brand){brand.classList.add('brand-right');const img=brand.querySelector('img');if(img)img.src='assets/logo.png';}
    if(!shell.classList.contains('route-home')){
      const head=document.querySelector('.page-head');
      if(head&&!head.querySelector('.page-watermark')) head.insertAdjacentHTML('beforeend','<img class="page-watermark" src="assets/logo.png" alt="">');
    }
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