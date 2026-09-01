/* Wires up the toolbar buttons and kicks off the first
   render. Runs last, after data.js + graph.js + panel.js
   have all loaded. */

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

window.addEventListener('resize', () => {
  width = wrap.clientWidth; height = wrap.clientHeight;
  simulation.force('center', d3.forceCenter(width / 2, height / 2));
  simulation.alpha(0.3).restart();
});

selectedId = data.id;
rebuild();
showPanel(data);
