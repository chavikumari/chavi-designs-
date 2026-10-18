(() => {
  const opener = document.querySelector('.peek-ipad');
  const dialog = document.querySelector('#upcoming-viewer');
  if (!opener || !dialog) return;
  const images = [
    { file:'blooming-mug-01.png', title:'The Blooming Mug', caption:'Bouquet packaging', alt:'The Blooming Mug striped floral bouquet packaging', width:5466, height:6830 },
    { file:'blooming-mug-02.png', title:'The Blooming Mug', caption:'Flowers & cookies gift box', alt:'The Blooming Mug branded gift box filled with flowers and cookies', width:5200, height:6497 },
    { file:'main-character-coffee-01.png', title:'Main Character Coffee', caption:'A few main-character moments', alt:'Three Main Character Coffee drinks with pink branded labels', width:4500, height:5625 },
    { file:'main-character-coffee-02.png', title:'Main Character Coffee', caption:'Coffee, stripes & little keepsakes', alt:'Main Character Coffee striped cup sleeve and pink flamingo charm', width:4500, height:5625 }
  ];
  const image = dialog.querySelector('#peek-image');
  let current = 0;
  function show(index) {
    current = (index + images.length) % images.length;
    const item = images[current];
    image.src = `/assets/upcoming/${item.file}`;
    image.alt = item.alt;
    image.width = item.width;
    image.height = item.height;
    dialog.querySelector('#peek-title').textContent = item.title;
    dialog.querySelector('#peek-caption').textContent = `${item.title} · ${item.caption}`;
    dialog.querySelector('#peek-count').textContent = `${String(current + 1).padStart(2,'0')} / 04`;
    dialog.querySelectorAll('[data-peek-index]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.peekIndex) === current)));
    dialog.querySelectorAll('[data-peek-project]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.peekProject) === (current < 2 ? 0 : 2))));
  }
  opener.addEventListener('click', () => { show(0); dialog.showModal(); document.body.classList.add('peek-open'); dialog.scrollTop = 0; });
  dialog.querySelector('.peek-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-peek-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-peek-next]').addEventListener('click', () => show(current + 1));
  dialog.querySelectorAll('[data-peek-index]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.peekIndex))));
  dialog.querySelectorAll('[data-peek-project]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.peekProject))));
  dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); } });
  dialog.addEventListener('click', event => { const r=dialog.getBoundingClientRect(); if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('peek-open'); opener.focus({preventScroll:true}); });
})();
