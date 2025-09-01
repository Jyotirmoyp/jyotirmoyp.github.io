function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                        // After loading the navigation, initialize it
                        initNavigation();
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include-html");
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

function initNavigation() {
    // Function to navigate and toggle menu
    window.navigateAndToggle = function(menuId, url) {
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
    // Add similar logic for other sections
}