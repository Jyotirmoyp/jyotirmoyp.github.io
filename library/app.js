// ============================================================
// app.js — Library app logic
// Reads book data from the global `books` array defined in data.js.
// Book data lives in data.js — this file only handles rendering,
// filtering, and URL routing.
// ============================================================

// ---------- Slug / URL helpers ----------

// Turn a title into a URL-friendly slug, keeping non-Latin scripts intact
// (e.g. Bengali) by matching on unicode letters/numbers rather than \w.
function slugify(text) {
    return (text || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '');
}

// Assign a stable, unique slug to every book (based on shortTitle/title),
// falling back to the book's id if the title produces an empty slug.
function assignBookSlugs() {
    const usedSlugs = new Set();
    books.forEach(book => {
        const base = slugify(book.shortTitle || book.title) || `book-${book.id}`;
        let slug = base;
        let counter = 2;
        while (usedSlugs.has(slug)) {
            slug = `${base}-${counter++}`;
        }
        usedSlugs.add(slug);
        book.slug = slug;
    });
}

// Update the address bar to reflect the given book, without reloading
// the page or polluting browser history more than necessary.
function setHashForBook(book) {
    if (!book || !book.slug) return;
    const newHash = '#' + book.slug;
    if (window.location.hash !== newHash) {
        history.pushState({ slug: book.slug }, '', newHash);
    }
}

// Remove any book hash from the URL (used when switching to a list view).
function clearHash() {
    if (window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
    }
}

function getBookBySlug(slug) {
    return books.find(b => b.slug === slug);
}

// React to the URL hash changing, whether from browser back/forward
// (popstate) or the user editing the hash directly (hashchange).
function handleLocationChange() {
    const slug = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!slug) return;
    const book = getBookBySlug(slug);
    if (book) {
        selectBook(book, { pushHash: false });
    }
}

window.addEventListener('popstate', handleLocationChange);
window.addEventListener('hashchange', handleLocationChange);

// ---------- Selection / highlighting ----------

// Central entry point for "show this book". Renders the book, switches
// to book view, highlights it in the sidebar, and updates the URL hash.
function selectBook(book, { pushHash = true } = {}) {
    if (!book) return;
    displayBook(book);
    showBookView();
    highlightActiveBook(book);
    if (pushHash) {
        setHashForBook(book);
    }
}

function highlightActiveBook(book) {
    document.querySelectorAll('.book-item').forEach(item => {
        item.classList.remove('active-book');
    });
    if (!book) return;
    const activeLink = document.querySelector(`.book-list .book-link[data-slug="${CSS.escape(book.slug)}"]`);
    if (activeLink) {
        const li = activeLink.closest('.book-item');
        if (li) li.classList.add('active-book');
    }
}

// ---------- Initialization ----------

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Add unique IDs to books if they don't have them
    books.forEach((book, index) => {
        if (!book.id) {
            book.id = index + 1;
        }
    });

    // Assign unique, URL-friendly slugs used for the "#short-name" hash
    assignBookSlugs();

    // Sort books alphabetically by title
    books.sort((a, b) => a.title.localeCompare(b.title));

    // Get all unique genres from all books
    const allGenres = [...new Set(books.flatMap(book => book.genres))];
    allGenres.sort();

    // Populate genre list
    const genreList = document.getElementById('genreList');
    allGenres.forEach(genre => {
        const li = document.createElement('li');
        li.className = 'genre-item';
        li.textContent = genre;

        li.addEventListener('click', () => {
            filterByGenre(genre);
            // Highlight active genre
            document.querySelectorAll('.genre-item').forEach(item => {
                item.classList.remove('active-genre');
            });
            li.classList.add('active-genre');
        });

        genreList.appendChild(li);
    });

    // Initial population of book list (show all books)
    updateBookList(books);

    // If the URL already points at a specific book (e.g. a shared link
    // or a page refresh), show that book. Otherwise fall back to the
    // book marked isHome (or the first book).
    const slugFromUrl = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    const bookFromUrl = slugFromUrl ? getBookBySlug(slugFromUrl) : null;
    const homeBook = bookFromUrl || books.find(book => book.isHome) || books[0];

    if (homeBook) {
        selectBook(homeBook, { pushHash: false });
    }
});

