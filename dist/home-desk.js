(() => {
  'use strict';
  const desk = document.querySelector('.home-desk');
  if (!desk) return;
  const dialogs = [...document.querySelectorAll('.desk-modal')];
  let opener;
  desk.querySelectorAll('[data-desk-open]').forEach(button => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.deskOpen);
      if (!dialog || dialog.open) return;
      opener = button;
      dialog.showModal();
      document.body.classList.add('desk-dialog-open');
      dialog.scrollTop = 0;
    });
  });
  dialogs.forEach(dialog => {
    dialog.querySelector('[data-desk-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('desk-dialog-open');
      opener?.focus({ preventScroll: true });
    });
  });

  const book = document.getElementById('desk-services-dialog');
  const sheets = [...book.querySelectorAll('[data-book-sheet]')];
  const tabs = [...book.querySelectorAll('[data-book-page]')];
  const photos = [
    ['foxy', 'Foxy brand identity and packaging', 'Foxy / a brand with a little bite.'],
    ['burp', 'Burp! drinks packaging', 'Burp! / happy little shelf moments.'],
    ['bean-there', 'Bean There visual identity', 'Bean There / a world of personality.'],
    ['real-chai', 'The Real Chai Company branding and print', 'Real Chai / a story you can hold.']
  ];
  let page = 0;
  function showPage(next) {
    page = (next + sheets.length) % sheets.length;
    sheets.forEach((sheet, index) => { sheet.hidden = index !== page; });
    tabs.forEach((tab, index) => tab.setAttribute('aria-pressed', String(index === page)));
    const image = book.querySelector('#desk-service-photo');
    image.src = `/assets/${photos[page][0]}.webp`;
    image.alt = photos[page][1];
    book.querySelector('#desk-service-caption').textContent = photos[page][2];
    book.querySelector('#desk-page-count').textContent = `PAGE ${String(page + 1).padStart(2, '0')} OF 04`;
  }
  tabs.forEach(tab => tab.addEventListener('click', () => showPage(Number(tab.dataset.bookPage))));
  book.querySelector('[data-book-prev]').addEventListener('click', () => showPage(page - 1));
  book.querySelector('[data-book-next]').addEventListener('click', () => showPage(page + 1));
  book.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showPage(page + (event.key === 'ArrowRight' ? 1 : -1));
  });
})();
