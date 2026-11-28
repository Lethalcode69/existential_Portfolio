/* Landing: interactive brand-system point field (WebGL) */
(()=>{const sec=document.getElementById('swarm');if(!sec)return;
const cv=document.getElementById('szc'),gc=document.getElementById('szg'),stage=sec.querySelector('.sz-stage'),gx=gc.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mob=matchMedia('(max-width:760px)');
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),ss=t=>t*t*(3-2*t);
const gl=cv.getContext('webgl',{antialias:true,alpha:false,powerPreference:'high-performance'}),ext=gl&&gl.getExtension('ANGLE_instanced_arrays');
if(!gl||!ext){sec.classList.add('no-gl');return}
/* same lattice as the source: N points, spacing 2.5, tetrahedra of radius .25. Fewer points on phones. */
const N=mob.matches?9000:20000,S=Math.ceil(Math.cbrt(N)),SEP=2.5,HALF=S*SEP/2,TS=.25*1.25;
const VS=`attribute vec3 aP;attribute vec3 aN;attribute vec4 aR;attribute float aI;
uniform mat4 uVP;uniform vec3 uCam,uRo,uRd;uniform mat3 uRot;uniform float uT,uAsm,uS,uSep,uSz,uFade,uPush,uRad,uGain;varying vec3 vC;varying float vA;
float sm(float a,float b,float x){x=clamp((x-a)/(b-a),0.,1.);return x*x*(3.-2.*x);}
mat3 rot(vec3 ax,float a){ax=normalize(ax);float s=sin(a),c=cos(a),o=1.-c;return mat3(c+ax.x*ax.x*o,ax.x*ax.y*o+ax.z*s,ax.x*ax.z*o-ax.y*s,ax.x*ax.y*o-ax.z*s,c+ax.y*ax.y*o,ax.y*ax.z*o+ax.x*s,ax.x*ax.z*o+ax.y*s,ax.y*ax.z*o-ax.x*s,c+ax.z*ax.z*o);}
void main(){
 float i=aI,x=mod(i,uS),y=mod(floor(i/uS),uS),z=floor(i/(uS*uS));
 vec3 L=vec3(x,y,z)*uSep-vec3(uS*uSep*.5-uSep*.5);
 vec3 Sc=(aR.xyz-.5)*vec3(150.);
 float e=sm(0.,1.,1.-exp(-2.4*max(uAsm-aR.w*.9,0.)));
 vec3 d=L-Sc;vec3 P=mix(Sc,L,e)+normalize(cross(d,vec3(0.,1.,0.)+aR.zxy*.05))*sin(3.14159*e)*length(d)*.16*(aR.y-.5)*2.;
 P+=vec3(sin(uT*.6+i*.37),cos(uT*.5+i*.23),sin(uT*.4+i*.51))*.07;
 vec3 q=P-uRo;vec3 cp=uRo+uRd*dot(q,uRd);vec3 away=P-cp;float dd=length(away);
 P+=normalize(away+1e-4)*pow(1.-smoothstep(0.,uRad,dd),2.)*uPush*7.;
 mat3 R=rot(aR.xyz+vec3(.1),uT*(.15+aR.w*.45)+aR.x*6.2832);
 vec3 W=uRot*P+uRot*(R*aP*uSz*(.7+.6*aR.y)); vec3 nW=uRot*(R*aN);
 gl_Position=uVP*vec4(W,1.);
 float tt=clamp((x+y+z)/(3.*(uS-1.)),0.,1.);
 vec3 teal=vec3(.176,.902,.824),vio=vec3(.545,.361,.965);
 vec3 base=mix(teal,vio,sm(.12,.95,tt+(aR.z-.5)*.25));
 vec3 vV=normalize(uCam-W);float diff=max(dot(nW,normalize(vec3(.4,.7,.6))),0.),fr=pow(1.-abs(dot(nW,vV)),2.4);
 float sp=pow(abs(sin(uT*1.1+i*.7)),48.)*step(.92,aR.z);
 vC=(base*(.28+.95*diff)+mix(base,vio,.55)*fr*.9+vec3(.85,1.,1.)*sp*.9)*uGain;
 float dist=length(W-uCam);
 vA=sm(1.5,8.,dist)*(1.-.55*sm(110.,380.,dist))*uFade*(.35+.65*e);
}`;
const FS=`precision mediump float;varying vec3 vC;varying float vA;void main(){gl_FragColor=vec4(vC*vA,1.);}`;
const sh=(t,src)=>{const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null};
const vs=sh(gl.VERTEX_SHADER,VS),fs=sh(gl.FRAGMENT_SHADER,FS);if(!vs||!fs){sec.classList.add('no-gl');return}
const pg=gl.createProgram();gl.attachShader(pg,vs);gl.attachShader(pg,fs);gl.linkProgram(pg);if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){sec.classList.add('no-gl');return}
gl.useProgram(pg);
/* tetrahedron, flat-shaded faces */
const V=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3))),F=[[0,1,2],[0,3,1],[0,2,3],[1,3,2]],G=[];
F.forEach(f=>{const [a,b,c]=f.map(i=>V[i]),u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],w=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];const m=Math.hypot(...n),ct=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3,(a[2]+b[2]+c[2])/3];n=n.map(v=>v/m);if(n[0]*ct[0]+n[1]*ct[1]+n[2]*ct[2]<0)n=n.map(v=>-v);[a,b,c].forEach(p=>G.push(...p,...n))});
const gb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,gb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(G),gl.STATIC_DRAW);
const ib=new Float32Array(N*5);let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
for(let i=0;i<N;i++){ib[i*5]=i;ib[i*5+1]=rnd();ib[i*5+2]=rnd();ib[i*5+3]=rnd();ib[i*5+4]=rnd()}
const nb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,ib,gl.STATIC_DRAW);
const A=n=>gl.getAttribLocation(pg,n),U=n=>gl.getUniformLocation(pg,n),aP=A('aP'),aN=A('aN'),aR=A('aR'),aI=A('aI');
gl.bindBuffer(gl.ARRAY_BUFFER,gb);gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(aN);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,24,12);
gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.enableVertexAttribArray(aI);gl.vertexAttribPointer(aI,1,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(aR);gl.vertexAttribPointer(aR,4,gl.FLOAT,false,20,4);
ext.vertexAttribDivisorANGLE(aI,1);ext.vertexAttribDivisorANGLE(aR,1);
const L={};['uVP','uCam','uRo','uRd','uRot','uT','uAsm','uS','uSep','uSz','uFade','uPush','uRad','uGain'].forEach(n=>L[n]=U(n));
gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(0,0,0,1);
gl.uniform1f(L.uS,S);gl.uniform1f(L.uSep,SEP);gl.uniform1f(L.uSz,TS);
/* size */
let W=0,H=0;const fit=()=>{const r=stage.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,mob.matches?1.25:1.75);W=Math.max(2,Math.round(r.width*d));H=Math.max(2,Math.round(r.height*d));cv.width=W;cv.height=H;gc.width=Math.max(2,W>>2);gc.height=Math.max(2,H>>2);gl.viewport(0,0,W,H)};
fit();new ResizeObserver(fit).observe(stage);
/* input: drag to rotate, pointer pushes the points aside */
let yawD=0,vYaw=0,pitchD=0,drag=false,lx=0,ly=0,mx=0,my=0,sx=0,sy=0,inside=0,pushS=0;
cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;sec.classList.add('is-drag');try{cv.setPointerCapture(e.pointerId)}catch(_){}});
const up=()=>{drag=false;sec.classList.remove('is-drag')};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*2-1;my=-((e.clientY-r.top)/r.height*2-1);inside=e.pointerType==='mouse'?1:0;
 if(drag){vYaw=(e.clientX-lx)*.006;yawD+=vYaw;pitchD=cl(pitchD+(e.clientY-ly)*.003,-.6,.6);lx=e.clientX;ly=e.clientY}});