// ---------- Filtering ----------

function filterByGenre(genre) {
    // Filter books that include this genre
    const filteredBooks = books.filter(book =>
        book.genres.includes(genre)
    );

    // Update book list to show only books in this genre
    updateBookList(filteredBooks);

    // Display the first book in this genre
    if (filteredBooks.length > 0) {
        selectBook(filteredBooks[0]);
        // Update header with first book's full title
        document.getElementById('bookTitleHeader').textContent = filteredBooks[0].title;
    } else {
        document.getElementById('bookTitleHeader').textContent = "No Books Found";
        clearHash();
    }

    // Show normal book view
    showBookView();
}

function filterByAuthor(author) {
    // Filter books by this author
    const filteredBooks = books.filter(book =>
        book.author.includes(author)
    );

    // Show author's books in status list view
    showAuthorBooks(author, filteredBooks);
}

function showAuthorBooks(author, booksByAuthor) {
    // Update header
    document.getElementById('bookTitleHeader').textContent = `Books by ${author}`;

    // Show status list view (not a single book, so clear any book hash)
    showStatusListView();
    clearHash();

    // Populate author's books list
    const statusListContainer = document.getElementById('statusListContainer');
    statusListContainer.innerHTML = `
        <div class="status-list-header">
            <div>Title</div>
            <div>Status</div>
            <div>Genres</div>
            <div>Rating</div>
        </div>
        <ul class="status-list" id="statusList">
            ${booksByAuthor.map(book => `
                <li class="status-list-item" data-slug="${book.slug}">
                    <div><a href="#" class="book-link" data-slug="${book.slug}">${book.shortTitle || book.title}</a></div>
                    <div>
                        <span class="status-tag ${book.status}" data-status="${book.status}">
                            ${book.status === 'read' ? 'Read' :
                             book.status === 'currently-reading' ? `Reading (${book.progress}%)` :
                             'About to Read'}
                        </span>
                    </div>
                    <div class="status-list-genres">
                        ${book.genres.map(genre => `
                            <a href="#" class="genre-tag" data-genre="${genre}">${genre}</a>
                        `).join(', ')}
                    </div>
                    <div class="status-list-rating">
                        ${renderStars(book.rating, true)}
                    </div>
                </li>
            `).join('')}
        </ul>
    `;

    // Add click handlers to book links
    statusListContainer.querySelectorAll('.book-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const book = getBookBySlug(this.getAttribute('data-slug'));
            if (book) {
                selectBook(book);
            }
        });
    });

    // Add click handlers to status tags in author list
    statusListContainer.querySelectorAll('.status-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const status = this.getAttribute('data-status');
            showStatusList(status, `List of ${status === 'read' ? 'Read' :
                                   status === 'currently-reading' ? 'Currently Reading' :
                                   'About to Read'} Books`);
        });
    });

    // Add click handlers to genre tags in author list
    statusListContainer.querySelectorAll('.genre-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const genre = this.getAttribute('data-genre');

            // Find the first book with this genre
            const firstBookInGenre = books.find(book =>
                book.genres.includes(genre)
            );

            if (firstBookInGenre) {
                // Filter by genre and show first book
                filterByGenre(genre);

                // Highlight the genre in sidebar
                document.querySelectorAll('.genre-item').forEach(item => {
                    item.classList.remove('active-genre');
                    if (item.textContent === genre) {
                        item.classList.add('active-genre');
                    }
                });
            }
        });
    });
}

// Show book view (hides status list)
function showBookView() {
    document.getElementById('bookCoverContainer').classList.remove('hide');
    document.getElementById('bookDescriptionContainer').classList.remove('hide');
    document.getElementById('statusListContainer').classList.add('hide');
}

