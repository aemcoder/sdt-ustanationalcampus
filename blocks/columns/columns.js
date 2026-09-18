/**
 * columns — Block Collection `columns` model (D11): one row, one cell per column.
 *
 * Schema: stardust/eds-schema/about.json §discover · play-private-lessons.json §intro §camps
 * Authoring: a row with a text cell (h2/h3 · paragraphs · CTA p) and a media cell
 *   (`<p><img></p>`), in either order — the block keeps the authored order and classifies
 *   each cell by content.
 * Variants: `image-text` (photo beside prose inside the 1200px container),
 *           `image-text band sage|clay` (full-bleed colour band: photo half + content half).
 * The pipeline's row/cell divs are structural, so they carry the layout classes; every authored
 * element stays where it was written (EW1/EW2).
 */
import { buildBlock, decorateBlock, loadBlock } from '../../scripts/aem.js';

const EMBED_HOSTS = /(^|\.)(youtube\.com|youtu\.be|vimeo\.com|ioncourt\.com)$/;

/**
 * A cell whose only content is a video URL link becomes an `embed` block (the page-level
 * auto-block skips links inside blocks, so the column does it for its own cells).
 */
function embedCell(cell) {
  const link = cell.querySelector('p > a[href]:only-child');
  if (!link || cell.textContent.trim() !== link.textContent.trim()) return false;
  let url;
  try { url = new URL(link.href); } catch { return false; }
  if (!EMBED_HOSTS.test(url.hostname)) return false;
  const embed = buildBlock('embed', { elems: [link] });
  link.closest('p').replaceWith(embed);
  decorateBlock(embed);
  loadBlock(embed);
  return true;
}

export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('columns-row');
    const cells = [...row.children];
    // the source grid gives every cell of a row an equal share (AEM grid columns)
    row.classList.add(`columns-row-${Math.min(cells.length, 6)}`);
    cells.forEach((cell) => {
      cell.classList.add('columns-col');
      if (embedCell(cell)) { cell.classList.add('columns-media', 'columns-embed'); return; }
      const media = cell.querySelector('picture, img');
      const hasText = [...cell.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
        .some((el) => el.textContent.trim());
      if (media && !hasText) {
        cell.classList.add('columns-media');
      } else {
        cell.classList.add('columns-text');
      }
    });
  });
}
