const favoriteMoviesCards = document.querySelector('.favorite-movies-cards');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Əgər token və ya userId yoxdursa, login səhifəsinə yönləndir
if (!token || !userId) {
    window.location.href = '../login/login.html';
}

// User-in bütün favorite movies-larını API-dən çək
async function getFavoriteMovies() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

// Favorite movies-ları göstər
async function displayFavoriteMovies() {
    const favorites = await getFavoriteMovies();
    const favMovies=favorites.data;
    console.log('Favorites:', favorites);
    
    // Container-i təmizlə
    favoriteMoviesCards.innerHTML = '';
    
    // Əgər favorite yoxdursa
    if (!favorites || !favorites.data || favorites.data.length === 0) {
        favoriteMoviesCards.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 100px 0;">
                <p style="color: #999; font-size: 20px;">Hələ ki favorite filminiz yoxdur.</p>
                <a href="../home/home.html" style="color: #9B51E0; text-decoration: none; font-size: 18px; margin-top: 20px; display: inline-block;">Filmləri kəşf edin</a>
            </div>
        `;
        return;
    }
    
    // Hər favorite movie üçün card yarat
    favMovies.forEach(favorite => {
        const movie = favorite;
        const rating = (movie.imdb / 2).toFixed(1);
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fa fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fa fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="fa fa-star-o"></i>';
        }
        
        favoriteMoviesCards.innerHTML += `
            <div class="favorite-movie-card" data-movie-id="${movie.id}">
                <img src="${movie.cover_url}" alt="${movie.title}">
                <h3 class="movie-category-name">${movie.category.name}</h3>
                <div class="rating-stars">
                    ${starsHTML}
                </div>
                <h1 class="movie-title">${movie.title}</h1>
            </div>
        `;
    });
    
    // Hər card-a click event əlavə et
    document.querySelectorAll('.favorite-movie-card').forEach(card => {
        card.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            localStorage.setItem('selectedMovieId', movieId);
            window.location.href = '../../../pages/client/detailed/detailed.html';
        });
    });
}

// Səhifə yüklənəndə favorite movies-ları göstər
displayFavoriteMovies();
