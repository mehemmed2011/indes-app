const fantasyMoviesSection = document.querySelector('.fantasy-movies-section');
const fantasyMoviesCards = document.querySelector('.fantasy-movies-cards');
const actionMoviesCards = document.querySelector('.action-movies-cards');
const thrillerMoviesCards = document.querySelector('.thriller-movies-cards');
const mysteryMoviesCards = document.querySelector('.mystery-movies-cards');
const comedyMoviesCards = document.querySelector('.comedy-movies-cards');
const dramMoviesCards = document.querySelector('.dram-movies-cards');
const crimeMoviesCards = document.querySelector('.crime-movies-cards');
const crimeeMoviesCards = document.querySelector('.crimee-movies-cards');   
const carouselInner = document.querySelector('.carousel-inner');
const youtubeModal = document.getElementById('youtubeModal');
const youtubeIframe = document.querySelector('#youtubeIframe iframe');
const youtubeModalClose = document.querySelector('.youtube-modal-close');

// YouTube linkləri - hər slide üçün (3 slide)
const youtubeLinks = [
    'https://www.youtube.com/embed/iM150ZWovZM?si=XbQ-CbKRVm48HE8r',
    'https://www.youtube.com/embed/NLOp_6uPccQ?si=PU7V9us7lPKtJYDX', 
    'https://youtu.be/x8UAUAuKNcU?si=CpY4G5TtPD_bWRm7' 
];

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
// Category name to DOM element mapping
const categoryCardsMap = {
    'Fantasy': fantasyMoviesCards,
    'Action': actionMoviesCards,
    'Thriller': thrillerMoviesCards,
    'Mystery': mysteryMoviesCards,
    'Comedy': comedyMoviesCards,
    'Dram': dramMoviesCards,
};

async function displayMoviesByCategory(categoryName) {
    const movies = await getMovies();
    const categoryMovies = movies.data.find(cat => cat.name === categoryName);
    const categoryCardsElement = categoryCardsMap[categoryName];


    if (categoryMovies && categoryMovies.movies && categoryMovies.movies.length > 0) {
        // Convert category name to lowercase for CSS class name
        const categoryClass = categoryName.toLowerCase() + '-movie-card1';
        categoryCardsElement.innerHTML = categoryMovies.movies.map(movie => `
            <div class="${categoryClass}" data-movie-id="${movie.id}">
                <div class="overlay-movies"></div>
                <img src="${movie.cover_url}" alt="${movie.title}">
                <div class="movie-content">
                    <h3 class="movie-category-name">${categoryMovies.name}</h3>
                    <div class="rating-stars">
                        ${generateStars(movie.imdb / 2 || 0)}
                    </div>
                    <h1 class="movie-title">${movie.title}</h1>
                </div>
            </div>
        `).join('');

// Add click event listeners to movie cards
const categoryCards = categoryCardsElement.querySelectorAll(`.${categoryClass}`);
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const movieId = card.getAttribute('data-movie-id');
            localStorage.setItem('selectedMovieId', movieId);
            window.location.href = '../../../pages/client/detailed/detailed.html';
        });
    });

    } else {
        categoryCardsElement.innerHTML = '<p style="color: white; font-size: 20px;">No movies found</p>';
    }
}

// Display movies for each category
displayMoviesByCategory('Fantasy');
displayMoviesByCategory('Action');
displayMoviesByCategory('Thriller');
displayMoviesByCategory('Mystery');
displayMoviesByCategory('Comedy');
displayMoviesByCategory('Dram');



//-----------------------------------------------------------------------------------

async function carousel() {
    const movies = await getMovies();
    
    if (movies && movies.data && movies.data.length > 0) {
      // 1. Bütün kategoriyalardakı filmləri bir massivə yığaq
      const allMovies = movies.data.flatMap(category => 
        category.movies.map(movie => ({
          ...movie,
          categoryName: category.name
        }))
      );
  
      // 2. İlk 3 filmi götürək
      const firstThree = allMovies.slice(0, 3);
  
      // 3. Carousel HTML yaradaq
      carouselInner.innerHTML = firstThree.map((movie, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <div class="overlay"></div>
          <img src="${movie.cover_url}" class="d-block w-100" alt="${movie.title}">
          <div class="carousel-content">
            <h3 class="slider-movie-category-name">${movie.categoryName}</h3>
           <div class="slider-rating-stars">
           <div class="rating-stars">
            ${generateStars(movie.imdb / 2 || 0)}
           </div>
           </div>
            <h1 class="slider-movie-title">${movie.title}</h1>
            <p>${movie.overview}</p>
            <button class="watch-btn" data-youtube-link="${youtubeLinks[index] || ''}" data-slide-index="${index}">Watch Now</button>
          </div>
        </div>
      `).join('');
    }
  }
  
  carousel();
  
  // YouTube linkini embed formatına çevirir
  function convertToEmbedUrl(url) {
    if (!url) return '';
    
    // Əgər artıq embed formatındadırsa
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Əgər watch URL formatındadırsa
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // Əgər embed ID-dir
    const embedMatch = url.match(/\/embed\/([^&\n?#]+)/);
    if (embedMatch) {
      return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }
    
    return url;
  }
  
  // Modal açır və YouTube video yükləyir
  function openYouTubeModal(youtubeUrl) {
    if (!youtubeUrl) {
      alert('YouTube linki tapılmadı!');
      return;
    }
    
    const embedUrl = convertToEmbedUrl(youtubeUrl);
    youtubeIframe.src = embedUrl + '?autoplay=1';
    youtubeModal.style.display = 'flex';
  }
  
  // Modal bağlayır
  function closeYouTubeModal() {
    youtubeModal.style.display = 'none';
    youtubeIframe.src = ''; // Video durdurulur
  }
  
  // Watch Now düymələrinə event listener
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('watch-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const youtubeLink = e.target.getAttribute('data-youtube-link');
      if (youtubeLink) {
        openYouTubeModal(youtubeLink);
      } else {
        alert('Bu slide üçün YouTube linki təyin edilməyib!');
      }
    }
  });
  
  // Modal bağlama düyməsi
  if (youtubeModalClose) {
    youtubeModalClose.addEventListener('click', closeYouTubeModal);
  }
  
  // Modal xaricində klikləndikdə bağla
  youtubeModal.addEventListener('click', function(e) {
    if (e.target === youtubeModal) {
      closeYouTubeModal();
    }
  });
  


  // Generate stars for the rating
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
  
