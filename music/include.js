function includeHTML() {
  const elements = document.querySelectorAll('[include-html]');
  elements.forEach(el => {
    const file = el.getAttribute('include-html');
    fetch(file)
      .then(resp => resp.text())
      .then(data => {
        el.innerHTML = data;
        initNavigation();
      });
  });
}

function initNavigation() {

  // TEXT → NAVIGATION
  document.querySelectorAll('.menu-text').forEach(text => {
    text.onclick = e => {
      e.stopPropagation();
      const url = text.dataset.url;
      if (url) window.location.href = url;
    };
  });

  // + / − TOGGLE ONLY
  document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.onclick = e => {
      e.stopPropagation();
      const target = document.getElementById(toggle.dataset.target);
      if (!target) return;

      const expanded = target.classList.toggle('expanded');
      toggle.textContent = expanded ? '−' : '+';
    };
  });

}
