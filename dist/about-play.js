(() => {
  const portrait = document.querySelector('.about-face-button');
  const dialog = document.querySelector('#chavi-facts');
  if (!portrait || !dialog) return;
  portrait.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('facts-open');
    dialog.scrollTop = 0;
  });
  dialog.querySelector('.facts-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('facts-open');
    portrait.focus({ preventScroll: true });
  });
  const elements = [...document.querySelectorAll('.centered-facts-photo, .about-facts-invite p, .about-world-number, .about-story, .values-grid article')];
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('note-arrived');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  elements.forEach(element => {
    element.classList.add('about-scroll-note');
    element.style.setProperty('--arrival-delay', `${element.matches('.personal-note') ? [...element.parentElement.children].indexOf(element) * 110 : 0}ms`);
    observer.observe(element);
  });
})();
