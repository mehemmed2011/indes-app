const tableBody = document.querySelector('.body-table');
const logoutBtn = document.querySelector('.logout');
const createBtn = document.getElementById('create-btn');
const moviesModal = document.querySelector('.movies-modal');
const moviesEditModal = document.querySelector('.movies-edit-modal');
const moviesDeleteModal = document.querySelector('.movies-delete-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const deleteMovieBtn = document.getElementById('delete-movie-btn');
const cancelMovieBtn = document.getElementById('cancel-movie-btn');
const inputTitle = document.getElementById('input-title');
const inputOverview = document.getElementById('input-overview');
const inputCover = document.getElementById('input-cover');
const inputFragman = document.getElementById('input-fragman');
const inputWatch = document.getElementById('input-watch');
const inputImdb = document.getElementById('input-imdb');
const inputRunTimeMin = document.getElementById('input-runTimeMin');
const categoryDropdown = document.querySelector('.category-dropdown');
const actorsDropdown = document.querySelector('.actors-dropdown');
const categoryOptions = document.querySelector('.category-options');
const actorsOptions = document.querySelector('.actors-options');
const modalCheckbox = document.querySelector('.modal-checkbox');
const editCategoryOptions = document.querySelector('.edit-category-options');
const editActorsOptions = document.querySelector('.edit-actors-options');
const btnSubmit = document.getElementById('btn-submit');
const btnEditSubmit = document.getElementById('btn-edit-submit');
const modalImage = document.querySelector('.modal-image');
const modalRight = document.querySelector('.modal-right');
const modalLeft = document.querySelector('.modal-left');
const sexCheckbox = document.getElementById('sex');

// Edit Modal Elements
const editInputTitle = document.getElementById('edit-input-title');
const editInputOverview = document.getElementById('edit-input-overview');
const editInputCover = document.getElementById('edit-input-cover');
const editInputFragman = document.getElementById('edit-input-fragman');
const editInputWatch = document.getElementById('edit-input-watch');
const editInputImdb = document.getElementById('edit-input-imdb');
const editInputRunTimeMin = document.getElementById('edit-input-runTimeMin');
const editCategoryDropdown = document.querySelector('.edit-category-dropdown');
const editActorsDropdown = document.querySelector('.edit-actors-dropdown');
const editSexCheckbox = document.getElementById('edit-sex');
const modalEditImage = document.querySelector('.modal-edit-image');

//Token
const token = localStorage.getItem('token');

let currentPage = 1;
const itemsPerPage = 8;
let allMovies = [];
let allCategories = [];
let allActors = [];
let selectedActors = []; // Create modal üçün
let selectedEditActors = []; // Edit modal üçün


document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.querySelector('.profile-img');
    const profileName = document.querySelector('.profile-name');

    const userImg = localStorage.getItem('userImg');
    profileImg.src = '/assets/images/default.jpg';

    const userName = JSON.parse(localStorage.getItem('userName'));
    profileName.textContent = userName || 'Admin';
});


// API Functions
async function getCategories() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories`;
    const options = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching categories:', error);
    }
}

async function getActors() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors`;
    const options = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching actors:', error);
    }
}

async function getMovies() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies`;
    const options = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
        Toastify({
            text: "Xəta baş verdi!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
            stopOnFocus: true,
            style: {
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                fontSize: "15px",
                fontWeight: "500",
                padding: "12px 18px"
            },
        }).showToast();
    }
}

async function getMovieById(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${id}`;
    const options = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
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

