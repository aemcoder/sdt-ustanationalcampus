/**
 * embed — auto-blocked video / live-stream player (D1: built by `buildEmbedAutoBlocks` in
 * scripts/scripts.js from a YouTube / Vimeo / IonCourt URL alone in its paragraph).
 *
 * The authored link is the only content; it is kept (hidden) as the no-JS fallback and the
 * player iframe is created lazily when the block scrolls near the viewport.
 * @ew-exempt <a> embed source URL — text-as-metadata (EW5 a)
 */
function iframeSrc(url) {
  const { hostname, pathname, searchParams } = url;
  if (/(^|\.)youtu\.be$/.test(hostname)) return `https://www.youtube.com/embed/${pathname.slice(1)}`;
  if (/(^|\.)youtube\.com$/.test(hostname)) {
    const id = searchParams.get('v') || pathname.split('/').pop();
    return `https://www.youtube.com/embed/${id}`;
  }
  if (/(^|\.)vimeo\.com$/.test(hostname)) {
    const id = pathname.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  return url.href;
}

function mount(block, url) {
  const frame = document.createElement('iframe');
  frame.src = iframeSrc(url);
  frame.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
  frame.setAttribute('allowfullscreen', '');
  frame.setAttribute('loading', 'lazy');
  frame.title = block.dataset.embedTitle || 'Embedded content';
  const wrap = document.createElement('div');
  wrap.className = 'embed-frame';
  wrap.append(frame);
  block.prepend(wrap);
  block.classList.add('embed-loaded');
}

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  let url;
  try { url = new URL(link.href); } catch { return; }
  const host = url.hostname.replace(/^www\./, '').split('.')[0];
  block.classList.add(`embed-${host}`);
  block.dataset.embedTitle = link.textContent.trim();
  const fallback = document.createElement('div');
  fallback.className = 'embed-source';
  fallback.append(link.closest('p') || link);
  block.replaceChildren(fallback);

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      mount(block, url);
    }
  }, { rootMargin: '200px' });
  io.observe(block);
}
