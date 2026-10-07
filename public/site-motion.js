(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lazyVideos = [...document.querySelectorAll('video[data-autoplay-loop]')];
  if (!reduceMotion && 'IntersectionObserver' in window && lazyVideos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.08, rootMargin: '240px 0px' });
    lazyVideos.forEach((video) => videoObserver.observe(video));
  } else if (!reduceMotion) {
    lazyVideos.forEach((video) => video.play().catch(() => {}));
  }
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const selectors = [
    '.approach-intro', '.opening-images > *', '.story-images > *', '.approach-quote',
    '.booking-panel-intro', '.contact-studio-heading', '.contact-studio-card', '.contact-studio-image',
    '.journal-card', '.project-archive-card',
    '.article-intro-inner', '.article-section', '.article-gallery', '.article-slider', '.article-video', '.article-inline-image', '.article-contact',
    '.project-detail-intro-inner', '.project-story-lead', '.project-gallery-frame img',
    '.audio-planning-intro', '.audio-feature-media', '.audio-solution-card',
    '.outdoor-audio-intro', '.outdoor-audio-card', '.outdoor-story-copy', '.outdoor-story-media', '.outdoor-story-image'
  ];
  const targets = [...new Set(document.querySelectorAll(selectors.join(',')))];
  if (!targets.length) return;

  const siblings = new WeakMap();
  targets.forEach((element) => {
    const parent = element.parentElement;
    const index = siblings.get(parent) || 0;
    siblings.set(parent, index + 1);
    element.style.setProperty('--reveal-delay', Math.min(index, 5) * 55 + 'ms');
    element.classList.add('site-reveal');
  });

  document.documentElement.classList.add('has-site-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -24px 0px' });
  targets.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add('is-visible');
    } else {
      observer.observe(element);
    }
  });
})();