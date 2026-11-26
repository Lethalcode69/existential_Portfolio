(()=>{
const about=document.getElementById('about');if(!about)return;
const $=q=>about.querySelector(q),pin=$('.ab-pin'),stage=$('.ab-stage'),por=$('.ab-portrait');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mob=matchMedia('(max-width:760px)'),tab=matchMedia('(max-width:1100px)');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
about.classList.add('ab-js');
/* 1. entrance */
if(reduce||!('IntersectionObserver' in window))about.classList.add('is-in');
else new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){about.classList.add('is-in');o.disconnect()}},{threshold:.3}).observe(stage);
/* 2. bands: constant speed, eased pause/resume on hover or keyboard focus */
const bands=[...document.querySelectorAll('.ab-band')].map(b=>{
  const roll=b.querySelector('.ab-roll'),sq=roll.querySelector('.ab-seq'),base=b.classList.contains('rtl')?44:40;
  let target=1,rate=1,raf=0;
  const anim=()=>roll.getAnimations?roll.getAnimations()[0]:null;
  const step=()=>{const a=anim();raf=0;if(!a)return;rate+=(target-rate)*.12;if(Math.abs(target-rate)<.01)rate=target;a.playbackRate=rate;if(rate!==target)raf=requestAnimationFrame(step)};
  const set=v=>{target=v;if(!raf)raf=requestAnimationFrame(step)};
  let hov=false,foc=false;const upd=()=>set(hov||foc?0:1);
  b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hov=true;upd()}});
  b.addEventListener('pointerleave',()=>{hov=false;upd()});
  b.addEventListener('focusin',()=>{foc=true;upd()});
  b.addEventListener('focusout',()=>{foc=false;upd()});
  const fit=()=>{const w=sq.offsetWidth,a=anim();if(!w||!a||!a.effect)return;const sp=base*(mob.matches?.72:tab.matches?.85:1),dur=w/sp*1000,pr=a.effect.getComputedTiming().progress||0;a.effect.updateTiming({duration:dur});a.currentTime=pr*dur};
  return{fit}});
const fitAll=()=>bands.forEach(b=>b.fit());
/* 3. particle field: one sim, drawn behind and in front of the portrait */
const cb=$('.ab-fx.b'),cf=$('.ab-fx.f'),xb=cb.getContext('2d'),xf=cf.getContext('2d');
const low=(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)||(navigator.connection&&navigator.connection.saveData);
let still=reduce||!!low,W=0,H=0,dpr=1,cx=0,cy=0,R=0,qual=0;
const RINGS=[[1.28,.30,-.2,.055],[1.62,.26,-.12,-.042],[1.95,.22,-.3,.034],[2.3,.30,.12,-.028],[2.75,.2,-.22,.022]];
const N=mob.matches?56:tab.matches?120:176;
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const P=Array.from({length:N},(_,i)=>{const r=i%5,c=rnd();return{r,th:rnd()*6.2832,w:RINGS[r][3]*(.85+rnd()*.3),off:(rnd()-.5)*.08,sz:.5+rnd()*1.2,col:c<.6?0:c<.88?1:2,tw:rnd()*6.28,link:rnd()<.3}});
const spr=[[45,230,210],[139,92,246],[225,240,255]].map(c=>{const k=document.createElement('canvas');k.width=k.height=32;const g=k.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,`rgba(${c},1)`);gr.addColorStop(.25,`rgba(${c},.55)`);gr.addColorStop(1,`rgba(${c},0)`);g.fillStyle=gr;g.fillRect(0,0,32,32);return k});
function size(){const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,mob.matches?1.25:1.5);
  [cb,cf].forEach(c=>{c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)});xb.setTransform(dpr,0,0,dpr,0,0);xf.setTransform(dpr,0,0,dpr,0,0);
  cx=W/2;cy=por.offsetTop+por.offsetHeight*.24;R=Math.min(por.offsetHeight*.37,W*.44);ppSize()}
