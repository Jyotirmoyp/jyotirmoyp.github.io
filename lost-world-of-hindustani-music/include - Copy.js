function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                        // Re-initialize navigation after content is loaded
                        initNavigation();
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

// Global function for navigation
function navigateAndToggle(menuId, url) {
    // Toggle the menu
    const menu = document.getElementById(menuId);
    if (menu && menu.classList.contains('submenu')) {
        const label = menu.previousElementSibling;
        menu.classList.toggle('expanded');
        label.classList.toggle('expanded');
    } else if (menu && menu.classList.contains('artist-menu')) {
        const label = menu.previousElementSibling;
        menu.classList.toggle('expanded');
        label.classList.toggle('expanded');
    }
    
    // Navigate to the URL if provided
    if (url) {
        window.location.href = url;
    }
}

function initNavigation() {
    // Add event listeners to all menu items
    const menuLabels = document.querySelectorAll('.menu-label');
    menuLabels.forEach(label => {
        // Remove existing onclick to avoid duplicates
        label.removeAttribute('onclick');
        label.addEventListener('click', function() {
            const menuId = this.nextElementSibling.id;
            const url = this.getAttribute('data-url');
            navigateAndToggle(menuId, url);
        });
    });
    
    const submenuItems = document.querySelectorAll('.submenu > li');
    submenuItems.forEach(item => {
        // Remove existing onclick to avoid duplicates
        item.removeAttribute('onclick');
        item.addEventListener('click', function() {
            const menuId = this.nextElementSibling.id;
            const url = this.getAttribute('data-url');
            navigateAndToggle(menuId, url);
        });
    });
    
    // Auto-expand current section based on URL
    const path = window.location.pathname;
    if (path.includes("Dhrupad")) {
        const dhrupadMenu = document.getElementById('dhrupad');
        if (dhrupadMenu) {
            const dhrupadLabel = dhrupadMenu.previousElementSibling;
            dhrupadMenu.classList.add('expanded');
            dhrupadLabel.classList.add('expanded');
            
            // If we're in a specific gharana, expand that too
            if (path.includes("Dagar")) {
                const dagarMenu = document.getElementById('dagar');
                if (dagarMenu) {
                    const dagarLabel = dagarMenu.previousElementSibling;
                    dagarMenu.classList.add('expanded');
                    if (dagarLabel) dagarLabel.classList.add('expanded');
                }
            }
        }
    }
}