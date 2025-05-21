// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle user type selection in registration form
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    const sellerFields = document.getElementById('sellerFields');

    if (userTypeRadios && sellerFields) {
        userTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'seller') {
                    sellerFields.style.display = 'block';
                    document.getElementById('businessName').required = true;
                    document.getElementById('businessAddress').required = true;
                    document.getElementById('taxId').required = true;
                } else {
                    sellerFields.style.display = 'none';
                    document.getElementById('businessName').required = false;
                    document.getElementById('businessAddress').required = false;
                    document.getElementById('taxId').required = false;
                }
            });
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.querySelector('input[name="userType"]:checked').value;

            console.log('Login attempt:', { email, userType });
            
            if (userType === 'buyer') {
                window.location.href = 'buyer-dashboard.html';
            } else {
                window.location.href = 'seller-dashboard.html';
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userType = document.querySelector('input[name="userType"]:checked').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            let sellerData = {};
            if (userType === 'seller') {
                sellerData = {
                    businessName: document.getElementById('businessName').value,
                    businessAddress: document.getElementById('businessAddress').value,
                    taxId: document.getElementById('taxId').value
                };
            }

            console.log('Registration attempt:', {
                userType,
                firstName,
                lastName,
                email,
                phone,
                ...sellerData
            });

            alert('Registro exitoso. Por favor, inicia sesión.');
            window.location.href = 'login.html';
        });
    }
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form Submissions
    const contactForm = document.querySelector('#contactForm');
    const newsletterForm = document.querySelector('#newsletterForm');
    
    contactForm?.addEventListener('submit', handleFormSubmit);
    newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
    
    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Contact form submitted:', data);
        showNotification('Mensaje enviado con éxito', 'success');
        e.target.reset();
    }
    
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        console.log('Newsletter subscription:', email);
        showNotification('¡Gracias por suscribirte!', 'success');
        e.target.reset();
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn?.addEventListener('click', () => {
            notification.remove();
        });
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.navbar-toggler');
    const mobileMenu = document.querySelector('.navbar-collapse');
    
    mobileMenuToggle?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('show');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu?.contains(e.target) && !mobileMenuToggle?.contains(e.target)) {
            mobileMenu?.classList.remove('show');
        }
    });
    
    // Handle Dropdown Hover on Desktop
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        if (window.innerWidth >= 992) {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.querySelector('.dropdown-menu')?.classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
            });
        }
    });

    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentLocation.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Initialize Bootstrap components
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    var dropdownList = dropdownElementList.map(function(dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });
}); 