/* mantle.js: the mantle-convection canvas animation used in every page banner.
   Tracers are advected through a stream function made of two convection-roll harmonics
   plus a localised plume under the cursor. Each tracer carries a temperature that relaxes
   toward hot at the base and cold at the surface, so rising material stays warm and sinking
   material stays cool. Colour = tracer temperature.

   Usage: MantleFlow(canvasEl, toggleButtonEl) — call once per canvas. The canvas's parent
   element is used as the stage (its size drives the animation, and hover/pointer events on it
   add a plume). toggleButtonEl is optional; pass null to skip the pause/play control. */
(function () {
    function MantleFlow(canvas, toggle) {
        if (!canvas || !canvas.getContext) return;

        var ctx = canvas.getContext('2d');
        var stage = canvas.parentNode;
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

        if (toggle) {
            var label = function () {
                var text = userPaused ? 'Play animation' : 'Pause animation';
                toggle.setAttribute('aria-label', text);
                toggle.title = text;
                toggle.dataset.paused = userPaused;
            };
            toggle.addEventListener('click', function () { userPaused = !userPaused; label(); update(); });
            label();
        }

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
    }

    window.MantleFlow = MantleFlow;
})();
