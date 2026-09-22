/* outreach.js: behaviour used only on the Outreach page. */

/* Page banner: same mantle-convection engine as the home and Research pages (see /js/mantle.js). */
MantleFlow(document.getElementById('mantle'), document.querySelector('.flow-toggle'));

/* Search across every numbered list on the page (Geoscience Education, EGU written/edited,
   Bengali writing, history writing): a title, venue or author match anywhere shows the item.
   Sections and their intro text stay visible throughout, so the page keeps its shape. */
(function () {
    var tools = document.getElementById('write-tools');
    var q = document.getElementById('owq');
    if (!tools || !q) return;

    var items = [].slice.call(document.querySelectorAll('main .pubs > li'));
    if (!items.length) return;
    items.forEach(function (li) { li._text = li.textContent.toLowerCase().replace(/\s+/g, ' '); });

    var status = tools.querySelector('.pubtools__status span');
    var clear = tools.querySelector('.pubtools__status button');

    function apply() {
        var terms = q.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
        items.forEach(function (li) {
            var ok = terms.every(function (t) { return li._text.indexOf(t) > -1; });
            li.hidden = !ok;
            if (ok) shown++;
        });
        status.textContent = !terms.length ? shown + ' pieces of writing, across every section below'
            : shown ? 'Showing ' + shown + ' of ' + items.length
            : 'Nothing matches that search.';
        clear.hidden = !terms.length;
    }
    q.addEventListener('input', apply);
    clear.addEventListener('click', function () { q.value = ''; apply(); q.focus(); });
    apply();

    document.addEventListener('keydown', function (e) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
        e.preventDefault();
        q.focus();
        q.scrollIntoView({ block: 'center' });
    });
})();
