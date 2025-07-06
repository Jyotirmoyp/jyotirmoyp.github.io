document.addEventListener('DOMContentLoaded', function() {
    // Build the hierarchical menu
    buildMenu();
    
    // Show welcome content
    showWelcomeContent();
});

function buildMenu() {
    const mainMenu = document.getElementById('main-menu');
    
    // Create Styles level
    musicData.styles.forEach(style => {
        const styleItem = document.createElement('li');
        styleItem.className = 'menu-item';
        
        const styleHeader = document.createElement('div');
        styleHeader.className = 'menu-header';
        styleHeader.textContent = style.name;
        styleHeader.setAttribute('data-type', 'style');
        styleHeader.setAttribute('data-id', style.id);
        
        const styleSubmenu = document.createElement('ul');
        styleSubmenu.className = 'submenu';
        
        // Create Gharanas for this style
        style.gharanas.forEach(gharanaId => {
            const gharana = musicData.gharanas.find(g => g.id === gharanaId);
            if (!gharana) return;
            
            const gharanaItem = document.createElement('li');
            gharanaItem.className = 'menu-item';
            
            const gharanaHeader = document.createElement('div');
            gharanaHeader.className = 'menu-header';
            gharanaHeader.textContent = gharana.name;
            gharanaHeader.setAttribute('data-type', 'gharana');
            gharanaHeader.setAttribute('data-id', gharana.id);
            
            const gharanaSubmenu = document.createElement('ul');
            gharanaSubmenu.className = 'submenu';
            
            // Create Artists for this gharana
            gharana.artists.forEach(artistId => {
                const artist = musicData.artists.find(a => a.id === artistId);
                if (!artist) return;
                
                const artistItem = document.createElement('li');
                artistItem.textContent = artist.name;
                artistItem.setAttribute('data-type', 'artist');
                artistItem.setAttribute('data-id', artist.id);
                artistItem.addEventListener('click', function() {
                    showArtistContent(artist.id);
                });
                
                gharanaSubmenu.appendChild(artistItem);
            });
            
            gharanaHeader.addEventListener('click', function() {
                this.classList.toggle('expanded');
                gharanaSubmenu.style.display = gharanaSubmenu.style.display === 'block' ? 'none' : 'block';
                showGharanaContent(gharana.id);
            });
            
            gharanaItem.appendChild(gharanaHeader);
            gharanaItem.appendChild(gharanaSubmenu);
            styleSubmenu.appendChild(gharanaItem);
        });
        
        styleHeader.addEventListener('click', function() {
            this.classList.toggle('expanded');
            styleSubmenu.style.display = styleSubmenu.style.display === 'block' ? 'none' : 'block';
            showStyleContent(style.id);
        });
        
        styleItem.appendChild(styleHeader);
        styleItem.appendChild(styleSubmenu);
        mainMenu.appendChild(styleItem);
    });
    
    // Add click handlers for menu headers
    document.querySelectorAll('.menu-header').forEach(header => {
        header.addEventListener('click', function(e) {
            if (e.target !== this) return; // Prevent bubbling
            
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                this.classList.toggle('expanded');
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
            
            const type = this.getAttribute('data-type');
            const id = this.getAttribute('data-id');
            
            if (type === 'style') {
                showStyleContent(id);
            } else if (type === 'gharana') {
                showGharanaContent(id);
            }
        });
    });
}

function showWelcomeContent() {
    document.getElementById('info-title').textContent = 'Welcome to Lost World of Hindustani Music';
    document.getElementById('info-description').innerHTML = `
        <p>Explore the rich heritage of Hindustani classical music through its styles, gharanas, and legendary artists.</p>
        <p>Select a category from the navigation menu to begin your journey.</p>
    `;
    document.getElementById('info-image').style.display = 'none';
    document.getElementById('info-links').innerHTML = '';
}

function showStyleContent(styleId) {
    const style = musicData.styles.find(s => s.id === styleId);
    if (!style) return;
    
    document.getElementById('info-title').textContent = style.name;
    
    let description = `<p>${style.description}</p>`;
    if (style.history) {
        description += `<h3>History</h3><p>${style.history}</p>`;
    }
    if (style.characteristics) {
        description += `<h3>Characteristics</h3><p>${style.characteristics}</p>`;
    }
    
    document.getElementById('info-description').innerHTML = description;
    
    const imageElement = document.getElementById('info-image');
    if (style.image) {
        imageElement.src = style.image;
        imageElement.alt = style.name;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }
    
    const linksContainer = document.getElementById('info-links');
    linksContainer.innerHTML = '';
    if (style.links) {
        style.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.title;
            a.target = '_blank';
            linksContainer.appendChild(a);
        });
    }
}

function showGharanaContent(gharanaId) {
    const gharana = musicData.gharanas.find(g => g.id === gharanaId);
    if (!gharana) return;
    
    document.getElementById('info-title').textContent = gharana.name;
    
    let description = `<p>${gharana.description}</p>`;
    if (gharana.founder) {
        description += `<p><strong>Founder:</strong> ${gharana.founder}</p>`;
    }
    if (gharana.origin) {
        description += `<p><strong>Origin:</strong> ${gharana.origin}</p>`;
    }
    if (gharana.characteristics) {
        description += `<h3>Characteristics</h3><p>${gharana.characteristics}</p>`;
    }
    
    document.getElementById('info-description').innerHTML = description;
    
    const imageElement = document.getElementById('info-image');
    if (gharana.image) {
        imageElement.src = gharana.image;
        imageElement.alt = gharana.name;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }
    
    const linksContainer = document.getElementById('info-links');
    linksContainer.innerHTML = '';
    if (gharana.links) {
        gharana.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.title;
            a.target = '_blank';
            linksContainer.appendChild(a);
        });
    }
}

function showArtistContent(artistId) {
    const artist = musicData.artists.find(a => a.id === artistId);
    if (!artist) return;
    
    document.getElementById('info-title').textContent = artist.name;
    
    let description = `<p>${artist.description}</p>`;
    if (artist.birth) {
        description += `<p><strong>Born:</strong> ${artist.birth}</p>`;
    }
    if (artist.death) {
        description += `<p><strong>Died:</strong> ${artist.death}</p>`;
    }
    if (artist.contribution) {
        description += `<h3>Contributions</h3><p>${artist.contribution}</p>`;
    }
    
    document.getElementById('info-description').innerHTML = description;
    
    const imageElement = document.getElementById('info-image');
    if (artist.image) {
        imageElement.src = artist.image;
        imageElement.alt = artist.name;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }
    
    const linksContainer = document.getElementById('info-links');
    linksContainer.innerHTML = '';
    if (artist.links) {
        artist.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.title;
            a.target = '_blank';
            linksContainer.appendChild(a);
        });
    }
}