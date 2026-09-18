// stardust:replica — archetype "en-home-visit-html" interaction parity.
// Cloned from the state machine OBSERVED live (stardust/replica/motion/en-home-visit-html.json): Bootstrap 3
// collapse — trigger [data-toggle="collapse"] → target gets .collapsing (height transition .35s ease) → .collapse.in;
// closing goes .collapsing → .collapse; trigger receives .collapsed when its panel is closed; data-parent closes
// the other open panel first (accordion). Useful-information chevron: span.open toggles (transform .4s in CSS).
(function () {
  const DURATION = 350; // .collapsing transition-duration .35s (Bootstrap 3, verified in the live clientlib)
  const targetOf = (trigger) => {
    const sel = trigger.getAttribute('data-target') || trigger.getAttribute('href');
    return sel && sel.charAt(0) === '#' ? document.getElementById(sel.slice(1)) : null;
  };
  const triggersOf = (panel) => Array.from(document.querySelectorAll(`[data-toggle="collapse"][href="#${panel.id}"],[data-toggle="collapse"][data-target="#${panel.id}"]`));
  const setState = (panel, open) => {
    panel.setAttribute('aria-expanded', String(open));
    triggersOf(panel).forEach((t) => {
      t.setAttribute('aria-expanded', String(open));
      t.classList.toggle('collapsed', !open);
      const chev = t.querySelector('.ui-acc__chev');
      if (chev) chev.classList.toggle('open', open);
    });
    // guest-services card (measured live, probe 2026-09-18): while its panel is open the card's text block carries
    // .active (2px #ce1126 underline) and the white pointer arrow under the card is shown.
    const card = panel.closest('.gs-card');
    if (card) {
      card.classList.toggle('is-open', open);
      const text = card.querySelector('.gs-card__text');
      if (text) text.classList.toggle('active', open);
    }
  };
  const busy = (panel) => panel.classList.contains('collapsing');
  function show(panel) {
    if (busy(panel) || panel.classList.contains('in')) return;
    panel.classList.remove('collapse');
    panel.classList.add('collapsing');
    panel.style.height = '0px';
    const h = panel.scrollHeight;
    requestAnimationFrame(() => { panel.style.height = `${h}px`; });
    setState(panel, true);
    setTimeout(() => {
      panel.classList.remove('collapsing');
      panel.classList.add('collapse', 'in');
      panel.style.height = '';
    }, DURATION);
  }
  function hide(panel) {
    if (busy(panel) || !panel.classList.contains('in')) return;
    panel.style.height = `${panel.getBoundingClientRect().height}px`;
    void panel.offsetHeight; // force reflow so the height transition starts from the measured value
    panel.classList.add('collapsing');
    panel.classList.remove('collapse', 'in');
    requestAnimationFrame(() => { panel.style.height = '0px'; });
    setState(panel, false);
    setTimeout(() => {
      panel.classList.remove('collapsing');
      panel.classList.add('collapse');
      panel.style.height = '';
    }, DURATION);
  }
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-toggle="collapse"]');
    if (!trigger) return;
    const panel = targetOf(trigger);
    if (!panel) return;
    e.preventDefault();
    const parentSel = trigger.getAttribute('data-parent');
    if (parentSel && !panel.classList.contains('in')) {
      const parent = document.querySelector(parentSel);
      if (parent) parent.querySelectorAll('.collapse.in').forEach((open) => { if (open !== panel) hide(open); });
    }
    if (panel.classList.contains('in')) hide(panel); else show(panel);
  });
  // keyboard parity for the role="button" accordion headers (h4[tabindex=0] on live)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const trigger = e.target.closest('[data-toggle="collapse"][role="button"]');
    if (!trigger) return;
    e.preventDefault();
    trigger.click();
  });
  // initial state: every panel collapsed on live at t=0 (aria-expanded="true" on the headers is a source quirk, kept verbatim)
  document.querySelectorAll('.ui-acc__head').forEach((h) => h.classList.add('collapsed'));
}());
