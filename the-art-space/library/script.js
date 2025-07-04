document.addEventListener('DOMContentLoaded', function() {
    const bookItems = document.querySelectorAll('.book-item');
    
    bookItems.forEach(item => {
        item.addEventListener('click', function() {
            // This would update the book display area with the selected book's data
            // In a real implementation, you might fetch this from a database or JSON file
            console.log('Book selected:', this.textContent.trim());
            
            // Update the display area
            // document.querySelector('.book-title').textContent = "New Title";
            // document.querySelector('.book-author').textContent = "by New Author";
            // etc.
        });
    });
    
    // Similar for genre filtering if desired
});