async function deleteMovieById(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

async function createMovie(newMovie) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie`;
    const options = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Film yaradılarkən xəta baş verdi');
        }
        
        return data;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
}

async function updateMovieById(id, updatedMovie) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMovie)
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
//--------------------------------------------------------------


// Render Functions
async function renderMovies() {
    const moviesData = await getMovies();
    allMovies = moviesData.data;
    showPage(currentPage);
    renderPagination();
}

function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const moviesToShow = allMovies.slice(start, end);

    tableBody.innerHTML = moviesToShow.map(movie => `
        <tr>
            <td>${movie.id}</td>
            <td><img class="movie-icon" src="${movie.cover_url}" alt=""> </td>
            <td>${movie.title}</td>
            <td>${movie.overview}</td>
            <td>${movie.category?.name || 'No category'}</td>
            <td>${movie.imdb}</td>
           <td>
               <button class="edit-btn" onclick="chooseMovie(${movie.id}, 'edit')"><i class="fa-solid fa-pen"></i></button>
            </td>
           <td>
              <button class="delete-btn" onclick="chooseMovie(${movie.id}, 'delete')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
    `).join('');
}

function renderPagination() {
  const totalPages = Math.ceil(allMovies.length / itemsPerPage);
  const pagination = document.querySelector('.pagination');
  let html = '';

    const visiblePages = 3;
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
    </li>
  `;

  for (let i = startPage; i <= endPage; i++) {
    html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
    </li>
  `;

  pagination.innerHTML = html;

  const links = pagination.querySelectorAll('.page-link');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = Number(e.target.dataset.page);
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        showPage(currentPage);
        renderPagination();
      }
    });
  });
}

renderMovies();

// Dropdown-ları dinamik et
async function loadDropdowns() {
    const categoriesData = await getCategories();
    const actorsData = await getActors();
    allCategories = categoriesData.data;
    allActors = actorsData.data;
    
    // Category options
    categoryOptions.innerHTML = allCategories.map(c => 
        `<div class="option" data-id="${c.id}">${c.name}</div>`).join('');
    editCategoryOptions.innerHTML = allCategories.map(c => 
        `<div class="option" data-id="${c.id}">${c.name}</div>`).join('');
    
    // Actors options - multiselect checkbox ilə
    actorsOptions.innerHTML = allActors.map(a => 
        `<div class="option actor-option" data-id="${a.id}">
            <input type="checkbox" id="actor-${a.id}" class="actor-checkbox" value="${a.id}">
            <label for="actor-${a.id}">${a.name}</label>
        </div>`).join('');
    editActorsOptions.innerHTML = allActors.map(a => 
        `<div class="option actor-option" data-id="${a.id}">
            <input type="checkbox" id="edit-actor-${a.id}" class="actor-checkbox" value="${a.id}">
            <label for="edit-actor-${a.id}">${a.name}</label>
        </div>`).join('');
    
    // Dropdown açma/bağlama
    categoryDropdown.querySelector('.selected-option').onclick = () => {
        categoryOptions.style.display = categoryOptions.style.display === 'block' ? 'none' : 'block';
    };
    actorsDropdown.querySelector('.selected-option').onclick = () => {
        actorsOptions.style.display = actorsOptions.style.display === 'block' ? 'none' : 'block';
    };
    editCategoryDropdown.querySelector('.selected-option').onclick = () => {
        editCategoryOptions.style.display = editCategoryOptions.style.display === 'block' ? 'none' : 'block';
    };
    editActorsDropdown.querySelector('.selected-option').onclick = () => {
        editActorsOptions.style.display = editActorsOptions.style.display === 'block' ? 'none' : 'block';
    };
    
    // Seçim etmə
    categoryOptions.querySelectorAll('.option').forEach(opt => {
        opt.onclick = () => {
            categoryDropdown.querySelector('.selected-option').innerHTML = opt.textContent + ' <i class="fa-solid fa-chevron-down"></i>';
            categoryDropdown.dataset.selectedId = opt.dataset.id;
            categoryOptions.style.display = 'none';
        };
    });
    // Actors seçimi - multiselect checkbox
    actorsOptions.querySelectorAll('.actor-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const actorId = parseInt(e.target.value);
            if (e.target.checked) {
                if (!selectedActors.includes(actorId)) {
                    selectedActors.push(actorId);
                }
            } else {
                selectedActors = selectedActors.filter(id => id !== actorId);
            }
            updateActorsDisplay();
        });
    });
    editCategoryOptions.querySelectorAll('.option').forEach(opt => {
        opt.onclick = () => {
            editCategoryDropdown.querySelector('.selected-option').innerHTML = opt.textContent + ' <i class="fa-solid fa-chevron-down"></i>';
            editCategoryDropdown.dataset.selectedId = opt.dataset.id;
            editCategoryOptions.style.display = 'none';
        };
    });
    // Edit Actors seçimi - multiselect checkbox
    editActorsOptions.querySelectorAll('.actor-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const actorId = parseInt(e.target.value);
            if (e.target.checked) {
                if (!selectedEditActors.includes(actorId)) {
                    selectedEditActors.push(actorId);
                }
            } else {
                selectedEditActors = selectedEditActors.filter(id => id !== actorId);
            }
            updateEditActorsDisplay();
        });
    });
}
loadDropdowns();

// Seçilmiş actorları göstər (Create modal)
function updateActorsDisplay() {
    const selectedNames = selectedActors.map(id => {
        const actor = allActors.find(a => a.id === id);
        return actor ? actor.name : '';
    }).filter(name => name).join(', ');
    
    actorsDropdown.querySelector('.selected-option').innerHTML = 
        (selectedNames || 'actors') + ' <i class="fa-solid fa-chevron-down"></i>';
}

// Seçilmiş actorları göstər (Edit modal)
function updateEditActorsDisplay() {
    const selectedNames = selectedEditActors.map(id => {
        const actor = allActors.find(a => a.id === id);
        return actor ? actor.name : '';
    }).filter(name => name).join(', ');
    
    editActorsDropdown.querySelector('.selected-option').innerHTML = 
        (selectedNames || 'actors') + ' <i class="fa-solid fa-chevron-down"></i>';
}

async function chooseMovie(id, action) {
    try {
        const moviesData = await getMovies();
        allMovies = moviesData.data;
        localStorage.setItem('movieId', id);
    if (action === 'edit') {
        const movie = allMovies.find(movie => movie.id === id);
        if (movie) {
            // Edit modal elementlərinə data yazırıq
            editInputTitle.value = movie.title;
            editInputOverview.value = movie.overview;
            editInputCover.value = movie.cover_url;
            editInputFragman.value = movie.fragman;
            editInputWatch.value = movie.watch_url;
            editInputImdb.value = movie.imdb;
            editInputRunTimeMin.value = movie.run_time_min;
            editSexCheckbox.checked = movie.adult;
            modalEditImage.src = movie.cover_url;
            
            // Seçilmiş category göstər
            const selectedCat = allCategories.find(c => c.id === movie.category_id);
            if (selectedCat) {
                editCategoryDropdown.querySelector('.selected-option').innerHTML = selectedCat.name + ' <i class="fa-solid fa-chevron-down"></i>';
                editCategoryDropdown.dataset.selectedId = selectedCat.id;
            }
            
            // Seçilmiş actorları göstər və checkbox-ları işarələ
            selectedEditActors = movie.actor_ids || [];
            editActorsOptions.querySelectorAll('.actor-checkbox').forEach(checkbox => {
                checkbox.checked = selectedEditActors.includes(parseInt(checkbox.value));
            });
            updateEditActorsDisplay();
            
            moviesEditModal.style.display = 'flex';
            modalOverlay.classList.add('active');
        }
        else {
            Toastify({
                text: "Film tapılmadı!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#a72a28ff",
            }).showToast();
        }
        return;
    }
    else if (action === 'delete') {
        moviesDeleteModal.style.display = 'flex';
        modalOverlay.classList.add('active');
        return;
    }
    Toastify({
        text: "Xəta baş verdi!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#a72a28ff",
    }).showToast();
    } catch (error) {
        console.error('Error:', error);
        return null;
        Toastify({
            text: "Xəta baş verdi!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
    }
}

// Close modal when clicking on overlay
modalOverlay.addEventListener('click', () => {
    moviesModal.style.display = 'none';
    moviesEditModal.style.display = 'none';
    moviesDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
    // Dropdown-ları bağla
    categoryOptions.style.display = 'none';
    actorsOptions.style.display = 'none';
    editCategoryOptions.style.display = 'none';
    editActorsOptions.style.display = 'none';
});

moviesModal.addEventListener('click', (e) => {
    e.stopPropagation();
    // Dropdown xaricində klik edərsə bağla
    if (!e.target.closest('.category-dropdown') && !e.target.closest('.actors-dropdown')) {
        categoryOptions.style.display = 'none';
        actorsOptions.style.display = 'none';
    }
});

moviesEditModal.addEventListener('click', (e) => {
    e.stopPropagation();
    // Dropdown xaricində klik edərsə bağla
    if (!e.target.closest('.edit-category-dropdown') && !e.target.closest('.edit-actors-dropdown')) {
        editCategoryOptions.style.display = 'none';
        editActorsOptions.style.display = 'none';
    }
});



// EVENTS
createBtn.addEventListener('click', async () => {
      // Create modal açılarkən əvvəlki seçimləri təmizlə
      selectedActors = [];
      actorsOptions.querySelectorAll('.actor-checkbox').forEach(checkbox => {
          checkbox.checked = false;
      });
      updateActorsDisplay();
      
      moviesModal.style.display = 'flex';
      modalOverlay.classList.add('active');
});

inputCover.addEventListener('input', (e) => {
    const imageUrl = e.target.value.trim();
    if (imageUrl && imageUrl.startsWith('http')) {
        modalImage.src = imageUrl;
    }
    else {
        modalImage.src = '/assets/images/default.jpg';
    }
});

editInputCover.addEventListener('input', (e) => {
    const imageUrl = e.target.value.trim();
    if (imageUrl && imageUrl.startsWith('http')) {
        modalEditImage.src = imageUrl;
    }
    else {
        modalEditImage.src = '/assets/images/default.jpg';
    }
});


btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        // Validation - category və actors seçilməlidir
        if (!categoryDropdown.dataset.selectedId) {
            Toastify({
                text: "Kateqoriya seçin!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#a72a28ff",
            }).showToast();
            return;
        }
        
        if (selectedActors.length === 0) {
            Toastify({
                text: "Ən azı bir aktyor seçin!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#a72a28ff",
            }).showToast();
            return;
        }

        const newMovie = {
            title: inputTitle.value.trim(),
            cover_url: inputCover.value.trim(),
            fragman: inputFragman.value.trim(),
            watch_url: inputWatch.value.trim(),
            imdb: inputImdb.value.trim(),
            overview: inputOverview.value.trim(),
            run_time_min: parseInt(inputRunTimeMin.value) || 0,
            category: parseInt(categoryDropdown.dataset.selectedId),
            actors: selectedActors,
            adult: sexCheckbox.checked,
        }

        const result = await createMovie(newMovie);
        
        if (result && result.result) {
            await renderMovies();
            moviesModal.style.display = 'none';
            modalOverlay.classList.remove('active');
            inputTitle.value = '';
            inputOverview.value = '';
            inputCover.value = '';
            inputFragman.value = '';
            inputWatch.value = '';
            inputImdb.value = '';
            inputRunTimeMin.value = '';
            categoryDropdown.dataset.selectedId = '';
            categoryDropdown.querySelector('.selected-option').innerHTML = 'category <i class="fa-solid fa-chevron-down"></i>';
            actorsDropdown.querySelector('.selected-option').innerHTML = 'actors <i class="fa-solid fa-chevron-down"></i>';
            selectedActors = [];
            actorsOptions.querySelectorAll('.actor-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            sexCheckbox.checked = false;
            modalImage.src = '/assets/images/default.jpg';
            
            Toastify({
                text: "Film uğurla əlavə edildi ✅",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#28a745",
            }).showToast();
        } else {
            Toastify({
                text: result?.message || "Film əlavə edilərkən xəta baş verdi!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#a72a28ff",
            }).showToast();
        }
    } catch (error) {
        console.error('Error creating movie:', error);
        Toastify({
            text: "Film əlavə edilərkən xəta baş verdi!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
    }
});

btnEditSubmit.addEventListener('click', async () => {
    try {
        const movieId = JSON.parse(localStorage.getItem('movieId'));
        // Validation for edit
        if (!editCategoryDropdown.dataset.selectedId) {
            Toastify({
                text: "Kateqoriya seçin!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#a72a28ff",
            }).showToast();
            return;
        }
        
        if (selectedEditActors.length === 0) {
            Toastify({
                text: "Ən azı bir aktyor seçin!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#a72a28ff",
            }).showToast();
            return;
        }

        const updatedMovie = {
            title: editInputTitle.value,
            overview: editInputOverview.value,
            cover_url: editInputCover.value,
            fragman: editInputFragman.value,
            category: parseInt(editCategoryDropdown.dataset.selectedId),
            adult: editSexCheckbox.checked,
            imdb: editInputImdb.value,
            run_time_min: parseInt(editInputRunTimeMin.value),
            watch_url: editInputWatch.value,
            actors: selectedEditActors,
        }
        await updateMovieById(movieId, updatedMovie);
        await renderMovies();
        moviesEditModal.style.display = 'none';
        modalOverlay.classList.remove('active');
        editInputTitle.value = '';
        editInputOverview.value = '';
        editInputCover.value = '';
        editInputFragman.value = '';
        editInputWatch.value = '';
        editInputImdb.value = '';
        editInputRunTimeMin.value = '';
        editCategoryDropdown.dataset.selectedId = '';
        editCategoryDropdown.querySelector('.selected-option').innerHTML = 'category <i class="fa-solid fa-chevron-down"></i>';
        editActorsDropdown.querySelector('.selected-option').innerHTML = 'actors <i class="fa-solid fa-chevron-down"></i>';
        selectedEditActors = [];
        editActorsOptions.querySelectorAll('.actor-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        editSexCheckbox.checked = false;
        Toastify({
            text: "Film uğurla edit olundu ✅",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#28a745",
        }).showToast();
        return;
    }
    catch (error) {
        console.error('Error updating movie:', error);
        Toastify({
            text: "Film edit edilərkən xəta baş verdi!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
    }

});

deleteMovieBtn.addEventListener('click', async () => {
    try {
        const movieId = JSON.parse(localStorage.getItem('movieId'));
        await deleteMovieById(movieId);
        await renderMovies();
        
        moviesDeleteModal.style.display = 'none';
        modalOverlay.classList.remove('active');

        Toastify({
            text: "Film uğurla silindi ✅",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#28a745",
            style: {
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                fontSize: "15px",
                fontWeight: "500",
                padding: "12px 18px"
            },
        }).showToast();
    } catch (error) {
        console.error('Error deleting movie:', error);
        Toastify({
            text: "Film silinərkən xəta baş verdi!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
            style: {
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                fontSize: "15px",
                fontWeight: "500",
                padding: "12px 18px"
            },
        }).showToast();
    }
});

cancelMovieBtn.addEventListener('click', () => {
    moviesDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.querySelector('.profile-img');
    const profileName = document.querySelector('.profile-name');
  
    const userImg = localStorage.getItem('userImg');
    profileImg.src = userImg || '/assets/images/default.jpg';
  
    const userName = localStorage.getItem('userName');
    profileName.textContent = userName || 'Admin';
  });


logoutBtn.addEventListener('click',()=>{    // Yalnız token-i sil, profil məlumatlarını saxla (növbəti login üçün)
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
})