/**
 * Módulo de Autenticación
 * Este módulo maneja todas las operaciones relacionadas con la autenticación de usuarios,
 * incluyendo registro, inicio de sesión, cierre de sesión y gestión de errores.
 */

import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig.js';

/**
 * Códigos de estado para las operaciones de autenticación
 */
const AuthStatus = {
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending'
};

/**
 * Tipos de usuario disponibles en la aplicación
 */
const UserRoles = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin'
};

/**
 * Clase principal para manejar la autenticación
 */
class AuthService {
    /**
     * Registra un nuevo usuario
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @param {Object} userData - Datos adicionales del usuario
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async registerUser(email, password, userData) {
        try {
            // Crear usuario en Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Crear documento en Firestore
            await this.createUserProfile(user.uid, {
                email: email,
                role: userData.role || UserRoles.BUYER,
                name: userData.name,
                createdAt: new Date().toISOString(),
                ...userData
            });

            return this.createResponse(true, null, user);
        } catch (error) {
            return this.createResponse(false, this.getAuthErrorMessage(error.code));
        }
    }

    /**
     * Inicia sesión de usuario
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async loginUser(email, password) {
        try {
            if (!email || !password) {
                return this.createResponse(false, 'El correo y la contraseña son obligatorios');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return this.createResponse(false, 'El formato del correo electrónico no es válido');
            }

            // Validar longitud mínima de contraseña
            if (password.length < 6) {
                return this.createResponse(false, 'La contraseña debe tener al menos 6 caracteres');
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return this.createResponse(true, null, userCredential.user);
        } catch (error) {
            return this.createResponse(false, this.getAuthErrorMessage(error.code));
        }
    }

    /**
     * Cierra la sesión del usuario actual
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async logoutUser() {
        try {
            await signOut(auth);
            return this.createResponse(true);
        } catch (error) {
            return this.createResponse(false, 'Error al cerrar sesión');
        }
    }

    /**
     * Observa cambios en el estado de autenticación
     * @param {Function} callback - Función a ejecutar cuando cambia el estado
     * @returns {Function} Función para dejar de observar
     */
    static onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    }

    /**
     * Crea el perfil del usuario en Firestore
     * @private
     * @param {string} uid - ID del usuario
     * @param {Object} data - Datos del perfil
     */
    static async createUserProfile(uid, data) {
        try {
            await setDoc(doc(db, 'users', uid), data);
        } catch (error) {
            console.error('Error al crear perfil:', error);
            throw error;
        }
    }

    /**
     * Crea una respuesta estándar para las operaciones
     * @private
     * @param {boolean} success - Indica si la operación fue exitosa
     * @param {string} error - Mensaje de error (si existe)
     * @param {Object} data - Datos adicionales
     * @returns {Object} Respuesta estandarizada
     */
    static createResponse(success, error = null, data = null) {
        return {
            success,
            status: success ? AuthStatus.SUCCESS : AuthStatus.ERROR,
            error,
            data
        };
    }

    /**
     * Obtiene el mensaje de error en español
     * @private
     * @param {string} errorCode - Código de error de Firebase
     * @returns {string} Mensaje de error en español
     */
    static getAuthErrorMessage(errorCode) {
        const errorMessages = {
            // Errores de registro
            'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
            'auth/invalid-email': 'El formato del correo electrónico no es válido.',
            'auth/operation-not-allowed': 'El inicio de sesión con correo y contraseña no está habilitado.',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
            'auth/missing-password': 'Debes ingresar una contraseña.',
            
            // Errores de inicio de sesión
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
            'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
            'auth/wrong-password': 'La contraseña es incorrecta.',
            'auth/invalid-credential': 'Credenciales inválidas.',
            'auth/invalid-login-credentials': 'El correo o la contraseña son incorrectos.',
            'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, intenta más tarde.',
            'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
            
            // Errores de configuración
            'auth/invalid-api-key': 'Error de configuración: La clave API no es válida.',
            'auth/api-key-not-valid-please-pass-a-valid-api-key': 
                'Error de configuración: La clave API de Firebase no es válida.'
        };

        return errorMessages[errorCode] || `Error de autenticación: ${errorCode}`;
    }
}

// Exportar la clase y constantes
export const {
    registerUser,
    loginUser,
    logoutUser,
    onAuthStateChange
} = AuthService;

export { AuthStatus, UserRoles };
