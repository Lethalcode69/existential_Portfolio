(()=>{
  /* About, inline: reveal-on-scroll, plus the Experience / Education / Toolkit tabs. */
  const about=document.getElementById('about'); if(!about) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items=[...about.querySelectorAll('.ab-reveal')];
  if(reduce||!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('is-visible'));}
  else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -40px 0px'});
    items.forEach(el=>io.observe(el));
  }
  const list=about.querySelector('.ab-tabs'); if(!list) return;
  const tabs=[...list.querySelectorAll('[role="tab"]')];
  const panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
  const STEP=7000; list.style.setProperty('--ab-t',STEP+'ms');
  let cur=0,timer=0,auto=!reduce,inView=!('IntersectionObserver' in window),paused=false;
  const restart=()=>{
    clearTimeout(timer); list.classList.remove('auto');
    if(auto&&inView&&!paused){void list.offsetWidth; list.classList.add('auto'); timer=setTimeout(()=>select(cur+1),STEP);}
  };
  const select=(i,focus)=>{
    cur=(i+tabs.length)%tabs.length;
    tabs.forEach((t,k)=>{const on=k===cur;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;panels[k].classList.toggle('is-on',on)});
    if(focus)tabs[cur].focus();
    restart();
  };
  tabs.forEach((t,k)=>{
    t.addEventListener('click',()=>{auto=false;select(k)});
    t.addEventListener('keydown',e=>{
      const n=e.key==='ArrowRight'?cur+1:e.key==='ArrowLeft'?cur-1:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;
      if(n===null)return; e.preventDefault(); auto=false; select(n,true);
    });
  });
  /* auto-advance only while the section is on screen; hovering or focusing the copy pauses it, and any manual choice stops it */
  const copy=about.querySelector('.ab-copy');
  copy.addEventListener('pointerenter',()=>{paused=true;restart()});
  copy.addEventListener('pointerleave',()=>{paused=false;restart()});
  copy.addEventListener('focusin',()=>{paused=true;restart()});
  copy.addEventListener('focusout',()=>{paused=false;restart()});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{inView=es[0].isIntersecting;restart()},{threshold:.35}).observe(about);
  restart();
})();
(()=>{
const about=document.getElementById('about'),cv=document.getElementById('abGeo');if(!about||!cv)return;
const stg=[...about.querySelectorAll('.ab-stages li')];
const gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false});if(!gl){cv.hidden=true;return;}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,narrow=matchMedia('(max-width:760px)');
let live=true;if('IntersectionObserver' in window){live=false;new IntersectionObserver(es=>{live=es[0].isIntersecting;about.classList.toggle('is-live',live)},{rootMargin:'12% 0px'}).observe(about)}
const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS=`precision highp float;
uniform vec2 uC,uM;uniform float uR,uPx,uT,uEvo,uFade;
float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec4 ov(vec4 a,vec4 b){return a+b*(1.-a.a);}
float cv(float d,float w,float aa){return 1.-smoothstep(w,w+aa*1.5,d);}
vec3 env(vec3 d,float b){
 float k=clamp(d.x*.5+.5+b,0.,1.);
 vec3 c=mix(vec3(0.,.82,.7),vec3(.47,.36,1.),smoothstep(.1,.9,k))*(.22+.95*pow(d.y*.5+.5,2.));
 vec3 n=normalize(d);
 c+=smoothstep(.8,.97,dot(n,normalize(vec3(-.5,.7,.55))))*1.1;
 c+=vec3(.6,.9,1.)*smoothstep(.78,1.,dot(n,normalize(vec3(.7,-.35,.6))))*.4;
 return c;}
vec4 orb(vec2 q,float evo,vec3 L,float aa,float b){
 float r=length(q),m=1.-smoothstep(1.-aa,1.+aa,r);if(m<=0.)return vec4(0.);
 float z=sqrt(max(1.-r*r,0.));vec3 n=vec3(q,z),V=vec3(0.,0.,-1.);
 float wS=smoothstep(.22,.4,evo),wD=smoothstep(.45,.66,evo),wF=smoothstep(.72,.96,evo);
 vec3 fc=mix(vec3(.47,.36,1.)*.45,vec3(0.,.82,.7)*.7,smoothstep(.02,-.02,q.x-b));
 float lam=clamp(dot(n,L)*.5+.5,0.,1.),g=h(gl_FragCoord.xy);
 float tone=clamp(smoothstep(.15,.95,lam)+(g-.5)*.5,0.,1.);
 vec3 dc=mix(vec3(.47,.36,1.),vec3(0.,.86,.72),smoothstep(.35,-.35,n.x-n.y*.3-b*2.))*tone*1.15;
 float fr=pow(1.-z,2.6);
 vec3 inn=env(refract(V,n,1./1.35),b)*.55*mix(.35,1.,pow(1.-z,.7));
 vec3 gc=inn+env(reflect(V,n),b)*(.08+fr*1.1);
 gc+=pow(max(dot(reflect(V,n),L),0.),90.)*1.3;
 gc+=(.5+.5*cos(6.2832*(fr*.9+vec3(0.,.33,.67)+.55)))*fr*.25;
 gc+=vec3(.2,.9,.8)*smoothstep(.6,0.,length(q-vec2(.25,-.55)))*.16*z;
 vec3 c=mix(mix(fc,dc,wD),gc,wF);
 float a=m*mix(.3*wS,.96,wD);
 return vec4(c*a,a);}
void main(){
 vec2 q=(gl_FragCoord.xy-uC)/uR;q-=uM*.03;
 float e=uEvo,aa=uPx,w=uPx*.7;
 vec3 L=normalize(vec3(-.55+uM.x*.35,.6+uM.y*.35,.6));
 float ta=uT*.32+2.4,cr=cos(.24),sr=sin(.24);mat2 R=mat2(cr,-sr,sr,cr);
 vec2 sp=R*vec2(cos(ta)*1.64,sin(ta)*.48);float zs=sin(ta),wO=smoothstep(.2,.42,e);
 vec2 q2=q*R;
 float el=cv(abs(length(q2/vec2(1.64,.48))-1.)*.48,w*1.1,aa)*.4*wO;
 float fF=step(0.,q2.y);
 vec3 lc=mix(vec3(0.,.85,.72),vec3(.55,.42,1.),smoothstep(-1.,1.,q.x));
 vec4 sa=orb((q-sp)/.17,e,L,aa/.17,.5)*wO;
 vec4 o=vec4(lc*el*(1.-fF),el*(1.-fF));
 if(zs<0.)o=ov(sa,o);
 o=ov(orb(q,e,L,aa,0.),o);
 vec4 f=vec4(lc*el*fF,el*fF);
 if(zs>=0.)f=ov(sa,f);
 o=ov(f,o);
 float ext=1.6*smoothstep(0.,.2,e);
 float ax=cv(abs(q.x),w,aa)*(1.-smoothstep(ext-.08,ext,abs(q.y)));
 float nd=(1.-smoothstep(.04-aa,.04+aa,min(length(q-vec2(0.,ext)),length(q+vec2(0.,ext)))))*smoothstep(.1,.2,e);
 float hz=cv(abs(q.y),w*.8,aa)*(1.-smoothstep(1.1,1.4,abs(q.x)))*.45*smoothstep(.15,.4,e);
 float am=mod(atan(q.x,q.y)+6.2832,6.2832),sw=smoothstep(.1,.5,e)*5.2;
 float rg=cv(abs(length(q)-1.38),w,aa)*(1.-smoothstep(sw-.2,sw,am))*.75;
 float rim=cv(abs(length(q)-1.),w,aa)*.5*smoothstep(.1,.28,e)*(1.-smoothstep(.6,.9,e)*.7);
 float wl=clamp(ax+nd+hz,0.,1.),cl=clamp(rg+rim,0.,1.),al=clamp(wl+cl,0.,1.);
 o=ov(vec4(min(vec3(.93,.96,1.)*wl+lc*cl,vec3(al)),al),o);
 float hl=exp(-max(length(q)-.95,0.)*2.4)*.2*smoothstep(.55,.95,e);
 o=ov(o,vec4(mix(vec3(0.,.85,.72),vec3(.47,.36,1.),smoothstep(-1.,1.,q.x+q.y*.4))*hl,hl*.6));
 o*=uFade;o.rgb+=(h(gl_FragCoord.xy+uT)-.5)*.025*o.a;
 gl_FragColor=o;}`;
