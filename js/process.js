(() => {
 const steps = [...document.querySelectorAll('#process-evolution .process-step')];
 if (!steps.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) steps.forEach(step => step.classList.toggle('is-current', step === entry.target)); });
 }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.35 });
 steps.forEach(step => observer.observe(step));
})();
