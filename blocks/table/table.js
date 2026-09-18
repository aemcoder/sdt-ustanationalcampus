/**
 * table — Block Collection `table` model (D11): one authored row per table row (reconstructive).
 *
 * Authoring: the first row is the header row when every cell is bold (`<p><strong>…</strong></p>`)
 *   or when the `pricing` variant is set; the remaining rows are data rows (any column count — a
 *   genuine data table is the D10 exception).
 * Variant `pricing` (program pages): the source's usta responsive price table — 1px #e1e6e8 frame,
 *   6px radius, 16px cells, alternating shaded rows, columns stacked on mobile.
 * The pipeline's row/cell divs are structural and carry the layout classes; every authored
 * element stays where it was written (EW1/EW2).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const pricing = block.classList.contains('pricing');
  rows.forEach((row, i) => {
    row.classList.add('table-row');
    row.setAttribute('role', 'row');
    const cells = [...row.children];
    const allBold = cells.length > 0 && cells.every((c) => {
      const strong = c.querySelector('strong, b');
      return strong && strong.textContent.trim() === c.textContent.trim();
    });
    const head = i === 0 && (pricing || allBold);
    row.classList.add(head ? 'head' : 'body');
    if (!head && ((rows.filter((r) => r.classList.contains('body')).length) % 2 === 1)) {
      row.classList.add('shaded');
    }
    cells.forEach((c) => {
      c.classList.add('table-cell');
      c.setAttribute('role', head ? 'columnheader' : 'cell');
    });
  });
  block.setAttribute('role', 'table');
}