// Show status list view (hides book details)
function showStatusListView() {
    document.getElementById('bookCoverContainer').classList.add('hide');
    document.getElementById('bookDescriptionContainer').classList.add('hide');
    document.getElementById('statusListContainer').classList.remove('hide');
}

// Show status list in description box
function showStatusList(status, title) {
    const filteredBooks = books.filter(book => book.status === status);

    // Update header with status title
    document.getElementById('bookTitleHeader').textContent = title;

    // Show status list view (not a single book, so clear any book hash)
    showStatusListView();
    clearHash();

    // Populate status list
    const statusListContainer = document.getElementById('statusListContainer');
    statusListContainer.innerHTML = `
        <div class="status-list-header">
            <div>Title</div>
            <div>Author</div>
            <div>Genres</div>
            <div>Rating</div>
        </div>
        <ul class="status-list" id="statusList">
            ${filteredBooks.map(book => `
                <li class="status-list-item" data-slug="${book.slug}">
                    <div><a href="#" class="book-link" data-slug="${book.slug}">${book.shortTitle || book.title}</a></div>
                    <div class="authors-list">
                        ${book.author.split(',').map(author => `
                            <a href="#" class="author-tag" data-author="${author.trim()}">${author.trim()}</a>
                        `).join('')}
                    </div>
                    <div class="status-list-genres">
                        ${book.genres.map(genre => `
                            <a href="#" class="genre-tag" data-genre="${genre}">${genre}</a>
                        `).join(', ')}
                    </div>
                    <div class="status-list-rating">
                        ${renderStars(book.rating, true)}
                    </div>
                </li>
            `).join('')}
        </ul>
    `;

    // Add click handlers to book links
    statusListContainer.querySelectorAll('.book-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const book = getBookBySlug(this.getAttribute('data-slug'));
            if (book) {
                selectBook(book);
            }
        });
    });

    // Add click handlers to genre tags in status list
    statusListContainer.querySelectorAll('.genre-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const genre = this.getAttribute('data-genre');

            // Find the first book with this genre
            const firstBookInGenre = books.find(book =>
                book.genres.includes(genre)
            );

            if (firstBookInGenre) {
                // Filter by genre and show first book
                filterByGenre(genre);

                // Highlight the genre in sidebar
                document.querySelectorAll('.genre-item').forEach(item => {
                    item.classList.remove('active-genre');
                    if (item.textContent === genre) {
                        item.classList.add('active-genre');
                    }
                });
            }
        });
    });

    // Add click handlers to author tags in status list
    statusListContainer.querySelectorAll('.author-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const author = this.getAttribute('data-author');
            filterByAuthor(author);
        });
    });
}

// Update book list display with alphabet indicators
function updateBookList(booksToShow) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    let lastInitial = '';

    const sortedBooks = [...booksToShow].sort((a, b) => a.title.localeCompare(b.title));

    sortedBooks.forEach(book => {
        const currentInitial = book.title.charAt(0).toUpperCase();
        const li = document.createElement('li');
        li.className = 'book-item';

        const span = document.createElement('span');
        span.className = 'alphabet-index';
        span.textContent = currentInitial;
        if (currentInitial === lastInitial) {
            span.style.visibility = 'hidden';
        } else {
            lastInitial = currentInitial;
        }

        const titleSpan = document.createElement('a');
        titleSpan.href = '#';
        titleSpan.className = 'book-link';
        titleSpan.setAttribute('data-slug', book.slug);
        titleSpan.textContent = book.shortTitle || book.title;
        titleSpan.addEventListener('click', (e) => {
            e.preventDefault();
            selectBook(book);
        });

        li.appendChild(span);
        li.appendChild(titleSpan);
        bookList.appendChild(li);
    });
}

