(function(){
const $=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const nav=$('nav'),reflection=$('reflection-field'),heroEl=$('hero'),capEl=$('cap'),
 loadEl=$('load'),hintEl=$('hint'),cats=$('hero-categories'),spacer=$('spacer'),bar=$('progress');
const mb=$('mbtn'),mn=$('menu');
const links=[...mn.querySelectorAll('a[data-key]')];
const PROJECTS=['kinetic','lms','ai-insurance','asuretify'];

/* Hero -> sections handoff (scroll-linked fade of the hero; the nav logo stays put). */
function applyStaticState(){
 const vh=innerHeight,vw=innerWidth;
 spacer.style.height=(vh*.9)+'px';
 const p=clamp(scrollY/(vh*.9)),ease=p*p*(3-2*p);
  reflection.style.opacity=String(1-ease*.98);reflection.style.transform='scale('+(1+ease*.14)+')';
 const onSection=scrollY>vh*.9;
 document.body.classList.toggle('section-mode',onSection);
 document.body.classList.remove('lock');
 heroEl.style.opacity=String(1-clamp((p-.82)/.18));heroEl.style.visibility=p>.99?'hidden':'visible';
 capEl.style.opacity=onSection?'1':'0';capEl.style.visibility=onSection?'visible':'hidden';capEl.style.transform='none';
 loadEl.style.display='none';hintEl.style.opacity=String(1-ease);cats.style.opacity=String(1-ease);
  nav.classList.add('ready');nav.style.opacity='1';nav.style.visibility='visible';
 const max=document.documentElement.scrollHeight-vh;
 bar.style.transform='scaleX('+(max>0?clamp(scrollY/max):0)+')';
}

/* Section tracking (drives the active marker in the menu). */
const topOf=sel=>{if(sel==='top')return 0;const el=document.querySelector(sel);return el?el.getBoundingClientRect().top+scrollY:null};
let current='';
function spy(){
 const vh=innerHeight,probe=scrollY+vh*.4;
 let key='home';
 if(scrollY>vh*.9){
  key='services';
  links.forEach(a=>{const sel=a.dataset.target;if(sel==='top')return;const y=topOf(sel);if(y!==null&&y<=probe)key=a.dataset.key});
 }
 if(key===current)return;current=key;
 const inProject=PROJECTS.includes(key);
 links.forEach(a=>{
  const k=a.dataset.key,on=k===key||(k==='work'&&inProject);
  a.classList.toggle('is-active',on);
  if(k===key)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
 });
}

/* Navigation */
function go(sel,key,instant){
 let y=topOf(sel);if(y===null)return;
 if(sel!=='top')y=Math.max(Math.ceil(y),Math.ceil(innerHeight*.9)+4);
 scrollTo({top:y,behavior:(reduce||instant)?'auto':'smooth'});
 try{history.replaceState(null,'','#'+key)}catch(e){}
}
function tog(o){
 mn.classList.toggle('open',o);
 mb.setAttribute('aria-label',o?'Close menu':'Open menu');
 mb.setAttribute('aria-expanded',o);
 if(o){spy();setTimeout(()=>{const a=mn.querySelector('a.is-active')||links[0];if(a)a.focus({preventScroll:true})},60)}
}
mb.onclick=()=>tog(!mn.classList.contains('open'));
links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();tog(false);go(a.dataset.target,a.dataset.key)}));
document.querySelectorAll('[data-jump]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();tog(false);go(a.dataset.jump,a.dataset.key)}));
document.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();tog(false);go('top','home')}));
addEventListener('keydown',e=>{if(e.key==='Escape'&&mn.classList.contains('open')){tog(false);mb.focus()}});

/* Events */
let ticking=false;
addEventListener('scroll',()=>{applyStaticState();if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;spy()})}},{passive:true});
addEventListener('resize',()=>{applyStaticState();spy()});
applyStaticState();spy();

/* Deep links such as #kinetic or #process */
addEventListener('load',()=>{
 const h=location.hash.slice(1),hit=links.find(a=>a.dataset.key===h);
 if(hit&&h!=='home')go(hit.dataset.target,hit.dataset.key,true);
 applyStaticState();spy();
});
})();
