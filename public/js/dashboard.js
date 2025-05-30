import { auth, db } from '/src/firebase/firebaseConfig.js';
import { logoutUser } from '/src/firebase/auth.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Inicializar el Dashboard
export const initializeDashboard = () => {
    // Verificar estado de autenticación
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await loadUserData(user);
            setupLogoutButton();
        } else {
            // Usuario no está autenticado, redirigir al login
            window.location.href = './login.html';
        }
    });
};

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
    document.getElementById('user-name').textContent = userName;
    document.getElementById('profile-name').textContent = userName;
    document.getElementById('profile-email').textContent = userEmail;
};

// Configurar el botón de logout
const setupLogoutButton = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await logoutUser();
                window.location.href = './login.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }
}; 