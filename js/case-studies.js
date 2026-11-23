/* Case-study overlays — Kinetic, LMS, AI for Insurance, Asuretify (one shared engine) */
(function(){
const root=document.documentElement,cap=document.getElementById('cap'),mn=document.getElementById('menu'),
 reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const DEFS=[['kinetic','kinetic-case'],['lms','lms-case'],['ai-insurance','ai-insurance-case'],['asuretify','asuretify-case'],['brand','brand-case']];
const ITEMS='.section-head,.problem,.phase,.feature-row,.role-grid>div,.impact-number,.impact-note,.callout,.hero-grid>*,.stat,.next-step .kc-in>*,.copy,.feature-list,.visual,.bs-rv';
const cases={};let cur=null;
function build(key,id){
 const kc=document.getElementById(id);if(!kc)return;
 const sc=kc.querySelector('.kc-scroll'),bg=[...kc.querySelectorAll('.kc-bg i')],ints=[...kc.querySelectorAll('.kc-int')],
  prog=kc.querySelector('.kc-prog'),items=[...kc.querySelectorAll(ITEMS)],hash='#'+id,P=[0,0,0];
 let open=false,opener=null,pushed=false,io=null,prepared=false;
 function prepare(){
  if(prepared)return;prepared=true;
  kc.querySelectorAll('img[data-ref]').forEach(im=>{const s=document.getElementById(im.dataset.ref);if(s)im.src=s.src});
  items.forEach(el=>{el.classList.add('kc-rv');const sib=[...el.parentElement.children].indexOf(el);el.style.setProperty('--d',Math.min(sib,5)*.07+'s')});
 }
 function arm(){
  if(reduce||!('IntersectionObserver' in window)){items.forEach(e=>e.classList.add('is-visible'));return}
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{root:sc,threshold:.12,rootMargin:'0px 0px -40px 0px'});
  items.forEach(e=>io.observe(e));
 }
 function tick(){
  const vh=innerHeight,m=sc.scrollHeight-sc.clientHeight,R=Math.hypot(innerWidth,vh)*.62;
  prog.style.transform='scaleX('+(m>0?sc.scrollTop/m:0)+')';
  ints.forEach((el,i)=>{const t=el.getBoundingClientRect().top;
   let p=Math.min(1,Math.max(0,(60-t)/(.6*vh+60)));if(reduce)p=t<vh*.5?1:0;
   P[i]=p;{const q=Math.min(1,Math.max(0,(p-.45)/.4));el.style.setProperty('--w',(1-q*q*(3-2*q)).toFixed(3))}bg[i+1].style.clipPath='circle('+((1-(1-p)*(1-p))*R).toFixed(1)+'px at 50% 55%)'});
  root.classList.toggle('kc-light',open&&P[1]>.5&&P[2]<.5);
 }
 sc.addEventListener('scroll',tick,{passive:true});
 function openIt(from,push=true){
  if(open)return;
  if(cur&&cur!==api)cur.close({toHistory:false,focus:false});
  open=true;cur=api;opener=from||document.activeElement;prepare();
  if(mn.classList.contains('open'))document.getElementById('mbtn').click();
  root.classList.add('kc-open');cap.inert=true;kc.classList.add('is-open');kc.setAttribute('aria-hidden','false');
  sc.scrollTop=0;arm();tick();
  if(push&&location.hash!==hash){try{history.pushState({kc:key},'',hash);pushed=true}catch(e){}}
  setTimeout(()=>sc.focus({preventScroll:true}),30);
 }
 function closeIt({toHistory=true,focus=true}={}){
  if(!open)return;open=false;if(cur===api)cur=null;
  kc.classList.remove('is-open');kc.setAttribute('aria-hidden','true');root.classList.remove('kc-light');
  if(!cur){root.classList.remove('kc-open');cap.inert=false}
  if(toHistory&&location.hash===hash){if(pushed)history.back();else{try{history.replaceState(null,'','#'+key)}catch(e){}}}
  pushed=false;dispatchEvent(new Event('scroll'));
  if(focus&&opener&&opener.focus)opener.focus({preventScroll:true});
  setTimeout(()=>{if(!open){io&&io.disconnect();if(!reduce)items.forEach(e=>e.classList.remove('is-visible'));sc.scrollTop=0}},650);
 }
 const api={key,hash,open:openIt,close:closeIt,tick,isOpen:()=>open};
 cases[key]=api;
}
DEFS.forEach(d=>build(d[0],d[1]));
const byHash=h=>Object.values(cases).find(c=>c.hash===h);
addEventListener('resize',()=>cur&&cur.tick());
document.addEventListener('click',e=>{
 const t=e.target.closest&&e.target.closest('a,button,[data-kc-open]');if(!t)return;
 if(t.hasAttribute('data-kc-open')){const c=cases[t.getAttribute('data-kc-open')||'kinetic'];if(c){e.preventDefault();e.stopPropagation();c.open(t);return}}
 if(t.hasAttribute('data-kc-close')){e.preventDefault();cur&&cur.close();return}
 if(cur&&(t.hasAttribute('data-go')||t.hasAttribute('data-key')))cur.close({toHistory:false,focus:false});
},true);
addEventListener('keydown',e=>{if(e.key==='Escape'&&cur&&!mn.classList.contains('open')){e.preventDefault();cur.close()}},true);
addEventListener('hashchange',()=>{
 const hit=byHash(location.hash);
 if(hit&&cur!==hit)hit.open(null,false);
 else if(!hit&&cur)cur.close({toHistory:false});
});
addEventListener('load',()=>{const hit=byHash(location.hash);if(hit)hit.open(null,false)});
})();
