const movieHeroCategoryName = document.getElementById('movie-hero-category-name');
const movieHeroTitle = document.getElementById('movie-hero-title');
const heroCoverImg = document.querySelector('.hero-cover-img');
const movieInfoCover = document.getElementById('movie-info-cover');
const movieInfoTitle = document.querySelector('.movie-info-title');
const movieInfoDescription = document.querySelector('.movie-info-description');
const movieInfoRating = document.querySelector('.movie-info-rating');
const movieInfoRunTime = document.querySelector('.movie-info-episode-run-time-value');
const movieInfoGenres = document.querySelector('.movie-info-genres-value');
const actorsContainer = document.getElementById('actors-container');
const addFavIcon = document.querySelector('.add-fav-icon');
const removeFavIcon = document.querySelector('.remove-fav-icon');
const watchLink = document.querySelector('.watch-link');
const profileImg = document.querySelector('.profile-img'); // comment form'da istifadə edilir
const commentInput = document.querySelector('#comment-input'); // comment form'da istifadə edilir
const commentBtn = document.querySelector('#comment-btn'); // comment form'da istifadə edilir
const commentsContainer = document.querySelector('.comments-container');
const commentProfileInfo = document.querySelector('.comment-profile-info');
const commentProfileName = document.querySelector('.comment-profile-name');
const commentProfileTime = document.querySelector('.comment-profile-time');
const commentTextContainer = document.querySelector('.comment-text-container');
const commentText = document.querySelector('.comment-text');
const similarMoviesCards = document.querySelector('.similar-movies-cards');
const similarMoviesTitle = document.querySelector('.similar-movies-title');
const movieTitle = document.querySelector('.movie-title');
const movieCategoryName = document.querySelector('.movie-category-name');


const selectedMovieId = localStorage.getItem('selectedMovieId');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const userImg = localStorage.getItem('userImg');
let currentWatchUrl = '';

// Əgər token və ya userId yoxdursa, login səhifəsinə yönləndir
if (!token || !userId) {
    window.location.href = '../../../pages/client/login/login.html';
}

async function getMovieById(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${id}`;
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

async function getActors() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors`;
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


async function getFavMovies() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${selectedMovieId}/favorites`;
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


async function addFavMovie(movieId) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movie/${selectedMovieId}/favorite`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
            {
                user_id: userId,
                movie_id: selectedMovieId
            }
        )
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}


// Filmin favorite-də olub-olmadığını yoxla
async function checkIfFavorite() {
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
        if(data && data.data && Array.isArray(data.data)) {
            const isFavorite = data.data.some(fav => fav.id == selectedMovieId);
            return isFavorite;
        }
        return false;
    } catch (error) {
        console.log('Error:', error);
        return false;
    }
}

async function getComments() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${selectedMovieId}/comments`;
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

async function addComment(newComment) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${selectedMovieId}/comment`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newComment)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

async function deleteComment(commentId) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${selectedMovieId}/comment/${commentId}`;
    const options = {
        method: 'DELETE',
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

async function getAccount() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/profile`;
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
        
    }
}

async function getCategories() {
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
        console.log('Error:', error);
    }
}

//------------------------------------------------------------------------
async function displayUserProfileImg() {
    if(userImg){
        profileImg.src = userImg;
    } else {
        // Əgər localStorage-də yoxdursa, API-dən al
        const accountData = await getAccount();
        if(accountData && accountData.data && accountData.data.img_url){
            profileImg.src = accountData.data.img_url;
            // localStorage-ə də saxla
            localStorage.setItem('userImg', accountData.data.img_url);
        } else {
            profileImg.src = '../../../assets/images/default.jpg';
        }
    }
}

displayUserProfileImg();

// Actors göstərmə funksiyası
function displayActors(actors) {
    actorsContainer.innerHTML = '';
    
    if (!actors || actors.length === 0) {
        actorsContainer.innerHTML = '<p style="color: #999;">No actors available</p>';
        return;
    }
    
    actors.forEach(actor => {
        const actorCard = document.createElement('div');
        actorCard.className = 'actor-card';
        actorCard.innerHTML = `
            <img class="actor-img" src="${actor.img_url}" alt="${actor.name}">
            <h3 class="actor-name">${actor.name}</h3>
        `;
        actorsContainer.appendChild(actorCard);
    });
}

