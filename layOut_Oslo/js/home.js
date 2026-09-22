/* home.js: behaviour used only on the home page
   portrait slideshow, mantle-convection animation, career timeline, publication tools */

// Portrait slideshow: slow crossfade, dots to choose, pauses on hover/focus, off for reduced motion.
(function () {
    var fig = document.querySelector('.portrait');
    var slides = [].slice.call(fig.querySelectorAll('.slide'));
    var wrap = fig.querySelector('.portrait__dots');
    if (slides.length < 2) { wrap.hidden = true; return; }

    var current = 0, timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    var dots = slides.map(function (_, n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show photo ' + (n + 1) + ' of ' + slides.length);
        b.addEventListener('click', function () { show(n); });
        wrap.appendChild(b);
        return b;
    });

    function show(n) {
        current = n;
        slides.forEach(function (s, k) {
            s.classList.toggle('is-active', k === n);
            s.setAttribute('aria-hidden', k === n ? 'false' : 'true');
        });
        dots.forEach(function (d, k) { d.setAttribute('aria-current', k === n ? 'true' : 'false'); });
    }
    function start() { if (!reduce.matches && !timer) timer = setInterval(function () { show((current + 1) % slides.length); }, 6000); }
    function stop() { clearInterval(timer); timer = null; }

    ['mouseenter', 'focusin'].forEach(function (e) { fig.addEventListener(e, stop); });
    ['mouseleave', 'focusout'].forEach(function (e) { fig.addEventListener(e, start); });

    show(0);
    start();
})();

/* ---------- Mantle convection simulation ----------
   Tracers are advected through a stream function made of two convection-roll harmonics
   plus a localised plume under the cursor. Each tracer carries a temperature that relaxes
   toward hot at the base and cold at the surface, so rising material stays warm and sinking
   material stays cool. Colour = tracer temperature. */
