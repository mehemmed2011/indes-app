const tableBody = document.querySelector('.body-table');
const logoutBtn = document.querySelector('.logout');

//Token
const token = localStorage.getItem('token');

let currentPage = 1;
const itemsPerPage = 8;
let allUsers = [];

async function getUsers() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/users`;
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
        console.error('Error fetching users:', error);
        return null;
    }
}


async function renderUsers() {
    const usersData = await getUsers();
    allUsers = usersData.data;
    showPage(currentPage);
    renderPagination();
}

function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const usersToShow = allUsers.slice(start, end);

    tableBody.innerHTML = usersToShow.map(user => `
             <tr>
              <td>${user.id}</td>
              <td>${user.full_name}</td>
              <td>${user.email}</td>
          </tr>
        `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(allUsers.length / itemsPerPage);
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

renderUsers();


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