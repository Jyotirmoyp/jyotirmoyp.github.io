document.addEventListener('DOMContentLoaded', function() {
    // Enhanced database with raga information
    const database = {
        'Dhrupad': {
            description: 'The oldest form of Hindustani classical music, characterized by its spiritual nature and strict adherence to rhythmic cycles. Dhrupad typically consists of four sections: alap, jor, jhala, and composition in fixed rhythm.',
            gharana: {
                'Dagar Vani': {
                    description: 'The Dagar tradition emphasizes meditative alap using syllables "a re ne na" in nom-tom alap. Known for its deep, resonant vocal style and precise intonation.',
                    artists: {
                        'Ustad Mohiuddin Dagar': {
                            image: 'mohiuddin.jpg',
                            description: 'Senior exponent of Dagar Vani with a career spanning five decades. Known for his profound alap and mastery over rare ragas.',
                            recordings: [
                                {title: 'Raga Yaman - Live at Dover Lane (1987)', url: 'https://youtube.com/example1', raga: 'yaman'},
                                {title: 'Raga Bhairav - Morning Concert', url: 'https://youtube.com/example2', raga: 'bhairav'}
                            ]
                        },
                        'Nancy Lesh': {
                            image: 'nancy.jpg',
                            description: 'Western disciple who adapted Dhrupad to contemporary contexts while maintaining traditional purity.',
                            recordings: [
                                {title: 'Raga Malkauns - Workshop Demonstration', url: 'https://youtube.com/example3', raga: 'malkauns'}
                            ]
                        }
                    }
                },
                'Khandar Vani': {
                    description: 'Characterized by its distinctive rhythmic patterns and use of "ta na na" syllables in alap. Known for powerful voice projection.',
                    artists: {
                        'Ustad Rahim Fahimuddin Dagar': {
                            image: 'fahimuddin.jpg',
                            description: 'Representative of Khandar Vani with exceptional command over rhythm and laya.',
                            recordings: [
                                {title: 'Raga Darbari - Live Performance', url: 'https://youtube.com/example4', raga: 'darbari'}
                            ]
                        }
                    }
                }
            }
        },
        'Kheyal': {
            description: 'The dominant form of Hindustani classical music today, featuring elaborate ornamentation and improvisation. Kheyal allows more freedom than Dhrupad and focuses on emotional expression.',
            gharana: {
                'Agra': {
                    description: 'Known for powerful voice projection and clear articulation of lyrics. Emphasizes bol-taan and layakari.',
                    artists: {
                        'Ustad Faiyaz Khan': {
                            image: 'faiyaz.jpg',
                            description: 'The legendary founder of Agra gharana, known for his majestic voice and complex taan patterns.',
                            recordings: [
                                {title: 'Raga Multani - Rare Recording', url: 'https://youtube.com/example5', raga: 'multani'},
                                {title: 'Raga Yaman - Evening Concert', url: 'https://youtube.com/example7', raga: 'yaman'}
                            ]
                        }
                    }
                },
                'Jaipur': {
                    description: 'Characterized by complex taan patterns, intricate rhythmic play, and emphasis on rare ragas.',
                    artists: {
                        'Pt. Mallikarjun Mansur': {
                            image: 'mansur.jpg',
                            description: 'Master of Jaipur-Atrauli gharana with unparalleled command over rare ragas and intricate taans.',
                            recordings: [
                                {title: 'Raga Basanti Kedar - Live Concert', url: 'https://youtube.com/example6', raga: 'basanti kedar'}
                            ]
                        }
                    }
                }
            }
        }
    };

    // Toggle menu sections
    document.querySelectorAll('.menu-header').forEach(header => {
        header.addEventListener('click', function() {
            const section = this.parentElement;
            section.classList.toggle('expanded');
            
            if (section.classList.contains('expanded')) {
                const genreName = this.textContent.trim();
                showGenreContent(genreName);
            } else {
                showWelcome();
            }
        });
    });

    // Toggle gharana sections
    document.querySelectorAll('.subgenre-header').forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            const subgenreSection = this.parentElement;
            subgenreSection.classList.toggle('expanded');
            
            if (subgenreSection.classList.contains('expanded')) {
                const genreName = this.closest('.menu-section').querySelector('.menu-header').textContent.trim();
                const gharanaName = this.textContent.trim();
                showGharanaContent(genreName, gharanaName);
            } else {
                const genreName = this.closest('.menu-section').querySelector('.menu-header').textContent.trim();
                showGenreContent(genreName);
            }
        });
    });

    // Handle artist clicks
    document.querySelectorAll('.artist').forEach(artist => {
        artist.addEventListener('click', function(e) {
            e.stopPropagation();
            const artistName = this.textContent.trim();
            const gharanaHeader = this.closest('.artist-items').previousElementSibling;
            const gharanaName = gharanaHeader.textContent.trim();
            const genreName = gharanaHeader.closest('.menu-section').querySelector('.menu-header').textContent.trim();
            
            showArtistContent(genreName, gharanaName, artistName);
        });
    });

    // Function to process hashtags in descriptions
    function processHashtags(text) {
        return text.replace(/(Raga\s)(\w+)/gi, function(match, p1, p2) {
            return `${p1}<a href="#" class="raga-link" data-raga="${p2.toLowerCase()}">#${p2.toLowerCase()}</a>`;
        });
    }

    // Handle raga link clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('raga-link')) {
            e.preventDefault();
            const ragaName = e.target.getAttribute('data-raga');
            showRagaContent(ragaName);
        }
    });

    function showGenreContent(genreName) {
        const genreData = database[genreName];
        if (!genreData) return;
        
        document.querySelector('.content-area').innerHTML = `
            <h2>${genreName}</h2>
            <div class="genre-description">
                ${processHashtags(genreData.description)}
            </div>
            <p>Select a gharana from the menu to explore artists.</p>
        `;
    }

    function showGharanaContent(genreName, gharanaName) {
        const gharanaData = database[genreName]?.gharana[gharanaName];
        if (!gharanaData) return;
        
        document.querySelector('.content-area').innerHTML = `
            <h2>${genreName} • ${gharanaName}</h2>
            <div class="gharana-description">
                ${processHashtags(gharanaData.description)}
            </div>
            <p>Select an artist from the menu to view recordings.</p>
        `;
    }

    function showArtistContent(genreName, gharanaName, artistName) {
        const artistData = database[genreName]?.gharana[gharanaName]?.artists[artistName];
        if (!artistData) return;
        
        const recordingsHtml = artistData.recordings?.map(rec => `
            <div class="recording">
                <a class="youtube-link" href="${rec.url}" target="_blank">${rec.title.replace(/(Raga\s)(\w+)/gi, 
                    (match, p1, p2) => `${p1}<a href="#" class="raga-link" data-raga="${p2.toLowerCase()}">#${p2.toLowerCase()}</a>`)}
                </a>
            </div>
        `).join('') || '<p>No recordings available</p>';
        
        document.querySelector('.content-area').innerHTML = `
            <h2>${artistName}</h2>
            <h3>${gharanaName} ${genreName}</h3>
            <div class="artist-content">
                <div class="artist-image">
                    <img src="images/${artistData.image}" alt="${artistName}">
                </div>
                <div class="artist-info">
                    <p>${processHashtags(artistData.description)}</p>
                    <h4>Recordings</h4>
                    ${recordingsHtml}
                </div>
            </div>
        `;
    }

    function showRagaContent(ragaName) {
        // Collect all recordings for this raga
        const recordings = [];
        
        // Search through database for matching ragas
        for (const genreName in database) {
            for (const gharanaName in database[genreName].gharana) {
                for (const artistName in database[genreName].gharana[gharanaName].artists) {
                    const artist = database[genreName].gharana[gharanaName].artists[artistName];
                    artist.recordings?.forEach(rec => {
                        if (rec.raga === ragaName) {
                            recordings.push({
                                artist: artistName,
                                title: rec.title,
                                url: rec.url,
                                genre: genreName,
                                gharana: gharanaName
                            });
                        }
                    });
                }
            }
        }
        
        // Sort recordings alphabetically by artist name
        recordings.sort((a, b) => a.artist.localeCompare(b.artist));
        
        // Generate HTML
        const ragaDisplayName = ragaName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        const recordingsHtml = recordings.length > 0 ?
            recordings.map(rec => `
                <div class="recording">
                    <a class="youtube-link" href="${rec.url}" target="_blank">
                        ${ragaDisplayName} by ${rec.artist} (${rec.gharana} ${rec.genre})
                    </a>
                </div>
            `).join('') :
            '<p>No recordings found for this raga</p>';
        
        document.querySelector('.content-area').innerHTML = `
            <h2>Raga ${ragaDisplayName}</h2>
            <div class="raga-description">
                <p>All recordings of ${ragaDisplayName} in the archive:</p>
            </div>
            <div class="recordings-list">
                ${recordingsHtml}
            </div>
        `;
    }

    function showWelcome() {
        document.querySelector('.content-area').innerHTML = `
            <div class="welcome-message">
                <p>Select from the menu to explore recordings</p>
            </div>
        `;
    }
});