import { auth, db } from '../../src/firebase/firebaseConfig.js';
import { logoutUser } from '../../src/firebase/auth.js';
import { doc, getDoc } from 'firebase/firestore';
import RouteGuard from '../../src/firebase/routeGuard.js';

// Inicializar el protector de rutas
RouteGuard.init();

// Inicializar el Dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (auth.currentUser) {
        loadUserData(auth.currentUser);
        setupLogoutButton();
    }
});

// Cargar datos del usuario
const loadUserData = async (user) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Actualizar nombre de usuario
            const userName = userData.firstName ? 
                `${userData.firstName} ${userData.lastName}` : 
                userData.businessName || 'Usuario';
            
            updateUIWithUserData(userName, user.email);
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
    }
};

// Actualizar la UI con los datos del usuario
const updateUIWithUserData = (userName, userEmail) => {
    const userNameElement = document.getElementById('user-name');
    const profileNameElement = document.getElementById('profile-name');
    const profileEmailElement = document.getElementById('profile-email');

    if (userNameElement) userNameElement.textContent = userName;
    if (profileNameElement) profileNameElement.textContent = userName;
    if (profileEmailElement) profileEmailElement.textContent = userEmail;
};

// Configurar el botón de logout
const setupLogoutButton = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await logoutUser();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }
}; 