(function () {
    var canvas = document.getElementById('mantle');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var stage = canvas.parentNode;
    var toggle = document.querySelector('.flow-toggle');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    var STOPS = [[42, 106, 143], [217, 164, 65], [192, 68, 42]];   // cool, mid, hot
    var NB = 24, LEN = 12, colors = [];
    for (var i = 0; i < NB; i++) {
        var f = i / (NB - 1) * 2, seg = Math.min(1, Math.floor(f)), k = f - seg;
        var a = STOPS[seg], b = STOPS[seg + 1];
        colors.push('rgb(' + [0, 1, 2].map(function (c) { return Math.round(a[c] + (b[c] - a[c]) * k); }).join(',') + ')');
    }

    var W = 0, H = 0, dpr = 1, parts = [], t = 0;
    var wave = 0, ky = 0, P0 = 0, sigma = 60;
    var mouse = { x: 0, y: 0, tx: 0, ty: 0, a: 0, target: 0, seen: false };
    var running = false, userPaused = reduce.matches, visible = true, raf = 0, last = 0;

    function makeParticle() {
        return { x: 0, y: 0, T: 0, age: 0, life: 0, tx: new Float32Array(LEN), ty: new Float32Array(LEN), head: 0, n: 0, b: 0 };
    }
    function respawn(p, anywhere) {
        p.x = Math.random() * W;
        p.y = 2 + Math.random() * (H - 4);
        p.T = p.y / H;
        p.age = anywhere ? Math.random() * 12 : 0;
        p.life = 10 + Math.random() * 12;
        p.n = 0;
    }

    function resize() {
        var r = stage.getBoundingClientRect();
        W = Math.max(1, r.width); H = Math.max(1, r.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ky = Math.PI / H;
        var pairs = Math.max(1, Math.round(W / (1.5 * H)));
        wave = 2 * Math.PI * pairs / W;                       // roll pairs fit the width, so x can wrap
        P0 = (28 + 0.045 * H) * H / Math.PI;                  // peak flow speed grows a little with the stage height
        sigma = Math.min(120, Math.max(50, H * 0.26));
        var n = Math.max(150, Math.min(800, Math.round(W * H / 850)));
        parts = [];
        for (var i = 0; i < n; i++) { var p = makeParticle(); respawn(p, true); parts.push(p); }
        for (var s = 0; s < 160; s++) step(0.05);             // spin up so the temperature field is already developed
        draw();
    }

    function step(dt) {
        t += dt;
        var ph = t * 0.12, ph2 = t * 0.09;
        mouse.a += (mouse.target - mouse.a) * Math.min(1, dt * 3);
        if (mouse.seen) {
            mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 8);
            mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 8);
        }
        var A = 120 * mouse.a, s2 = sigma * sigma, plume = mouse.a > 0.01;

        for (var i = 0; i < parts.length; i++) {
            var p = parts[i], x = p.x, y = p.y;
            var a1 = wave * x + ph, a2 = 2 * wave * x - ph2 + 1.3;
            var sy = Math.sin(ky * y), cy = Math.cos(ky * y);
            var s2y = Math.sin(2 * ky * y), c2y = Math.cos(2 * ky * y);
            var u = P0 * ky * Math.sin(a1) * cy + 0.22 * P0 * 2 * ky * Math.sin(a2) * c2y;
            var v = -P0 * wave * Math.cos(a1) * sy - 0.22 * P0 * 2 * wave * Math.cos(a2) * s2y;
            var g = 0;
            if (plume) {
                var dx = x - mouse.x, dy = y - mouse.y;
                g = Math.exp(-(dx * dx + dy * dy) / (2 * s2));
                var edge = Math.sqrt(sy);                     // ease the plume off toward the top and bottom boundaries
                u += -A * g * dx * dy / s2 * edge;
                v += -A * g * (1 - dx * dx / s2) * edge;
            }
            p.x += u * dt; p.y += v * dt;
            if (p.x < 0) { p.x += W; p.n = 0; } else if (p.x > W) { p.x -= W; p.n = 0; }
            if (p.y < 1) p.y = 1; else if (p.y > H - 1) p.y = H - 1;

            var yn = p.y / H;
            var kT = 0.10 + 2.5 * Math.exp(-yn / 0.05) + 2.5 * Math.exp(-(1 - yn) / 0.05);
            p.T += (yn - p.T) * Math.min(1, kT * dt);
            if (g > 0.02) p.T += (1 - p.T) * Math.min(1, 2.2 * g * mouse.a * dt);
            p.T = p.T < 0 ? 0 : p.T > 1 ? 1 : p.T;
            p.b = Math.round(p.T * (NB - 1));

            var h = p.head;
            if (p.n === 0) { p.tx[h] = p.x; p.ty[h] = p.y; p.n = 1; }
            else {
                var ddx = p.x - p.tx[h], ddy = p.y - p.ty[h];
                if (ddx * ddx + ddy * ddy >= 3) { h = p.head = (h + 1) % LEN; p.tx[h] = p.x; p.ty[h] = p.y; if (p.n < LEN) p.n++; }
            }
            p.age += dt;
            if (p.age > p.life) respawn(p, false);
        }
    }

    function trace(p, from) {                                // path along the trail, oldest to newest, ending at the live position
        var n = p.n, oldest = (p.head - n + 1 + LEN * 2) % LEN;
        for (var j = from; j < n; j++) {
            var idx = (oldest + j) % LEN;
            if (j === from) ctx.moveTo(p.tx[idx], p.ty[idx]); else ctx.lineTo(p.tx[idx], p.ty[idx]);
        }
        ctx.lineTo(p.x, p.y);
    }

    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        if (mouse.a > 0.02) {
            var gr = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, sigma * 1.6);
            gr.addColorStop(0, 'rgba(192,68,42,' + (0.16 * mouse.a).toFixed(3) + ')');
            gr.addColorStop(1, 'rgba(192,68,42,0)');
            ctx.fillStyle = gr;
            ctx.fillRect(0, 0, W, H);
        }
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (var pass = 0; pass < 2; pass++) {
            ctx.lineWidth = pass ? 1.9 : 1.3;
            ctx.globalAlpha = pass ? 0.9 : 0.35;
            for (var b = 0; b < NB; b++) {
                ctx.strokeStyle = colors[b];
                ctx.beginPath();
                for (var i = 0; i < parts.length; i++) {
                    var p = parts[i];
                    if (p.b !== b || p.n < 1) continue;
                    trace(p, pass ? Math.max(0, p.n - 3) : 0);
                }
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }

    function frame(now) {
        raf = 0;
        if (!running) return;
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        step(dt); draw();
        raf = requestAnimationFrame(frame);
    }
    function update() {
        var should = !userPaused && visible && !document.hidden;
        if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
        else if (!should && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    }

    function setPointer(e) {
        var r = stage.getBoundingClientRect();
        mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
        if (!mouse.seen) { mouse.x = mouse.tx; mouse.y = mouse.ty; mouse.seen = true; }
    }
    stage.addEventListener('pointerenter', function (e) { mouse.seen = false; setPointer(e); mouse.target = 1; });
    stage.addEventListener('pointermove', function (e) { setPointer(e); mouse.target = 1; });
    stage.addEventListener('pointerdown', function (e) { setPointer(e); mouse.target = 1; });
    ['pointerleave', 'pointercancel', 'pointerup'].forEach(function (ev) {
        stage.addEventListener(ev, function () { mouse.target = 0; });
    });

    function label() {
        var text = userPaused ? 'Play animation' : 'Pause animation';
        toggle.setAttribute('aria-label', text);
        toggle.title = text;
        toggle.dataset.paused = userPaused;
    }
    toggle.addEventListener('click', function () { userPaused = !userPaused; label(); update(); });
    label();

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; update(); }).observe(stage);
    }
    document.addEventListener('visibilitychange', update);

    var timer;
    if ('ResizeObserver' in window) {
        new ResizeObserver(function () { clearTimeout(timer); timer = setTimeout(function () { resize(); }, 150); }).observe(stage);
    } else {
        window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(resize, 150); });
    }
    resize();
    update();
})();

