(() => {
  const root = document.documentElement;
  const key = 'pk-page-transition';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let arriving = false;
  try {
    arriving = sessionStorage.getItem(key) === '1';
    sessionStorage.removeItem(key);
  } catch (_) { /* Navigation still works when storage is unavailable. */ }
  if (arriving && !motion.matches) {
    root.classList.add('pk-arriving');
    window.setTimeout(() => root.classList.remove('pk-arriving'), 800);
  }
  let leaving = false;
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || motion.matches) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem(key, '1'); } catch (_) { /* Continue without the entry effect. */ }
    root.classList.remove('pk-arriving');
    root.classList.add('pk-leaving');
    window.setTimeout(() => { location.href = url.href; }, 480);
  });
  // A page restored from the browser's back/forward cache must not stay covered.
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      leaving = false;
      root.classList.remove('pk-leaving', 'pk-arriving');
      try { sessionStorage.removeItem(key); } catch (_) {}
    }
  });
})();
