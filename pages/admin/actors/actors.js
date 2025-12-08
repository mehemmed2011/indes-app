const tableBody = document.querySelector('.body-table');
const logoutBtn = document.querySelector('.logout');
const createBtn = document.querySelector('#create-btn');
const actorNameInput = document.getElementById('actor-name-input');
const actorSurnameInput = document.getElementById('actor-surname-input');
const actorImgInput = document.getElementById('actor-img-input');
const addActorBtn = document.getElementById('add-actor-btn');
const actorsModal = document.querySelector('.actors-modal');
const movieContainer = document.querySelector('.movie-container');
const actorsEditModal = document.querySelector('.actors-edit-modal');
const editNameInput = document.getElementById('actor-name-input-upt');
const editSurnameInput = document.getElementById('actor-surname-input-upt');
const editImgInput = document.getElementById('actor-img-input-upt');
const editActorBtn = document.getElementById('edit-actor-btn');
const actorsDeleteModal = document.querySelector('.actors-delete-modal');
const deleteActorBtn = document.getElementById('delete-actors-btn');
const cancelDeleteActorBtn = document.getElementById('cancel-actors-btn');
const actorEditImg = document.querySelector('.actor-edit-img');
const actorCreateImg = document.querySelector('.actor-create-img');
const modalOverlay = document.querySelector('.modal-overlay');
const token = localStorage.getItem('token');


let currentPage = 1;
const itemsPerPage = 8;
let allActors = [];

//Api functions
async function getActors() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
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

async function addNewActor(newActor) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor`;
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newActor)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

async function deleteActorById(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor/${id}`;
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
        console.error('Error:', error);
    }
}

async function updateActorById(id, updatedActor) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedActor)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
/*- ------------------------------------------------*/

async function renderActors() {
    const dataActors = await getActors();
    allActors = dataActors.data;
    showPage(currentPage);
    renderPagination();
}


function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const actorsToShow = allActors.slice(start, end);

    tableBody.innerHTML = actorsToShow.map(actor => `
           <tr>
                        <td>${actor.id}</td>
                        <td><img class="movie-icon" src="${actor.img_url}" alt=""></td>
                        <td>${actor.name}</td>
                        <td>${actor.surname}</td>
                        <td>
                            <button class="edit-btn" onclick="chooseActors(${actor.id}, 'edit')"><i class="fa-solid fa-pen"></i></button>
                        </td>
                        <td>
                              <button class="delete-btn" onclick="chooseActors(${actor.id}, 'remove')"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
        `).join('');
}


