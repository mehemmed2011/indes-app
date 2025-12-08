const registrForm = document.querySelector('#client-registr-form');
const registrEmailInput = document.querySelector('#registr-email');
const registrPasswordInput = document.querySelector('#registr-password');
const registrFullnameInput = document.querySelector('#registr-fullname');
const registrBtn = document.querySelector('#registr-btn');

// LandingPage-dən gələn email-i yüklə
const pendingEmail = localStorage.getItem('pendingEmail');
if (pendingEmail) {
    registrEmailInput.value = pendingEmail;
    // Email-i localStorage-dan sil
    localStorage.removeItem('pendingEmail');
}

async function registerUser(register) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(register)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            // Check if account already exists
            let errorText = 'Registration failed. Please try again.';
            if (data.message && data.message.toLowerCase().includes('exist')) {
                errorText = 'This account already exists!';
            } else if (data.error && data.error.toLowerCase().includes('exist')) {
                errorText = 'This account already exists!';
            } else if (response.status === 409) {
                errorText = 'This account already exists!';
            }
            
            // Show Toastify error message
            Toastify({
                text: errorText,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#ff4444",
                stopOnFocus: true
            }).showToast();
            
            registrEmailInput.style.border = '1px solid red';
            registrPasswordInput.style.border = '1px solid red';
            registrFullnameInput.style.border = '1px solid red';

            setTimeout(() => {
                registrEmailInput.style.border = '';
                registrPasswordInput.style.border = '';
                registrFullnameInput.style.border = '';
                registrEmailInput.value = '';
                registrPasswordInput.value = '';
                registrFullnameInput.value = '';
            }, 3000)
            return
        }

        if (data.result === true && data.message === 'Successfully registered') {
            // Show success message
            Toastify({
                text: 'Registration is successful!',
                duration: 2000,
                gravity: "top",
                position: "center",
                backgroundColor: "#4CAF50",
                stopOnFocus: true
            }).showToast();

            registrEmailInput.style.border = '1px solid antiqueWhite';
            registrPasswordInput.style.border = '1px solid antiqueWhite';
            registrFullnameInput.style.border = '1px solid antiqueWhite';
            
            window.location.href = '../../../pages/client/login/login.html';

      
        }   
    } catch (error) {
        console.error('Registration error:', error);
        
        // Show Toastify error message
        Toastify({
            text: 'Network error. Please check your connection and try again.',
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ff4444",
            stopOnFocus: true
        }).showToast();
        
        registrEmailInput.style.border = '1px solid red';
        registrPasswordInput.style.border = '1px solid red';
        registrFullnameInput.style.border = '1px solid red';
        setTimeout(() => {
            registrEmailInput.style.border = '';
            registrPasswordInput.style.border = '';
            registrFullnameInput.style.border = '';
        }, 2000)
    }
}

//EVENTS
registrForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // Basic validation
    if (!registrFullnameInput.value.trim()) {
        registrFullnameInput.style.border = '1px solid red';
        return;
    }
    if (!registrEmailInput.value.trim()) {
        registrEmailInput.style.border = '1px solid red';
        return;
    }
    if (!registrPasswordInput.value.trim()) {
        registrPasswordInput.style.border = '1px solid red';
        return;
    }
    
    const register = {
        full_name: registrFullnameInput.value.trim(),
        email: registrEmailInput.value.trim(),
        password: registrPasswordInput.value.trim()
    }
    
    registerUser(register);
});