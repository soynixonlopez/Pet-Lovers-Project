import { auth, db } from '../../src/firebase/firebaseConfig.js';
import { logoutUser } from '../../src/firebase/auth.js';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Inicializar el Dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await loadUserData(user);
            setupLogoutButton();
            setupNavigationLinks();
        }
    });
});

// Cargar datos del usuario
const loadUserData = async (user) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Actualizar nombre de usuario según el tipo de cuenta
            const userName = userData.role === 'business' ? 
                userData.businessName : 
                `${userData.firstName} ${userData.lastName}`;
            
            updateUIWithUserData(userName, user.email, userData);
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
    }
};

// Actualizar la UI con los datos del usuario
const updateUIWithUserData = (userName, userEmail, userData) => {
    // Actualizar elementos del header
    const userNameElement = document.getElementById('user-name');
    const profileNameElement = document.getElementById('profile-name');
    const profileEmailElement = document.getElementById('profile-email');
    const userAvatars = document.querySelectorAll('.user-avatar');

    if (userNameElement) userNameElement.textContent = userName;
    if (profileNameElement) profileNameElement.textContent = userName;
    if (profileEmailElement) profileEmailElement.textContent = userEmail;

    // Actualizar avatares con las iniciales del usuario
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
    userAvatars.forEach(avatar => {
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=ff6b6b&color=fff`;
    });

    // Actualizar estadísticas si están disponibles
    updateStatistics(userData);
};

// Actualizar estadísticas del usuario
const updateStatistics = (userData) => {
    // Aquí puedes agregar lógica para actualizar las estadísticas
    // basándote en los datos del usuario
    // Por ahora mantendremos los valores de ejemplo
};

// Configurar el botón de logout
const setupLogoutButton = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await logoutUser();
                window.location.href = '/index.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }
};

// Configurar enlaces de navegación
const setupNavigationLinks = () => {
    const homeLink = document.querySelector('.logo');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/index.html';
        });
    }
}; 