function draw(now,sc,dt){
  if(!W)return;const t=now/1000,par=(sc-.5)*H*.10;xb.clearRect(0,0,W,H);xf.clearRect(0,0,W,H);
  const ring=RINGS.map((q,i)=>{const a=R*q[0]*(1+.03*Math.sin(t*.21+i*1.7)),b=a*q[1]*(1+.06*Math.sin(t*.17+i)),f=q[2]+.05*Math.sin(t*.09+i*2)+(i%2?1:-1)*(sc-.5)*.35;return{a,b,f,c:Math.cos(f),s:Math.sin(f),py:par*(.4+i*.3)}});
  const lim=Math.round(N/(1+qual)),L=[[],[]];
  for(let i=0;i<lim;i++){const p=P[i],q=ring[p.r];if(!still)p.th+=p.w*dt;
    const ex=q.a*(1+p.off)*Math.cos(p.th),ey=q.b*(1+p.off)*Math.sin(p.th),x=cx+ex*q.c-ey*q.s,y=cy+q.py+ex*q.s+ey*q.c,z=Math.sin(p.th),fr=z>0;
    let al=(fr?.18+.28*z:.12+.3*(1+z))*(.75+.25*Math.sin(t*.8+p.tw));
    if(fr){const dx=(x-cx)/(R*.55),dy=(y-cy-R*.1)/(R*.65),d=dx*dx+dy*dy;if(d<1)al*=d}
    const s=p.sz*3.2*(.8+.35*z)*(R/330),X=fr?xf:xb;X.globalAlpha=al;X.drawImage(spr[p.col],x-s,y-s,s*2,s*2);
    if(p.link)L[fr?1:0].push([x,y])}
  [xb,xf].forEach((X,k)=>{const a=L[k],th=R*.28;X.lineWidth=.6;let n=0;for(let i=0;i<a.length&&n<40;i++)for(let j=i+1;j<a.length&&n<40;j++){const d=Math.hypot(a[i][0]-a[j][0],a[i][1]-a[j][1]);if(d<th){n++;X.globalAlpha=(1-d/th)*.2;X.strokeStyle='#2DE6D2';X.beginPath();X.moveTo(a[i][0],a[i][1]);X.lineTo(a[j][0],a[j][1]);X.stroke()}}});
  xb.globalAlpha=xf.globalAlpha=1;drawPP(now,sc)}
/* portrait: a living particle portrait. The approved photo is sampled into ~40k fine particles (brightness and size follow its luminance).
   Loop (18s): particles drift on orbital paths -> a scan front pulls them home from the top -> the portrait holds and breathes -> it dissolves back into orbit -> repeat.
   All motion is computed on the GPU from one time value; reduced-motion and low-power devices get the settled portrait, still made of particles. */
