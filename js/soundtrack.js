/* Soundtrack: OPENSTATE_ mixtape (124 BPM, 3:25, four beatmatched techno tracks, looping).
   One <audio> element streams assets/audio/openstate-mixtape.mp3; Web Audio is only a fallback.
   Off until the visitor interacts (browsers block autoplay), quieter under case studies and the brand guidelines. */
(() => {
  const btn = document.getElementById('snd-toggle'), au = document.getElementById('site-sound');
  if (!btn || !au) return;
  const label = btn.querySelector('.snd-label'), root = document.documentElement;
  au.loop = true;   /* native loop; the single <audio> element is the only player */
  au.addEventListener('ended', () => { if (on && engine === 'el') { au.currentTime = 0; au.play().catch(() => {}); } });   /* safety net if a browser ignores loop */
  const LEVEL = 0.8, DUCKED = 0.22;           /* normal volume / volume under case studies (the mixtape is mastered hotter than the old track) */
  let on = false, busy = false, raf = 0, wasOn = false, vol = 0, engine = '', pref = '', loaded = false, blocked = false, userOff = false, dead = false, firstErr = null;
  let bytes = null, ctx = null, gain = null, node = null, buf = null, waT0 = 0, waOff = 0;
  const target = () => /\bkc-open\b/.test(root.className) ? DUCKED : LEVEL;
  const SRC = au.dataset.src;                 /* assets/audio/openstate-mixtape.mp3 (loaded only when the visitor starts the sound) */
  const getBytes = async () => {              /* only used by the Web Audio fallback */
    if (bytes) return bytes;
    const r = await fetch(SRC);
    if (!r.ok) throw new Error('Soundtrack file not found: ' + SRC);
    return (bytes = new Uint8Array(await r.arrayBuffer()));
  };
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
  /* Method 1: the single <audio> element, streaming the mixtape file */
  const tryEl = async () => {
    au.pause();
    au.src = SRC; au.muted = false; au.volume = 0; engine = 'el';
    await au.play();
    await new Promise((res, rej) => {
      if (au.currentTime > 0) return res();
      const t = setTimeout(() => rej(new Error('audio stalled')), 8000);
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
      const ab = (await getBytes()).buffer.slice(0);
      buf = await new Promise((res, rej) => { const bad = () => rej(new Error('The soundtrack could not be decoded')); const p = ctx.decodeAudioData(ab, res, bad); if (p && p.catch) p.catch(bad); });
    }
    if (node) { try { node.stop(); } catch (e) {} try { node.disconnect(); } catch (e) {} node = null; }   /* never two sources at once */
    node = ctx.createBufferSource(); node.buffer = buf; node.loop = true; node.connect(gain);
    engine = 'wa'; gain.gain.value = 0; node.start(0); waT0 = ctx.currentTime; waOff = 0;
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

  /* ---- Mixtape clock + controls (124 BPM, four beatmatched tracks) for the interactive 3D components ----
     OpenState.beat()  -> { time, beat, bar, phase 0..1, step16 } or null when the sound is off
     OpenState.onBeat(cb), .next(), .prev(), .goTo(i), .track, .tracks, .playing                              */
  const BPM = 124, BEAT = 60 / BPM, BAR = BEAT * 4;
  const TRACKS = [['Opening State', 0], ['Signal Path', 28], ['Kit 03', 52], ['Afterglow', 76]].map(([n, bar]) => ({ n, bar, t: bar * BAR }));   /* each track starts on an exact bar line (bass-swap point) */
  const dur = () => (engine === 'wa' && buf ? buf.duration : au.duration) || 0;
  const pos = () => { const d = dur(); if (!d) return 0; const p = engine === 'wa' && ctx ? ctx.currentTime - waT0 + waOff : au.currentTime; const m = p % d; return m < 0 ? m + d : m; };
  const seek = sec => {
    if (engine === 'wa' && ctx && buf) {
      try { node && node.stop(); node && node.disconnect(); } catch (e) {}
      node = ctx.createBufferSource(); node.buffer = buf; node.loop = true; node.connect(gain); node.start(0, sec); waT0 = ctx.currentTime; waOff = sec;
    } else if (engine === 'el') au.currentTime = sec;
  };
  const trackAt = p => TRACKS.reduce((a, t, i) => (p >= t.t ? i : a), 0);
  window.OpenState = {
    bpm: BPM, tracks: TRACKS,
    get playing() { return on; },
    get track() { return on ? trackAt(pos()) : -1; },
    toggle: () => btn.click(),
    goTo(i) { if (!on) return; i = (i + TRACKS.length) % TRACKS.length; seek(TRACKS[i].t); },
    next() { this.goTo(this.track + 1); }, prev() { this.goTo(this.track - 1); },
    beat() { if (!on) return null; const p = pos(), x = p / BEAT; return { time: p, beat: Math.floor(x), bar: Math.floor(x / 4), phase: x % 1, step16: Math.floor(x * 4) % 16 }; },
    onBeat(cb) { let last = -1; const loop = () => { const c = this.beat(); if (c && c.beat !== last) { last = c.beat; cb(c); } requestAnimationFrame(loop); }; loop(); }
  };
})();
