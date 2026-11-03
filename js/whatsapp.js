(() => {
  /* ---- Edit these two lines to change the number / the pre-filled message ---- */
  const WA_NUMBER = '919162008243';   /* country code + number, digits only */
  const WA_MESSAGE =
`Hi existential.design 👋

I came across your studio and I have an idea I'd like to bring into existence.

• What I'm working on: 
• Where it is right now (just an idea / in progress / live): 
• How I'd like you to help: 

Looking forward to talking!`;
  /* --------------------------------------------------------------------------- */
  const a = document.getElementById('wa-float'); if (!a) return;
  a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_MESSAGE);
  let shown = false;
  const show = () => {
    if (shown) return; shown = true;
    a.classList.add('is-ready');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(() => a.classList.add('peek'), 700);
      setTimeout(() => a.classList.remove('peek'), 4200);
    }
  };
  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('ready')) {
    const mo = new MutationObserver(() => { if (nav.classList.contains('ready')) { mo.disconnect(); setTimeout(show, 600); } });
    mo.observe(nav, { attributes: true, attributeFilter: ['class'] });
    setTimeout(show, 9000); /* safety fallback */
  } else setTimeout(show, 600);
})();
