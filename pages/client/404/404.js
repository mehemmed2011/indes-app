// 404 Page JavaScript
const token = localStorage.getItem('token');

// Check if user is logged in
if (!token) {
    // Hide profile menu for non-logged in users
    const profileMenu = document.querySelector('.profile-menu');
    if (profileMenu) {
        profileMenu.style.display = 'none';
    }
}

// DOM Elements
const logoutBtn = document.getElementById('logout');

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    addFloatingAnimations();
});

function setupEventListeners() {
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../../../index.html';
        });
    }
    
    // Profile menu toggle
    const profileMenu = document.querySelector('.profile-menu');
    if (profileMenu) {
        profileMenu.addEventListener('click', () => {
            profileMenu.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (profileMenu && !profileMenu.contains(e.target)) {
            profileMenu.classList.remove('active');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open dropdowns
            if (profileMenu) {
                profileMenu.classList.remove('active');
            }
        }
    });
}

// Add floating animations to movie cards
function addFloatingAnimations() {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach((card, index) => {
        // Add random delay for more natural movement
        const randomDelay = Math.random() * 2;
        card.style.animationDelay = `${randomDelay}s`;
        
        // Add random movement variation
        const randomVariation = Math.random() * 20 - 10;
        card.style.setProperty('--random-y', `${randomVariation}px`);
    });
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add hover effects to suggestion links
    const suggestionLinks = document.querySelectorAll('.suggestion-links a');
    
    suggestionLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn-primary,
    .btn-secondary,
    .btn-outline {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Add some fun Easter eggs
let clickCount = 0;
document.addEventListener('click', (e) => {
    clickCount++;
    
    // Easter egg: Click 10 times to show secret message
    if (clickCount === 10) {
        showEasterEgg();
        clickCount = 0;
    }
});

function showEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #e50914;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #e50914;
        z-index: 1000;
        text-align: center;
        font-family: 'Raleway', sans-serif;
        animation: easterEggAnimation 3s ease-out forwards;
    `;
    
    easterEgg.innerHTML = `
        <h3>🎬 Easter Egg Found! 🎬</h3>
        <p>You found the secret!<br>
        This 404 page is as mysterious as<br>
        the missing scenes in your favorite movies!</p>
        <small>Click anywhere to close</small>
    `;
    
    document.body.appendChild(easterEgg);
    
    // Add animation CSS
    const easterEggStyle = document.createElement('style');
    easterEggStyle.textContent = `
        @keyframes easterEggAnimation {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(easterEggStyle);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        easterEgg.remove();
        easterEggStyle.remove();
    }, 3000);
    
    // Remove on click
    easterEgg.addEventListener('click', () => {
        easterEgg.remove();
        easterEggStyle.remove();
    });
}

// Add some dynamic background effects
function addDynamicEffects() {
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: #e50914;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        animation: particleFloat ${5 + Math.random() * 10}s linear infinite;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
        // Create new particle
        createParticle();
    }, (5 + Math.random() * 10) * 1000);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Start dynamic effects after a delay
setTimeout(addDynamicEffects, 2000);

// Add some console fun
console.log(`
🎬 Filmalisa 404 Page 🎬

Looks like you've stumbled into the digital equivalent of a deleted scene!

Fun fact: Even the best movies have scenes that end up on the cutting room floor.
This page is like that - it exists, but it's not where you expected to be!

Thanks for visiting! 🍿
`);

// Add some error tracking (mock)
function track404Error() {
    const errorData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        type: '404_error'
    };
    
    // Store in localStorage for demo purposes
    try {
        const errors = JSON.parse(localStorage.getItem('404_errors') || '[]');
        errors.push(errorData);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(0, errors.length - 10);
        }
        
        localStorage.setItem('404_errors', JSON.stringify(errors));
    } catch (e) {
        console.warn('Could not store 404 error data:', e);
    }
}

// Track the 404 error
track404Error();