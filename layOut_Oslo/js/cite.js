/* cite.js: adds a "Copy citation" button to every publication in a .pubs list.
   Works on any page that uses the shared publication markup (see site.css). */
(function () {
    var items = [].slice.call(document.querySelectorAll('.pubs > li'));
    if (!items.length) return;

    var live = document.getElementById('live');
    if (!live) {                                   // status region for screen readers
        live = document.createElement('div');
        live.id = 'live'; live.className = 'sr-only';
        live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
        document.body.appendChild(live);
    }

    function citation(li) {
        var cite = li.querySelector('.pub__cite').textContent.trim();
        var i = cite.indexOf('). ');
        var title = li.querySelector('.pub__title').textContent.trim();
        var doi = [].filter.call(li.querySelectorAll('a.chip'), function (a) { return a.textContent.trim() === 'DOI'; })[0];
        return cite.slice(0, i + 2) + ' ' + (/[?!.]$/.test(title) ? title : title + '.') + ' ' + cite.slice(i + 3) + (doi ? ' ' + doi.href : '');
    }
    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        return new Promise(function (res, rej) {
            var ta = document.createElement('textarea');
            ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy') ? res() : rej(); } catch (err) { rej(err); }
            document.body.removeChild(ta);
        });
    }

    items.forEach(function (li) {
        var links = li.querySelector('.pub__links');
        if (!links) {                              // papers without DOI/links still get a row for the button
            links = document.createElement('p');
            links.className = 'pub__links';
            li.appendChild(links);
        }
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'chip'; b.textContent = 'Copy citation';
        b.addEventListener('click', function () {
            copy(citation(li)).then(function () {
                b.textContent = 'Copied'; live.textContent = 'Citation copied to clipboard';
            }, function () {
                b.textContent = 'Copy failed'; live.textContent = 'Could not copy the citation';
            });
            setTimeout(function () { b.textContent = 'Copy citation'; live.textContent = ''; }, 1800);
        });
        links.appendChild(b);
    });
})();