async function displayMovie() {
    const movie = await getMovieById(selectedMovieId);
    console.log('Movie:', movie);
    movieHeroCategoryName.textContent = movie.data.category.name;
    movieHeroTitle.textContent = movie.data.title;
    heroCoverImg.src = movie.data.cover_url;
    movieInfoCover.src = movie.data.cover_url;
    movieInfoTitle.innerHTML = `${movie.data.title} <span class="watch-link" data-watch-url="${movie.data.watch_url}">Watch Link</span>`;
    movieInfoDescription.textContent = movie.data.overview;
    movieInfoRating.innerHTML = `<img src="../../../assets/icons/movie-info-star.svg" alt="">${(movie.data.imdb / 2).toFixed(1)}`;
    movieInfoRunTime.textContent = `${movie.data.run_time_min} min`;
    movieInfoGenres.textContent = movie.data.category.name;
    
    // Watch URL-i global dəyişənə saxla
    currentWatchUrl = movie.data.watch_url;
    
    // Actors göstər - bütün seçilmiş actorlar
    displayActors(movie.data.actors);
    
    // Similar movies-i göstər
    await displaySimilarMovies(movie.data.category.id, movie.data.category.name);
    
    // Səhifə yüklənəndə icon statusunu yoxla
    const isFavorite = await checkIfFavorite();
    if(isFavorite) {
        addFavIcon.style.display = 'none';
        removeFavIcon.style.display = 'inline-block';
    } else {
        addFavIcon.style.display = 'inline-block';
        removeFavIcon.style.display = 'none';
    }
}

async function displaySimilarMovies(categoryId, categoryName) {
    const categories = await getCategories();
    
    if (!categories || !categories.data) return;
    
    // Cari kateqoriyanı tap
    const currentCategory = categories.data.find(cat => cat.id === categoryId);
    
    if (!currentCategory || !currentCategory.movies) return;
    
    // Cari filmi çıxar, yalnız digər filmləri göstər
    const similarMovies = currentCategory.movies.filter(movie => movie.id != selectedMovieId);
    
    // Similar movies title-ni yenilə
    similarMoviesTitle.textContent = `Similar ${categoryName} Movies`;
    
    // Similar movies cards-ı təmizlə
    similarMoviesCards.innerHTML = '';
    
    if (similarMovies.length === 0) {
        similarMoviesCards.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Bu kateqoriyada başqa film yoxdur.</p>';
        return;
    }
    
    // İlk 3 oxşar filmi göstər
    const moviesToShow = similarMovies.slice(0, 3);
    
    moviesToShow.forEach(movie => {
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
        
        similarMoviesCards.innerHTML += `
            <div class="similar-movie-card1" data-movie-id="${movie.id}" style="cursor: pointer;"><img src="${movie.cover_url}" alt="">
               <h3 class="movie-category-name">${movie.category.name}</h3>
               <div class="rating-stars">
                ${starsHTML}
              </div>
                <h1 class="movie-title">${movie.title}</h1>
            </div>
        `;
    });
    
    // Movie card-lara click event əlavə et
    document.querySelectorAll('.similar-movie-card1').forEach(card => {
        card.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            localStorage.setItem('selectedMovieId', movieId);
            window.location.reload(); // Səhifəni yenilə
        });
    });
}

displayMovie();

