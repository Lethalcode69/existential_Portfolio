/* Selected work: scroll-driven horizontal panels */
(function(){
const st=document.getElementById('selected-work');if(!st)return;
const stage=st.querySelector('.sw-stage'),track=st.querySelector('.sw-track'),panels=[...st.querySelectorAll('.sw-panel')],
 anchors=[...st.querySelectorAll('.sw-anchor')],dots=[...st.querySelectorAll('.sw-dot')],cur=st.querySelector('.sw-cur'),
 arrows=[...st.querySelectorAll('.sw-arr')],N=panels.length,mq=matchMedia('(prefers-reduced-motion:reduce)');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),ease=x=>x*x*(3-2*x);
let on=false,D=0,raf=0,last=-1;st.style.setProperty('--n',N);
function measure(){
 on=!mq.matches;st.classList.toggle('sw-on',on);const vh=innerHeight;D=vh*(innerWidth<761?.85:1);
 stage.style.height=on?(vh+(N-1)*D)+'px':'';
 const sr=stage.getBoundingClientRect().top;
 anchors.forEach((a,i)=>a.style.top=(on?i*D+1:panels[i].getBoundingClientRect().top-sr)+'px');render(true);
}
function pos(){const p=clamp(-stage.getBoundingClientRect().top/((N-1)*D)),t=p*(N-1),i=Math.min(N-2,Math.floor(t));
 return i+ease(clamp((t-i-.14)/.72));}
function render(force){
 raf=0;if(!on){track.style.transform='';return}
 const x=pos();if(!force&&Math.abs(x-last)<.0004)return;last=x;
 track.style.transform='translate3d('+(-x/N*100)+'%,0,0)';
 const a=Math.round(x);
 panels.forEach((p,i)=>{const d=x-i;p.style.setProperty('--d',d.toFixed(3));p.style.setProperty('--o',(1-Math.min(1,Math.abs(d))*.9).toFixed(3));p.inert=i!==a});
 dots.forEach((d,i)=>d.classList.toggle('is-on',i===a));cur.textContent='0'+(a+1);
 arrows[0].disabled=a===0;arrows[1].disabled=a===N-1;
}
function go(i){i=clamp(i,0,N-1);
 const y=on?stage.getBoundingClientRect().top+scrollY+i*D+1:panels[i].getBoundingClientRect().top+scrollY;
 scrollTo({top:y,behavior:mq.matches?'auto':'smooth'});}
const cr=()=>Math.round(pos());
dots.forEach((d,i)=>d.onclick=()=>go(i));
arrows.forEach(b=>b.onclick=()=>go(cr()+(+b.dataset.dir)));
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>render())},{passive:true});
addEventListener('resize',measure);mq.addEventListener&&mq.addEventListener('change',measure);
addEventListener('keydown',e=>{
 if(!on||(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')||/kc-open/.test(document.documentElement.className)||document.getElementById('menu').classList.contains('open'))return;
 const r=stage.getBoundingClientRect();if(r.top>0||r.bottom<innerHeight)return;
 if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
 e.preventDefault();go(cr()+(e.key==='ArrowRight'?1:-1));});
addEventListener('load',measure);measure();
})();

/* Case-study overlays — Kinetic, LMS, AI for Insurance, Asuretify (one shared engine) */
(function(){
const root=document.documentElement,cap=document.getElementById('cap'),mn=document.getElementById('menu'),
 reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const DEFS=[['kinetic','kinetic-case'],['lms','lms-case'],['ai-insurance','ai-insurance-case'],['asuretify','asuretify-case']];
const ITEMS='.section-head,.problem,.phase,.feature-row,.role-grid>div,.impact-number,.impact-note,.callout,.hero-grid>*,.stat,.next-step .kc-in>*,.copy,.feature-list,.visual';
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
 const t=e.target.closest&&e.target.closest('a,button');if(!t)return;
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
