import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig.js';

// Registro de usuario
export const registerUser = async (email, password, userData) => {
    try {
        // Crear usuario en Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crear documento en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            role: userData.role, // 'buyer' o 'seller'
            name: userData.name,
            createdAt: new Date().toISOString(),
            ...userData
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Inicio de sesión
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Cerrar sesión
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
