/**
 * hero — full-bleed cover photo with a title panel (template-slotted / node-slotted, #95).
 *
 * Schema: stardust/eds-schema/about.json §hero · play-private-lessons.json §hero · index.json §hero
 * Authoring (any row/cell shape — classified by content, never by index, #42):
 *   picture  — the cover photo (editorial, authored `<p><img></p>`; rendered as the cover layer)
 *   h1       — the page title
 *   p        — optional lede (link-free paragraph)
 *   p > strong > a — CTA(s), one per paragraph (primary blue); moved as their <p> (EW3)
 * Variants: `title-only` (home: 75% scrim panel), `boxed` (hub: black box + CTA columns),
 *           `boxed light` (program pages: translucent white box + lede).
 * Every authored element is MOVED into an empty slot container (EW1/EW2); no text is copied.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const paragraphs = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const ctas = paragraphs.filter((p) => p.querySelector('a'));
  const ledes = paragraphs.filter((p) => !p.querySelector('a'));
  const extras = [...block.querySelectorAll('ul, ol, h4, h5, h6, blockquote')];

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'hero-media';
  if (media) mediaWrap.append(media);

  const box = document.createElement('div');
  box.className = 'hero-box';
  if (heading) box.append(wrapNode(heading, 'hero-title'));
  if (ledes.length) {
    const lede = document.createElement('div');
    lede.className = 'hero-lede';
    lede.append(...ledes);
    box.append(lede);
  }
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    actions.append(...ctas);
    box.append(actions);
  }
  // leftovers pass: any authored element no slot consumed degrades to visible default styling
  if (extras.length) {
    const rest = document.createElement('div');
    rest.className = 'hero-extra';
    rest.append(...extras);
    box.append(rest);
  }

  const boxWrap = wrapNode(box, 'hero-box-wrap');
  block.replaceChildren(mediaWrap, boxWrap);
}
