/* Hero: the point-cloud animation runs on a continuous loop: six stages, each morphing into the next, and the last one folds back into the first. */
(()=>{const stage=document.getElementById('hero-pc'),cv=document.getElementById('hero-pc-canvas'),cx=cv&&cv.getContext&&cv.getContext('2d');if(!stage||!cx)return;
const mqM=matchMedia('(max-width:760px)'),mqR=matchMedia('(prefers-reduced-motion: reduce)'),mqT=matchMedia('(max-width:1024px)');
const DELAY=1200,STG=3200;           /* start 1.2s after load; each stage morph takes 3.2s, so the full six-stage cycle is 19.2s and then repeats */
let W=0,H=0,dpr=1,raf=0,tFirst=0,tStart=1e15,lastR=0,mx=0,my=0,pmx=0,pmy=0;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)};
/* ---- geometry: one pool of 360 points morphs between six stage layouts ---- */
const N=360;let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const P=Array.from({length:6},()=>new Float32Array(N*4));
const put=(s,i,p,a)=>{const o=i*4,A=P[s];A[o]=p[0];A[o+1]=p[1];A[o+2]=p[2];A[o+3]=a};
const fib=(k,n,r)=>{const y=1-2*(k+.5)/n,q=Math.sqrt(1-y*y),th=k*2.39996;return[Math.cos(th)*q*r,y*r,Math.sin(th)*q*r]};
const ring=(k,n,r,tx,tz)=>{const a=k/n*6.2832,x=Math.cos(a)*r,z=Math.sin(a)*r,y1=-z*Math.sin(tx),z1=z*Math.cos(tx);return[x*Math.cos(tz)-y1*Math.sin(tz),x*Math.sin(tz)+y1*Math.cos(tz),z1]};
const cube=(i,h)=>{const q=i-145,f=q/25|0,u=(q%25)/5|0,v=q%5,a=(u/2-1)*h,b=(v/2-1)*h,s=f&1?-h:h;return f<2?[s,a,b]:f<4?[a,s,b]:[a,b,s]};
const TILT=[[.35,0],[1.15,.6],[-.7,1.25]],TILT3=[[.9,-.4],[-.5,.9],[.2,1.5]],TILT5=[[0,0],[1.5708,0],[0,1.5708]];
const shell=[];for(let j=0;j<65;j++){const p=fib(j,65,1.5+rnd()*1.5);shell.push([p[0]+(rnd()-.5)*.4,p[1]+(rnd()-.5)*.4,p[2]+(rnd()-.5)*.4])}
const O=[0,0,0];
for(let s=0;s<6;s++){put(s,0,O,1);
 for(let i=1;i<N;i++){let p=O,a=0;const g=i<145?(i-1)/48|0:i<295?3:4,k=g<3?(i-1)%48:0;
  if(g<3){const R=[[1.1,1.65,2.2],[.55,.85,1.05],[2.3,2.9,3.5],[2.0,2.5,3.0],[2.35,2.35,2.35]];
   if(s===1){p=ring(k,48,R[0][g],...TILT[g]);a=.85}
   else if(s===2){p=ring(k,48,R[1][g],...TILT[g]);a=.35}
   else if(s===3){p=ring(k,48,R[2][g],...TILT3[g]);a=.85}
   else if(s===4){p=ring(k,48,R[3][g],...TILT3[g]);a=.5}
   else if(s===5){p=ring(k,48,R[4][g],...TILT5[g]);a=.8}}
  else if(g===3){const q=i-145;if(s>=2&&s<=4){p=cube(i,1.25);a=[0,0,.8,.55,.45][s]}else if(s===5){p=fib(q,150,1.7);a=.85}}
  else{const j=i-295;
   if(s===0){p=shell[j];a=.55}else if(s===1){p=shell[j];a=.3}else if(s===2){p=shell[j];a=.12}
   else if(s===3){p=ring((j/3|0)*2.2,48,[2.3,2.9,3.5][j%3],...TILT3[j%3]);a=.9}
   else if(s===4){p=fib(j,65,3.6+(j%5)*.2);a=.95}else{p=fib(j,65,3.1);a=.55}}
  put(s,i,p,a)}}
