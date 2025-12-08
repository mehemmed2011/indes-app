const loginForm = document.querySelector('#admin-login-form');
const loginUsernameInput = document.querySelector('#login-username');
const loginPasswordInput = document.querySelector('#login-password');
const loginBtn = document.querySelector('#login-btn');
const passwordEye = document.querySelector('#password-eye');

const token = localStorage.getItem('token');

// Password göstərmək/gizlətmək funksiyası
if (passwordEye) {
    passwordEye.addEventListener('click', function() {
        if (loginPasswordInput.type === 'password') {
            loginPasswordInput.type = 'text';
        } else {
            loginPasswordInput.type = 'password';
        }
    });
}

const userInput = {
    email: localStorage.getItem('userEmail'),
    password: localStorage.getItem('userPassword'),
    name: localStorage.getItem('userName'),
    img: localStorage.getItem('userImg')
}

// Səhifə yükləndikdə input-ları localStorage-dan doldur
if (userInput.email) {
    loginUsernameInput.value = userInput.email;
}
if (userInput.password) {
    loginPasswordInput.value = userInput.password;
}

// Api Calls
async function getProfile(token) {
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
        console.log('Error:', error);
    }
}


async function loginUser(login) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
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
            }, 2000)
            return
        }

        const token = data.data.tokens.access_token;

        if (token) {
            localStorage.setItem('token', token);

            const profileData = await getProfile(token);
            console.log('Profile data:', profileData);

            // Profil məlumatlarını localStorage-a yaz
            if (profileData && profileData.result) {
                const userImg = profileData?.data?.img_url || userInput.img || '/assets/images/default.jpg';
                const userName = profileData?.data?.full_name || userInput.name || 'Admin';
                
                localStorage.setItem('userImg', userImg);
                localStorage.setItem('userName', userName);
            }

            loginPasswordInput.style = 'border: 1px solid antiqueWhite';
            loginUsernameInput.style = 'border: 1px solid antiqueWhite';
            
            // Dashboard-a yönləndir
            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 500);

        }
    } catch (error) {
        console.error('Error:', error);
    }

}

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const login = {
        email: loginUsernameInput.value.trim(),
        password: loginPasswordInput.value.trim()
    }

    console.log(login);
    loginUser(login);

})