//Comments
async function displayComments() {
    const comments = await getComments();
    console.log('Selected Movie ID:', selectedMovieId);
    console.log('Comments:', comments.data);
    console.log('User ID:', userId);
    console.log('Comments:', comments);
    commentsContainer.innerHTML = '';
    comments.data.forEach(comment => {
        commentsContainer.innerHTML += `
                    <div class="comment-item" data-comment-id="${comment.id}">
                        <div class="comment-content">
                            <div class="comment-profile-info">
                               <img class="profile-img" src="${comment.user.img_url}" alt="">
                               <h1 class="comment-profile-name">${comment.user.full_name}</h1>
                            </div>
                             <div class="comment-profile-time-container">
                                   <span class="comment-profile-time">${comment.created_at}</span>
                                   <i class="fa-solid fa-xmark delete-comment-icon" data-comment-id="${comment.id}"></i>
                            </div>
                        </div>
                        <div class="comment-text-container">
                            <p class="comment-text">${comment.comment}</p>
                        </div>
                    </div>
        `
    });
}

displayComments();

async function submitComment() {
    const newComment = {
        comment: commentInput.value,
        user_id: userId,
        movie_id: selectedMovieId,
    }
    await addComment(newComment);
    await displayComments();
    commentInput.value = '';
    Toastify({
        text: "Comment uğurla əlavə edildi ✅",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#28a745",
    }).showToast();
}

commentBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 
    if(commentInput.value.trim() === ''){
        Toastify({
            text: "Comment daxil edin ❌",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
        return;
    }
    await submitComment();
    
});

// Comment silmək üçün event delegation
commentsContainer.addEventListener('click', async (e) => {
    if(e.target.classList.contains('delete-comment-icon')){
        const commentId = e.target.getAttribute('data-comment-id');
        const result = await deleteComment(commentId);
        if(result.result === true){ // düz bu hissə
            await displayComments();
            Toastify({
                text: "Comment uğurla silindi ✅",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#28a745",
            }).showToast();
        }
    }
});


// addFavIcon-a basanda favorite-ə əlavə et və removeFavIcon göstər
addFavIcon.addEventListener('click', async () => {
    const result = await addFavMovie(selectedMovieId);
    if(result && result.result === true){
        addFavIcon.style.display = 'none';
        removeFavIcon.style.display = 'inline-block';
        Toastify({
            text: "Favoritlərə əlavə edildi ✅",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#28a745",
        }).showToast();
    } else {
        Toastify({
            text: "Əlavə edilərkən xəta baş verdi ❌",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
    }
});

// removeFavIcon-a basanda favorite-dən sil və addFavIcon göstər
removeFavIcon.addEventListener('click', async () => {
    const result = await addFavMovie(selectedMovieId);
    if(result && result.result === true){
        removeFavIcon.style.display = 'none';
        addFavIcon.style.display = 'inline-block';
        Toastify({
            text: "Favoritlərdən silindi ✅",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#ff9800",
        }).showToast();
    } else {
        Toastify({
            text: "Silinərkən xəta baş verdi ❌",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
    }
});

// Video Modal elementləri
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoModalClose = document.querySelector('.video-modal-close');

// Watch Link click event
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('watch-link')) {
        const watchUrl = e.target.getAttribute('data-watch-url');
        if (watchUrl) {
            openVideoModal(watchUrl);
        }
    }
});

// Video modal-ı aç
function openVideoModal(url) {
    videoFrame.src = url;
    videoModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Scroll-u bağla
}

// Video modal-ı bağla
function closeVideoModal() {
    videoFrame.src = ''; // Video-nu dayandır
    videoModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Scroll-u aç
}

// Close button click
videoModalClose.addEventListener('click', closeVideoModal);

// Modal xaricində click edəndə bağla
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// ESC düyməsi ilə bağla
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('show')) {
        closeVideoModal();
    }
});

// Movie Info Cover - Play Icon Animasiyası
const movieInfoCoverDiv = document.querySelector('.movie-info-cover');
const movieCoverOverlay = document.querySelector('.movie-cover-overlay');

// 2 saniyədən bir overlay göstər/gizlət
setInterval(() => {
    movieCoverOverlay.classList.add('active');
    setTimeout(() => {
        movieCoverOverlay.classList.remove('active');
    }, 1000); // 1 saniyə göstər, sonra gizlət
}, 2000);

// Movie cover-ə click edəndə video aç
movieInfoCoverDiv.addEventListener('click', () => {
    if (currentWatchUrl) {
        openVideoModal(currentWatchUrl);
    }
});