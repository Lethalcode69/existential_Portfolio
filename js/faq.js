(()=>{const root=document.getElementById('faq');if(!root)return;
const items=[...root.querySelectorAll('.faq-item')],qs=items.map(i=>i.querySelector('.faq-q'));
const set=(it,open)=>{it.classList.toggle('is-open',open);it.querySelector('.faq-q').setAttribute('aria-expanded',String(open))};
root.addEventListener('click',e=>{const q=e.target.closest('.faq-q');if(!q)return;const it=q.closest('.faq-item'),open=!it.classList.contains('is-open');items.forEach(o=>{if(o!==it)set(o,false)});set(it,open)});
root.addEventListener('keydown',e=>{const q=e.target.closest&&e.target.closest('.faq-q');if(!q)return;const i=qs.indexOf(q);let n=-1;
 if(e.key==='ArrowDown')n=(i+1)%qs.length;else if(e.key==='ArrowUp')n=(i-1+qs.length)%qs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=qs.length-1;
 if(n>=0){e.preventDefault();qs[n].focus()}})})();
