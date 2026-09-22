/* research.js: interactions on the Research page.

   DATA. Nothing is stored in this file. The network is built from the page itself:
     - the numbered list #collab       (who: data-id, data-short, coordinates, link)
     - the publications  .pubs > li    (data-people = collaborators on that paper, data-topic = research topic)
   A person is linked to you once per shared paper, and two collaborators are linked when they share a paper.

   VIEWS. "Network" (default, drawn here as SVG with a small force simulation) and "Globe" (Plotly, downloaded
   only if someone opens it). */
(function () {
    'use strict';

    var block = document.getElementById('collaborations');
    var listEl = document.getElementById('collab');
    var netEl = document.getElementById('net');
    var mapWrap = document.querySelector('.map-wrap');
    var mapEl = document.getElementById('map');
    var zoomEl = document.getElementById('net-zoom');
    var topicLinks = document.querySelectorAll('.page-head__links a[data-topic]');
    var hintEl = document.getElementById('net-hint');
    var detailEl = document.getElementById('net-detail');
    if (!block || !listEl || !netEl || !mapEl || !mapWrap || !zoomEl || !hintEl || !detailEl) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SVGNS = 'http://www.w3.org/2000/svg';
    var PLOTLY_URL = 'https://cdn.plot.ly/plotly-1.58.5.min.js';

    // `at` is where a topic's cluster settles, as a fraction of the half-width / half-height from the centre.
    var TOPICS = {
        craton: { label: 'Craton dynamics',               section: 'craton',    color: '#2A6A8F', at: [-1, 0.05] },
        grain:  { label: 'Grain size dependent rheology', section: 'grainSize', color: '#D9A441', at: [1, -0.05] },
        ore:    { label: 'Layered ore complex',           section: 'ore',       color: '#A8532A', at: [-0.15, 1] },
        crab:   { label: 'Crab ecology',                  section: 'crab',      color: '#6E5A9A', at: [0.2, -1] }
    };

    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function svg(tag, attrs) {
        var e = document.createElementNS(SVGNS, tag);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }
    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

    /* People at the same city (e.g. several people at the same university) would otherwise sit on
       top of each other on the globe. Anyone within ~0.5 degrees of another person is nudged a few
       degrees apart, spaced evenly around their true location, so every point stays visible. */
    function spreadByLocation(list) {
        var THRESH = 0.5, groups = [], used = {};
        list.forEach(function (p, i) {
            if (used[i]) return;
            var group = [p]; used[i] = true;
            list.forEach(function (q, j) {
                if (used[j] || j === i) return;
                if (Math.hypot(p.lat - q.lat, p.lng - q.lng) < THRESH) { group.push(q); used[j] = true; }
            });
            groups.push(group);
        });
        var POS = ['top right', 'top left', 'bottom right', 'bottom left'];
        groups.forEach(function (group) {
            if (group.length === 1) { group[0].glat = group[0].lat; group[0].glng = group[0].lng; group[0].gpos = POS[0]; return; }
            var R = 2.3 + group.length * 0.9;                        // degrees: bigger clusters spread a little further
            var stretch = 1 / Math.max(0.4, Math.cos(group[0].lat * Math.PI / 180));   // keep east-west spacing consistent nearer the poles
            group.forEach(function (p, k) {
                var a = -Math.PI / 2 + (2 * Math.PI * k) / group.length;
                p.glat = p.lat + R * Math.sin(a);
                p.glng = p.lng + R * Math.cos(a) * stretch;
                p.gpos = POS[k % POS.length];
            });
        });
    }

    /* ---------------------------------------------------------------- data from the page */
    var people = {}, order = [];
    [].forEach.call(listEl.querySelectorAll('li'), function (li, i) {
        var a = li.querySelector('a');
        var full = a.textContent.trim().replace(/\s+/g, ' ');
        var cut = full.indexOf(',');
        var p = {
            id: li.dataset.id, num: i + 1, short: li.dataset.short,
            name: full.slice(0, cut), aff: full.slice(cut + 1).trim(), url: a.href,
            lat: parseFloat(li.dataset.lat), lng: parseFloat(li.dataset.lng),
            papers: [], topic: null, li: li
        };
        people[p.id] = p; order.push(p.id);
    });

    var papers = [], paperById = {};
    [].forEach.call(document.querySelectorAll('.pubs > li[data-people]'), function (li) {
        var year = li.querySelector('.pub__cite').textContent.match(/\((\d{4})\)/);
        var p = {
            n: li.value, topic: li.dataset.topic, el: li, year: year ? year[1] : '',
            title: li.querySelector('.pub__title').textContent.trim(),
            ids: li.dataset.people.split(/\s+/).filter(function (id) { return people[id]; })
        };
        papers.push(p); paperById[p.n] = p;
    });
    papers.sort(function (a, b) { return b.n - a.n; });
    papers.forEach(function (p) {
        p.ids.forEach(function (id) {
            people[id].papers.push(p);
            if (!people[id].topic) people[id].topic = p.topic;
        });
    });
    order = order.filter(function (id) { return people[id].topic; });        // only people who appear on a paper

    var me = { id: 'paul', name: 'Jyotirmoy Paul', short: 'Jyotirmoy Paul', aff: '', center: true, r: 17, papers: papers };
    var nodes = [me], byId = { paul: me };
    order.forEach(function (id) {
        var p = people[id];
        p.r = 7 + 4 * Math.sqrt(p.papers.length);                          // bigger = more papers together
        nodes.push(p); byId[id] = p;
    });

    nodes.forEach(function (n) { n.padX = Math.max(n.r, n.short.length * 3.6 + 2) + 6; });   // keeps names inside the box

    var edgeMap = {};
    papers.forEach(function (p) {
        var ids = ['paul'].concat(p.ids);
        for (var i = 0; i < ids.length; i++) for (var j = i + 1; j < ids.length; j++) {
            var key = ids[i] < ids[j] ? ids[i] + '|' + ids[j] : ids[j] + '|' + ids[i];
            (edgeMap[key] = edgeMap[key] || { a: byId[ids[i]], b: byId[ids[j]], w: 0 }).w++;
        }
    });
    var edges = Object.keys(edgeMap).map(function (k) { return edgeMap[k]; });
    var nbrs = {};
    nodes.forEach(function (n) { nbrs[n.id] = {}; });
    edges.forEach(function (e) { nbrs[e.a.id][e.b.id] = true; nbrs[e.b.id][e.a.id] = true; });

    /* ---------------------------------------------------------------- state */
    var state = { person: null, paper: null, topic: null };
    var mode = 'network';
    var hover = null, dragging = null;
    var W = 0, H = 0, alpha = 1, raf = 0, started = false;
    var svgEl, gEdges, gNodes, tip;
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    /* ---------------------------------------------------------------- building the SVG */
    function build() {
        svgEl = svg('svg', { role: 'group', 'aria-label': 'Network of collaborators. Every person is also listed below.' });
        gEdges = svg('g', {}); gNodes = svg('g', {});
        svgEl.appendChild(gEdges); svgEl.appendChild(gNodes);

        edges.forEach(function (e) {
            e.line = svg('line', {
                'class': 'net-edge ' + (e.a.center || e.b.center ? 'net-edge--me' : 'net-edge--peer'),
                'stroke-width': (1 + 1.1 * e.w).toFixed(1)
            });
            gEdges.appendChild(e.line);
        });

        nodes.forEach(function (n) {
            var g = svg('g', { 'class': 'net-node' + (n.center ? ' net-node--me' : ''), tabindex: '0', role: 'button' });
            var count = n.papers.length + (n.papers.length === 1 ? ' paper' : ' papers');
            g.setAttribute('aria-label', n.center
                ? 'Jyotirmoy Paul, centre of the network'
                : n.name + ', ' + n.aff + '. ' + TOPICS[n.topic].label + ', ' + count + ' together');
            var circle = svg('circle', { r: n.r, fill: n.center ? '#15222C' : TOPICS[n.topic].color });
            var label = svg('text', { 'class': 'net-label', y: n.r + 15 });
            label.textContent = n.short;
            g.appendChild(circle); g.appendChild(label);
            gNodes.appendChild(g);
            n.g = g;
            bindNode(n);
        });

        svgEl.addEventListener('pointerdown', function (e) { if (e.target === svgEl) setState({}); });
        tip = el('div', 'net-tip'); tip.hidden = true;
        netEl.appendChild(svgEl); netEl.appendChild(tip);
        netEl.addEventListener('keydown', function (e) { if (e.key === 'Escape') setState({}); });
    }

    /* ---------------------------------------------------------------- physics */
    function anchor(n) {
        var at = TOPICS[n.topic].at;
        return [W / 2 + at[0] * W * 0.40, H / 2 + at[1] * H * 0.36];
    }

    function place() {                                  // everyone starts near the centre and spreads out
        nodes.forEach(function (n) {
            n.x = W / 2 + (rnd() - 0.5) * 40;
            n.y = H / 2 + (rnd() - 0.5) * 40;
            n.vx = n.vy = 0;
        });
    }

    function tick() {
        var i, j, a, b, dx, dy, d2, d, f, e, L, min;
        var Lme = Math.min(W, H) * 0.36, Lpeer = 68;

        for (i = 0; i < nodes.length; i++) {
            a = nodes[i];
            for (j = i + 1; j < nodes.length; j++) {
                b = nodes[j]; dx = b.x - a.x; dy = b.y - a.y; d2 = dx * dx + dy * dy;
                if (d2 < 1) { dx = rnd() - 0.5; dy = rnd() - 0.5; d2 = 1; }
                d = Math.sqrt(d2); min = a.r + b.r + 30;
                f = 3400 * alpha / Math.max(d2, min * min * 0.35);            // push apart
                a.vx -= dx / d * f; a.vy -= dy / d * f; b.vx += dx / d * f; b.vy += dy / d * f;
                if (d < a.r + b.r + 8) {                                        // never overlap
                    var push = (a.r + b.r + 8 - d) * 0.25;
                    if (!a.fixed) { a.x -= dx / d * push; a.y -= dy / d * push; }
                    if (!b.fixed) { b.x += dx / d * push; b.y += dy / d * push; }
                }
            }
        }
        for (i = 0; i < edges.length; i++) {                                    // links act as springs
            e = edges[i]; a = e.a; b = e.b;
            dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy) || 1;
            L = (a.center || b.center) ? Lme : Lpeer;
            f = (d - L) * 0.03 * alpha;
            a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f;
        }
        for (i = 0; i < nodes.length; i++) {
            a = nodes[i];
            if (a.center) {                                                     // you stay near the middle
                a.vx += (W / 2 - a.x) * 0.12; a.vy += (H / 2 - a.y) * 0.12;
            } else {                                                            // topics gather in their own area
                var at = anchor(a);
                a.vx += (at[0] - a.x) * 0.02 * alpha; a.vy += (at[1] - a.y) * 0.02 * alpha;
            }
            a.vx *= 0.8; a.vy *= 0.8;
            if (a.fixed) { a.vx = a.vy = 0; }
            else { a.x += a.vx; a.y += a.vy; }
            a.x = clamp(a.x, a.padX, W - a.padX);
            a.y = clamp(a.y, a.r + 6, H - a.r - 22);
        }
        if (!dragging) alpha *= 0.988;
    }

    function render() {
        nodes.forEach(function (n) { n.g.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')'); });
        edges.forEach(function (e) {
            e.line.setAttribute('x1', e.a.x.toFixed(1)); e.line.setAttribute('y1', e.a.y.toFixed(1));
            e.line.setAttribute('x2', e.b.x.toFixed(1)); e.line.setAttribute('y2', e.b.y.toFixed(1));
        });
        if (hover && !tip.hidden) positionTip(hover);
    }

    function loop() {
        raf = 0; tick(); render();
        if (alpha > 0.02 || dragging) raf = requestAnimationFrame(loop);
    }
    function run() {
        if (!W) return;
        if (reduce) { for (var i = 0; i < 4; i++) tick(); render(); }        // no animation: move straight to the result
        else if (!raf) raf = requestAnimationFrame(loop);
    }
    function reheat(a) { alpha = Math.max(alpha, a); run(); }

    function start() {
        if (started || !W) return;
        started = true;
        if (reduce) { for (var i = 0; i < 400; i++) tick(); render(); }
        else run();
    }

    function setSize(w, h) {
        var ow = W, oh = H;
        W = w; H = h;
        svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        if (!ow) { place(); render(); }
        else {
            nodes.forEach(function (n) { n.x *= W / ow; n.y *= H / oh; });
            render();
            if (started) reheat(0.3);
        }
    }
    function measure() {
        var w = netEl.clientWidth, h = netEl.clientHeight;
        if (w && h && (w !== W || h !== H)) setSize(w, h);
    }

    /* ---------------------------------------------------------------- pointer, touch and keyboard on nodes */
    function bindNode(n) {
        var g = n.g, from = null;

        g.addEventListener('pointerenter', function () { if (!dragging) { hover = n; update(); showTip(n); } });
        g.addEventListener('pointerleave', function () { if (!dragging) { hover = null; update(); hideTip(); } });
        g.addEventListener('focus', function () { hover = n; update(); showTip(n); });
        g.addEventListener('blur', function () { hover = null; update(); hideTip(); });
        g.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(n); }
        });

        g.addEventListener('pointerdown', function (e) {
            if (e.button !== 0) return;
            var r = svgEl.getBoundingClientRect();
            g.setPointerCapture(e.pointerId);
            from = { x: e.clientX, y: e.clientY, moved: false, ox: n.x - (e.clientX - r.left), oy: n.y - (e.clientY - r.top) };
            dragging = n; n.fixed = true; hideTip();
            e.preventDefault();
        });
        g.addEventListener('pointermove', function (e) {
            if (dragging !== n || !from) return;
            if (Math.abs(e.clientX - from.x) + Math.abs(e.clientY - from.y) > 4) from.moved = true;
            if (!from.moved) return;
            var r = svgEl.getBoundingClientRect();
            n.x = clamp(e.clientX - r.left + from.ox, n.padX, W - n.padX);
            n.y = clamp(e.clientY - r.top + from.oy, n.r + 6, H - n.r - 22);
            reheat(0.35);
        });
        function release(e, cancelled) {
            if (dragging !== n) return;
            n.fixed = false; dragging = null;
            var tapped = from && !from.moved && !cancelled;
            from = null;
            hover = e.pointerType === 'mouse' && g.matches(':hover') ? n : null;
            if (tapped) activate(n); else update();
        }
        g.addEventListener('pointerup', function (e) { release(e, false); });
        g.addEventListener('pointercancel', function (e) { release(e, true); });
    }

    function activate(n) {
        if (n.center) setState({});
        else setState(state.person === n.id ? {} : { person: n.id });
    }

    /* ---------------------------------------------------------------- tooltip */
    function showTip(n) {
        if (!W) return;
        tip.textContent = '';
        tip.appendChild(el('strong', '', n.name));
        tip.appendChild(document.createTextNode(n.center ? 'Centre of the network' : n.aff));
        tip.hidden = false;
        positionTip(n);
    }
    function positionTip(n) {
        tip.style.left = clamp(n.x, 90, W - 90) + 'px';
        tip.style.top = Math.max(34, n.y - n.r - 8) + 'px';
    }
    function hideTip() { tip.hidden = true; }

    /* ---------------------------------------------------------------- highlighting and the detail panel */
    function activeSet() {                               // null = show everything
        var s = {}, id = hover ? hover.id : state.person;
        if (id) {
            s[id] = 1;
            Object.keys(nbrs[id]).forEach(function (k) { s[k] = 1; });
            return s;
        }
        if (state.paper) {
            s.paul = 1;
            paperById[state.paper].ids.forEach(function (k) { s[k] = 1; });
            return s;
        }
        if (state.topic) {
            s.paul = 1;
            order.forEach(function (k) { if (people[k].topic === state.topic) s[k] = 1; });
            return s;
        }
        return null;
    }

    function update() {
        var act = activeSet();
        nodes.forEach(function (n) {
            n.g.classList.toggle('is-dim', !!act && !act[n.id]);
            n.g.classList.toggle('is-selected', state.person === n.id);
            if (!n.center) n.g.setAttribute('aria-pressed', state.person === n.id ? 'true' : 'false');
        });
        edges.forEach(function (e) {
            e.line.classList.toggle('is-dim', !!act && !(act[e.a.id] && act[e.b.id]));
        });
        order.forEach(function (id) {
            people[id].li.classList.toggle('is-dim', !!act && !act[id]);
        });
        topicLinks.forEach(function (a) {
            a.setAttribute('aria-current', a.dataset.topic === state.topic ? 'true' : 'false');
        });
        highlightGlobe();
    }

    function setState(next) {
        state = { person: next.person || null, paper: next.paper || null, topic: next.topic || null };
        update();
        renderDetail();
    }

    function chip(text, fn) {
        var b = el('button', 'chip', text);
        b.type = 'button';
        b.addEventListener('click', fn);
        return b;
    }
    function link(text, href, external) {
        var a = el('a', '', text);
        a.href = href;
        if (external) { a.target = '_blank'; a.rel = 'noopener'; }
        return a;
    }
    function paperItem(p) {
        var li = el('li'), a = link('', '#pub-' + p.n);
        a.appendChild(el('span', '', '[' + p.n + ']'));
        a.appendChild(document.createTextNode(p.title + (p.year ? ' (' + p.year + ')' : '')));
        li.appendChild(a);
        return li;
    }
    function peopleChips(ids) {
        var row = el('div', 'net-detail__chips');
        ids.forEach(function (id) { row.appendChild(chip(people[id].name, function () { setState({ person: id }); })); });
        return row;
    }
    function count(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

    function renderDetail() {
        var d = detailEl, p, t, name, line, ul;
        d.textContent = '';

        if (state.person) {
            p = people[state.person]; t = TOPICS[p.topic];
            name = el('p', 'net-detail__name'); name.appendChild(link(p.name, p.url, true));
            d.appendChild(name);
            d.appendChild(el('p', 'net-detail__sub', p.aff));
            line = el('p', 'net-detail__sub');
            line.appendChild(document.createTextNode('Topic: '));
            line.appendChild(link(t.label, '#' + t.section));
            d.appendChild(line);
            d.appendChild(el('p', 'net-detail__sub', count(p.papers.length, 'paper') + ' together'));
            ul = el('ul', 'net-detail__list');
            p.papers.forEach(function (pp) { ul.appendChild(paperItem(pp)); });
            d.appendChild(ul);
        } else if (state.paper) {
            p = paperById[state.paper];
            d.appendChild(el('p', 'net-detail__name', '[' + p.n + '] ' + p.title + (p.year ? ' (' + p.year + ')' : '')));
            d.appendChild(el('p', 'net-detail__sub', 'Collaborators on this paper'));
            d.appendChild(peopleChips(p.ids));
            line = el('p', 'net-detail__sub'); line.appendChild(link('Back to the paper', '#pub-' + p.n));
            d.appendChild(line);
        } else if (state.topic) {
            t = TOPICS[state.topic];
            var ids = order.filter(function (id) { return people[id].topic === state.topic; });
            var n = papers.filter(function (pp) { return pp.topic === state.topic; }).length;
            d.appendChild(el('p', 'net-detail__name', t.label));
            d.appendChild(el('p', 'net-detail__sub', count(ids.length, 'collaborator') + ', ' + count(n, 'paper')));
            d.appendChild(peopleChips(ids));
            line = el('p', 'net-detail__sub'); line.appendChild(link('Go to this research topic', '#' + t.section));
            d.appendChild(line);
        } else {
            d.appendChild(el('p', 'net-detail__name', count(order.length, 'collaborator') + ' on ' + count(papers.length, 'paper')));
            d.appendChild(el('p', 'net-detail__sub',
                'Bigger circles share more papers with me. Lines join people who co-authored a paper. Select a person or a topic to see how they connect.'));
        }
        d.hidden = mode === 'list' || (mode === 'globe' && !state.person && !state.paper && !state.topic);
    }

    /* ---------------------------------------------------------------- the globe (Plotly, only if opened) */
    // Plotly's built-in scroll-zoom doesn't support this globe projection, so zoom is done by hand:
    // the +/- buttons always work; Ctrl/Cmd+scroll and a two-finger pinch also zoom, while a plain
    // one-finger scroll or drag is left alone so the page still scrolls normally over the map.
    var ROTATION = { lon: -13, lat: 48 };                            // starting view, centred roughly on Europe; drag to see the rest
    var scale = 1, MIN_SCALE = 0.6, MAX_SCALE = 6;
    function setScale(next) {
        scale = clamp(next, MIN_SCALE, MAX_SCALE);
        if (globe === 'ready') window.Plotly.relayout(mapEl, { 'geo.projection.scale': scale });
    }
    function resetView() {
        scale = 1;
        if (globe === 'ready') window.Plotly.relayout(mapEl, { 'geo.projection.scale': 1, 'geo.projection.rotation': ROTATION });
    }

    var zIn = el('button', '', '+'), zOut = el('button', '', '−');
    zIn.type = zOut.type = 'button';
    zIn.setAttribute('aria-label', 'Zoom in'); zOut.setAttribute('aria-label', 'Zoom out');
    zIn.addEventListener('click', function () { setScale(scale * 1.5); });
    zOut.addEventListener('click', function () { setScale(scale / 1.5); });
    zoomEl.appendChild(zIn); zoomEl.appendChild(zOut);

    mapWrap.addEventListener('wheel', function (e) {
        if (!(e.ctrlKey || e.metaKey)) return;                        // a plain scroll passes through to the page
        e.preventDefault();
        setScale(scale * Math.exp(-e.deltaY * 0.0018));
    }, { passive: false });
    mapWrap.addEventListener('dblclick', function () { setScale(scale * 1.6); });

    var pinch = {}, pinchDist = null;                                   // two-finger pinch to zoom on touch
    mapWrap.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch') pinch[e.pointerId] = { x: e.clientX, y: e.clientY };
    });
    mapWrap.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'touch' || !pinch[e.pointerId]) return;
        pinch[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(pinch);
        if (ids.length === 2) {
            var d = Math.hypot(pinch[ids[0]].x - pinch[ids[1]].x, pinch[ids[0]].y - pinch[ids[1]].y);
            if (pinchDist) setScale(scale * (d / pinchDist));
            pinchDist = d;
        }
    });
    function pinchEnd(e) { delete pinch[e.pointerId]; if (Object.keys(pinch).length < 2) pinchDist = null; }
    mapWrap.addEventListener('pointerup', pinchEnd);
    mapWrap.addEventListener('pointercancel', pinchEnd);

    var globe = 'idle';
    function loadGlobe() {
        if (globe === 'ready') { if (window.Plotly) window.Plotly.Plots.resize(mapEl); return; }
        if (globe !== 'idle') return;
        globe = 'loading';
        mapEl.dataset.state = 'loading';
        mapEl.textContent = 'Loading map…';
        if (window.Plotly) return drawGlobe();
        var s = document.createElement('script');
        s.src = PLOTLY_URL;
        s.onload = drawGlobe;
        s.onerror = function () {
            globe = 'idle';
            mapEl.dataset.state = 'error';
            mapEl.textContent = 'The map could not be loaded. The collaborators are listed below.';
        };
        document.head.appendChild(s);
    }

    var globeList = null;                                              // people, in the order plotted on the globe (for highlighting)

    function drawGlobe() {
        var home = { lat: parseFloat(mapEl.dataset.lat), lng: parseFloat(mapEl.dataset.lng), name: mapEl.dataset.label };
        var list = globeList = order.map(function (id) { return people[id]; });
        spreadByLocation(list);
        var lines = { type: 'scattergeo', mode: 'lines', lat: [], lon: [], hoverinfo: 'none', name: 'Connections',
                      line: { width: 1, color: 'rgba(11,107,112,0.5)' } };
        list.forEach(function (p) { lines.lat.push(home.lat, p.glat, null); lines.lon.push(home.lng, p.glng, null); });

        var markers = {
            type: 'scattergeo', mode: 'markers+text', name: 'Collaborators',
            lat: list.map(function (p) { return p.glat; }), lon: list.map(function (p) { return p.glng; }),
            text: list.map(function (p) { return String(p.num); }), textposition: list.map(function (p) { return p.gpos; }),
            textfont: { size: 10, color: '#15222C' },
            hovertext: list.map(function (p) { return p.name + ', ' + p.aff; }), hoverinfo: 'text',
            marker: { size: 10, color: list.map(function (p) { return TOPICS[p.topic].color; }), line: { width: 1, color: '#fff' } }
        };
        var office = {
            type: 'scattergeo', mode: 'markers', name: 'My office',
            lat: [home.lat], lon: [home.lng], hovertext: [home.name], hoverinfo: 'text',
            marker: { size: 14, color: '#15222C', symbol: 'star', line: { width: 1, color: '#fff' } }
        };
        var layout = {
            geo: {
                projection: { type: 'orthographic', rotation: ROTATION, scale: scale },
                showland: true, landcolor: '#F7F9F9', showocean: true, oceancolor: '#DCE7EB',
                showlakes: true, lakecolor: '#DCE7EB', showcountries: false,
                coastlinecolor: '#9FB0B6', showrivers: false, bgcolor: 'rgba(0,0,0,0)', showframe: false
            },
            font: { family: '"Hanken Grotesk", system-ui, sans-serif', color: '#15222C' },
            paper_bgcolor: 'rgba(0,0,0,0)', hovermode: 'closest', showlegend: false, margin: { l: 0, r: 0, t: 0, b: 0 }
        };

        mapEl.textContent = '';
        mapEl.removeAttribute('data-state');
        window.Plotly.newPlot(mapEl, [lines, markers, office], layout,
                              { responsive: true, displayModeBar: false, scrollZoom: false }).then(function () {
            globe = 'ready';
            mapEl.on('plotly_click', function (ev) {
                var pt = ev.points[0];
                if (pt.data.name === 'Collaborators') setState({ person: list[pt.pointNumber].id });
            });
            highlightGlobe();
        });
    }

    // dims collaborators on the globe that don't match the current selection, the same way the network dims them
    function highlightGlobe() {
        if (globe !== 'ready' || !globeList) return;
        var act = activeSet();
        window.Plotly.restyle(mapEl, {
            'marker.opacity': [globeList.map(function (p) { return act && !act[p.id] ? 0.25 : 1; })]
        }, [1]);                                                        // trace 1 is "Collaborators"
    }

    /* ---------------------------------------------------------------- Network / List / Globe switch */
    var head = block.querySelector('.block__head');
    var sw = el('div', 'viewtoggle');
    sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', 'Collaboration view');
    var bNet = el('button', '', 'Network'), bList = el('button', '', 'List'), bGlobe = el('button', '', 'Globe');
    bNet.type = bList.type = bGlobe.type = 'button';
    sw.appendChild(bNet); sw.appendChild(bList); sw.appendChild(bGlobe); head.appendChild(sw);

    var HINTS = {
        network: 'Drag people to rearrange the network.',
        list: 'Select a name to open that person\u2019s page.',
        globe: 'Drag to rotate. Use +/\u2212, Ctrl/\u2318 + scroll, or pinch to zoom.'
    };

    function view(v) {
        mode = v;
        netEl.hidden = v !== 'network';
        listEl.hidden = v !== 'list';
        mapEl.hidden = zoomEl.hidden = v !== 'globe';
        bNet.setAttribute('aria-pressed', String(v === 'network'));
        bList.setAttribute('aria-pressed', String(v === 'list'));
        bGlobe.setAttribute('aria-pressed', String(v === 'globe'));
        hintText.textContent = HINTS[v];
        resetBtn.hidden = v !== 'globe';
        hintEl.lastChild.previousSibling.nodeValue = v === 'globe' ? ' \u00b7 ' : '';
        renderDetail();
        if (v === 'network') { measure(); start(); } else if (v === 'globe') loadGlobe();
    }
    bNet.addEventListener('click', function () { view('network'); });
    bList.addEventListener('click', function () { view('list'); });
    bGlobe.addEventListener('click', function () { view('globe'); });

    /* ---------------------------------------------------------------- colour the topic links in the fixed sub-nav
       These already jump to each section; clicking one also marks that topic as selected here, so the
       colour-matching stays connected if the visitor scrolls back up to the network, list or globe. */
    topicLinks.forEach(function (a) {
        var k = a.dataset.topic;
        if (!TOPICS[k]) return;
        a.style.setProperty('--dot', TOPICS[k].color);
        a.addEventListener('click', function () { setState({ topic: k }); });
    });

    /* ---------------------------------------------------------------- links from the rest of the page into the network */
    papers.forEach(function (p) {                        // each publication: "See in network"
        var links = p.el.querySelector('.pub__links');
        if (!links) { links = el('p', 'pub__links'); p.el.appendChild(links); }
        var b = el('button', 'chip', 'See in network');
        b.type = 'button';
        b.addEventListener('click', function () {
            view('network');
            setState({ paper: p.n });
            block.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        });
        links.appendChild(b);
    });

    order.forEach(function (id) {                        // hovering a name in the list lights it up in the network
        var li = people[id].li;
        li.addEventListener('mouseenter', function () { if (!netEl.hidden) { hover = people[id]; update(); } });
        li.addEventListener('mouseleave', function () { hover = null; update(); });
    });

    /* ---------------------------------------------------------------- go */
    build();
    var hintText = el('span'); hintEl.appendChild(hintText);
    var resetBtn = el('button', 'net-reset', 'Reset view');
    resetBtn.type = 'button';
    resetBtn.hidden = true;
    resetBtn.addEventListener('click', resetView);
    hintEl.appendChild(document.createTextNode(' \u00b7 '));
    hintEl.appendChild(resetBtn);
    hintEl.hidden = false;
    view('network');
    update();

    if ('ResizeObserver' in window) {
        new ResizeObserver(function () { if (!netEl.hidden) { measure(); } }).observe(netEl);
    }
    if ('IntersectionObserver' in window) {              // let the network assemble when it comes into view
        new IntersectionObserver(function (entries, obs) {
            if (entries[0].isIntersecting) { obs.disconnect(); if (!netEl.hidden) { measure(); start(); } }
        }, { threshold: 0.25 }).observe(netEl);
    } else {
        start();
    }
})();

/* Page banner: same mantle-convection engine as the home page (see /js/mantle.js). */
MantleFlow(document.getElementById('mantle'), document.querySelector('.flow-toggle'));

/* Only one video plays at a time. */
(function () {
    var vids = [].slice.call(document.querySelectorAll('video'));
    vids.forEach(function (v) {
        v.addEventListener('play', function () { vids.forEach(function (o) { if (o !== v) o.pause(); }); });
    });
})();
