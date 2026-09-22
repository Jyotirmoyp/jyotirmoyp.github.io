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

/* Mantle-convection animation: engine lives in mantle.js so the Research and Outreach
   page banners can reuse it too. */
MantleFlow(document.getElementById('mantle'), document.querySelector('.flow-toggle'));

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