/* ---------- Career timeline (built from the lists in #career) ---------- */
(function () {
    var body = document.getElementById('career-body');
    if (!body) return;
    var list = body.querySelector('.career-list');
    var head = body.parentNode.querySelector('.block__head');
    var rows = [].slice.call(list.querySelectorAll('.row[data-from]'));
    if (!rows.length) return;

    var d = new Date();
    var nowDec = d.getFullYear() + (d.getMonth() + d.getDate() / 31) / 12;
    function num(v) { return v === 'now' ? nowDec : parseFloat(v); }

    var items = rows.map(function (r) {
        return {
            row: r, from: num(r.dataset.from), to: num(r.dataset.to), now: r.dataset.to === 'now',
            label: r.dataset.label, kind: r.parentNode.dataset.kind,
            when: r.querySelector('dt').textContent.trim(),
            title: r.querySelector('.row__what').textContent.trim()
        };
    });

    var minY = Math.floor(Math.min.apply(null, items.map(function (i) { return i.from; })));
    var maxY = Math.ceil(Math.max.apply(null, items.map(function (i) { return i.to; })));
    var cols = maxY - minY;

    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

    var tl = el('div', 'tl'); tl.setAttribute('role', 'group'); tl.setAttribute('aria-label', 'Career timeline. Select an entry for details.');
    var inner = el('div', 'tl__inner'); inner.style.setProperty('--cols', cols);
    var years = el('div', 'tl__years'); years.setAttribute('aria-hidden', 'true');
    for (var y = minY; y < maxY; y++) years.appendChild(el('span', '', y));
    inner.appendChild(years);

    var detail = el('div', 'tl-detail'); detail.setAttribute('role', 'region'); detail.setAttribute('aria-live', 'polite'); detail.setAttribute('aria-label', 'Selected entry');
    var buttons = [];

    function select(item) {
        buttons.forEach(function (b) { b.el.setAttribute('aria-pressed', b.item === item ? 'true' : 'false'); });
        detail.innerHTML = '';
        detail.appendChild(el('p', 'tl-detail__when', item.when));
        var bodyEl = el('div', 'tl-detail__body');
        bodyEl.innerHTML = item.row.querySelector('dd').innerHTML;
        detail.appendChild(bodyEl);
    }

    [['job', 'Appointments'], ['edu', 'Education']].forEach(function (g) {
        var group = items.filter(function (i) { return i.kind === g[0]; }).sort(function (a, b) { return a.from - b.from; });
        var laneEnds = [];
        group.forEach(function (i) {                          // first lane with no overlap
            var lane = 0;
            while (laneEnds[lane] !== undefined && laneEnds[lane] > i.from) lane++;
            laneEnds[lane] = Math.max(i.to, i.from + 0.75); i.lane = lane;   // very short bars still occupy their minimum width
        });
        var wrap = el('div', 'tl__group');
        wrap.appendChild(el('p', 'tl__label', g[1]));
        var lanes = el('div', 'tl__lanes'); lanes.style.setProperty('--lanes', laneEnds.length);
        group.forEach(function (i) {
            var b = el('button', 'tl-bar tl-bar--' + g[0], i.label);
            b.type = 'button';
            var w = (i.to - i.from) / cols * 100;
            b.style.left = ((i.from - minY) / cols * 100) + '%';
            b.style.width = w + '%';
            b.style.top = (i.lane * 2.4 + 0.2) + 'rem';
            if (w < 5) b.classList.add('tl-bar--narrow');
            if (i.now) b.classList.add('tl-bar--now');
            b.title = i.title + ', ' + i.when;
            b.setAttribute('aria-label', i.title + ', ' + i.when);
            b.setAttribute('aria-pressed', 'false');
            b.addEventListener('click', function () { select(i); });
            buttons.push({ el: b, item: i });
            lanes.appendChild(b);
        });
        wrap.appendChild(lanes);
        inner.appendChild(wrap);
    });
    tl.appendChild(inner);
    body.insertBefore(tl, list);
    body.insertBefore(detail, list);

    // Timeline / List switch
    var sw = el('div', 'viewtoggle'); sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', 'Career view');
    var bT = el('button', '', 'Timeline'), bL = el('button', '', 'List');
    bT.type = bL.type = 'button';
    sw.appendChild(bT); sw.appendChild(bL); head.appendChild(sw);

    function view(v) {
        var tlv = v === 'timeline';
        tl.hidden = detail.hidden = !tlv;
        list.hidden = tlv;
        bT.setAttribute('aria-pressed', tlv); bL.setAttribute('aria-pressed', !tlv);
        if (tlv) tl.scrollLeft = tl.scrollWidth;              // on narrow screens, start at the present
    }
    bT.addEventListener('click', function () { view('timeline'); });
    bL.addEventListener('click', function () { view('list'); });

    select(items.filter(function (i) { return i.now; })[0] || items[0]);
    view(window.matchMedia('(max-width: 700px)').matches ? 'list' : 'timeline');
})();

