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
window.BSA={"m": "assets/img/brand-m.webp", "ill_hero": "assets/img/brand-ill-hero.webp", "ill_structure": "assets/img/brand-ill-structure.webp", "ill_plane": "assets/img/brand-ill-plane.webp", "ill_orbit": "assets/img/brand-ill-orbit.webp", "ill_ship": "assets/img/brand-ill-ship.webp", "w_hero": "assets/img/brand-w-hero.webp", "w_work": "assets/img/brand-w-work.webp", "w_foot": "assets/img/brand-w-foot.webp", "p_hero": "assets/img/brand-p-hero.webp", "p_work": "assets/img/brand-p-work.webp", "v_hero": "assets/img/brand-v-hero.webp", "v_foot": "assets/img/brand-v-foot.webp", "desk": "assets/img/brand-desk.webp"};
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
/* evolution: point, line, plane, volume */
const FM=[['<circle class="df" cx="50" cy="50" r="5"/><circle cx="50" cy="50" r="24"/>','Point'],['<circle cx="20" cy="76" r="3"/><circle cx="80" cy="24" r="3"/><path class="hl" d="M20 76L80 24"/>','Line'],['<rect x="24" y="24" width="52" height="52"/><path class="hl" d="M24 76V24h52"/>','Plane']];
H('#bs-evo',`<div class="bs-4">${FM.map(f=>`<figure><div class="v"><svg viewBox="0 0 100 100" role="img" aria-label="${f[1]}">${f[0]}</svg></div><figcaption>${f[1]}</figcaption></figure>`).join('')}<figure><div class="v"><span class="bs-3d"><img src="${BSA.m}" alt="The existential mascot: a glossy three-dimensional e with an orbiting sphere"></span></div><figcaption>Volume</figcaption></figure></div>`);
/* logo stage, construction, variants, lockup, misuse */
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
H('#bs-vx',[['v_hero','The belief, in one line','Landing · hero'],['v_foot','An invitation, not a pitch','Closing · contact']].map(v=>`<figure class="bs-tile"><div class="p" style="padding:0;aspect-ratio:3.2;background:#040509"><img src="${BSA[v[0]]}" alt="${v[1]}" loading="lazy"></div><figcaption><b>${v[1]}</b>${v[2]}</figcaption></figure>`).join(''));
H('#bs-vq',[['Make complex things feel clear.','Offer · Product &amp; UX/UI design'],['Frame it before you build it.','Focus area · Research &amp; strategy'],['Give it one recognisable form.','Focus area · Brand &amp; identity'],['AI suggests. People validate.','Statement · Brand system']].map(q=>`<figure class="bs-q"><blockquote>${q[0]}</blockquote><figcaption>${q[1]}</figcaption></figure>`).join(''));
/* expression */
const br=(k,c,u='existential.design')=>`<figure class="bs-br"><div class="bar"><i></i><i></i><i></i><span>${u}</span></div><img src="${BSA[k]}" alt="${c}, captured from the live site" loading="lazy"><figcaption>${c}</figcaption></figure>`;
const WEB=`<div class="bs-sub bs-rv" style="margin-top:0"><div class="eyebrow">Web</div><p>Captured from the live site, not redrawn: the hero, the selected work and the closing invitation, on desktop and on a phone.</p>${br('w_hero','Landing · the hero')}<div class="bs-g" style="--w:300px;margin-top:clamp(.8rem,1.6vw,1.4rem)">${br('w_work','Selected work')}${br('w_foot','Closing invitation')}<div class="bs-phs"><figure class="bs-pho"><img src="${BSA.p_hero}" alt="The landing page on a phone" loading="lazy"></figure><figure class="bs-pho"><img src="${BSA.p_work}" alt="Selected work on a phone" loading="lazy"></figure><p class="cap">On a phone</p></div></div></div>`;
const DESK=`<div class="bs-sub bs-rv"><div class="eyebrow">System in context</div><figure class="bs-fig"><img src="${BSA.desk}" alt="The brand system laid out on a studio desk: identity, colour, typography and visual language" loading="lazy"><figcaption>Identity, colour, type and visual language, gathered as one brand system.</figcaption></figure></div>`;
H('#bs-app',`${WEB}
<div class="bs-sub bs-rv"><div class="eyebrow">Social</div><div class="bs-g" style="--w:220px"><div class="bs-sq bs-gr" style="background:${B[0]},#040509">${mk('url(#em-g)')}<b>Ideas <em>evolve.</em></b></div><div class="bs-sq bs-gr" style="background:${B[3]},#040509"><small>Kinetic · Certificate issuance</small><b>9 → <em>2 days</em></b></div><div class="bs-sq bs-gr" style="background:${ATM}"><small>Frame it before you build it.</small><b>Strategy first.</b></div></div></div>
<div class="bs-sub bs-rv"><div class="eyebrow">Presentation</div><div class="bs-g" style="--w:240px"><div class="bs-sl bs-gr" style="background:${B[4]},#040509">${mk('url(#em-g)')}<b>Case study</b></div><div class="bs-sl" style="background:#040509"><small>03 — Section</small><b>Systems <span style="color:#2de6d2">&amp; craft</span></b></div><div class="bs-sl" style="background:#f7f7f5;color:#0a0c12;border-color:rgba(10,12,18,.12)"><small style="color:#4b5260">Statement</small><b>AI suggests.<br>People validate.</b></div></div></div>${DESK}`);
/* interactions */
R.addEventListener('pointermove',e=>{const m=e.target.closest&&e.target.closest('.bs-3d');if(!m)return;const r=m.getBoundingClientRect();m.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*30+'deg');m.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*24+'deg')});
R.addEventListener('pointerout',e=>{const m=e.target.closest&&e.target.closest('.bs-3d');if(m){m.style.removeProperty('--ry');m.style.removeProperty('--rx')}});
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
