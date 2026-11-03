(() => {
  const logo = document.getElementById('logoLockup');
  if (!logo) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { logo.classList.add('is-visible'); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        logo.classList.add('is-visible');
        observer.disconnect();
      }
    });
  }, { threshold: 0.18 });
  observer.observe(logo);
  document.getElementById('year').textContent = new Date().getFullYear();
})();
