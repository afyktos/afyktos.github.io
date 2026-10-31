(() => {
  'use strict';
  if (location.protocol !== 'file:' && location.pathname.endsWith('/index.html')) {
    history.replaceState(null, '', location.pathname.slice(0, -10) + location.search + location.hash);
  }
  if (location.protocol === 'file:') {
    const portfolioPage = /\/(art|music)\/index\.html$/.test(location.pathname);
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') { link.setAttribute('href', portfolioPage ? '../index.html' : 'index.html'); return; }
      const destination = new URL(href, location.href);
      if (destination.protocol === 'file:' && destination.pathname.endsWith('/')) {
        destination.pathname += 'index.html';
        link.href = destination.href;
      }
    });
  }
  // Keep every appended record behind the same editorial boundary.
  const groups = [
    ['#collaborations .pc-grid', '.pc-card', 'The Twilight Zone', 9, 'collaborations'],
    ['#remixes .pc-grid', '.pc-card', null, 3, 'remixes']
  ];
  for (const [selector, itemSelector, boundary, fallback, name] of groups) {
    const grid = document.querySelector(selector);
    if (!grid) continue;
    grid.id ||= `${name}-grid`;
    const cards = [...grid.querySelectorAll(itemSelector)];
    const found = boundary ? cards.findIndex(c => c.querySelector('h3')?.textContent.trim() === boundary) : -1;
    const limit = found >= 0 ? found + 1 : fallback;
    if (cards.length <= limit) continue;
    const extra = cards.slice(limit);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'show-more';
    button.setAttribute('aria-controls', grid.id);
    button.setAttribute('aria-expanded', 'false');
    const label = () => button.textContent = button.getAttribute('aria-expanded') === 'true' ? 'SHOW LESS −' : `SHOW MORE + (${extra.length})`;
    extra.forEach(c => c.hidden = true);
    label(); grid.after(button);
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      extra.forEach(c => {
        c.hidden = !expanded;
        if (!expanded) c.querySelectorAll('iframe').forEach(f => {
          const box = f.closest('.pc-video');
          if (!box) return;
          const img = document.createElement('img'); img.src = `https://i.ytimg.com/vi/${box.dataset.yt}/hqdefault.jpg`; img.alt = ''; img.loading = 'lazy';
          const play = document.createElement('button'); play.type = 'button'; play.className = 'pc-play'; play.setAttribute('aria-label', `Play ${box.dataset.title}`);
          const span = document.createElement('span'); span.textContent = '▶ PLAY'; play.append(span); box.replaceChildren(img,play);
        });
      });
      label();
      if (!expanded) button.scrollIntoView({block:'center', behavior:'instant'});
    });
  }
  document.querySelectorAll('.pc-video').forEach(box => {
    const link = document.createElement('a'); link.className = 'video-direct';
    link.href = `https://www.youtube.com/watch?v=${box.dataset.yt}`;
    link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'WATCH ON YOUTUBE ↗';
    box.after(link);
  });
  // Upgrade only thumbnails near the viewport, keeping the verified fallback
  // when YouTube has no high-resolution image for that video.
  const thumbnailObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const box = entry.target;
      thumbnailObserver.unobserve(box);
      const image = box.querySelector('img');
      if (!image) return;
      const large = new Image();
      large.onload = () => { if (large.naturalWidth >= 640 && image.isConnected) image.src = large.src; };
      large.src = `https://i.ytimg.com/vi/${box.dataset.yt}/maxresdefault.jpg`;
    });
  }, {rootMargin:'160px'}) : null;
  document.querySelectorAll('.pc-video').forEach(box => thumbnailObserver?.observe(box));
  const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('#main-nav');
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && nav?.classList.contains('open')) {nav.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); menu?.focus();}
  });
  const flip = document.querySelector('.flip-card');
  if(flip) {flip.setAttribute('aria-pressed','false'); flip.addEventListener('click',()=>flip.setAttribute('aria-pressed',String(flip.classList.contains('is-flipped'))));}
  document.querySelectorAll('.project').forEach(p => {p.setAttribute('role','button'); p.setAttribute('aria-haspopup','dialog'); p.setAttribute('aria-label',`View ${p.dataset.title}`);});
  document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
})();
