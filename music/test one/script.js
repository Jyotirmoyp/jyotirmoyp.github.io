document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    // Create main categories
    for (const [key, category] of Object.entries(musicData)) {
        const categoryBlock = createCategoryBlock(category.title, key);
        container.appendChild(categoryBlock);
    }
    
    // Add event listeners for all toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.parentElement.nextElementSibling;
            content.classList.toggle('open');
            this.textContent = content.classList.contains('open') ? '−' : '+';
        });
    });
});

function createCategoryBlock(title, dataKey) {
    const block = document.createElement('div');
    block.className = 'category-block';
    
    const header = document.createElement('div');
    header.className = 'category-header';
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    
    const toggleBtn = document.createElement('span');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.textContent = '+';
    
    header.appendChild(titleElement);
    header.appendChild(toggleBtn);
    
    const content = document.createElement('div');
    content.className = 'category-content';
    
    // Add subcategories based on data
    const subcategories = musicData[dataKey].gharanas || musicData[dataKey].categories;
    
    for (const [subKey, subcategory] of Object.entries(subcategories)) {
        const subcategoryElement = createSubcategoryBlock(subcategory.name, subcategory.artists);
        content.appendChild(subcategoryElement);
    }
    
    block.appendChild(header);
    block.appendChild(content);
    
    return block;
}

function createSubcategoryBlock(title, artistsData) {
    const subcategory = document.createElement('div');
    subcategory.className = 'subcategory';
    
    const header = document.createElement('h3');
    header.textContent = title;
    header.className = 'subcategory-header';
    header.style.cursor = 'pointer';
    
    const content = document.createElement('div');
    content.className = 'subcategory-content';
    content.style.display = 'none';
    
    // Add artists
    for (const [artistKey, artist] of Object.entries(artistsData)) {
        const artistElement = createArtistBlock(artist.name, artist.description, artist.youtubeLinks);
        content.appendChild(artistElement);
    }
    
    header.addEventListener('click', function() {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
    
    subcategory.appendChild(header);
    subcategory.appendChild(content);
    
    return subcategory;
}

function createArtistBlock(name, description, youtubeLinks) {
    const artist = document.createElement('div');
    artist.className = 'artist';
    
    const nameElement = document.createElement('h4');
    nameElement.textContent = name;
    nameElement.style.cursor = 'pointer';
    
    const info = document.createElement('div');
    info.className = 'artist-info';
    
    const desc = document.createElement('p');
    desc.textContent = description;
    
    const links = document.createElement('div');
    links.className = 'youtube-links';
    
    youtubeLinks.forEach(link => {
        const a = document.createElement('a');
        a.className = 'youtube-link';
        a.href = link.url;
        a.textContent = link.title;
        a.target = '_blank';
        links.appendChild(a);
    });
    
    info.appendChild(desc);
    info.appendChild(links);
    
    nameElement.addEventListener('click', function() {
        info.classList.toggle('open');
    });
    
    artist.appendChild(nameElement);
    artist.appendChild(info);
    
    return artist;
}