/* ---------- Publications: search, filters, copy citation ---------- */
(function () {
    var ol = document.querySelector('.pubs');
    if (!ol) return;
    var items = [].slice.call(ol.children);
    items.forEach(function (li) { li._text = li.textContent.toLowerCase().replace(/\s+/g, ' '); });   // before buttons are added

    var TOPICS = { cratons: 'Cratons', convection: 'Mantle convection', rheology: 'Rheology', geology: 'Geology and geochemistry' };
    var state = { q: '', year: '', topic: '' };

    var yrs = items.map(function (li) { return li.dataset.year; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; }).sort().reverse();

    var tools = document.createElement('div');
    tools.className = 'pubtools';
    tools.innerHTML =
        '<div class="pubtools__row">' +
        '<label class="sr-only" for="pubq">Search publications</label>' +
        '<input id="pubq" type="search" placeholder="Search title, author, journal (press / to focus)" autocomplete="off">' +
        '<label class="sr-only" for="puby">Year</label>' +
        '<select id="puby"><option value="">All years</option>' + yrs.map(function (y) { return '<option>' + y + '</option>'; }).join('') + '</select>' +
        '</div>' +
        '<div class="pubtools__topics" role="group" aria-label="Filter by topic"></div>' +
        '<p class="pubtools__status"><span></span><button type="button" hidden>Clear filters</button></p>';
    ol.parentNode.insertBefore(tools, ol);

    var q = tools.querySelector('#pubq'), ySel = tools.querySelector('#puby');
    var topicWrap = tools.querySelector('.pubtools__topics');
    var status = tools.querySelector('.pubtools__status span'), clear = tools.querySelector('.pubtools__status button');

    Object.keys(TOPICS).forEach(function (k) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'chip'; b.textContent = TOPICS[k]; b.dataset.topic = k;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { state.topic = state.topic === k ? '' : k; apply(); });
        topicWrap.appendChild(b);
    });

    function apply() {
        var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
        items.forEach(function (li) {
            var ok = (!state.year || li.dataset.year === state.year) &&
                     (!state.topic || (' ' + li.dataset.topics + ' ').indexOf(' ' + state.topic + ' ') > -1) &&
                     terms.every(function (t) { return li._text.indexOf(t) > -1; });
            li.hidden = !ok;
            if (ok) shown++;
        });
        [].forEach.call(topicWrap.children, function (b) { b.setAttribute('aria-pressed', b.dataset.topic === state.topic ? 'true' : 'false'); });
        var filtered = state.q || state.year || state.topic;
        status.textContent = !filtered ? 'Showing all ' + items.length + ' publications'
            : shown ? 'Showing ' + shown + ' of ' + items.length + ' publications'
            : 'No publications match these filters.';
        clear.hidden = !filtered;
    }
    q.addEventListener('input', function () { state.q = q.value; apply(); });
    ySel.addEventListener('change', function () { state.year = ySel.value; apply(); });
    clear.addEventListener('click', function () { state.q = state.year = state.topic = ''; q.value = ''; ySel.value = ''; apply(); q.focus(); });
    apply();

    document.addEventListener('keydown', function (e) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
        e.preventDefault();
        q.focus();
        q.scrollIntoView({ block: 'center' });
    });
})();
