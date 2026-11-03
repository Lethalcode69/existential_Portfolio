(() => {
  const btn = document.getElementById('snd-toggle'), au = document.getElementById('site-sound');
  if (!btn || !au) return;
  const label = btn.querySelector('.snd-label'), root = document.documentElement;
  au.loop = true;   /* native loop; the single <audio> element is the only player */
  au.addEventListener('ended', () => { if (on && engine === 'el') { au.currentTime = 0; au.play().catch(() => {}); } });   /* safety net if a browser ignores loop */
  const LEVEL = 0.9, DUCKED = 0.25;           /* normal volume / volume under case studies */
  let on = false, busy = false, raf = 0, wasOn = false, vol = 0, engine = '', pref = '', loaded = false, blocked = false, userOff = false, dead = false, firstErr = null;
  let ctx = null, gain = null, node = null, buf = null;
  const target = () => /\bkc-open\b/.test(root.className) ? DUCKED : LEVEL;
  const setVol = v => { vol = Math.max(0, Math.min(1, v)); if (engine === 'wa' && gain) gain.gain.value = vol; else au.volume = vol; };
  const fadeTo = (v, ms, done) => {
    cancelAnimationFrame(raf);
    const v0 = vol, t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0) / ms, 1);
      setVol(v0 + (v - v0) * k);
      if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
    };
    raf = requestAnimationFrame(step);
  };
  const ui = () => {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Turn soundtrack off' : 'Turn soundtrack on');
    label.textContent = on ? 'Sound on' : dead ? 'Sound unavailable' : blocked ? 'Turn sound on' : 'Sound off';
    btn.classList.toggle('attn', blocked && !on);
    btn.dataset.engine = on ? engine : '';
  };
  /* Method 1: the single <audio> element, streaming assets/audio/soundtrack.mp3 */
  const tryEl = async () => {
    au.pause();
    au.src = au.dataset.src;
    au.muted = false; au.volume = 0; engine = 'el';
    await au.play();
    await new Promise((res, rej) => {
      if (au.currentTime > 0) return res();
      const t = setTimeout(() => rej(new Error('audio stalled')), 6000);
      au.addEventListener('timeupdate', function h() { if (au.currentTime > 0) { clearTimeout(t); au.removeEventListener('timeupdate', h); res(); } });
      au.addEventListener('error', () => { clearTimeout(t); rej(new Error('media error')); }, { once: true });
    });
  };
  /* Method 2 (only if the element cannot play, never alongside it): Web Audio decodes the same file */
  const tryWA = async () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('Web Audio unsupported');
    if (!ctx) { ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination); }
    await ctx.resume();
    if (!buf) {
      const ab = await (await fetch(au.dataset.src)).arrayBuffer();
      buf = await new Promise((res, rej) => { const bad = () => rej(new Error('The soundtrack could not be decoded')); const p = ctx.decodeAudioData(ab, res, bad); if (p && p.catch) p.catch(bad); });
    }
    if (node) { try { node.stop(); } catch (e) {} try { node.disconnect(); } catch (e) {} node = null; }   /* never two sources at once */
    node = ctx.createBufferSource(); node.buffer = buf; node.loop = true; node.connect(gain);
    engine = 'wa'; gain.gain.value = 0; node.start(0);
  };
  const halt = () => {
    if (engine === 'wa') { try { node && node.stop(); } catch (e) {} node = null; }
    else au.pause();
  };
  const fail = e => {   /* real failure (not just autoplay being blocked): say so once, stop retrying on every interaction */
    console.warn('Soundtrack could not start:', e && e.message || e, firstErr && firstErr !== e ? '(player: ' + (firstErr.name || firstErr.message) + ')' : '');
    on = false; dead = true; blocked = false; ui(); btn.title = String(e && (e.message || e.name) || e);
    btn.classList.add('peek'); setTimeout(() => btn.classList.remove('peek'), 3500);
  };
  const pauseIt = () => { if (engine === 'wa') { if (ctx) ctx.suspend(); } else au.pause(); };
  const setBlocked = v => { blocked = v; ui(); };
  /* mode: 'click' = the visitor pressed Sound On; 'auto' = attempt on page load; 'gesture' = first interaction after a blocked autoplay */
  const start = async (mode = 'click') => {
    if (busy || on) return;
    const quiet = mode !== 'click', denied = e => quiet && e && e.name === 'NotAllowedError';
    if (!quiet) { userOff = false; dead = false; firstErr = null; }
    busy = true;
    if (loaded) {   /* resume the same instance: no reload, no second source */
      cancelAnimationFrame(raf);
      try { if (engine === 'wa') await ctx.resume(); else await au.play(); } catch (e) { busy = false; return denied(e) ? setBlocked(true) : fail(e); }
      busy = false; blocked = false; on = true; ui(); fadeTo(target(), 1000); return;
    }
    vol = 0; if (!quiet) label.textContent = 'Loading…';
    const order = pref === 'wa' ? [tryWA] : [tryEl, tryWA];
    let err = null;
    for (const f of order) { try { await f(); err = null; break; } catch (e) { err = e; firstErr = firstErr || e; try { halt(); } catch (_) {} if (denied(e)) break; } }
    busy = false;
    if (err) return denied(err) ? setBlocked(true) : fail(err);
    loaded = true; pref = engine; blocked = false; on = true; ui(); setVol(0); fadeTo(target(), 1800);
    setTimeout(() => { if (on && vol < target() * 0.5) setVol(target()); }, 2300);   /* safety if the fade was throttled */
  };
  const stop = () => { on = false; userOff = true; ui(); fadeTo(0, 250, () => { if (!on) pauseIt(); }); };
  btn.addEventListener('click', () => (on ? stop() : start('click')));
  /* 1) try to start with sound as soon as the page loads; 2) if the browser blocks it, the control shows 'Turn sound on' and the first interaction starts it */
  start('auto');
  const kick = e => { if (on || busy || !blocked || userOff || dead || (e.target && e.target.closest && e.target.closest('#snd-toggle'))) return; start('gesture'); };
  ['pointerdown', 'pointerup', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, kick, { capture: true, passive: true }));
  /* quieter under the case studies, back up when they close */
  new MutationObserver(() => { if (on) fadeTo(target(), 800); }).observe(root, { attributes: true, attributeFilter: ['class'] });
  /* pause when the tab is hidden, resume when it comes back */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { wasOn = on; if (on) { cancelAnimationFrame(raf); if (engine === 'wa') ctx.suspend(); else au.pause(); } }
    else if (wasOn && on) { (engine === 'wa' ? ctx.resume() : au.play()).then(() => fadeTo(target(), 800)).catch(() => {}); }
  });
  /* reveal after the intro, same moment as the WhatsApp button */
  let shown = false;
  const show = () => {
    if (shown) return; shown = true; btn.classList.add('is-ready');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(() => btn.classList.add('peek'), 900);
      setTimeout(() => btn.classList.remove('peek'), 4400);
    }
  };
  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('ready')) {
    const mo = new MutationObserver(() => { if (nav.classList.contains('ready')) { mo.disconnect(); setTimeout(show, 800); } });
    mo.observe(nav, { attributes: true, attributeFilter: ['class'] });
    setTimeout(show, 9000);
  } else setTimeout(show, 800);
})();