// Function to render star ratings
function renderStars(rating, small = false) {
    if (rating === 0) return 'Not rated';

    const fullStars = Math.floor(rating);
    const partialStar = rating - fullStars;
    const emptyStars = 5 - Math.ceil(rating);

    const containerClass = small ? 'small-stars-container' : 'stars-container';
    const filledClass = small ? 'small-stars-filled' : 'stars-filled';

    // Calculate width for partial star (percentage)
    const partialWidth = partialStar * 100;

    return `
        <div class="${containerClass}">
            ${'★'.repeat(5)}
            <div class="${filledClass}" style="width: ${(fullStars + partialStar) * 20}%">
                ${'★'.repeat(fullStars)}
                ${partialStar > 0 ? `<span style="width: ${partialWidth}%">★</span>` : ''}
            </div>
        </div>
        <span>${rating.toFixed(1)}</span>
    `;
}

// Display the selected book
function displayBook(book) {
    document.getElementById('bookCover').src = book.cover;
    document.getElementById('bookCover').alt = book.title;
    document.getElementById('bookTitleHeader').textContent = book.title;

    // Display author(s) as clickable tag(s)
    const authorContainer = document.getElementById('bookAuthor');
    authorContainer.innerHTML = '';
    authorContainer.className = 'book-authors';

    // Split authors by comma and trim whitespace
    const authors = book.author.split(',').map(a => a.trim());
    authors.forEach(author => {
        const authorTag = document.createElement('a');
        authorTag.className = 'author-tag';
        authorTag.href = '#';
        authorTag.textContent = author;
        authorTag.addEventListener('click', (e) => {
            e.preventDefault();
            filterByAuthor(author);
        });
        authorContainer.appendChild(authorTag);
    });

    // Display genre tags
    const genresContainer = document.getElementById('bookGenres');
    genresContainer.innerHTML = '';
    book.genres.forEach(genre => {
        const tag = document.createElement('a');
        tag.className = 'genre-tag';
        tag.href = '#';
        tag.textContent = genre;
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            filterByGenre(genre);
            document.querySelectorAll('.genre-item').forEach(item => {
                item.classList.remove('active-genre');
                if (item.textContent === genre) {
                    item.classList.add('active-genre');
                }
            });
        });
        genresContainer.appendChild(tag);
    });

    // Display rating
    const ratingContainer = document.getElementById('bookRating');
    ratingContainer.innerHTML = '';
    if (book.rating > 0) {
        ratingContainer.innerHTML = `
            <span style="margin-right: 0.5rem;">Rating:</span>
            ${renderStars(book.rating)}
        `;
    } else {
        ratingContainer.innerHTML = '<span>Not rated yet</span>';
    }

    document.getElementById('bookDescription').innerHTML = `<p>${book.description}</p>`;
    document.getElementById('bookPublisher').textContent = `Publisher: ${book.publisher}`;

    // Display reading status
    const statusContainer = document.getElementById('readingStatus');
    statusContainer.innerHTML = '';

    const statusTag = document.createElement('div');
    statusTag.className = `status-tag ${book.status}`;

    let statusText = '';
    let statusTitle = '';
    switch(book.status) {
        case 'read':
            statusText = 'Read';
            statusTitle = 'List of Read Books';
            break;
        case 'currently-reading':
            statusText = `Currently Reading (${book.progress}%)`;
            statusTitle = 'List of Currently Reading Books';
            break;
        case 'about-to-read':
            statusText = 'About to Read';
            statusTitle = 'List of About to Read Books';
            break;
    }

    statusTag.textContent = statusText;
    statusTag.addEventListener('click', (e) => {
        e.stopPropagation();
        showStatusList(book.status, statusTitle);
    });

    statusContainer.appendChild(statusTag);

    // Add progress bar
    if (book.status === 'currently-reading' || book.status === 'read') {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';

        const progressInfo = document.createElement('div');
        progressInfo.className = 'progress-info';
        progressInfo.innerHTML = `<span>Progress</span><span>${book.progress}%</span>`;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.style.width = `${book.progress}%`;

        progressBar.appendChild(progress);
        progressContainer.appendChild(progressInfo);
        progressContainer.appendChild(progressBar);
        statusContainer.appendChild(progressContainer);
    }
}
