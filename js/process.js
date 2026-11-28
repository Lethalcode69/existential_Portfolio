/* Process: current-step highlight */
(() => {
 const steps = [...document.querySelectorAll('#process-evolution .process-step')];
 if (!steps.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) steps.forEach(step => step.classList.toggle('is-current', step === entry.target)); });
 }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.35 });
 steps.forEach(step => observer.observe(step));
})();

/* Process: lifecycle canvas ("How every area evolves", six stages on a loop) */
(()=>{const el=document.getElementById('evolve'),cv=document.getElementById('evc');if(!el||!cv)return;
const ctx=cv.getContext('2d'),labs=[...el.querySelectorAll('.ev-lab')],rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const T=[45,230,210],V=[139,92,246],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const col=(k,a)=>`rgba(${T[0]+(V[0]-T[0])*k|0},${T[1]+(V[1]-T[1])*k|0},${T[2]+(V[2]-T[2])*k|0},${a})`;
const sphere=(n,r,k0,k1,s)=>{const a=[];for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,q=Math.sqrt(1-y*y),h=i*2.39996;a.push([Math.cos(h)*q*r,y*r,Math.sin(h)*q*r,k0+(k1-k0)*(y+1)/2,s])}return a};
const ring=(n,r,rx,rz,k,s)=>{const a=[],c=Math.cos(rx),d=Math.sin(rx),e=Math.cos(rz),f=Math.sin(rz);for(let i=0;i<n;i++){const h=i/n*6.2832,x=Math.cos(h)*r,y=Math.sin(h)*r;a.push([x*e-y*c*f,x*f+y*c*e,y*d,k,s])}return a};
const cs=[-1,1];
const cube=(n,r)=>{const a=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++){const d=i^j;if(d&(d-1))continue;const A=[i&1?1:-1,i&2?1:-1,i&4?1:-1],B=[j&1?1:-1,j&2?1:-1,j&4?1:-1];for(let s=0;s<=n;s++){const u=s/n;a.push([(A[0]+(B[0]-A[0])*u)*r,(A[1]+(B[1]-A[1])*u)*r,(A[2]+(B[2]-A[2])*u)*r,(A[0]+1)*.3+.1,1.1])}}
for(let i=0;i<8;i++)a.push([(i&1?1:-1)*r,(i&2?1:-1)*r,(i&4?1:-1)*r,.15,2.6]);for(const x of cs)for(const y of cs)for(const z of cs)a.push([x*r*.5,y*r*.5,z*r*.5,.5,1.5]);return a};
const shell=(g,r)=>{const a=[];for(let i=0;i<g;i++)for(let j=0;j<g;j++){const u=(i/(g-1)*2-1)*r,v=(j/(g-1)*2-1)*r,k=(u+v)/(4*r)+.5;for(const s of cs){a.push([u,v,s*r,k,1.05],[u,s*r,v,k,1.05],[s*r,u,v,k,1.05])}}return a};
const plane=(g,z,k)=>{const a=[];for(let i=0;i<g;i++)for(let j=0;j<g;j++){const e=i==0||j==0||i==g-1||j==g-1;a.push([(i/(g-1)*2-1)*.95,z,(j/(g-1)*2-1)*.75,k,e?1.7:.8])}return a};
const tun=()=>{const a=[];for(let r=0;r<6;r++){const u=r/5;a.push(...ring(64,.35+u*.6,0,0,.1+u*.8,1).map(q=>[q[0],q[1],(u*2-1)*.9,q[3],.95+u*.5]))}for(let i=0;i<200;i++){const u=i/200,h=u*6.2832*3;a.push([Math.cos(h)*(.3+u*.65),Math.sin(h)*(.3+u*.65),(u*2-1)*.9,u,1.2])}return a};
const O=[[...sphere(300,.36,0,.25,1.5),...sphere(150,.95,.1,.5,.8),...ring(70,1,1.2,.3,.2,1),...ring(70,1.15,.5,-.6,.5,1)],cube(46,.8),
 [...plane(15,-.5,.55),...plane(15,0,.7),...plane(15,.5,.85)].map(q=>{const c=Math.cos(.2),s=Math.sin(.2);return[q[0]*c-q[1]*s,q[0]*s+q[1]*c,q[2],q[3],q[4]]}),
 [...ring(150,1,1.15,0,.1,1),...ring(150,1,-.35,1.1,.5,1),...ring(150,1,.2,-.9,.9,1),...sphere(160,.3,.55,1,1.8)],shell(8,.7),tun()];
const dust=Array.from({length:230},()=>({x:Math.random(),y:Math.random(),z:Math.random(),k:Math.random()}));
const spr=document.createElement('canvas');spr.width=spr.height=128;{const g=spr.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(80,190,230,.4)');r.addColorStop(.4,'rgba(100,110,240,.1)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128)}
let W,H,D,vis=false,raf=0,last=performance.now(),t=rm?5:0;
function size(){W=el.clientWidth;H=el.clientHeight;D=Math.min(devicePixelRatio||1,2);cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0)}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!rm)t+=dt;
 const rc=el.getBoundingClientRect(),pr=cl((innerHeight-rc.top)/(innerHeight*.8),0,1),fd=pr*pr*(3-2*pr);cv.style.opacity=fd;
 ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
 const G=Math.max(250,W/4.4),L=G*6,R=Math.min(G*.32,H*.2),cy=H*.5,F=950,off=rm?G*.9:(t*58)%L;
 for(const d of dust){if(!rm){d.x+=dt*(14+d.z*46)/W;if(d.x>1)d.x-=1}ctx.fillStyle=col(d.k,.12+d.z*.4);const s=.6+d.z*1.5;ctx.fillRect(d.x*W,d.y*H,s,s)}
 for(let i=0;i<6;i++){const cx=((i*G+off)%L)-G*.5,ang=t*.55+i*1.3,ca=Math.cos(ang),sa=Math.sin(ang),tx=Math.cos(-.38),sx=Math.sin(-.38),P=O[i];
  ctx.globalAlpha=.55;const gs=R*2.9;ctx.drawImage(spr,cx-gs/2,cy-gs/2,gs,gs);ctx.globalAlpha=1;
  for(let n=0;n<P.length;n++){const q=P[n],x1=q[0]*ca+q[2]*sa,z1=-q[0]*sa+q[2]*ca,y1=q[1]*tx-z1*sx,z2=q[1]*sx+z1*tx,zp=z2*R,sc=F/(F+zp),a=cl(.42-z2*.38,.12,1);
   const s=q[4]*sc*1.7;ctx.fillStyle=col(q[3],a);ctx.fillRect(cx+x1*R*sc-s/2,cy+y1*R*sc-s/2,s,s)}
  const l=labs[i];l.style.opacity=fd;l.style.transform=`translate(${(cx-l.offsetWidth/2).toFixed(1)}px,${(cy+R*1.6).toFixed(1)}px)`}
 ctx.globalCompositeOperation='source-over';if(vis&&!rm)raf=requestAnimationFrame(frame)}
size();addEventListener('resize',()=>{size();if(rm||!vis)frame(performance.now())});
new IntersectionObserver(e=>{vis=e[0].isIntersecting;cancelAnimationFrame(raf);if(vis){last=performance.now();frame(last)}},{rootMargin:'20% 0px'}).observe(el);
})();
