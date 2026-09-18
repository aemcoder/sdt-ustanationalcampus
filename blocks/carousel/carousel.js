/**
 * carousel — Block Collection `carousel` model (D11): one row per slide (reconstructive).
 *
 * Authoring: one row per slide — `<p><img></p>` · optional caption paragraph(s).
 * Source (cmp-carousel, summer-camps 1440): one visible 588×588 slide, previous/next arrows over
 * the photo, 16px ring indicators (black when active) 15px above the bottom edge; no autoplay.
 * Slides are MOVED into `.carousel-slide` wrappers (EW1); hidden slides stay editable once the
 * author navigates to them (EW7). Arrow/indicator buttons carry aria-labels only (no words, #100).
 */
function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slides = rows.map((row) => {
    const slide = div('carousel-slide');
    [...row.children].forEach((cell) => slide.append(...cell.children));
    return slide;
  }).filter((s) => s.childElementCount);
  if (!slides.length) return;

  const track = div('carousel-track', ...slides);
  const indicators = document.createElement('ol');
  indicators.className = 'carousel-indicators';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Next slide');

  let current = 0;
  const dots = slides.map((_, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'carousel-indicator';
    b.setAttribute('aria-label', `Slide ${i + 1}`);
    b.addEventListener('click', () => { current = i; show(); }); // eslint-disable-line no-use-before-define
    li.append(b);
    indicators.append(li);
    return b;
  });
  function show() {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      s.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach((d, i) => d.setAttribute('aria-current', i === current ? 'true' : 'false'));
  }
  prev.addEventListener('click', () => { current = (current + slides.length - 1) % slides.length; show(); });
  next.addEventListener('click', () => { current = (current + 1) % slides.length; show(); });
  show();

  block.replaceChildren(track, prev, next, indicators);
  block.setAttribute('role', 'group');
  block.setAttribute('aria-roledescription', 'carousel');
}
