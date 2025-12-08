const tableBody = document.querySelector('.body-table');
const contactusViewModal = document.querySelector('.contactus-view-modal');
const contactusView = document.querySelector('.contactus-view');
const contactusDeleteModal = document.querySelector('.contactus-delete-modal');
const deleteContactusBtn = document.getElementById('delete-contactus-btn');
const cancelDeleteBtn = document.getElementById('cancel-contactus-btn');
const logoutBtn = document.querySelector('.logout');
const modalOverlay = document.querySelector('.modal-overlay');

let currentPage = 1;
const itemsPerPage = 8;
let contactusData = [];

//Token
const token = localStorage.getItem('token');

//Api Call
async function getContactus() {
    const  url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts`;
    const options = {
        method: 'GET',
        headers: {
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

async function deleteContactus(id) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
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

//----------------------------------------------------------
async function renderContactus() {
    const contactus = await getContactus();
    contactusData = contactus.data;
    showPage(currentPage);
    renderPagination();
}

function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const contactusToShow = contactusData.slice(start, end);
    
    tableBody.innerHTML = contactusToShow.reverse().map(contactus => `
        <tr>
            <td>${contactus.id}</td>
            <td>${contactus.full_name}</td>
            <td>${contactus.email}</td>
            <td>${contactus.reason}</td>
            <td>
                <button class="search-btn" onclick="chooseContactus(${contactus.id}, 'search')"><i class="fa-solid fa-magnifying-glass"></i></button>
            </td>
            <td>
                <button class="delete-btn" onclick="chooseContactus(${contactus.id}, 'remove')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(contactusData.length / itemsPerPage);
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


async function chooseContactus(id, method) {
    try {
        const dataContactus = await getContactus();
        allContactus = dataContactus.data;
        const contactus = allContactus.find(con => con.id === id);
        
        if (!contactus) {
            Toastify({
                text: "Bu contact us tapılmadı!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff9800",
            }).showToast();
            return;
        }
        
        localStorage.setItem('contactusId', JSON.stringify(id));
        
        if (method === 'search') {
            contactusView.textContent = contactus.reason;
            contactusViewModal.style.display = 'flex';
            modalOverlay.classList.add('active');
        } else if (method === 'remove') {
            contactusDeleteModal.style.display = 'flex';
            modalOverlay.classList.add('active');
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

// Close modal when clicking on overlay
modalOverlay.addEventListener('click', () => {
    contactusViewModal.style.display = 'none';
    contactusDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
});

deleteContactusBtn.addEventListener('click', async () => {
    const localId = JSON.parse(localStorage.getItem('contactusId'));
    await deleteContactus(localId);
    await renderContactus();
    contactusDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');

    Toastify({
        text: "Contact uğurla silindi ✅",
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
    contactusDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (contactusViewModal.style.display === 'flex' && !contactusViewModal.contains(e.target)) {
        contactusViewModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
    if (contactusDeleteModal.style.display === 'flex' && !contactusDeleteModal.contains(e.target)) {
        contactusDeleteModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
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


// İlk yükləmə
renderContactus();

