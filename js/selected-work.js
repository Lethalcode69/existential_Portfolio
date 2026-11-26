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

/* Brand system render */
window.BSA={"ill_hero": "assets/img/brand-ill-hero.webp", "ill_structure": "assets/img/brand-ill-structure.webp", "ill_plane": "assets/img/brand-ill-plane.webp", "ill_orbit": "assets/img/brand-ill-orbit.webp", "ill_ship": "assets/img/brand-ill-ship.webp", "w_hero": "assets/img/brand-w-hero.webp", "w_work": "assets/img/brand-w-work.webp", "w_foot": "assets/img/brand-w-foot.webp", "p_hero": "assets/img/brand-p-hero.webp", "p_work": "assets/img/brand-p-work.webp", "v_hero": "assets/img/brand-v-hero.webp", "v_foot": "assets/img/brand-v-foot.webp"};
/* Brand system: render data-driven blocks (runs before the overlay engine so reveals bind) */
(function(){
const R=document.getElementById('brand-case');if(!R)return;
const $=s=>R.querySelector(s),H=(s,h)=>{const e=$(s);if(e)e.innerHTML=h},
hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),
L=h=>{const c=hex(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]},
CR=(a,b)=>{const x=L(a),y=L(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)},
mix=(a,b,t)=>'#'+hex(a).map((v,i)=>Math.round(v+(hex(b)[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase(),
on=h=>L(h)>.35?'#0a0c12':'#fff',
mk=(f,st='')=>`<svg class="bs-m" viewBox="0 0 112 100" aria-hidden="true" style="${st}"><use href="#em-geo" fill="${f}"/></svg>`,
lock=(x,f,tx,dot,dim)=>`<span class="bs-lock" style="--x:${x};color:${tx}">${mk(f)}<span>existential<i style="color:${dot}">.</i><em style="color:${dim}">design</em></span></span>`,
ATM='radial-gradient(ellipse 92% 72% at 4% 0%,rgba(0,209,178,.3),transparent),radial-gradient(ellipse 70% 55% at 88% 0%,rgba(87,64,214,.55),transparent),linear-gradient(135deg,#061a19,#080d16 48%,#100b1d)';
/* hero 3D mark */
{const e=$('#bs-m3d');if(e){let h='';for(let k=0;k<7;k++)h+=`<svg viewBox="0 0 112 100" style="transform:translateZ(${((k-3)*6.5).toFixed(1)}px)"><use href="#em-geo" fill="url(#${k==6?'em-g':'em-gb'})"/></svg>`;e.innerHTML='<span class="m3d-in">'+h+'</span>'}}
/* toc */
const T=[['bs-foundation','Brand foundation'],['bs-logo','Logo'],['bs-colour','Colour'],['bs-type','Type'],['bs-imagery','Imagery'],['bs-voice','Tone of voice'],['bs-expression','Brand expression']];
H('#bs-toc',T.map((t,i)=>`<li><button type="button" data-bs-go="${t[0]}">${t[1]}<em>0${i+1}</em></button></li>`).join(''));
/* evolution: point, line, plane, volume, drawn as live particles (the volume is sampled from the mark's own geometry) */
const bsEvo=root=>{
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,TE=[45,230,210],VI=[139,92,246],cvs=[...root.querySelectorAll('canvas')],cl=(v,a,b)=>v<a?a:v>b?b:v,ez=x=>x*x*(3-2*x);
 const col=(t,a)=>`rgba(${TE.map((c,i)=>Math.round(c+(VI[i]-c)*t)).join()},${a})`;
 const FM={
  point:{n:61,w:i=>i?.7:2.2,L:[[1,60,1]],pos:(i,t)=>{if(!i)return[50,50,0];const a=(i/60)*6.2832+t*.35;return[50+24*Math.cos(a),50+24*Math.sin(a),0]}},
  line:{n:72,w:i=>i<2?2:.7,L:[[0,1,0]],pos:(i,t)=>{const u=i<2?i:((i-2)/70+t*.05)%1;return[20+60*u,76-52*u,0]}},
  plane:{n:88,w:i=>i<72?.7:.35,L:[[0,71,1]],pos:(i,t)=>{if(i>=72){const j=i-72;return[24+52*((j%4)+.5)/4,24+52*(((j/4)|0)+.5)/4,0]}const s=((i/72+t*.03)%1)*4,f=s%1;return[[24+52*f,24,0],[76,24+52*f,0],[76-52*f,76,0],[24,76-52*f,0]][s|0]}},
  volume:{n:720,w:i=>.8,L:[],pos:(i,t,P)=>{const p=P[i],th=Math.sin(t*.4)*.75,c=Math.cos(th),s=Math.sin(th),x=p.x-50,X=x*c+p.z*s,Z=-x*s+p.z*c,Y=(p.y-50)*.98-Z*.18;return[50+X,50+Y,Z]}}
 };
 const sample=cb=>{const g=document.getElementById('em-geo'),d=['em-m','em-k'].map(i=>document.getElementById(i)).filter(Boolean),im=new Image();
  im.onload=()=>{const c=document.createElement('canvas');c.width=448;c.height=400;const x=c.getContext('2d');x.drawImage(im,0,0);const D=x.getImageData(0,0,448,400).data,pts=[];for(let j=0;j<400;j+=3)for(let i=0;i<448;i+=3)if(D[(j*448+i)*4+3]>128)pts.push([i/4,j/4]);cb(pts)};im.onerror=()=>cb([]);
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 100" width="448" height="400"><defs>${d.map(e=>e.outerHTML).join('')}</defs>${g.outerHTML}</svg>`)};
 let raf=0;
 const draw=(S,now)=>{const{c,f,W,H,x}=S,el=RM?9:(now-S.t0)/1000,sc=Math.min(W,H)/100*.86,ox=W/2-50*sc,oy=H/2-50*sc;x.clearRect(0,0,W,H);
  if(f.n===720&&!S.P)return;const cur=[];
  for(let i=0;i<f.n;i++){const q=S.st[i],e=ez(cl((el-q[3])/1.3,0,1)),p=f.pos(i,RM?0:el,S.P),X=q[0]+(p[0]-q[0])*e,Y=q[1]+(p[1]-q[1])*e;cur.push([X*sc+ox,Y*sc+oy,e,p[2],X])}
  x.globalCompositeOperation='lighter';x.lineWidth=1;
  for(const[a,b,cls]of f.L){x.beginPath();for(let i=a;i<=b;i++){const p=cur[i];i==a?x.moveTo(p[0],p[1]):x.lineTo(p[0],p[1])}if(cls)x.closePath();x.strokeStyle=col(.4,.38*cur[a][2]);x.stroke()}
  for(let i=0;i<f.n;i++){const p=cur[i],z=p[3],pr=f.n===720?1+z/160:1,r=(.9+f.w(i)*1.1)*(sc/3.2)*pr*(S.dpr>1?1:1.1)*(f.n===720?1:1.7),a=cl(.35+.65*cl((z+30)/60,0,1),0,1)*(f.n===720?.8:1)*p[2];x.fillStyle=col(cl(p[4]/100,0,1),a);x.beginPath();x.arc(p[0],p[1],Math.max(.6,r),0,6.2832);x.fill();if(f.w(i)>=2){x.fillStyle=col(cl(p[4]/100,0,1),.16*p[2]);x.beginPath();x.arc(p[0],p[1],r*4,0,6.2832);x.fill()}}
  x.globalCompositeOperation='source-over'};
 const tick=now=>{raf=0;let any=false;for(const c of cvs){const S=c._s;if(S.vis){any=true;draw(S,now)}}if(any&&!RM)raf=requestAnimationFrame(tick)};
 const go=()=>{if(RM){cvs.forEach(c=>c._s.vis&&draw(c._s,0))}else if(!raf)raf=requestAnimationFrame(tick)};
 cvs.forEach(c=>{const f=FM[c.dataset.form],S=c._s={c,f,x:c.getContext('2d'),W:0,H:0,dpr:1,vis:false,t0:0,P:null,st:Array.from({length:f.n},()=>[Math.random()*100,Math.random()*100,0,Math.random()*.45])};
  const fit=()=>{const r=c.getBoundingClientRect();S.dpr=Math.min(devicePixelRatio||1,2);S.W=c.width=Math.max(1,r.width*S.dpr|0);S.H=c.height=Math.max(1,r.height*S.dpr|0);go()};
  new ResizeObserver(fit).observe(c);
  new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!S.vis)S.t0=performance.now();S.vis=v;go()},{threshold:.25}).observe(c);
  if(f.n===720)sample(pts=>{if(!pts.length){for(let i=0;i<9000;i++){const a=Math.random()*6.283,r=24+Math.random()*24;pts.push([56+r*Math.cos(a),50+r*Math.sin(a)])}}
   for(let i=pts.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[pts[i],pts[j]]=[pts[j],pts[i]]}
   S.P=pts.slice(0,720).map(p=>({x:(p[0]-56)*.82+50,y:(p[1]-50)*.82+50,z:((Math.random()*7|0)-3)*5.3}));go()})})};
const FM=[['point','Point','a single point, with a ring forming around it'],['line','Line','a line drawn between two points'],['plane','Plane','a flat square with a grid inside it'],['volume','Volume','the existential mark, built in depth from particles']]; H('#bs-evo',`<div class="bs-4">${FM.map(f=>`<figure><div class="v"><canvas data-form="${f[0]}" role="img" aria-label="${f[1]}: ${f[2]}"></canvas></div><figcaption>${f[1]}</figcaption></figure>`).join('')}</div>`); bsEvo($('#bs-evo')); /* logo stage, construction, variants, lockup, misuse */
H('#bs-sym',mk('url(#em-g)'));
H('#bs-con',`<svg viewBox="-14 -8 140 116" style="width:min(100%,640px);color:var(--kt);fill:none;stroke:currentColor;stroke-width:.3"><use href="#em-geo" fill="url(#em-g)" stroke="none" opacity=".92"/><g stroke-dasharray="1.5 1.5" opacity=".8"><circle cx="50" cy="50" r="48"/><circle cx="50" cy="50" r="24"/><path d="M-14 50H126M50 -8V108"/></g><path d="M-2 64.5L106 47M3 62L104 31" stroke="#2de6d2" stroke-width=".6"/><g style="fill:currentColor;stroke:none;font-size:3.4px;letter-spacing:.2px"><text x="100" y="-1">R 48</text><text x="76" y="53">r 24 · 2:1</text><text x="108" y="49">≈ 9° cut</text><text x="106" y="31">≈ 17° wedge</text><text x="-12" y="106">Grid 112 × 100</text></g></svg>`);
const V=[['Primary','#040509',lock('2.2rem','url(#em-g)','#eef1f6','#2de6d2','#8b8d98'),'Gradient mark on Deep Space'],['Secondary','#f7f7f5',lock('2.2rem','#0a0c12','#0a0c12','#00806f','#7b8290'),'Ink on Paper'],['On gradient',ATM,lock('2.2rem','#fff','#fff','#fff','rgba(255,255,255,.7)'),'Mono white on atmosphere'],['Mark only','#040509',mk('url(#em-g)','--h:3.6rem'),'Where space is tight, as in the nav']];
H('#bs-var',V.map(v=>`<figure class="bs-tile"><div class="p" style="background:${v[1]}">${v[2]}</div><figcaption><b>${v[0]}</b>${v[3]}</figcaption></figure>`).join(''));
H('#bs-lock',`<span class="bs-cs" style="--x:3.4rem">${lock('3.4rem','url(#em-g)','var(--kt)','#2de6d2','#8b8d98')}</span>`);
const M=[['transform:rotate(28deg) scaleX(-1)','url(#em-g)','Don’t rotate or flip the mark'],['transform:scaleX(.5)','url(#em-g)','Don’t squeeze or stretch it'],['','#ff8a3d','Don’t recolour outside the palette'],['','x','Don’t close the ring or drop the cut'],['','#8be9d8','Don’t place it on low-contrast colour'],['filter:drop-shadow(0 0 14px #2de6d2) drop-shadow(0 0 30px #8b5cf6)','url(#em-g)','Don’t add heavy glow or shadow']];
H('#bs-mis',M.map((m,i)=>`<figure class="bs-tile bs-x"><div class="p" style="background:${i==4?'#9ff0e0':'#0c0e14'}">${m[1]=='x'?'<svg class="bs-m" viewBox="0 0 112 100" style="--h:6.5rem"><path fill-rule="evenodd" fill="url(#em-g)" d="M50 2a48 48 0 1 0 0 96a48 48 0 1 0 0-96zM50 26a24 24 0 1 1 0 48a24 24 0 1 1 0-48z"/></svg>':mk(m[1],'--h:6.5rem;'+m[0])}</div><figcaption>${m[2]}</figcaption></figure>`).join(''));
/* palette */
const P=[['Deep Space','#040509','Canvas'],['Existence Teal','#2DE6D2','Primary signal'],['Momentum Violet','#8B5CF6','Secondary signal'],['Light Presence','#EEF1F6','Text on dark'],['Signal Grey','#C9CED6','Lines, UI'],['Mist','#8B8D98','Wordmark “design”'],['Paper','#F7F7F5','Light surface'],['Ink','#0A0C12','Text on light'],['Teal Deep','#00806F','Teal on light'],['Violet Deep','#5A3FD6','Violet on light']];
H('#bs-pal',P.map((p,i)=>`<div class="bs-sw" style="background:${p[1]};color:${on(p[1])};--mh:${i<3?'200px':'130px'};${i<3?'grid-column:span 1':''}"><div><b>${p[0]}</b><small>${p[2]}</small></div><div>${p[1]}<small>RGB ${hex(p[1]).join(' ')}</small></div></div>`).join(''));
const RP=[['Existence Teal',[0,1,2,3,4].map(i=>[mix('#2DE6D2','#fff',.72),mix('#2DE6D2','#fff',.38),'#2DE6D2',mix('#2DE6D2','#000',.32),mix('#2DE6D2','#000',.6)][i])],['Momentum Violet',[0,1,2,3,4].map(i=>[mix('#8B5CF6','#fff',.72),mix('#8B5CF6','#fff',.38),'#8B5CF6',mix('#8B5CF6','#000',.32),mix('#8B5CF6','#000',.6)][i])],['Neutrals',['#EEF1F6','#C9CED6','#8B8D98','#4B5260','#1B1F2A']]];
H('#bs-ramps',RP.map(r=>`<div><p class="bs-rl">${r[0]}</p><div class="bs-ramp">${r[1].map((c,i)=>`<div style="background:${c};color:${on(c)}">${i*2+1}00</div>`).join('')}</div></div>`).join(''));
/* accessibility, computed live */
const A=[['#EEF1F6','#040509'],['#2DE6D2','#040509'],['#8B5CF6','#040509'],['#C9CED6','#040509'],['#0A0C12','#F7F7F5'],['#00806F','#F7F7F5'],['#5A3FD6','#F7F7F5'],['#2DE6D2','#F7F7F5'],['#8B5CF6','#F7F7F5']];
const nm=h=>(P.find(p=>p[1].toUpperCase()==h)||[h])[0];
H('#bs-acc',A.map(a=>{const r=CR(a[0],a[1]),k=r>=4.5?['ok','Body + headline']:r>=3?['ok','Headline only']:['no','Don’t use'];return`<div class="bs-cr"><div class="a" style="background:${a[1]};color:${a[0]}">Aa</div><div>${nm(a[0])} on ${nm(a[1])}</div><div class="n">${r.toFixed(2)}</div><span class="bs-bd ${k[0]}">${k[1]}</span></div>`}).join(''));
/* gradients and mapping */
const G=[['Existence','linear-gradient(90deg,#2DE6D2,#5B86F2,#9B5CF6)','#2DE6D2 → #5B86F2 → #9B5CF6'],['Depth','linear-gradient(90deg,#0E5F68,#24378C,#3F2486)','#0E5F68 → #24378C → #3F2486'],['Atmosphere',ATM,'Teal glow top left, violet top right, on Deep Space']];
H('#bs-grad',G.map(g=>`<div><div class="bs-bar bs-gr" style="background:${g[1]};position:relative;overflow:hidden"></div><p class="bs-rl" style="margin-top:.7rem">${g[0]}</p><p style="font-size:.78rem;color:var(--km)">${g[2]}</p></div>`).join(''));
const CM=[['Kinetic','#2DE6D2','#8B5CF6'],['Learning','#BCAEFF','#6FC6EE'],['AI for Insurance','#82B8FF','#7A6BFF'],['Asuretify','#7DF2C4','#12A3AD']];
H('#bs-map',CM.map(c=>`<div class="bs-sw" style="background:linear-gradient(135deg,${c[1]},${c[2]});color:#04100e;--mh:130px"><b>${c[0]}</b><div>${c[1]} · ${c[2]}</div></div>`).join(''));
const TOK=`:root{\n  --bg:#040509; --teal:#2DE6D2; --violet:#8B5CF6;\n  --tx:#EEF1F6; --grey:#C9CED6; --mist:#8B8D98;\n  --paper:#F7F7F5; --ink:#0A0C12;\n  --teal-deep:#00806F; --violet-deep:#5A3FD6;\n  --grad-existence:linear-gradient(135deg,#2DE6D2,#5B86F2 50%,#9B5CF6);\n  --grad-depth:linear-gradient(135deg,#0E5F68,#24378C 50%,#3F2486);\n  --font:"Helvetica Neue",Inter,system-ui,sans-serif;\n  --track-display:-.055em; --track-brand:-.045em; --track-caption:.19em;\n}`;
H('#bs-tok',TOK.replace(/</g,'&lt;'));
/* type usage */
const TY=[['Display','500 · −5.5% · 102%','48–128 px','Ideas don’t just exist.','clamp(2rem,5vw,4rem)'],['Heading','500 · −5.5% · 102%','35–74 px','Give it one recognisable form.','clamp(1.6rem,3.4vw,2.6rem)'],['Subhead','500 · −5.5%','24–38 px','Consistency that scales.','clamp(1.2rem,2vw,1.7rem)'],['Body','400 · 170% line height','15–18 px','Design systems, high-fidelity UI and clean handoff, so products stay coherent as they grow.','1rem'],['Caption','400 · caps · +19%','11 px','05 — Brand &amp; Identity','.7rem']];
H('#bs-typ',TY.map(t=>`<div class="bs-tt"><small>${t[0]}</small><small>Helvetica Neue<br>${t[1]}<br>${t[2]}</small><div style="font-size:${t[4]};${t[0]=='Body'?'letter-spacing:0;line-height:1.7;font-weight:400;color:var(--km)':''}${t[0]=='Caption'?'letter-spacing:.19em;text-transform:uppercase;line-height:1.4':''}">${t[3]}</div></div>`).join(''));
/* imagery */
const B=['radial-gradient(60% 80% at 20% 100%,#2de6d2,transparent 70%),radial-gradient(60% 60% at 90% 90%,#8b5cf6,transparent 70%)','radial-gradient(70% 60% at 50% 100%,#8b5cf6,transparent 70%),radial-gradient(50% 50% at 10% 20%,#2de6d2 0,transparent 60%)','radial-gradient(80% 60% at 80% 100%,#2de6d2,transparent 65%),radial-gradient(60% 60% at 0% 80%,#5b86f2,transparent 70%)','radial-gradient(90% 55% at 50% 110%,#9b5cf6,transparent 70%),radial-gradient(40% 40% at 90% 10%,#2de6d2 0,transparent 70%)','radial-gradient(70% 70% at 0% 100%,#2de6d2,transparent 70%),radial-gradient(70% 70% at 100% 0%,#8b5cf6,transparent 70%)','radial-gradient(60% 50% at 50% 100%,#5b86f2,transparent 70%),radial-gradient(50% 50% at 100% 100%,#9b5cf6,transparent 70%)'];
H('#bs-bgs',B.map((b,i)=>`<div class="bs-bg"><i style="background:${b};animation-delay:-${i*2.3}s"></i></div>`).join(''));
const IC=[['<circle cx="24" cy="24" r="14"/>','<circle class="df" cx="24" cy="24" r="3"/>'],['<circle cx="8" cy="36" r="2"/><circle cx="40" cy="12" r="2"/>','<path class="hl" d="M8 36L40 12"/>'],['<path d="M24 6v36M6 24h36"/>','<circle class="hl" cx="24" cy="24" r="3"/>'],['<rect x="9" y="9" width="30" height="30"/>','<path class="hl" d="M9 39V9h30"/>'],['<path d="M24 5l19 19-19 19L5 24z"/>','<path class="hl" d="M24 14l10 10-10 10-10-10z"/>'],['<path d="M24 6l15 8v20l-15 8-15-8V14zM9 14l15 8 15-8"/>','<path class="hv" d="M24 22v20"/>'],['<circle cx="24" cy="24" r="16"/><ellipse cx="24" cy="24" rx="16" ry="6"/>','<path class="hl" d="M24 8v32"/>'],['<ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-24 24 24)"/>','<circle class="hl" cx="24" cy="24" r="5"/>'],['<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="12"/>','<circle class="hl" cx="24" cy="24" r="6"/>'],['<path d="M10 40V30h10"/>','<path class="hl" d="M10 30a14 14 0 1 1 6 11"/>']];
H('#bs-ics',IC.map(i=>`<div class="bs-ic"><svg viewBox="0 0 48 48" aria-hidden="true">${i[0]}${i[1]}</svg></div>`).join(''));
const IL=[['ill_hero','Hero point cloud','An idea starts as a point and gathers into form.'],['ill_structure','Structure &amp; Flow','Lines join the points into a frame.'],['ill_plane','Design &amp; Prototype','Planes give the frame a surface to work on.'],['ill_orbit','Test &amp; Refine','Orbits keep the form moving as it is tested.'],['ill_ship','Hand off &amp; Ship','The volume resolves, ready to hand over.']];
H('#bs-ils',IL.map(i=>`<figure class="bs-tile"><div class="p" style="padding:0"><img src="${BSA[i[0]]}" alt="${i[1]}, as shown on the live site" loading="lazy"></div><figcaption><b>${i[1]}</b>${i[2]}</figcaption></figure>`).join(''));/* voice */
H('#bs-vx',[['<div class="vi"><h3>Ideas don’t just exist.<br><em>They evolve.</em></h3><p>Aman Singh. Product Designer for B2B SaaS and AI-native products.</p></div>','The belief, in one line','Landing · hero','h'],['<div class="vi"><small>Ideas don’t just exist. They evolve.</small><h3>Have a product in mind?<br><em>Let’s bring it into existence.</em></h3><p>Tell me what you’re building, or what’s stuck. I’ll help you work out the next step.</p></div>','An invitation, not a pitch','Closing · contact','f']].map(v=>`<figure class="bs-tile"><div class="p bs-vc bs-vc-${v[3]}">${v[0]}</div><figcaption><b>${v[1]}</b>${v[2]}</figcaption></figure>`).join(''));
H('#bs-vq',[['Make complex things feel clear.','Offer · Product &amp; UX/UI design'],['Frame it before you build it.','Focus area · Research &amp; strategy'],['Give it one recognisable form.','Focus area · Brand &amp; identity'],['AI suggests. People validate.','Statement · Brand system']].map(q=>`<figure class="bs-q"><blockquote>${q[0]}</blockquote><figcaption>${q[1]}</figcaption></figure>`).join(''));
/* expression */
const br=(k,c,u='existential.design')=>`<figure class="bs-br"><div class="bar"><i></i><i></i><i></i><span>${u}</span></div><img src="${BSA[k]}" alt="${c}, captured from the live site" loading="lazy"><figcaption>${c}</figcaption></figure>`;
const WEB=`<div class="bs-sub bs-rv" style="margin-top:0"><div class="eyebrow">Web</div><p>Captured from the live site, not redrawn: the hero, the selected work and the closing invitation, on desktop and on a phone.</p>${br('w_hero','Landing · the hero')}<div class="bs-g" style="--w:300px;margin-top:clamp(.8rem,1.6vw,1.4rem)">${br('w_work','Selected work')}${br('w_foot','Closing invitation')}<div class="bs-phs"><figure class="bs-pho"><img src="${BSA.p_hero}" alt="The landing page on a phone" loading="lazy"></figure><figure class="bs-pho"><img src="${BSA.p_work}" alt="Selected work on a phone" loading="lazy"></figure><p class="cap">On a phone</p></div></div></div>`;
H('#bs-app',`${WEB}
<div class="bs-sub bs-rv"><div class="eyebrow">Social</div><div class="bs-g" style="--w:220px"><div class="bs-sq bs-gr" style="background:${B[0]},#040509">${mk('url(#em-g)')}<b>Ideas <em>evolve.</em></b></div><div class="bs-sq bs-gr" style="background:${B[3]},#040509"><small>Kinetic · Certificate issuance</small><b>9 → <em>2 days</em></b></div><div class="bs-sq bs-gr" style="background:${ATM}"><small>Frame it before you build it.</small><b>Strategy first.</b></div></div></div>
<div class="bs-sub bs-rv"><div class="eyebrow">Presentation</div><div class="bs-g" style="--w:240px"><div class="bs-sl bs-gr" style="background:${B[4]},#040509">${mk('url(#em-g)')}<b>Case study</b></div><div class="bs-sl" style="background:#040509"><small>03 — Section</small><b>Systems <span style="color:#2de6d2">&amp; craft</span></b></div><div class="bs-sl" style="background:#f7f7f5;color:#0a0c12;border-color:rgba(10,12,18,.12)"><small style="color:#4b5260">Statement</small><b>AI suggests.<br>People validate.</b></div></div></div>`);
/* interactions */
R.addEventListener('click',e=>{
 const g=e.target.closest('[data-bs-go]');if(g){const t=R.querySelector('#'+g.dataset.bsGo);t&&t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});return}
 const v=e.target.closest('[data-bs-v]');if(v){R.querySelectorAll('[data-bs-v]').forEach(b=>b.setAttribute('aria-selected',b===v));pn(+v.dataset.bsV);return}
 const c=e.target.closest('[data-bs-copy]');if(c){const d=()=>{c.textContent='Copied ✓';setTimeout(()=>c.textContent='Copy tokens',1800)};try{navigator.clipboard.writeText(TOK).then(d,d)}catch(_){const t=document.createElement('textarea');t.value=TOK;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();d()}return}
 const dl=e.target.closest('[data-bs-dl]');if(dl){const k=dl.dataset.bsDl,f=k=='grad'?'url(#g)':k=='ink'?'#0A0C12':'#FFFFFF',s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 100" width="448" height="400"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="6" y1="6" x2="98" y2="98"><stop offset="0" stop-color="#2de6d2"/><stop offset=".5" stop-color="#5b86f2"/><stop offset="1" stop-color="#9b5cf6"/></linearGradient><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="100"><rect width="112" height="100" fill="#fff"/><path d="M-2 64.5L106 47V70L80 71-2 66.5Z" fill="#000"/></mask><clipPath id="k"><circle cx="50" cy="50" r="48"/></clipPath></defs><g fill="${f}"><path mask="url(#m)" fill-rule="evenodd" d="M50 2a48 48 0 1 0 0 96a48 48 0 1 0 0-96zM50 26a24 24 0 1 1 0 48a24 24 0 1 1 0-48z"/><path clip-path="url(#k)" d="M3 62L104 31V47Z"/></g></svg>`,a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'image/svg+xml'}));a.download='existential-mark-'+k+'.svg';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
});
})();

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
const ix=sc.querySelector('.bs-idxw');if(ix){ix.style.position='relative';ix.style.zIndex=1}
/* point, line, plane, volume. Straight edges only, and the shape is anchored to the gap between chapters, so it travels with the scroll instead of sitting still behind the content. */
const acts=[...sc.children].filter(e=>e.classList.contains('kc-act'));
function shape(p,w,h,cy,S){const cx=w/2,ex=w/2+2,at=' at 50% '+cy.toFixed(1)+'px';if(p<=0)return'circle(0px'+at+')';
 if(p<.12)return'circle('+(5*ss(cl(p/.08,0,1))).toFixed(1)+'px'+at+')';
 const K=[[.12,5,1.5,1.5],[.36,ex,1.5,1.5],[.7,ex,S*.4,S*.4],[1,ex,cy+2,h-cy+2]]; /* [progress, half-width, up, down] */
 let i=0;while(i<K.length-2&&p>K[i+1][0])i++;const a=K[i],b=K[i+1],t=ss(cl((p-a[0])/(b[0]-a[0]),0,1)),hw=lp(a[1],b[1],t),ht=lp(a[2],b[2],t),hb=lp(a[3],b[3],t);
 return'polygon('+[[cx-hw,cy-ht],[cx+hw,cy-ht],[cx+hw,cy+hb],[cx-hw,cy+hb]].map(q=>q[0].toFixed(1)+'px '+q[1].toFixed(1)+'px').join(',')+')'}
