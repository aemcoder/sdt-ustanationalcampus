/**
 * ad-slot — the source's adImageComp advertisement slot (template-slotted).
 *
 * Schema: stardust/eds-schema/index.json §programs (ad-wrap)
 * Authoring (one row, one cell): `<h4>Advertisement</h4>` (the slot label, as the source) ·
 *   `<p><a href="#…">Skip Advertisement</a></p>` (the visually-hidden skip link, as the source) ·
 *   optional `<p><img></p>` creative · optional `<p><a>` link that wraps the creative. With no
 *   creative the slot renders the 728×90 (320×50 mobile) grey placeholder box; when `gpt.enabled`
 *   in scripts/site-config.js the box becomes the GPT container for the configured ad unit
 *   (stardust/dynamic-features.md row 15).
 * When no skip link is authored a generated one carries its text in `aria-label` only (#100).
 */
function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

let counter = 0;

export default async function decorate(block) {
  counter += 1;
  const id = `ad-slot-${counter}`;
  const label = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]
    .find((p) => p.textContent.trim() && !p.querySelector('a, picture, img'));
  const media = block.querySelector('picture, img');
  const skipLink = [...block.querySelectorAll('a[href^="#"]')].find((a) => a.textContent.trim());
  const link = [...block.querySelectorAll('a[href]')].find((a) => a !== skipLink);

  let skip;
  if (skipLink) {
    skip = document.createElement('div');
    skip.className = 'ad-slot-skip';
    skip.append(skipLink.closest('p') || skipLink);
    skipLink.href = `#skip-${id}`;
  } else {
    skip = document.createElement('a');
    skip.className = 'ad-slot-skip';
    skip.href = `#skip-${id}`;
    skip.setAttribute('aria-label', 'Skip advertisement');
  }

  const creative = div('ad-slot-creative');
  creative.id = id;
  if (media) {
    if (link) {
      link.replaceChildren(media);
      creative.append(link);
    } else {
      creative.append(media);
    }
  }
  const wrap = div('ad-slot-wrap');
  if (label) wrap.append(div('ad-slot-title', label));
  wrap.append(div('ad-slot-cont', creative));

  const anchor = div('ad-slot-skip-target');
  anchor.id = `skip-${id}`;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Advertisement');
  block.replaceChildren(skip, wrap, anchor);

  if (media) return;
  try {
    const { default: config } = await import('../../scripts/site-config.js');
    if (config.gpt?.enabled && window.googletag?.cmd) {
      const unit = config.gpt.adUnits?.ros;
      window.googletag.cmd.push(() => {
        window.googletag.defineSlot(unit, [[728, 90], [320, 50]], id)
          .addService(window.googletag.pubads());
        window.googletag.display(id);
      });
    }
  } catch (e) {
    // site-config unavailable (inline harness) — the static placeholder stands
  }
}
