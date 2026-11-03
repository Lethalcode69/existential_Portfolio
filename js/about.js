(()=>{
  /* About, inline: reveal-on-scroll, plus the Experience / Education / Toolkit tabs. */
  const about=document.getElementById('about'); if(!about) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items=[...about.querySelectorAll('.ab-reveal')];
  if(reduce||!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('is-visible'));}
  else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -40px 0px'});
    items.forEach(el=>io.observe(el));
  }
  const list=about.querySelector('.ab-tabs'); if(!list) return;
  const tabs=[...list.querySelectorAll('[role="tab"]')];
  const panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
  const STEP=7000; list.style.setProperty('--ab-t',STEP+'ms');
  let cur=0,timer=0,auto=!reduce,inView=!('IntersectionObserver' in window),paused=false;
  const restart=()=>{
    clearTimeout(timer); list.classList.remove('auto');
    if(auto&&inView&&!paused){void list.offsetWidth; list.classList.add('auto'); timer=setTimeout(()=>select(cur+1),STEP);}
  };
  const select=(i,focus)=>{
    cur=(i+tabs.length)%tabs.length;
    tabs.forEach((t,k)=>{const on=k===cur;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;panels[k].classList.toggle('is-on',on)});
    if(focus)tabs[cur].focus();
    restart();
  };
  tabs.forEach((t,k)=>{
    t.addEventListener('click',()=>{auto=false;select(k)});
    t.addEventListener('keydown',e=>{
      const n=e.key==='ArrowRight'?cur+1:e.key==='ArrowLeft'?cur-1:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;
      if(n===null)return; e.preventDefault(); auto=false; select(n,true);
    });
  });
  /* auto-advance only while the section is on screen; hovering or focusing the copy pauses it, and any manual choice stops it */
  const copy=about.querySelector('.ab-copy');
  copy.addEventListener('pointerenter',()=>{paused=true;restart()});
  copy.addEventListener('pointerleave',()=>{paused=false;restart()});
  copy.addEventListener('focusin',()=>{paused=true;restart()});
  copy.addEventListener('focusout',()=>{paused=false;restart()});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{inView=es[0].isIntersecting;restart()},{threshold:.35}).observe(about);
  restart();
})();
