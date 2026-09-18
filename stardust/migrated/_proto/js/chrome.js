// stardust:replica chrome behaviour — cloned from the live state machine (stardust/current/_chrome-lift.json):
// desktop: hover shows the sub-list (CSS); toggle click sets aria-expanded + .is-open.
// mobile (<768): hamburger adds body.menu-open (panel slides in, body overflow hidden, hamburger↔cancel swap);
// toggle click opens the item's sub-list (li.active in the source → .is-open here).
// alert banner: close hides it for the session (observed: display:none after click).
(function () {
  const body = document.body;
  const hb = document.querySelector('.top-nav__logo-hamburger');
  const cancel = document.querySelector('.top-nav__logo-cancel');
  if (hb) hb.addEventListener('click', () => body.classList.add('menu-open'));
  if (cancel) cancel.addEventListener('click', () => body.classList.remove('menu-open'));
  document.querySelectorAll('.main-nav__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.main-nav__item');
      const open = li.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  const book = document.querySelector(".top-nav__book"); if (book) book.addEventListener("click", () => window.open(book.dataset.href, "_blank"));
  const close = document.querySelector('.alert-banner__close');
  if (close) close.addEventListener('click', () => { document.querySelector('.alert-banner').classList.add('is-hidden'); try { sessionStorage.setItem('nc-alert-closed', '1'); } catch (e) {} });
})();
