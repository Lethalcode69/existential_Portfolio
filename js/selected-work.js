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