function sh(t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(x));return x;}
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.hidden=true;return;}
gl.useProgram(pr);
const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const pl=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(pl);gl.vertexAttribPointer(pl,2,gl.FLOAT,false,0,0);
const U={};['uC','uM','uR','uPx','uT','uEvo','uFade'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));
let W=0,H=0,dpr=1;
function size(){const cw=cv.clientWidth,ch=cv.clientHeight;if(!cw||!ch)return;dpr=Math.min(Math.max(devicePixelRatio||1,1.5),2);
 while(cw*ch*dpr*dpr>7e6&&dpr>1)dpr-=.25;
 W=Math.round(cw*dpr);H=Math.round(ch*dpr);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;gl.viewport(0,0,W,H);}}
addEventListener('resize',size);
const ss=x=>x*x*(3-2*x),cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
let mx=0,my=0,tx=0,ty=0,was=false,t0=0;
about.addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*2;ty=-(e.clientY/innerHeight-.5)*2;},{passive:true});
function frame(now){requestAnimationFrame(frame);
 if(!live){was=false;return;}
 if(!was){was=true;t0=now;size();}
 if(!W)size();if(!W)return;
 const ch=cv.clientHeight,cw=cv.clientWidth,n=narrow.matches,st=Math.max(0,cv.getBoundingClientRect().top-about.getBoundingClientRect().top),r=st/ch;
 let evo=1;if(!reduce){const c=((((now-t0-350)/1000)%14)+14)%14;evo=c<7?ss(cl(c/7)):c<10.5?1:c<12.5?1-ss((c-10.5)/2):0;}
 mx+=(tx-mx)*.06;my+=(ty-my)*.06;
 const R=(n?Math.min(cw*.3,ch*.14):Math.min(cw*.17,ch*.22))*(1+.35*ss(cl(r/1.6)));
 const cy=ch*(n?.3:.47)-st*.5;
 gl.uniform2f(U.uC,cw*.5*dpr,(ch-cy)*dpr);gl.uniform1f(U.uR,R*dpr);gl.uniform1f(U.uPx,1/(R*dpr));
 gl.uniform2f(U.uM,reduce?0:mx,reduce?0:my);gl.uniform1f(U.uT,reduce?0:now/1000);gl.uniform1f(U.uEvo,evo);
 gl.uniform1f(U.uFade,.5*(1-.8*ss(cl((r-.25)/1.1))));
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 const i=Math.min(3,Math.floor(evo*4));stg.forEach((li,k)=>li.classList.toggle('on',k<=i));
}
requestAnimationFrame(frame);
})();
