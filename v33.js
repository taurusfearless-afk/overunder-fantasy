(()=>{
  const teamByName=name=>(window.OVERUNDER_DATA?.teams||[]).find(t=>t.name===name);
  function decorate(){
    const shell=document.querySelector('.app-shell'); if(!shell)return;
    document.querySelectorAll('.brand-centered img').forEach(img=>img.src='assets/logo-transparent.svg');
    if(!shell.classList.contains('route-home')){
      const head=document.querySelector('.page-head');
      if(head&&!head.querySelector('.page-watermark')) head.insertAdjacentHTML('beforeend','<img class="page-watermark" src="assets/logo-transparent.svg" alt="">');
    }
    if(shell.classList.contains('route-league')){
      document.querySelectorAll('.mobile-list .team-card').forEach(card=>{
        const strong=card.querySelector('.row strong'); if(!strong||strong.dataset.v33)return;
        const raw=strong.textContent.replace(/^#\d+\s*/, '').trim(); const t=teamByName(raw); const rank=(strong.textContent.match(/^#(\d+)/)||[])[1]||'';
        strong.dataset.v33='1'; strong.className='league-identity';
        strong.innerHTML=`<span class="league-rank">${rank}</span><span class="league-team-main"><span class="league-team-name">${raw}</span><span class="league-owner">${t?.owner||''}</span></span>`;
      });
      document.querySelectorAll('.desktop-table tbody tr').forEach(tr=>{const td=tr.querySelector('td.team');if(!td||td.dataset.v33)return;const t=teamByName(td.textContent.trim());td.dataset.v33='1';td.innerHTML=`<span class="league-team-name">${td.textContent.trim()}</span>${t?.owner?`<span class="league-owner">${t.owner}</span>`:''}`});
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