function renderPagination() {
    const totalPages = Math.ceil(allActors.length / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    let html = '';

    const visiblePages = 3; // eyni anda neçə səhifə görünsün
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Əgər sonlara yaxınlaşırsa
    if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    // Prev düyməsi
    html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
    </li>
  `;

    // Səhifə nömrələri
    for (let i = startPage; i <= endPage; i++) {
        html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
    }

    // Next düyməsi
    html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
    </li>
  `;

    pagination.innerHTML = html;

    // Klik hadisəsi
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

renderActors();

async function chooseActors(id, method) {
    console.log(id, method);
    try {
        const dataActors = await getActors();
        allActors = dataActors.data;
        // console.log(categoriesData);
        if (method === 'remove') {
            localStorage.setItem('actorId', JSON.stringify(id));
            actorsDeleteModal.style.display = 'flex';
            modalOverlay.classList.add('active');
        } else if (method === 'edit') {
            const actor = allActors.find(cat => cat.id === id);
            if (actor) {
                editNameInput.value = actor.name;
                editSurnameInput.value = actor.surname;
                editImgInput.value = actor.img_url;
                actorEditImg.src = actor.img_url;
                localStorage.setItem('actorId', JSON.stringify(id));
                actorsEditModal.style.display = 'flex';
                modalOverlay.classList.add('active');
            }
        }
    } catch (error) {
        console.error('Xəta baş verdi:', error);
        Toastify({
            text: "Xeta bas verdi, zehmet olmasa yeniden cehd et!",
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
        return;
    }
}

//EVENTS 

createBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    actorsModal.style.display = 'flex';
    modalOverlay.classList.add('active');
})

// Close modal when clicking on overlay
modalOverlay.addEventListener('click', () => {
    actorsModal.style.display = 'none';
    actorsEditModal.style.display = 'none';
    actorsDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
    actorCreateImg.src = '/assets/images/default.jpg';
});

// Image URL Preview for Create Modal
actorImgInput.addEventListener('input', (e) => {
    const imageUrl = e.target.value.trim();
    
    if (imageUrl && imageUrl.startsWith('http')) {
        // URL düzgün formatda olduqda şəkili yüklə
        actorCreateImg.src = imageUrl;
        
        // Şəkil yüklənməsə error handler
        actorCreateImg.onerror = () => {
            actorCreateImg.src = '/assets/images/default.jpg';
        };
        
        // Şəkil uğurla yükləndikdə
        actorCreateImg.onload = () => {
            console.log('Şəkil uğurla yükləndi');
        };
    } else if (imageUrl === '') {
        // Input boşdursa default şəkil
        actorCreateImg.src = '/assets/images/default.jpg';
    }
})

// Image URL Preview for Edit Modal
editImgInput.addEventListener('input', (e) => {
    const imageUrl = e.target.value.trim();
    
    if (imageUrl && imageUrl.startsWith('http')) {
        // URL düzgün formatda olduqda şəkili yüklə
        actorEditImg.src = imageUrl;
        
        // Şəkil yüklənməsə error handler
        actorEditImg.onerror = () => {
            actorEditImg.src = '/assets/images/default.jpg';
        };
        
        // Şəkil uğurla yükləndikdə
        actorEditImg.onload = () => {
            console.log('Şəkil uğurla yükləndi');
        };
    } else if (imageUrl === '') {
        // Input boşdursa default şəkil
        actorEditImg.src = '/assets/images/default.jpg';
    }
})

window.addEventListener('click', (e) => {
    if (actorsModal.style.display === 'flex' && !actorsModal.contains(e.target) && !e.target.closest('#create-btn')) {
        actorsModal.style.display = 'none';
        modalOverlay.classList.remove('active');
        actorCreateImg.src = '/assets/images/default.jpg';
    }
    if (actorsEditModal.style.display === 'flex' && !actorsEditModal.contains(e.target)) {
        actorsEditModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
    if (actorsDeleteModal.style.display === 'flex' && !actorsDeleteModal.contains(e.target)) {
        actorsDeleteModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
});

actorsModal.addEventListener('click', (e) => {
    e.stopPropagation();
});


addActorBtn.addEventListener('click', async () => {
    const newActor = {
        name: actorNameInput.value.trim(),
        surname: actorSurnameInput.value.trim(),
        img_url: actorImgInput.value.trim()
    }

    if(!newActor.name || !newActor.surname || !newActor.img_url){

          Toastify({
            text: "Zəhmət olmasa aktoyor adı daxil et!",
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
        return;
    }

    await addNewActor(newActor);
    await renderActors();
    console.log('Actor added successfully');
    actorsModal.style.display = 'none';
    modalOverlay.classList.remove('active');
    actorNameInput.value = '';
    actorSurnameInput.value = '';
    actorImgInput.value = '';
    actorCreateImg.src = '/assets/images/default.jpg';

        Toastify({
        text: "Aktyor uğurla əlavə edildi ✅",
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
})

editActorBtn.addEventListener('click', async () => {
    const localId = JSON.parse(localStorage.getItem('actorId'));
   console.log(localId);
    const updatedCActor = {
        name: editNameInput.value,
        surname: editSurnameInput.value,
        img_url: editImgInput.value

    }

    await updateActorById(localId, updatedCActor);
    await renderActors();

    actorsEditModal.style.display = 'none';
    modalOverlay.classList.remove('active');
    editNameInput.value = '';
    editSurnameInput.value = '';
    editImgInput.value = '';

       Toastify({
        text: "Aktyor uğurla edit olundu ✅",
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
});

deleteActorBtn.addEventListener('click', async () => {
    const localId = JSON.parse(localStorage.getItem('actorId'));
    await deleteActorById(localId);
    await renderActors();
    actorsDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');

       Toastify({
        text: "Aktyor uğurla silindi ✅",
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
});

cancelDeleteActorBtn.addEventListener('click', () => {
    actorsDeleteModal.style.display = 'none';
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