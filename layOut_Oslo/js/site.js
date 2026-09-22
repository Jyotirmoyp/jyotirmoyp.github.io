/* site.js: shared by every page.
   - Loads the navigation into <header id="site-nav" include-html="...">
     (use "nav.html" on the home page and "/nav.html" from pages in sub-folders)
   - Fills the current year in the footer (<span id="year">) */

// Load the shared navigation, then mark the link for the current page.
(function () {
    var host = document.querySelector('[include-html]');
    if (!host) return;

    function clean(url) {
        var a = document.createElement('a');
        a.href = url;
        return (a.origin + a.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    }

    fetch(host.getAttribute('include-html'))
        .then(function (r) { if (!r.ok) throw new Error('nav not found'); return r.text(); })
        .then(function (html) {
            host.innerHTML = html;
            var here = clean(location.href);
            host.querySelectorAll('a[href]').forEach(function (a) {
                if (clean(a.href) === here) a.setAttribute('aria-current', 'page');
            });
        })
        .catch(function () {
            host.innerHTML = '<a href="https://jyotirmoyp.github.io" style="display:block;padding:1rem 2rem;font:600 1rem system-ui,sans-serif">Jyotirmoy Paul</a>';
        });
})();

var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
