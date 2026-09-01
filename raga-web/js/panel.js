/* Renders the right-hand description panel: title, kind,
   description, "branches here" chips, and "connections"
   chips. Imports the shared graph state from graph.js. */

import { nodesById, hierRaw, KIND, revealAndSelect } from './graph.js';

function escapeHtml(str){ const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

export function showPanel(node, interactive = true){
  const panelBody = document.getElementById('panelBody');
  const parentLink = hierRaw.find(l => l.targetId === node.id);
  const parent = parentLink ? nodesById[parentLink.sourceId] : null;
  const crumb = parent ? `<span>${escapeHtml(parent.name)}</span> / <span>${escapeHtml(node.name)}</span>` : escapeHtml(node.name);

  let hierHtml = '';
  if(node.children && node.children.length){
    hierHtml = `<div class="relations"><p class="rel-heading">Branches here</p><div class="hier-chips">` +
      node.children.map(c => `<button class="hier-chip" data-id="${escapeHtml(c.id)}">${escapeHtml(c.name)}</button>`).join('') +
      `</div></div>`;
  }

  let relHtml = '';
  if(node.relations && node.relations.length){
    relHtml = `<div class="relations connections-top"><p class="rel-heading">Connections</p><div class="rel-chips">` +
      node.relations.map(rel => {
        const t = nodesById[rel.targetId];
        if(!t) return '';
        return `<button class="rel-chip" data-id="${escapeHtml(rel.targetId)}"><span class="rel-type">${escapeHtml(rel.type)}</span><span class="rel-name">${escapeHtml(t.name)}</span></button>`;
      }).join('') + `</div></div>`;
  }

  const imageHtml = node.image
    ? `<img class="panel-image" src="${escapeHtml(node.image)}" alt="${escapeHtml(node.name)}" onerror="this.remove()">`
    : '';

  let linksHtml = '';
  if(node.links && node.links.length){
    linksHtml = `<div class="relations"><p class="rel-heading">Watch &amp; read</p><div class="media-links">` +
      node.links.map(link => {
        const isVideo = /youtube\.com|youtu\.be|vimeo\.com/i.test(link.url || '');
        return `<a class="media-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
          <span class="media-icon">${isVideo ? '\u25B6' : '\u2197'}</span>
          <span class="media-label">${escapeHtml(link.label || link.url)}</span>
        </a>`;
      }).join('') + `</div></div>`;
  }

  panelBody.innerHTML = `
    ${imageHtml}
    <div class="crumb">${crumb}</div>
    <h2>${escapeHtml(node.name)}</h2>
    ${relHtml}
    <p class="kind">${KIND[node._depth]}</p>
    ${node.description ? `<p class="desc">${escapeHtml(node.description)}</p>` : `<p class="empty">No description yet.</p>`}
    ${linksHtml}
    ${hierHtml}
    ${node.children && node.children.length ? `<p class="hint">Click the circle on the map to ${node.expanded ? 'hide' : 'reveal'} these on the graph.</p>` : ''}
  `;

  panelBody.querySelectorAll('.hier-chip, .rel-chip').forEach(chip => {
    chip.addEventListener('click', () => revealAndSelect(chip.dataset.id));
  });
}