cv.addEventListener('pointerleave',()=>{inside=0});
/* loop */
const FOV=60,TF=Math.tan(FOV*Math.PI/360),far=1200,near=.1;let live=false,raf=0,t0=0,asm0=0,last=0;
const proj=(a)=>{const f=1/TF;return[f/a,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]};
function frame(now){
 raf=0;if(!live)return;const dt=Math.min(.05,(now-(last||now))/1e3);last=now;if(!t0)t0=now;if(!asm0)asm0=now;
 const T=reduce?4:(now-t0)/1e3,asm=reduce?10:(now-asm0)/1e3;
 const r=sec.getBoundingClientRect(),range=Math.max(1,r.height-innerHeight);let p=reduce?.35:cl(-r.top/range,0,1);
 sec.style.setProperty('--zp',p.toFixed(3));
 /* zoom: from outside the lattice to inside it, then fade to black as the page releases */
 const e=.6*ss(p)+.4*p,D0=HALF*4.2,D1=HALF*.2,D=Math.exp(Math.log(D0)+(Math.log(D1)-Math.log(D0))*e),fade=1-ss(cl((p-.9)/.1,0,1));
 if(!drag)vYaw*=.94,yawD+=vYaw;
 sx+=(mx-sx)*.08;sy+=(my-sy)*.08;pushS+=((inside&&!drag?1:0)-pushS)*.06;
 const yaw=(reduce?0:T*.209)+yawD+sx*.15,pitch=.32+pitchD+sy*.08*-1+.12*Math.sin(T*.15);
 const cy=Math.cos(yaw),sY=Math.sin(yaw),cx=Math.cos(pitch),sX=Math.sin(pitch);
 /* R = Ry * Rx (column-major mat3) */
 const Rm=[cy,sX*sY,-cx*sY, 0,cx,sX, sY,-sX*cy,cx*cy];
 const a=W/H,P=proj(a);
 const VP=new Float32Array([P[0],0,0,0, 0,P[5],0,0, 0,0,P[10],-1, 0,0,P[10]*(-D)+P[14],D]);
 /* pointer ray into lattice space (inverse rotation = transpose) */
 const dx=sx*TF*a,dy=sy*TF,dl=Math.hypot(dx,dy,1),rd=[dx/dl,dy/dl,-1/dl],ro=[0,0,D];
 const inv=v=>[Rm[0]*v[0]+Rm[1]*v[1]+Rm[2]*v[2],Rm[3]*v[0]+Rm[4]*v[1]+Rm[5]*v[2],Rm[6]*v[0]+Rm[7]*v[1]+Rm[8]*v[2]];
 gl.uniformMatrix4fv(L.uVP,false,VP);gl.uniform3f(L.uCam,0,0,D);gl.uniformMatrix3fv(L.uRot,false,new Float32Array(Rm));
 const lo=inv(ro),ld=inv(rd);gl.uniform3f(L.uRo,lo[0],lo[1],lo[2]);gl.uniform3f(L.uRd,ld[0],ld[1],ld[2]);
 gl.uniform1f(L.uT,T);gl.uniform1f(L.uAsm,asm);gl.uniform1f(L.uFade,fade);gl.uniform1f(L.uPush,pushS);gl.uniform1f(L.uGain,1-.55*ss(cl((e-.3)/.7,0,1)));gl.uniform1f(L.uRad,Math.max(5,D*.12));
 gl.clear(gl.COLOR_BUFFER_BIT);ext.drawArraysInstancedANGLE(gl.TRIANGLES,0,12,N);
 gx.clearRect(0,0,gc.width,gc.height);gx.drawImage(cv,0,0,gc.width,gc.height); /* low-res copy, blurred in CSS: the glow */
 if(!reduce)raf=requestAnimationFrame(frame)}
const setLive=v=>{live=v;if(v&&!raf){last=0;raf=requestAnimationFrame(frame)}else if(!v&&raf){cancelAnimationFrame(raf);raf=0}};
if('IntersectionObserver' in window)new IntersectionObserver(es=>setLive(es[0].isIntersecting),{rootMargin:'20% 0px'}).observe(sec);else setLive(true);
addEventListener('scroll',()=>{if(reduce&&live&&!raf)raf=requestAnimationFrame(frame)},{passive:true});
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();setLive(false);sec.classList.add('no-gl')});
})();
