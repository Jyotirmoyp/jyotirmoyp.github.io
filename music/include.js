function includeHTML() {
  document.querySelectorAll('[include-html]').forEach(el => {
    fetch(el.getAttribute('include-html'))
      .then(r => r.text())
      .then(data => {
        el.innerHTML = data;
        initNavigation();
      });
  });
}

function initNavigation() {

  // TEXT → NAVIGATE
  document.querySelectorAll('.menu-text').forEach(text => {
    text.onclick = e => {
      e.stopPropagation();
      window.location.href = text.dataset.url;
    };
  });

  // + / − → TOGGLE ONLY
  document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.onclick = e => {
      e.stopPropagation();
      const target = document.getElementById(toggle.dataset.target);
      if (!target) return;
      const open = target.classList.toggle('expanded');
      toggle.textContent = open ? '−' : '+';
    };
  });

}
