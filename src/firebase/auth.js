import { auth } from './firebaseConfig.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged
} from 'firebase/auth';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.querySelector('.auth-form');
const googleLoginBtn = document.getElementById('googleLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Función para mostrar mensajes de error/éxito
function showMessage(message, type = 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.auth-box');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando sesión...';
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuario inició sesión:', userCredential.user);
            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            let errorMessage = 'Error al iniciar sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde';
                    break;
            }
            
            showMessage(errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });
}

// Handle Register
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const accountType = document.querySelector('input[name="accountType"]:checked').id;
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creando cuenta...';
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuario registrado:', userCredential.user);
            
            // Aquí puedes guardar información adicional del usuario en Firestore
            // según el tipo de cuenta (usuario o negocio)
            
            showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Error al registrar:', error);
            let errorMessage = 'Error al crear la cuenta';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este correo electrónico ya está registrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es demasiado débil';
                    break;
            }
            
            showMessage(errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Crear Cuenta';
        }
    });
}

// Google Sign In
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        try {
            googleLoginBtn.disabled = true;
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Usuario inició sesión con Google:', result.user);
            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            showMessage('Error al iniciar sesión con Google');
        } finally {
            googleLoginBtn.disabled = false;
        }
    });
}

// Facebook Sign In
if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', async () => {
        try {
            facebookLoginBtn.disabled = true;
            const result = await signInWithPopup(auth, facebookProvider);
            console.log('Usuario inició sesión con Facebook:', result.user);
            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Error al iniciar sesión con Facebook:', error);
            showMessage('Error al iniciar sesión con Facebook');
        } finally {
            facebookLoginBtn.disabled = false;
        }
    });
}

// Password Reset
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = prompt('Por favor, ingresa tu correo electrónico:');
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                showMessage('Se ha enviado un correo para restablecer tu contraseña', 'success');
            } catch (error) {
                console.error('Error al enviar correo de restablecimiento:', error);
                showMessage('Error al enviar el correo de restablecimiento');
            }
        }
    });
}

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuario actual:', user);
        // Si el usuario está en una página de autenticación, redirigir al dashboard
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = '../pages/dashboard.html';
        }
    } else {
        console.log('No hay usuario autenticado');
        // Si el usuario no está autenticado y está en el dashboard, redirigir al login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = '../pages/login.html';
        }
    }
});
