/**
 * stat-band — row of headline numbers with labels (reconstructive).
 *
 * Schema: stardust/eds-schema/index.json §stats (4 units, uniform)
 * Authoring: one row per stat — a single cell holding `h2` (the number) and `h5` (the label).
 *   A flattened single cell (DA) is segmented on the h2 boundary.
 * Every authored element is MOVED into its column wrapper (EW1/EW2).
 */
function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

export default function decorate(block) {
  const rows = [...block.children];
  let groups = rows.map((row) => [...row.querySelectorAll(':scope > div > *')]);
  // #52 — one flattened cell holding every stat: split on the number heading
  if (groups.length === 1 && groups[0].filter((n) => n.matches('h2')).length > 1) {
    groups = [];
    groups[0].forEach((node) => {
      if (node.matches('h2') || !groups.length) groups.push([]);
      groups[groups.length - 1].push(node);
    });
  }
  const inner = div('stat-band-inner');
  groups.forEach((nodes) => {
    if (!nodes.length) return;
    inner.append(div('stat', div('stat-text', ...nodes)));
  });
  block.replaceChildren(inner);
}
