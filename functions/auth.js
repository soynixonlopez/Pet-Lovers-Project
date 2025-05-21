import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Función simple para verificar email y password
export const loginWithEmail = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html';
    } catch {
        alert('Email o contraseña incorrectos');
    }
};
