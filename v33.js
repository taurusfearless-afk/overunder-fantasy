(()=>{
  const teamByName=name=>(window.OVERUNDER_DATA?.teams||[]).find(t=>t.name===name);
  function decorate(){
    const shell=document.querySelector('.app-shell'); if(!shell)return;

    /* Header: brand sits on the far right. Keep the actual site logo asset here. */
    const brand=document.querySelector('.brand-centered');
    if(brand){
      brand.classList.add('brand-right');
      const img=brand.querySelector('img');
      if(img) img.src='assets/logo.png';
    }

    /* Subtle branding on inner pages; no player/owner names outside Budget for now. */
    if(!shell.classList.contains('route-home')){
      const head=document.querySelector('.page-head');
      if(head&&!head.querySelector('.page-watermark')) head.insertAdjacentHTML('beforeend','<img class="page-watermark" src="assets/logo.png" alt="">');
    }

    /* League: team names only until the competition starts. */
    if(shell.classList.contains('route-league')){
      document.querySelectorAll('.league-owner').forEach(el=>el.remove());
      document.querySelectorAll('.mobile-list .team-card').forEach(card=>{
        const strong=card.querySelector('.row strong'); if(!strong||strong.dataset.v34)return;
        const raw=strong.textContent.replace(/^#\d+\s*/, '').trim();
        const rank=(strong.textContent.match(/^#(\d+)/)||[])[1]||'';
        strong.dataset.v34='1'; strong.className='league-identity';
        strong.innerHTML=`<span class="league-rank">${rank}</span><span class="league-team-main"><span class="league-team-name">${raw}</span></span>`;
      });
    }

    /* Budget: this is currently the only page that shows owner/player names. */
    if(shell.classList.contains('route-budget')){
      document.querySelectorAll('tbody td.team').forEach(td=>{
        if(td.dataset.ownerAdded)return;
        const name=td.textContent.trim(); const t=teamByName(name);
        td.dataset.ownerAdded='1';
        td.innerHTML=`<span class="budget-team-name">${name}</span>${t?.owner?`<span class="budget-owner">${t.owner}</span>`:''}`;
      });
    }

    if(shell.classList.contains('route-rules')){
      const joke=document.querySelector('.rules-joke'); const footer=document.querySelector('.footer');
      if(joke&&footer&&!footer.querySelector('.rules-joke')){joke.remove();footer.appendChild(joke)}
    }
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(decorate));
  obs.observe(document.getElementById('app'),{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(decorate,0));
  addEventListener('DOMContentLoaded',()=>setTimeout(decorate,0));
  setTimeout(decorate,50);
})();