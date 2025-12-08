const tableBody = document.querySelector('.body-table');
const commentsViewModal = document.querySelector('.comments-view-modal');
const commentView = document.querySelector('.comment-view');
const commentsDeleteModal = document.querySelector('.comments-delete-modal');
const deleteCommentBtn = document.getElementById('delete-comment-btn');
const cancelDeleteBtn = document.getElementById('cancel-comment-btn');
const logoutBtn = document.querySelector('.logout');
const modalOverlay = document.querySelector('.modal-overlay');

let currentPage = 1;
const itemsPerPage = 8;
let allComments = [];

//Token
const token = localStorage.getItem("token");

//Api Calls
async function getComments() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments`;
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
        console.error('Error fetching comments:', error);
    }
}

async function deleteCommentById(movieId, commentId) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieId}/comment/${commentId}`;
    const options = {
        method: 'DELETE',
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
        console.error('Error deleting comment:', error);
        throw error;
    }
}

/*---------------------------------------------------*/
async function renderComments() {
    const dataComments = await getComments();
    allComments = dataComments.data;
    showPage(currentPage);
    renderPagination();
}

function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const commentsToShow = allComments.slice(start, end);

    tableBody.innerHTML = commentsToShow.reverse().map(comment => `
       <tr>
                        <td>${comment.id}</td>
                        <td>${comment.user.full_name}</td>
                        <td>${comment.user.email}</td>
                        <td>${comment.movie.title}</td>
                        <td>${comment.comment}</td>
                        <td>
                            <button class="search-btn" onclick="chooseComments(${comment.id},'search')"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </td>
                        <td>
                             <button class="delete-btn"  onclick="chooseComments(${comment.id},'remove')"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(allComments.length / itemsPerPage);
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

renderComments();

async function chooseComments(id, method) {
    try {
        const dataComments = await getComments();
        allComments = dataComments.data;
        const comment = allComments.find(com => com.id === id);
        
        if (!comment) {
            Toastify({
                text: "Bu komment tapılmadı!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff9800",
            }).showToast();
            return;
        }
        
        localStorage.setItem('commentId', JSON.stringify(id));
        localStorage.setItem('movieId', JSON.stringify(comment.movie.id));
        
        if (method === 'search') {
            commentView.textContent = comment.comment;
            commentsViewModal.style.display = 'flex';
            modalOverlay.classList.add('active');
        } else if (method === 'remove') {
            commentsDeleteModal.style.display = 'flex';
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
    commentsViewModal.style.display = 'none';
    commentsDeleteModal.style.display = 'none';
    modalOverlay.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (commentsViewModal.style.display === 'flex' && !commentsViewModal.contains(e.target)) {
        commentsViewModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
    if (commentsDeleteModal.style.display === 'flex' && !commentsDeleteModal.contains(e.target)) {
        commentsDeleteModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }
});



deleteCommentBtn.addEventListener('click', async () => {
    try {
        const commentId = JSON.parse(localStorage.getItem('commentId'));
        const movieId = JSON.parse(localStorage.getItem('movieId'));
        
        await deleteCommentById(movieId, commentId);
        await renderComments();
        commentsDeleteModal.style.display = 'none';
        modalOverlay.classList.remove('active');

        Toastify({
            text: "Comment uğurla silindi ✅",
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
        console.error('Comment silinərkən xəta:', error);
        Toastify({
            text: "Comment silinərkən xəta baş verdi!",
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

cancelDeleteBtn.addEventListener('click', () => {
    commentsDeleteModal.style.display = 'none';
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