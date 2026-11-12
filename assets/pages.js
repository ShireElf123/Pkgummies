// Add motion only when supported; content remains visible without JavaScript.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('main .section h2, main .section .card, main .split img, main .pk-feature img').forEach(element => {
    // Never hide content already in view or an element targeted by a link.
    if (element.getBoundingClientRect().top > window.innerHeight && !element.id) {
      element.classList.add('pk-reveal');
      observer.observe(element);
    }
  });
}
