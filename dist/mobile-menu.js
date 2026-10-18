(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = document.createElement('button');
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-label', 'Open navigation menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobile-menu');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  const menu = document.createElement('dialog');
  menu.id = 'mobile-menu';
  menu.className = 'mobile-menu';
  menu.setAttribute('aria-label', 'Navigation menu');
  menu.innerHTML = '<button class="menu-close" aria-label="Close navigation menu">×</button><p class="menu-eyebrow">A LITTLE LOOK AROUND ✦</p><h2>Make yourself<br><em>at home.</em></h2>';
  const nav = header.querySelector('nav').cloneNode(true);
  nav.setAttribute('aria-label', 'Mobile navigation');
  menu.append(nav);
  menu.append(header.querySelector('.button').cloneNode(true));
  header.append(toggle);
  document.body.append(menu);
  let oldOverflow;
  toggle.addEventListener('click', () => {
    oldOverflow = document.body.style.overflow;
    menu.showModal();
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  });
  menu.querySelector('.menu-close').addEventListener('click', () => menu.close());
  menu.addEventListener('click', e => {
    if (e.target === menu) {
      const r = menu.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) menu.close();
    }
    if (e.target.closest('a')) menu.close();
  });
  menu.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow || '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  });
  matchMedia('(max-width: 1000px)').addEventListener('change', e => {
    if (!e.matches && menu.open) menu.close();
  });
})();
