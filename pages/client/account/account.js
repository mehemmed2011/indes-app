const accountProfileImg = document.getElementById('account-profile-img');
const accountFullname = document.getElementById('account-fullname');
const accountEmail = document.getElementById('account-email');
const accountPassword = document.getElementById('account-password');
const saveBtn = document.getElementById('save-btn');
const passwordEye=document.getElementById('password-eye');
const profilePreviewImg=document.getElementById('profile-preview-img');

//Token
const token = localStorage.getItem('token');


//Api Calls
async function getAccount() {
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
        
    }
}

async function updateAccountData(updatedAccount) {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/profile`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedAccount)
    }
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        
    }
}

//------------------------------------------------------------------------
showAccountData();

async function showAccountData() {
    try {
        const account = await getAccount();
        if (account) {
            accountProfileImg.value = account.data.img_url;
            accountFullname.value = account.data.full_name;
            accountEmail.value = account.data.email;
            accountPassword.value = account.data.password;
            
            // Set profile preview image
            if (account.data.img_url) {
                profilePreviewImg.src = account.data.img_url;
                profilePreviewImg.onerror = function() {
                    profilePreviewImg.src = '../../../assets/images/default.jpg';
                };
            }
        }
    } catch (error) {
        console.log('Error fetching account:', error);
    }
}



//EVENTS
accountProfileImg.addEventListener('input', function() {
    const imageUrl = this.value;
    if (imageUrl) {
        profilePreviewImg.src = imageUrl;
        profilePreviewImg.onerror = function() {
            // If image fails to load, show default image
            profilePreviewImg.src = '../../../assets/images/default.jpg';
        };
    } else {
        profilePreviewImg.src = '../../../assets/images/default.jpg';
    }
});


passwordEye.addEventListener('click', function() {
    if (accountPassword.type === 'password') {
        accountPassword.type = 'text';
        passwordEye.src = '../../../assets/icons/password-eye.svg'; 
    } else {
        accountPassword.type = 'password';
        passwordEye.src = '../../../assets/icons/password-eye.svg';
    }
});

// Input-lar focus olduqda saved class-unu sil
const inputsData = [accountProfileImg, accountFullname, accountEmail, accountPassword];

inputsData.forEach(input => {
    input.addEventListener('focus', function() {
        this.classList.remove('saved');
    });
});

saveBtn.addEventListener('click', async (event) => {
    // Prevent form default submit + page reload
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    try {
        const updatedAccount = {
            img_url: accountProfileImg.value,
            full_name: accountFullname.value,
            email: accountEmail.value,
            password: accountPassword.value
        }
        const result = await updateAccountData(updatedAccount);
        if (result) {
            console.log('Account updated successfully');
            
            // Məlumatları localStorage-a yaz (admin login üçün)
            localStorage.setItem('userName', accountFullname.value);
            localStorage.setItem('userImg', accountProfileImg.value);
            localStorage.setItem('userEmail', accountEmail.value);
            localStorage.setItem('userPassword', accountPassword.value);
  
            // Save olduqdan sonra input-lara saved class əlavə et
            inputsData.forEach(input => {
                input.classList.add('saved');
            });
        }
    } catch (error) {
        console.log('Error updating account:', error);
    }
});