const range=(a,b)=>Array.from({length:b-a},(_,k)=>a+k),RD=range(145,295),RE=range(295,360),RR=range(1,145);
const loops=(st,n)=>{const o=[];for(let k=0;k<n;k++)o.push(st+k,st+(k+1)%n);return o};
const RL=[...loops(1,48),...loops(49,48),...loops(97,48)],grid=[];
for(let f=0;f<6;f++)for(let u=0;u<5;u++)for(let v=0;v<5;v++){const i=145+f*25+u*5+v;if(u<4)grid.push(i,i+5);if(v<4)grid.push(i,i+1)}
const d2=(S,i,j)=>{const a=S[i*4]-S[j*4],b=S[i*4+1]-S[j*4+1],c=S[i*4+2]-S[j*4+2];return a*a+b*b+c*c};
const near=(S,i,ids)=>{let b=ids[0],bd=1e9;for(const j of ids){const d=d2(S,i,j);if(d<bd){bd=d;b=j}}return b};
const knn=(S,ids,k)=>{const o=[];for(const i of ids){const d=ids.filter(j=>j!==i).map(j=>[d2(S,i,j),j]).sort((x,y)=>x[0]-y[0]);for(let m=0;m<k;m++)o.push(i,d[m][1])}return o};
const corners=[];for(let f=0;f<6;f++)for(const u of[0,4])for(const v of[0,4])corners.push(145+f*25+u*5+v);
const L=[[[range(295,307).flatMap(i=>[0,i]),1,.16]],
 [[RL,0,.5],[[1,17,33,49,65,81,97,113,129].flatMap(i=>[0,i]),1,.24]],
 [[grid,0,.34],[RL,1,.16]],
 [[grid,0,.16],[RL,1,.42],[corners.flatMap(i=>[i,near(P[3],i,RR)]),0,.3]],
 [[grid,0,.1],[RL,1,.2],[knn(P[4],RE,2),0,.4],[RE.flatMap(i=>[i,near(P[4],i,RR)]),1,.25]],
 [[knn(P[5],RD,3),0,.38],[RL,1,.5],[RE.flatMap(i=>[0,i]),1,.14]]];
const ZM=[1.35,1.2,1,.92,.72,.8];
/* ---- sprites ---- */
const spr=c=>{const k=document.createElement('canvas');k.width=k.height=64;const g=k.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);
 r.addColorStop(0,`rgba(${c},1)`);r.addColorStop(.22,`rgba(${c},.55)`);r.addColorStop(.55,`rgba(${c},.12)`);r.addColorStop(1,`rgba(${c},0)`);g.fillStyle=r;g.fillRect(0,0,64,64);return k};
