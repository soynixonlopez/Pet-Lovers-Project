import { loginUser } from '../../src/firebase/auth.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const result = await loginUser(email, password);

            if (result.success) {
                // Obtener datos del usuario de Firestore
                const userDoc = await getDoc(doc(db, 'users', result.user.uid));
                const userData = userDoc.data();

                // Guardar información del usuario en localStorage
                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('userName', userData.name);
                localStorage.setItem('userEmail', userData.email);
                localStorage.setItem('userId', result.user.uid);

                alert('¡Inicio de sesión exitoso!');

                // Redirigir según el rol
                window.location.href = userData.role === 'seller'
                    ? '/pages/seller-dashboard.html'
                    : '/pages/marketplace.html';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            alert('Error al iniciar sesión: ' + error.message);
        }
    });
}); 