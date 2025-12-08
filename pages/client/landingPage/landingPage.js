const signInBtn = document.querySelector('#sign-in-btn');
const emailInput = document.querySelector('#email-input');
const startBtn = document.querySelector('#start-btn');
const filmalisaForm = document.querySelector('.filmalisa-form');
const userDropdown = document.getElementById('user-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const contactusFullname = document.querySelector('#contactus-fullname');
const contactusEmail = document.querySelector('#contactus-email');
const contactusMessage = document.querySelector('#contactus-message');
const contactusBtn = document.querySelector('#contactus-btn');
const contactusForm = document.querySelector('.contactus-form');

//Token
const token = localStorage.getItem('token');


async function registerUser(register) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(register)
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

async function loginUser(login) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/auth/login`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log('Data:', data);

        if (!response.ok) {
            loginPasswordInput.style = 'border: 1px solid red';
            loginUsernameInput.style = 'border: 1px solid red';
            setTimeout(() => {
                loginPasswordInput.style = '';
                loginUsernameInput.style = '';
                loginUsernameInput.value = '';
                loginPasswordInput.value = '';
            }, 2000)
            return
        }

        const token = data.data.tokens.access_token;

        if (token) {
            localStorage.setItem('token', token);

            // İstəsən profil məlumatlarını da saxla
            const profile = data.data.profile;
            localStorage.setItem('user', JSON.stringify(profile));

            loginPasswordInput.style = 'border: 1px solid antiqueWhite';
            loginUsernameInput.style = 'border: 1px solid antiqueWhite';
            window.location.href = './pages/client/home/home.html';

        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function getProfile() {
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
        console.error('Error:', error);
    }
}

async function showProfile() {
    const profile = await getProfile();
    userAvatar.src = profile.data.img_url;
    userName.textContent = profile.data.full_name;
}

// Token varsa dropdown göster, yoxsa Sign-in göster
if (token) {
    signInBtn.textContent = 'Profile';
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        userDropdown.classList.toggle('show');
        showProfile();
    });
} else {
    signInBtn.addEventListener('click', () => {
        window.location.href = './pages/client/login/login.html';
    });
}

// Logout funksiyası
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = './index.html';
    });
}

// Dropdown xaricində klikləndikdə bağla
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        userDropdown.classList.remove('show');
    }
});

//EVENTS

filmalisaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    if(!token && email){
    localStorage.setItem('pendingEmail', email);
    window.location.href = "./pages/client/registr/registr.html";
    } else if(!token && !email){
        emailInput.style.border = '1px solid red';
        setTimeout(() => {
            emailInput.style.border = '';
        }, 2000);
    }
});

// FAQ Accordion funksionallığı
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-item-question');
    
    question.addEventListener('click', () => {
        // Əgər cari item açıqdırsa, bağla
        const isActive = item.classList.contains('active');
        
        // Bütün FAQ item-ləri bağla
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Əgər cari item bağlı idisə, aç
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Contact Us funksionallığı
async function sendContactMessage(contactData) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/contact`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Contact form submit
contactusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullname = contactusFullname.value.trim();
    const email = contactusEmail.value.trim();
    const message = contactusMessage.value.trim();
    
    // Validation
    if (!fullname || !email || !message) {
        Toastify({
            text: "Bütün xanaları doldurun! ❌",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Toastify({
            text: "Düzgün email daxil edin! ❌",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
        return;
    }
    
    const contactData = {
        full_name: fullname,
        email: email,
        reason: message
    };
    
    const result = await sendContactMessage(contactData);
    
    if (result && result.result === true) {
        Toastify({
            text: "Mesajınız uğurla göndərildi! ✅",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#28a745",
        }).showToast();
        
        // Formu təmizlə
        contactusFullname.value = '';
        contactusEmail.value = '';
        contactusMessage.value = '';
    } else {
        Toastify({
            text: "Mesaj göndərilərkən xəta baş verdi! ❌",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#a72a28ff",
        }).showToast();
    }
});