function tick(){const vh=innerHeight,w=innerWidth,P=[];
 wipes.forEach((el,i)=>{const r=el.getBoundingClientRect(),cy=r.top+r.height/2;let p=cl((vh*1.04-cy)/(vh*.9),0,1);if(rm)p=p>.5?1:0;P[i]=p;
  el.firstElementChild.style.clipPath=shape(p,w,vh,cy,r.height);
  const nx=acts[i+1];if(nx)nx.style.setProperty('--g',ss(cl((p-.72)/.26,0,1)).toFixed(3))}); /* the next chapter's content settles in only once its surface is complete */
 if(kc.classList.contains('is-open'))root.classList.toggle('kc-light',(P[1]||0)>.62&&(P[2]||0)<.62)}
sc.addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);
new MutationObserver(()=>{if(kc.classList.contains('is-open'))setTimeout(tick,60)}).observe(kc,{attributes:true,attributeFilter:['class']});
kc.addEventListener('click',e=>{const a=e.target.closest('.bs-idx a');if(!a)return;e.preventDefault();const s=document.getElementById(a.getAttribute('href').slice(1));if(s)sc.scrollTo({top:sc.scrollTop+s.getBoundingClientRect().top-sc.getBoundingClientRect().top-4,behavior:rm?'auto':'smooth'})});
})();
