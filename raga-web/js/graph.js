/* Builds the force-directed graph: flattens data/index.js into
   node/link lists, sets up the D3 simulation, and handles
   expand/collapse + click-to-focus behaviour. Everything the
   rest of the app needs (nodesById, rebuild, revealAndSelect,
   etc.) is exported for panel.js and main.js to import. */

import { data } from '../data/index.js';

export const COLORS = { 0:'#c99a44', 1:'#c99a44', 2:'#7f77dd', 3:'#5dcaa5' };
export const RADII  = { 0:22, 1:16, 2:12, 3:8 };
export const KIND   = { 0:'Tradition', 1:'Genre', 2:'Gharana / bani / instrument', 3:'Musician' };

export const allNodes = [];
export const nodesById = {};
export const hierRaw = [];
export const relRaw = [];

function flatten(node, depth, parent){
  node._depth = Math.min(depth, 3);
  node.id = node.id || node.name;
  if(node.expanded === undefined) node.expanded = depth === 0;
  nodesById[node.id] = node;
  allNodes.push(node);
  if(parent) hierRaw.push({ sourceId: parent.id, targetId: node.id });
  if(node.children) node.children.forEach(c => flatten(c, depth + 1, node));
}
flatten(data, 0, null);

allNodes.forEach(n => {
  (n.relations || []).forEach(rel => {
    if(nodesById[rel.targetId]) relRaw.push({ sourceId: n.id, targetId: rel.targetId, type: rel.type });
  });
});

export const svg = d3.select('#net');
export const wrap = document.getElementById('canvasWrap');
let width = wrap.clientWidth, height = wrap.clientHeight;
const g = svg.append('g');
export const zoom = d3.zoom().scaleExtent([0.2, 3]).on('zoom', e => g.attr('transform', e.transform));
svg.call(zoom);

const hierLayer = g.append('g').attr('stroke', 'rgba(201,154,68,0.35)').attr('stroke-width', 1);
const relLayer = g.append('g');
const nodeLayer = g.append('g');

const simulation = d3.forceSimulation();
let hierLinkSel = hierLayer.selectAll('line');
let relLinkSel = relLayer.selectAll('path');
let nodeGroup = nodeLayer.selectAll('g.node-group');
let selectedId = null;

/* main.js hooks up showPanel() here, so graph.js never needs
   to import panel.js (that would create a circular import). */
let onSelectCallback = () => {};
export function onSelect(fn){ onSelectCallback = fn; }

function visibleSet(){
  const vis = new Set();
  (function visit(node){
    vis.add(node.id);
    if(node.children && node.expanded) node.children.forEach(visit);
  })(data);
  return vis;
}

