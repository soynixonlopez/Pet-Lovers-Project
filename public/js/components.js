// Component Loading System
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initializeNavigation();
    initializeSearch();
    initializeCart();
    initializeMobileMenu();
    initializeSocialLinks();
    initializeScrollEffects();
});

// Component Loading
function loadComponents() {
    // Load header
    const headerPlaceholder = document.querySelector('#header-placeholder');
    if (headerPlaceholder) {
        fetch('/components/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initializeHeader();
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    if (footerPlaceholder) {
        fetch('/components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
                initializeFooter();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

// Navigation Active State
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight * (percentageScroll/100)));
    };

    const displayScrollElement = element => {
        element.classList.add('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Search Handling
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                // Implement search functionality here
                console.log('Searching for:', query);
            }
        });

        // Live search suggestions
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query && searchResults) {
                // Implement live search suggestions here
                searchResults.style.display = 'block';
            } else if (searchResults) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Cart Functionality
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCounter = document.querySelector('.cart-counter');
    const cartDropdown = document.querySelector('.cart-dropdown');
    
    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartDropdown.classList.toggle('show');
        });

        // Close cart dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('show');
            }
        });
    }

    // Update cart counter
    function updateCartCounter(count) {
        if (cartCounter) {
            cartCounter.textContent = count;
            cartCounter.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Initialize with 0 items
    updateCartCounter(0);
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active');
            }
            document.body.classList.toggle('menu-open');
        });

        if (overlay) {
            overlay.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
    }
}

// Social Links
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = e.currentTarget.dataset.platform;
            const url = e.currentTarget.href;
            
            // Analytics tracking can be added here
            console.log(`Clicked ${platform} social link:`, url);
        });
    });
} 