const tableBody = document.querySelector('.body-table');
const createCategoryBtn = document.getElementById('create-category-btn');
const categoriesModal = document.querySelector('.categories-modal');
const addCategoriesBtn = document.getElementById('add-categories-btn');
const addNameInput = document.getElementById('categories-name-input');
const categoriesEditModal = document.querySelector('.categories-edit-modal');
const editCategoriesBtn = document.getElementById('edit-categories-btn');
const editNameInput = document.getElementById('categories-edit-name-input');
const categoriesDeleteModal = document.querySelector('.categories-delete-modal');
const deleteCategoriesBtn = document.getElementById('delete-categories-btn');
const cancelDeleteBtn = document.getElementById('cancel-categories-btn');
const logoutBtn = document.querySelector('.logout');
const modalOverlay = document.querySelector('.modal-overlay');

let currentPage = 1;
const itemsPerPage = 8;
let categoriesData = [];

const token = localStorage.getItem('token');

//Api Calls
async function getCategories() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories`;
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
        console.error('Error:', error);
    }
}


async function getCategoryById(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories/${id}`;
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
        console.error('Error:', error);
    }
}

async function createCategory(newCategory) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/category`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteCategoryById(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/category/${id}`;
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

async function updateCategoryById(id, updatedCategory) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/category/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedCategory)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

/*-------------------------------------------------*/
async function renderCategories() {
    const categories = await getCategories();
     categoriesData = categories.data;
    showPage(currentPage);
    renderPagination();
}

function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const categoriesToShow = categoriesData.slice(start, end);

    tableBody.innerHTML = categoriesToShow.reverse().map(category => `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>
               <button class="edit-btn" onclick="chooseCategories(${category.id}, 'edit')"><i class="fa-solid fa-pen"></i></button>
                 </td>
                 <td>
                <button class="delete-btn" onclick="chooseCategories(${category.id}, 'remove')"><i class="fa-solid fa-trash"></i></button>
               </td>
        </tr>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(categoriesData.length / itemsPerPage);
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

renderCategories();


async function chooseCategories(id, method) {
    try {
        const categories = await getCategories();
        const categoriesData = categories.data;
        // console.log(categoriesData);
        if (method === 'remove') {
            localStorage.setItem('categoryId', JSON.stringify(id));
            categoriesDeleteModal.style.display = 'flex';
            modalOverlay.classList.add('active');
        } else if (method === 'edit') {
            const category = categoriesData.find(cat => cat.id === id);
            if (category) {
                editNameInput.value = category.name;
                localStorage.setItem('categoryId', JSON.stringify(id));
                categoriesEditModal.style.display = 'flex';
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

// EVENTS
createCategoryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    categoriesModal.style.display = 'flex';
    modalOverlay.classList.add('active');
});

// Close modal when clicking on overlay
modalOverlay.addEventListener('click', () => {
    categoriesModal.style.display = 'none';
    categoriesEditModal.style.display = 'none';
    categoriesDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (categoriesModal.style.display === 'flex' && !categoriesModal.contains(e.target) && !e.target.closest('#create-category-btn')) {
        categoriesModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
    if (categoriesEditModal.style.display === 'flex' && !categoriesEditModal.contains(e.target)) {
        categoriesEditModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
    if (categoriesDeleteModal.style.display === 'flex' && !categoriesDeleteModal.contains(e.target)) {
        categoriesDeleteModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
});

categoriesModal.addEventListener('click', (e) => {
    e.stopPropagation();
});

addCategoriesBtn.addEventListener('click', async () => {

    const name = addNameInput.value.trim()

    if (!name) {
        Toastify({
            text: "Zəhmət olmasa kateqoriya adı daxil et!",
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

    const newCategory = {
        name: name
    }
    await createCategory(newCategory);
    await renderCategories();
    categoriesModal.style.display = 'none';
    modalOverlay.classList.remove('active');
    addNameInput.value = '';


    Toastify({
        text: "Kateqoriya uğurla əlavə edildi ✅",
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

editCategoriesBtn.addEventListener('click', async () => {
    const localId = JSON.parse(localStorage.getItem('categoryId'));


    const updatedCategory = {
        name: editNameInput.value,
    }

    await updateCategoryById(localId, updatedCategory);
    await renderCategories();

    categoriesEditModal.style.display = 'none';
    modalOverlay.classList.remove('active');
    editNameInput.value = '';

      Toastify({
        text: "Kateqoriya uğurla edit edildi ✅",
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

deleteCategoriesBtn.addEventListener('click', async () => {
    const localId = JSON.parse(localStorage.getItem('categoryId'));
    await deleteCategoryById(localId);
    await renderCategories();
    categoriesDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');

      Toastify({
        text: "Kateqoriya uğurla silindi ✅",
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

cancelDeleteBtn.addEventListener('click', () => {
    categoriesDeleteModal.style.display = 'none';
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