const ppC=$('.ab-pp'),pimg=$('.ab-portrait img');
let gl=null,gp=null,vb=null,np=0,UL={},ppT0=0,ppX=0,ppY=0,pxs=0,pys=0;
const VS=`attribute vec2 aH;attribute vec4 aR;attribute vec2 aL;uniform float uT,uPR,uStill;uniform vec2 uPt;varying float vA;varying vec3 vC;
float sm(float a,float b,float x){x=clamp((x-a)/(b-a),0.,1.);return x*x*(3.-2.*x);}
void main(){float t=uStill>.5?9.:mod(uT,18.);float y=aH.y;
float ta=.4+y*3.8+aR.x*.8,td=13.3+(1.-y)*3.+aR.y*.8;float A=sm(ta,ta+1.6,t),D=sm(td,td+1.6,t),s=A*(1.-D);
float an=aR.z*6.2832+uT*(.05+.07*aR.w)*(aR.x>.5?1.:-1.),rr=.18+.4*aR.y,tl=(aR.w-.5)*.8;
vec2 o=vec2(cos(an)*rr,sin(an)*rr*.4);o=vec2(o.x*cos(tl)-o.y*sin(tl),o.x*sin(tl)+o.y*cos(tl));vec2 S=vec2(.5,.34)+o;
vec2 H=aH;float ph=aR.z*40.;H+=vec2(sin(uT*.9+ph),cos(uT*.8+ph*1.3))*.0014*(aR.w+.4);H.y+=sin(uT*.55+H.x*5.)*.0008;
vec2 d=H-S;vec2 P=mix(S,H,s)+vec2(-d.y,d.x)*sin(3.1416*s)*(aR.x-.5)*.55;P+=uPt*(.012+.03*(1.-s));
float fl=exp(-pow((t-ta-.9)/.45,2.))*(1.-D)+exp(-pow((t-td-.5)/.4,2.))*.8;
vec3 sc=aR.w>.82?vec3(.55,.38,.97):vec3(.18,.9,.82);vec3 base=vec3(aL.x)*vec3(.93,.97,1.);
vC=mix(sc*.55,base,s)+fl*vec3(.25,.95,.88);vA=mix(.34,1.,s)*(1.+.2*sin(uT*(1.+aR.w*2.5)+aR.z*30.)*s)+fl*.5;
gl_Position=vec4(P.x*2.-1.,1.-P.y*2.,0.,1.);gl_PointSize=max(1.,uPR*aL.y*(mix(.85,1.,s)+fl*.9));}`;
const FS=`precision mediump float;varying float vA;varying vec3 vC;void main(){float r=length(gl_PointCoord-.5)*2.;float a=clamp(vA,0.,1.)*smoothstep(1.,.3,r);gl_FragColor=vec4(vC*a,a);}`;
function glInit(){
  gl=ppC.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,powerPreference:'low-power'});if(!gl)return false;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null},v=sh(gl.VERTEX_SHADER,VS),f=sh(gl.FRAGMENT_SHADER,FS);
  if(!v||!f){gl=null;return false}
  gp=gl.createProgram();gl.attachShader(gp,v);gl.attachShader(gp,f);gl.linkProgram(gp);if(!gl.getProgramParameter(gp,gl.LINK_STATUS)){gl=null;return false}
  gl.useProgram(gp);vb=gl.createBuffer();['uT','uPR','uStill','uPt'].forEach(n=>UL[n]=gl.getUniformLocation(gp,n));
  ppC.addEventListener('webglcontextlost',e=>{e.preventDefault();gl=null;about.classList.remove('pp')});return true}
function buildP(){
  const iw=pimg.naturalWidth,ih=pimg.naturalHeight,w=por.offsetWidth,h=por.offsetHeight;if(!iw||!w||!h)return false;
  const cell=mob.matches?2.7:tab.matches?2.2:1.85,gw=Math.ceil(w/cell),gh=Math.ceil(h/cell),s=Math.max(w/iw,h/ih),dw=iw*s,dh=ih*s;
  const c=document.createElement('canvas');c.width=gw;c.height=gh;const g=c.getContext('2d',{willReadFrequently:true});g.imageSmoothingQuality='high';
  g.drawImage(pimg,(w-dw)*.5/cell,(h-dh)*.06/cell,dw/cell,dh/cell); /* same crop as object-fit:cover, object-position 50% 6% */
  let D;try{D=g.getImageData(0,0,gw,gh).data}catch(e){return false}
  const A=new Float32Array(gw*gh*8);let n=0,sd=11;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;
  for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const k=(j*gw+i)*4,L=(.299*D[k]+.587*D[k+1]+.114*D[k+2])/255;if(L<.06)continue; /* the navy backdrop is skipped, so only the figure becomes particles */
    const lum=Math.pow(clamp((L-.05)/.56),.68);if(r()>lum*1.06)continue; /* stipple: tone is carried by particle density, so light areas are dense and shadows thin out */
    const o=n*8;
    A[o]=(i+.5+(r()-.5)*.8)/gw;A[o+1]=(j+.5+(r()-.5)*.8)/gh;A[o+2]=r();A[o+3]=r();A[o+4]=r();A[o+5]=r();A[o+6]=.64+.4*lum;A[o+7]=cell*(.88+.4*lum);n++}
  gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,A.subarray(0,n*8),gl.STATIC_DRAW);np=n;return true}
