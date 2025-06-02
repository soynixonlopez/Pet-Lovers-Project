// Importaciones necesarias de Firebase
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut 
} from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RouteGuard from './routeGuard';

// Inicializar el protector de rutas
const routeGuard = RouteGuard.init();

/**
 * Función para cerrar sesión
 * @returns {Promise} Promesa que resuelve cuando se cierra la sesión
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        window.location.href = '/pages/login.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
};

/**
 * Clase que maneja toda la lógica de autenticación
 * Implementa el patrón Singleton para asegurar una única instancia
 */
class AuthManager {
    static instance = null;
    
    constructor() {
        if (AuthManager.instance) {
            return AuthManager.instance;
        }
        AuthManager.instance = this;
        this.currentUser = null;
    }

    /**
     * Inicia sesión con email y contraseña
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} Promesa que resuelve con el usuario o rechaza con error
     */
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.currentUser = userCredential.user;
            
            // Obtener el rol del usuario desde Firestore
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Redirigir según el rol
                if (userData.role === 'business') {
                    window.location.href = '/pages/dashboardbusiness.html';
                } else {
                    window.location.href = '/pages/dashboard.html';
                }
                return userCredential.user;
            } else {
                throw new Error('Usuario no encontrado en la base de datos');
            }
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    /**
     * Maneja los errores de autenticación y muestra mensajes apropiados
     * @private
     * @param {Error} error - Error de Firebase Auth
     */
    handleAuthError(error) {
        let errorMessage = 'Ha ocurrido un error. Por favor, intenta de nuevo.';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'El correo electrónico no es válido.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta cuenta ha sido deshabilitada.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este correo electrónico.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'La contraseña es incorrecta.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
                break;
            default:
                if (error.message === 'Usuario no encontrado en la base de datos') {
                    errorMessage = 'Error en los datos del usuario. Por favor, contacta a soporte.';
                }
        }

        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean} true si hay un usuario autenticado
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Obtiene el usuario actual
     * @returns {Object|null} Usuario actual o null si no hay usuario
     */
    getCurrentUser() {
        return this.currentUser;
    }
}

// Crear instancia del AuthManager
const authManager = new AuthManager();

// Inicializar el manejo del formulario de login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.querySelector('.toggle-password');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await authManager.login(email, password);
            } catch (error) {
                // Los errores se manejan en handleAuthError
                console.error('Error en el login:', error);
            }
        });
    }

    // Manejar la visibilidad de la contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePassword.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
});

export default authManager;
