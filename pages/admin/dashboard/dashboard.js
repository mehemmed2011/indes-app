const totalFav = document.querySelector('#total-fav');
const totalUsers = document.querySelector('#total-users');
const totalMovies = document.querySelector('#total-movies');
const totalComments = document.querySelector('#total-comments');
const totalCategories = document.querySelector('#total-categories');
const totalActors = document.querySelector('#total-actors');
const totalContacts = document.querySelector('#total-contacts');
const logoutBtn = document.querySelector('.logout');

const token = localStorage.getItem('token');



async function loadDashboardTotal() {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard`;
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
        console.log('Dashboard total data', data);
        return data;
    } catch (error) {
        console.log('Err', error);
    }

}

async function renderDashboard() {
    const totalData = await loadDashboardTotal();
    let favCount = 0;
    let userCount = 0;
    let movieCount = 0;
    let commentCount = 0;
    let categoryCount = 0;
    let actorCount = 0;
    let contactCount = 0;

    let interval = setInterval(() => {
        if (favCount < totalData.data.favorites) favCount++;
        if (userCount < totalData.data.users) userCount++;
        if (movieCount < totalData.data.movies) movieCount++;
        if (commentCount < totalData.data.comments) commentCount++;
        if (categoryCount < totalData.data.categories) categoryCount++;
        if (actorCount < totalData.data.actors) actorCount++;
        if (contactCount < totalData.data.contacts) contactCount++;

        totalFav.textContent = favCount;
        totalUsers.textContent = userCount;
        totalMovies.textContent = movieCount;
        totalComments.textContent = commentCount;
        totalCategories.textContent = categoryCount;
        totalActors.textContent = actorCount;
        totalContacts.textContent = contactCount;


        if (favCount >= totalData.data.favorites &&
            userCount >= totalData.data.users &&
            movieCount >= totalData.data.movies &&
            commentCount >= totalData.data.comments &&
            categoryCount >= totalData.data.categories &&
            actorCount >= totalData.data.actors &&
            contactCount >= totalData.data.contacts) {
            clearInterval(interval);
        }
    }, 30);
}

renderDashboard();

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