function dragBehavior(){
  return d3.drag()
    .on('start', (event, d) => { if(!event.active) simulation.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
    .on('end', (event, d) => { if(!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; });
}

export function rebuild(){
  const vis = visibleSet();
  const vNodes = allNodes.filter(n => vis.has(n.id));

  vNodes.forEach(n => {
    if(n.x === undefined){
      const parentLink = hierRaw.find(l => l.targetId === n.id);
      const parent = parentLink ? nodesById[parentLink.sourceId] : null;
      if(parent && parent.x !== undefined){
        n.x = parent.x + (Math.random() - 0.5) * 40;
        n.y = parent.y + (Math.random() - 0.5) * 40;
      } else {
        n.x = width / 2 + (Math.random() - 0.5) * 40;
        n.y = height / 2 + (Math.random() - 0.5) * 40;
      }
    }
  });

  const vHier = hierRaw.filter(l => vis.has(l.sourceId) && vis.has(l.targetId)).map(l => ({ source: l.sourceId, target: l.targetId }));
  const vRel = relRaw.filter(l => vis.has(l.sourceId) && vis.has(l.targetId)).map(l => ({ source: l.sourceId, target: l.targetId, type: l.type }));

  hierLinkSel = hierLayer.selectAll('line').data(vHier, d => d.source + '>' + d.target)
    .join(enter => enter.append('line'), update => update, exit => exit.remove());

  relLinkSel = relLayer.selectAll('path').data(vRel, d => d.source + '>' + d.target)
    .join(
      enter => enter.append('path').attr('fill', 'none').attr('stroke', 'var(--red)').attr('stroke-width', 1.2).attr('stroke-dasharray', '4 4').attr('opacity', 0.75),
      update => update,
      exit => exit.remove()
    );

  nodeGroup = nodeLayer.selectAll('g.node-group').data(vNodes, d => d.id)
    .join(
      enter => {
        const eg = enter.append('g').attr('class', 'node-group').style('cursor', 'pointer')
          .attr('transform', d => `translate(${d.x},${d.y})`)
          .call(dragBehavior())
          .on('click', (event, d) => { event.stopPropagation(); nodeClicked(d); });
        eg.append('circle')
          .attr('r', d => RADII[d._depth])
          .attr('fill', d => COLORS[d._depth])
          .attr('fill-opacity', d => d._depth === 3 ? 0.85 : 0.9)
          .attr('stroke', '#15111c').attr('stroke-width', 1.5);
        eg.filter(d => d.children && d.children.length)
          .append('text').attr('class', 'expand-dot')
          .attr('text-anchor', 'middle').attr('dy', 3)
          .attr('font-size', d => RADII[d._depth])
          .text(d => d.expanded ? '\u2212' : '+');
        eg.append('text')
          .attr('class', d => 'node-label' + (d._depth <= 1 ? ' genre' : ''))
          .attr('font-size', d => d._depth === 0 ? 14 : d._depth === 1 ? 12.5 : 11)
          .attr('font-weight', d => d._depth <= 1 ? 500 : 400)
          .attr('dx', d => RADII[d._depth] + 6).attr('dy', 4)
          .text(d => d.name);
        return eg;
      },
      update => {
        update.select('.expand-dot').text(d => d.expanded ? '\u2212' : '+');
        return update;
      },
      exit => exit.remove()
    );

  simulation.nodes(vNodes);
  simulation.force('link', d3.forceLink(vHier).id(d => d.id).distance(d => 150 - (d.source._depth || 0) * 10).strength(0.6));
  simulation.force('rellink', d3.forceLink(vRel).id(d => d.id).distance(190).strength(0.2));
  simulation.force('charge', d3.forceManyBody().strength(d => -420 + d._depth * 30));
  simulation.force('center', d3.forceCenter(width / 2, height / 2));
  simulation.force('collide', d3.forceCollide().radius(d => RADII[d._depth] + 22 + d.name.length * 3.4));
  simulation.alpha(0.7).restart();

  applyFocus();
}

simulation.on('tick', () => {
  hierLinkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
  relLinkSel.attr('d', d => {
    const mx = (d.source.x + d.target.x) / 2, my = (d.source.y + d.target.y) / 2 - 20;
    return `M ${d.source.x} ${d.source.y} Q ${mx} ${my} ${d.target.x} ${d.target.y}`;
  });
  nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
});

function selectNode(node){
  selectedId = node.id;
  rebuild();
  onSelectCallback(node);
}

function nodeClicked(d){
  if(d.children && d.children.length) d.expanded = !d.expanded;
  selectNode(d);
}

export function revealAndSelect(targetId){
  const target = nodesById[targetId];
  if(!target) return;
  let cur = target;
  while(true){
    const parentLink = hierRaw.find(l => l.targetId === cur.id);
    if(!parentLink) break;
    const parent = nodesById[parentLink.sourceId];
    parent.expanded = true;
    cur = parent;
  }
  selectNode(target);
}

function applyFocus(){
  if(!selectedId || !nodesById[selectedId]){
    nodeGroup.style('opacity', 1);
    nodeGroup.select('circle').attr('stroke', '#15111c').attr('stroke-width', 1.5);
    hierLinkSel.style('opacity', 1);
    relLinkSel.style('opacity', 0.75);
    return;
  }
  const node = nodesById[selectedId];
  const connected = new Set([node.id]);
  hierRaw.forEach(l => { if(l.sourceId === node.id) connected.add(l.targetId); if(l.targetId === node.id) connected.add(l.sourceId); });
  relRaw.forEach(l => { if(l.sourceId === node.id) connected.add(l.targetId); if(l.targetId === node.id) connected.add(l.sourceId); });

  nodeGroup.style('opacity', d => connected.has(d.id) ? 1 : 0.25);
  nodeGroup.select('circle').attr('stroke', d => d.id === selectedId ? '#c99a44' : '#15111c').attr('stroke-width', d => d.id === selectedId ? 3 : 1.5);
  hierLinkSel.style('opacity', d => (d.source.id === node.id || d.target.id === node.id) ? 0.9 : 0.1);
  relLinkSel.style('opacity', d => (d.source.id === node.id || d.target.id === node.id) ? 0.9 : 0.08);
}

svg.on('click', () => { selectedId = null; applyFocus(); });

export function selectInitial(){ selectNode(data); }

export function refreshSize(){
  width = wrap.clientWidth; height = wrap.clientHeight;
  simulation.force('center', d3.forceCenter(width / 2, height / 2));
  simulation.alpha(0.3).restart();
}
