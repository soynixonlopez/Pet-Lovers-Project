/**
 * Componentes Reutilizables
 * Este archivo maneja la carga y funcionalidad de los componentes header y footer
 */

// Cargar los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo cargar componentes si estamos en la página principal
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        loadHeader();
        loadFooter();
    }
    initializeComponents();
});

/**
 * Carga el componente Header
 */
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('./components/header.html')
        .then(response => response.text())
        .then(data => {
            headerPlaceholder.innerHTML = data;
            initializeHeader();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

/**
 * Carga el componente Footer
 */
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
            initializeFooter();
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

/**
 * Inicializa las funcionalidades del Header
 */
function initializeHeader() {
    // Marcar el enlace activo en la navegación
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Efecto de scroll en el navbar
    const navbar = document.querySelector('.main-header');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Manejar el formulario de búsqueda
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchForm.querySelector('input').value;
            // Aquí puedes implementar la lógica de búsqueda
            console.log('Búsqueda:', searchTerm);
        });
    }

    // Dropdown hover en desktop
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
}

/**
 * Inicializa las funcionalidades del Footer
 */
function initializeFooter() {
    // Botón "Volver arriba"
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Inicializar enlaces sociales
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            if (url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
}

/**
 * Inicializa componentes adicionales y funcionalidades globales
 */
function initializeComponents() {
    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector('.navbar-collapse');
        const toggleButton = document.querySelector('.navbar-toggler');
        
        if (!navbar?.contains(e.target) && !toggleButton?.contains(e.target)) {
            navbar?.classList.remove('show');
        }
    });

    // Manejar carrito de compras
    updateCartCount();
}

/**
 * Actualiza el contador del carrito
 */
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // Aquí puedes implementar la lógica para obtener el número real de items
        const itemsInCart = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')).length : 0;
        cartCount.textContent = itemsInCart;
    }
}