const searchMoviesCards = document.querySelector('.search-movies-cards');
const searchInput = document.querySelector('#search-input');
const searchMoviesSection = document.querySelector('.search-movies-section');
const noResultMessage = document.getElementById('no-result-message');
const addSearchIcon = document.querySelector('.add-search-icon');

//Token
const token = localStorage.getItem('token');


//API Calls
async function getMovies(){
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/categories`;
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
        console.log('Error fetching movies:', error);
    }
}

//----------------------------------------------------------------------------------------------
async function displayAllMovies(){
    try {
        const movies = await getMovies();
        console.log('API Response:', movies); // Debug log
        
        if(movies && movies.data && movies.data.length > 0){
            // Bütün kategoriyalardakı filmləri bir massivə yığaq
            const allMovies = movies.data.flatMap(category => 
                category.movies.map(movie => ({
                    ...movie,
                    categoryName: category.name
                }))
            );


            if(allMovies && allMovies.length > 0){
                searchMoviesCards.innerHTML = allMovies.map(movie => `
                        <div class="search-movie-card1" data-movie-id="${movie.id}" style="cursor: pointer;">
                      <div class="overlay-movies"></div>
                      <img src="${movie.cover_url}" alt="">
                      <div class=movie-content>
                    <h3 class="movie-category-name">${movie.category.name}</h3>
                    <div class="rating-stars">
                    ${generateStars(movie.imdb / 2 || 0)}
                    </div>
                    <h1 class="movie-title">${movie.title}</h1>
                    </div>
                   </div> `).join('');
                
                // Hər card-a click event əlavə et
                addClickEventsToCards();
            }
        }
       
    } catch (error) {
        console.error('Error in displayAllMovies:', error);
        searchMoviesCards.innerHTML = '<p style="color: red; text-align: center;">Error loading movies: ' + error.message + '</p>';
    }
}

function generateStars(rating) {
    if (!rating) return '<i class="fa fa-star-o"></i>'.repeat(5);
  
    const maxRating = rating > 5 ? rating / 2 : rating;
    const fullStars = Math.floor(maxRating);
    const halfStar = maxRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fa fa-star"></i>';
    if (halfStar) starsHTML += '<i class="fa fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="fa fa-star-o"></i>';
  
    return starsHTML;
}

// Movie card-lara click event əlavə et
function addClickEventsToCards() {
    const movieCards = document.querySelectorAll('.search-movie-card1');
    movieCards.forEach(card => {
        card.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            if(movieId) {
                localStorage.setItem('selectedMovieId', movieId);
                window.location.href = '../../../pages/client/detailed/detailed.html';
            }
        });
    });
}

displayAllMovies();


//EVENTS
addSearchIcon.addEventListener('click', () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    const searchMovies = document.querySelectorAll('.search-movie-card1');
    let found = false;

    // Əgər input boşdursa → bütün filmləri göstər
    if (searchValue === '') {
        searchMovies.forEach(movie => movie.style.display = 'block');
        noResultMessage.style.display = 'none';
        return;
    }

    // Əks halda filtrlə
    searchMovies.forEach(movie => {
        const movieTitle = movie.querySelector('.movie-title').textContent.toLowerCase();
        if (movieTitle.includes(searchValue)) {
            movie.style.display = 'block';
            found = true;
        } else {
            movie.style.display = 'none';
        }
    });

    // Əgər heç bir film tapılmadısa, mesaj göstər
    noResultMessage.style.display = found ? 'none' : 'block';
});