function ppSize(){
  if(!gl)return;const w=por.offsetWidth,h=por.offsetHeight;if(!w||!h)return;const d=Math.min(devicePixelRatio||1,mob.matches?1.5:2);
  ppC.width=Math.round(w*d);ppC.height=Math.round(h*d);if(!buildP()){gl=null;about.classList.remove('pp')}}
function initPortrait(){
  if(!ppC||!pimg)return;
  const go=()=>{if(!pimg.naturalWidth||gl)return;if(!glInit())return;about.classList.add('pp');ppSize();if(live&&!raf){last=0;raf=requestAnimationFrame(loop)}};
  if(pimg.complete&&pimg.naturalWidth)go();else pimg.addEventListener('load',go,{once:true})}
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!reduce){pxs=e.clientX/innerWidth-.5;pys=e.clientY/innerHeight-.5}},{passive:true});
function drawPP(now,sc){
  if(!gl||!np)return;if(!still&&!ppT0&&about.classList.contains('is-in'))ppT0=now+300;
  ppX+=(pxs-ppX)*.05;ppY+=(pys-ppY)*.05;
  gl.viewport(0,0,ppC.width,ppC.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.uniform1f(UL.uT,still?0:Math.max(0,ppT0?(now-ppT0)/1000:0));gl.uniform1f(UL.uPR,ppC.width/por.offsetWidth);gl.uniform1f(UL.uStill,still?1:0);gl.uniform2f(UL.uPt,ppX,ppY);
  gl.bindBuffer(gl.ARRAY_BUFFER,vb);const aH=gl.getAttribLocation(gp,'aH'),aR=gl.getAttribLocation(gp,'aR'),aL=gl.getAttribLocation(gp,'aL');
  gl.enableVertexAttribArray(aH);gl.vertexAttribPointer(aH,2,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(aR);gl.vertexAttribPointer(aR,4,gl.FLOAT,false,32,8);gl.enableVertexAttribArray(aL);gl.vertexAttribPointer(aL,2,gl.FLOAT,false,32,24);
  gl.drawArrays(gl.POINTS,0,np)}

let live=false,raf=0,last=0,fc=0,acc=0;
const pass=()=>{const r=pin.getBoundingClientRect(),vh=innerHeight;return{pass:clamp((vh-r.top)/(r.height+vh)),pinned:clamp(-r.top/Math.max(1,r.height-vh))}};
function loop(now){raf=0;if(!live)return;const dt=Math.min(.05,(now-last)/1000||.016);last=now;const s=pass();
  if(!reduce)about.style.setProperty('--p',s.pinned.toFixed(3));
  draw(now,still?.5:s.pass,still?0:dt);if(still)return;
  acc+=dt*1000;if(++fc===90){if(acc/fc>34){qual<2?qual++:(still=true)}fc=0;acc=0}
  raf=requestAnimationFrame(loop)}
const setLive=v=>{live=v&&!document.hidden;about.classList.toggle('is-idle',!live);if(live&&!raf){last=0;raf=requestAnimationFrame(loop)}};
if('IntersectionObserver' in window)new IntersectionObserver(es=>setLive(es[0].isIntersecting),{rootMargin:'10% 0px'}).observe(about);else setLive(true);
document.addEventListener('visibilitychange',()=>setLive(live||!document.hidden));
let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{size();fitAll();if(still&&live)raf||(raf=requestAnimationFrame(loop))},150)});
initPortrait();size();fitAll();addEventListener('load',()=>{size();fitAll()});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{size();fitAll()});
})();
