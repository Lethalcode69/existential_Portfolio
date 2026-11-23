(()=>{const kc=document.getElementById('brand-case');if(!kc)return;const sc=kc.querySelector('.kc-scroll'),root=document.documentElement,hud=document.getElementById('bs-hud');if(!sc||!hud)return;
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const IDS=['bs-foundation','bs-logo','bs-colour','bs-type','bs-imagery','bs-voice','bs-expression'],NM=['Brand foundation','Logo','Colour','Type','Imagery','Tone of voice','Brand expression'];
const I=document.getElementById('bsh-i'),T=document.getElementById('bsh-t'),B=document.getElementById('bsh-b');let cur=-1;
const sec=i=>document.getElementById(IDS[i]);
const top=el=>el.getBoundingClientRect().top-sc.getBoundingClientRect().top;
function go(i){const s=sec(cl(i,0,6));if(s)sc.scrollTo({top:sc.scrollTop+top(s)-4,behavior:rm?'auto':'smooth'})}
hud.addEventListener('click',e=>{const b=e.target.closest('button[data-d]');if(b)go((cur<0?-1:cur)+ +b.dataset.d)});
/* the four moves: pinned, one step per scroll stretch */
const evo=document.getElementById('bs-evo');let host=null,pinned=false,rail=null,figs=[],natural=0;
function setupPin(){if(!evo||rm||innerWidth<900||pinned)return;const g=evo.querySelector('.bs-4');if(!g||!g.children.length)return;host=evo.parentElement;figs=[...g.children];
 natural=evo.getBoundingClientRect().top-host.getBoundingClientRect().top;
 rail=document.createElement('div');rail.className='bs-step';rail.innerHTML=figs.map((f,i)=>'<span>'+String(i+1).padStart(2,'0')+'</span>'+(i<figs.length-1?'<i></i>':'')).join('');evo.appendChild(rail);
 host.style.minHeight=(evo.offsetHeight+natural+innerHeight*1.9)+'px';evo.classList.add('is-pin');pinned=true}
function pin(){if(!pinned)return;const r=host.getBoundingClientRect(),s0=sc.getBoundingClientRect().top,stick=parseFloat(getComputedStyle(evo).top)||0;
 const run=host.offsetHeight-evo.offsetHeight-natural,p=run>0?cl((s0+stick-(r.top+natural))/run,0,1):0,k=Math.min(figs.length-1,Math.floor(p*figs.length));
 figs.forEach((f,i)=>{f.classList.toggle('on',i===k);f.classList.toggle('past',i<k)});
 const bars=rail.querySelectorAll('i');bars.forEach((b,i)=>b.style.setProperty('--p',cl(p*figs.length-i,0,1)*100+'%'))}
/* count-up on the opening stats */
const nums=[...kc.querySelectorAll('.stats .stat strong')].map(el=>{const m=/^(\d+)(.*)$/.exec(el.textContent.trim());return m?{el,n:+m[1],rest:m[2],done:false}:null}).filter(Boolean);
nums.forEach(o=>{if(!rm)o.el.textContent='0'+o.rest});
function count(){nums.forEach(o=>{if(o.done||rm)return;const r=o.el.getBoundingClientRect();if(r.top>innerHeight*.95||r.bottom<0)return;o.done=true;const t0=performance.now();(function f(t){const p=cl((t-t0)/900,0,1),v=Math.round(o.n*(1-Math.pow(1-p,3)));o.el.textContent=v+o.rest;if(p<1)requestAnimationFrame(f)})(t0)})}
function upd(){const y=sc.clientHeight*.4;let k=-1;IDS.forEach((id,i)=>{const s=sec(i);if(s&&top(s)<=y)k=i});
 if(k!==cur){cur=k;if(k>=0){I.textContent=String(k+1).padStart(2,'0');T.textContent=NM[k]}}
 root.classList.toggle('bs-on',cur>=0);const m=sc.scrollHeight-sc.clientHeight;B.style.transform='scaleX('+(m>0?sc.scrollTop/m:0)+')';setupPin();pin();count()}
sc.addEventListener('scroll',upd,{passive:true});let lw=innerWidth;addEventListener('resize',()=>{if(innerWidth!==lw){lw=innerWidth;if(pinned){evo.classList.remove('is-pin');host.style.minHeight='';rail&&rail.remove();pinned=false}}else if(pinned){host.style.minHeight=(evo.offsetHeight+natural+innerHeight*1.9)+'px'}upd()});
new MutationObserver(()=>{if(kc.classList.contains('is-open'))setTimeout(upd,700);else{root.classList.remove('bs-on');cur=-1}}).observe(kc,{attributes:true,attributeFilter:['class']});
addEventListener('keydown',e=>{if(!kc.classList.contains('is-open')||e.target.closest('input,textarea'))return;if(e.key==='ArrowDown'&&e.altKey){e.preventDefault();go(cur+1)}if(e.key==='ArrowUp'&&e.altKey){e.preventDefault();go(cur-1)}});
})();

(()=>{const kc=document.getElementById('brand-case');if(!kc)return;const sc=kc.querySelector('.kc-scroll'),wipes=[...kc.querySelectorAll('.bs-int')],root=document.documentElement;if(!sc)return;
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),ss=t=>t*t*(3-2*t),lp=(a,b,t)=>a+(b-a)*t;
/* stacking: outgoing chapter < wipe < incoming chapter, so the new surface sweeps over the old content and the new content sits on top of it */
[...sc.children].filter(e=>e.classList.contains('kc-act')).forEach((e,i)=>{e.style.position='relative';e.style.zIndex=1+2*i});
/* point, line, plane, volume, at full screen size */
function shape(p,w,h){const cx=w/2,cy=h/2;if(p<=0)return'circle(0px at 50% 50%)';
 if(p<.12)return'circle('+(5*ss(cl(p/.08,0,1))).toFixed(1)+'px at 50% 50%)';
 const K=[[.12,[[cx-5,cy-1.5],[cx+5,cy-1.5],[cx+5,cy+1.5],[cx-5,cy+1.5]]],[.34,[[0,cy-1.5],[w,cy-1.5],[w,cy+1.5],[0,cy+1.5]]],[.64,[[w*.14,h*.12],[w*.86,h*.12],[w*.96,h*.9],[w*.04,h*.9]]],[1,[[-2,-2],[w+2,-2],[w+2,h+2],[-2,h+2]]]];
 let i=0;while(i<K.length-2&&p>K[i+1][0])i++;const a=K[i],b=K[i+1],t=ss(cl((p-a[0])/(b[0]-a[0]),0,1));
 return'polygon('+a[1].map((q,j)=>lp(q[0],b[1][j][0],t).toFixed(1)+'px '+lp(q[1],b[1][j][1],t).toFixed(1)+'px').join(',')+')'}
function tick(){const vh=innerHeight,w=innerWidth,P=[];
 wipes.forEach((el,i)=>{const r=el.getBoundingClientRect();let p=cl((vh-r.top)/Math.max(r.height,1),0,1);if(rm)p=p>.5?1:0;P[i]=p;el.firstElementChild.style.clipPath=shape(p,w,vh)});
 if(kc.classList.contains('is-open'))root.classList.toggle('kc-light',(P[1]||0)>.8&&(P[2]||0)<.8)}
sc.addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);
new MutationObserver(()=>{if(kc.classList.contains('is-open'))setTimeout(tick,60)}).observe(kc,{attributes:true,attributeFilter:['class']});
})();
