import { 
    createUserWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth';
import { 
    doc, 
    setDoc,
    serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig.js';
import RouteGuard from './routeGuard.js';

// Inicializar el protector de rutas
const routeGuard = RouteGuard.init();

class RegisterManager {
    constructor() {
        this.initializeForm();
        this.setupEventListeners();
    }

    initializeForm() {
        // Obtener los campos del formulario
        this.form = document.querySelector('.auth-form');
        this.accountTypeInputs = document.querySelectorAll('input[name="accountType"]');
        this.userFields = document.getElementById('userFields');
        this.businessFields = document.getElementById('businessFields');
        
        // Mostrar campos según el tipo de cuenta seleccionado
        this.accountTypeInputs.forEach(input => {
            input.addEventListener('change', () => this.toggleFields());
        });
    }

    toggleFields() {
        const isBusinessAccount = document.getElementById('businessAccount').checked;
        this.userFields.style.display = isBusinessAccount ? 'none' : 'block';
        this.businessFields.style.display = isBusinessAccount ? 'block' : 'none';
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegistration();
            });

            // Configurar los toggles de contraseña
            const toggleButtons = document.querySelectorAll('.toggle-password');
            toggleButtons.forEach(button => {
                button.addEventListener('click', () => this.togglePasswordVisibility(button));
            });
        }
    }

    togglePasswordVisibility(button) {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    async handleRegistration() {
        try {
            // Indicar que estamos en proceso de registro
            routeGuard.setRegistering(true);

            // Validar el formulario
            if (!this.validateForm()) {
                routeGuard.setRegistering(false);
                return;
            }

            const isBusinessAccount = document.getElementById('businessAccount').checked;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Preparar datos según el tipo de cuenta
            const userData = isBusinessAccount ? 
                this.prepareBusinessData() : 
                this.prepareUserData();

            // Guardar datos en Firestore
            await this.saveUserData(user.uid, userData);

            // Actualizar el perfil del usuario
            await updateProfile(user, {
                displayName: isBusinessAccount ? 
                    document.getElementById('businessName').value :
                    `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`
            });

            // Cerrar sesión después del registro
            await signOut(auth);
            
            // Mostrar mensaje de éxito y redirigir al login
            this.showSuccess('Registro exitoso. Por favor, inicia sesión.');
            setTimeout(() => {
                routeGuard.setRegistering(false);
                window.location.href = '/pages/login.html';
            }, 2000);

        } catch (error) {
            routeGuard.setRegistering(false);
            this.handleError(error);
        }
    }

    validateForm() {
        const isBusinessAccount = document.getElementById('businessAccount').checked;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // Validar contraseñas
        if (password !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return false;
        }

        // Validar longitud mínima de la contraseña
        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        // Validar términos y condiciones
        if (!terms) {
            this.showError('Debes aceptar los términos y condiciones');
            return false;
        }

        // Validar campos específicos según el tipo de cuenta
        if (isBusinessAccount) {
            const requiredBusinessFields = ['businessName', 'businessType', 'taxId', 'businessAddress'];
            for (const field of requiredBusinessFields) {
                if (!document.getElementById(field).value) {
                    this.showError('Por favor, completa todos los campos del negocio');
                    return false;
                }
            }
        } else {
            const requiredUserFields = ['firstName', 'lastName'];
            for (const field of requiredUserFields) {
                if (!document.getElementById(field).value) {
                    this.showError('Por favor, completa todos los campos personales');
                    return false;
                }
            }
        }

        return true;
    }

    prepareUserData() {
        return {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            role: 'user',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    }

    prepareBusinessData() {
        return {
            businessName: document.getElementById('businessName').value,
            businessType: document.getElementById('businessType').value,
            taxId: document.getElementById('taxId').value,
            businessAddress: document.getElementById('businessAddress').value,
            email: document.getElementById('email').value,
            role: 'business',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    }

    async saveUserData(userId, userData) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, userData);
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger';
        errorElement.textContent = message;
        
        const form = document.querySelector('.auth-form');
        form.insertBefore(errorElement, form.firstChild);
        
        // Remover el mensaje después de 5 segundos
        setTimeout(() => errorElement.remove(), 5000);
    }

    showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'alert alert-success';
        successElement.textContent = message;
        
        const form = document.querySelector('.auth-form');
        form.insertBefore(successElement, form.firstChild);
    }

    handleError(error) {
        let errorMessage = 'Ha ocurrido un error durante el registro.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este correo electrónico ya está registrado.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'El correo electrónico no es válido.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'El registro con correo y contraseña no está habilitado.';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es demasiado débil.';
                break;
            default:
                console.error('Error durante el registro:', error);
        }
        
        this.showError(errorMessage);
    }
}

// Inicializar el registro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegisterManager();
}); 