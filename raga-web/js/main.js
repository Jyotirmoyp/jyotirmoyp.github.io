/* Entry point (loaded as type="module" from index.html).
   Wires the toolbar buttons up to the graph, hooks the
   panel into node-selection, and kicks off the first render. */

import { data } from '../data/index.js';
import { rebuild, selectInitial, onSelect, svg, zoom, refreshSize } from './graph.js';
import { showPanel } from './panel.js';

onSelect(showPanel);

function setAllExpanded(node, val){
  if(node.children && node.children.length){
    node.expanded = val;
    node.children.forEach(c => setAllExpanded(c, val));
  }
}

document.getElementById('expandAllBtn').addEventListener('click', () => { setAllExpanded(data, true); rebuild(); });
document.getElementById('collapseAllBtn').addEventListener('click', () => {
  data.children.forEach(c => setAllExpanded(c, false));
  data.expanded = true;
  rebuild();
});
document.getElementById('resetBtn').addEventListener('click', () => {
  svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
});

window.addEventListener('resize', refreshSize);

selectInitial();