const sT=spr('0,209,178'),sV=spr('120,97,255'),sW=spr('225,255,250');
const sx=new Float32Array(N),sy=new Float32Array(N),ss=new Float32Array(N),aa=new Float32Array(N);
/* ---- render: time, not scroll, drives one continuous progress value ---- */
function render(now){const rm=mqR.matches,t=(now-tFirst)/1000,en=rm?1:sm(0,1,(now-tFirst)/1300),
 su=rm?5:Math.max(0,now-tStart)/STG,sp=su%6,a=Math.floor(sp)%6,b=(a+1)%6,f=sm(.18,.82,sp-Math.floor(sp));
 const zm=(ZM[a]*(1-f)+ZM[b]*f)*.66,u0=Math.min(W,H*1.1)*.14*zm,ps=Math.min(W,H)/620*.8,cxp=W*.5,cyp=H*.5;
 if(!rm){pmx+=(mx-pmx)*.06;pmy+=(my-pmy)*.06}
 const yaw=(rm?0:t*.18)+(1.5+su)*.3+pmx*.5,pit=.35+pmy*.25,cy=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(pit),sp_=Math.sin(pit),A0=P[a],A1=P[b];
 for(let i=0;i<N;i++){const o=i*4,x=A0[o]*(1-f)+A1[o]*f,y=A0[o+1]*(1-f)+A1[o+1]*f,z=A0[o+2]*(1-f)+A1[o+2]*f;
  const X=x*cy+z*sy_,Z0=-x*sy_+z*cy,Y=y*cp-Z0*sp_,Z=y*sp_+Z0*cp,s=7/(7+Z);
  sx[i]=cxp+X*s*u0;sy[i]=cyp+Y*s*u0;ss[i]=s;aa[i]=i?(A0[o+3]*(1-f)+A1[o+3]*f):1}
 cx.clearRect(0,0,W,H);cx.globalCompositeOperation='lighter';cx.lineWidth=1;cx.lineJoin='round';
 for(const[st,w]of[[a,1-f],[b,f]]){if(w<.02)continue;for(const[pr,col,al]of L[st]){if(!pr.length)continue;
  cx.strokeStyle=(col?'rgba(120,97,255,':'rgba(0,209,178,')+(al*w*en).toFixed(3)+')';cx.beginPath();
  for(let k=0;k<pr.length;k+=2){const p=pr[k],qq=pr[k+1];cx.moveTo(sx[p],sy[p]);cx.lineTo(sx[qq],sy[qq])}cx.stroke()}}
 const low=mqT.matches;
 for(let i=1;i<N;i++){const al=aa[i]*en;if(al<.03||(low&&i>144&&(i&1)))continue;const s=ss[i],d=(7+7*s)*ps*(.7+.5*aa[i]);
  cx.globalAlpha=Math.min(1,al*clamp((s-.5)/.8,.25,1));cx.drawImage(i>96&&i<145||i<49?sT:i<97?sV:(i&1?sV:sT),sx[i]-d/2,sy[i]-d/2,d,d)}
 const pu=1+(rm?0:.08*Math.sin(t*2.2)),cs=ps*en;
 cx.globalAlpha=.28;cx.drawImage(sV,sx[0]-150*cs*pu,sy[0]-150*cs*pu,300*cs*pu,300*cs*pu);
 cx.globalAlpha=.7;cx.drawImage(sT,sx[0]-70*cs*pu,sy[0]-70*cs*pu,140*cs*pu,140*cs*pu);
 cx.globalAlpha=1;cx.drawImage(sW,sx[0]-24*cs,sy[0]-24*cs,48*cs,48*cs);cx.globalAlpha=1;cx.globalCompositeOperation='source-over'}
/* ---- visibility: fades as the hero scrolls away; the render loop pauses while it is hidden and picks the cycle up again on return ---- */
const ov=()=>/\bkc-open\b/.test(document.documentElement.className);
function level(){const p=clamp(scrollY/(innerHeight*.9),0,1);return 1-sm(0,.8,p)}
function tick(now){raf=0;if(ov()||document.hidden)return;
 if(!tFirst)tFirst=now;
 const o=level();stage.style.opacity=o.toFixed(3);stage.style.visibility=o<.01?'hidden':'visible';
 if(o<.01)return;
 if(!mqT.matches||mqR.matches||now-lastR>=32){lastR=now;render(now)}
 if(!mqR.matches)loop()}
function loop(){if(!raf)raf=requestAnimationFrame(tick)}
function size(){const r=stage.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,mqM.matches?1.25:mqT.matches?1.5:2);W=r.width;H=r.height;cv.width=W*dpr|0;cv.height=H*dpr|0;cx.setTransform(dpr,0,0,dpr,0,0);loop()}
new ResizeObserver(size).observe(stage);
mqR.addEventListener&&mqR.addEventListener('change',loop);
addEventListener('scroll',loop,{passive:true});
document.addEventListener('visibilitychange',loop);
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
new MutationObserver(()=>{if(!ov())loop()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
const begin=()=>{tStart=performance.now()+DELAY;loop()};
document.readyState==='complete'?begin():addEventListener('load',begin,{once:true});
size();})();
