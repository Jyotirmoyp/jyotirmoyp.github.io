function includeHTML(callback) {
    var z, i, elmnt, file, xhttp;
    z = document.querySelectorAll("[include-html]");
    if (z.length === 0) {
        if (callback) callback();
        return;
    }
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                        elmnt.removeAttribute("include-html");
                        includeHTML(callback);
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
    if (callback) callback();
}

function initNavigation() {
    // Main menu toggles (Dhrupad, Kheyal, etc.)
    document.querySelectorAll(".menu-label").forEach(label => {
        label.addEventListener("click", function (e) {
            e.stopPropagation();
            const submenu = label.nextElementSibling;
            if (submenu && submenu.classList.contains("submenu")) {
                submenu.classList.toggle("expanded");
            } else {
                // navigate if no submenu
                const url = label.getAttribute("data-url");
                if (url) window.location.href = url;
            }
        });
    });

    // Submenu items (Gharanas → Dagar, Nauhar, etc.)
    document.querySelectorAll(".submenu > li").forEach(item => {
        // Skip artist links
        if (item.querySelector("a")) return;

        // Add toggle symbol
        const toggle = document.createElement("span");
        toggle.classList.add("toggle");
        toggle.textContent = "+";
        item.appendChild(toggle);

        // Toggle expand/collapse
        item.addEventListener("click", function (e) {
            e.stopPropagation();
            const artistMenu = item.nextElementSibling;
            if (artistMenu && artistMenu.classList.contains("artist-menu")) {
                artistMenu.classList.toggle("expanded");
                toggle.textContent = artistMenu.classList.contains("expanded") ? "-" : "+";
            } else {
                // Navigate if no artist submenu
                const url = item.getAttribute("data-url");
                if (url) window.location.href = url;
            }
        });
    });

    // Auto-expand based on current URL
    const currentUrl = window.location.href;
    if (currentUrl.includes("Dhrupad")) {
        document.getElementById("dhrupad")?.classList.add("expanded");
    }
    if (currentUrl.includes("Dagar")) {
        document.getElementById("dagar")?.classList.add("expanded");
    }
}

// Initialize after includes are loaded
includeHTML(initNavigation);
