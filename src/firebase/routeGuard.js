import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

class RouteGuard {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.userRole = null;
        this.isRegistering = false;
        this.initAuthListener();
    }

    async getUserRole(uid) {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                return userDoc.data().role;
            }
            return null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    }

    setRegistering(value) {
        this.isRegistering = value;
    }

    initAuthListener() {
        onAuthStateChanged(auth, async (user) => {
            this.isAuthenticated = !!user;
            this.currentUser = user;
            
            if (user) {
                this.userRole = await this.getUserRole(user.uid);
            } else {
                this.userRole = null;
            }
            
            // Solo manejar la protección de rutas si no estamos en proceso de registro
            if (!this.isRegistering) {
                this.handleRouteProtection();
            }
        });
    }

    handleRouteProtection() {
        const currentPath = window.location.pathname;
        const publicRoutes = ['/pages/login.html', '/pages/register.html', '/index.html', '/'];
        const isPublicRoute = publicRoutes.some(route => currentPath.endsWith(route));

        // No redirigir si estamos en proceso de registro
        if (this.isRegistering) {
            return;
        }

        if (this.isAuthenticated && this.userRole) {
            // Si está autenticado y está en una ruta pública (login/register), redirigir según el rol
            if (isPublicRoute) {
                if (this.userRole === 'business') {
                    window.location.href = '/pages/dashboardbusiness.html';
                } else {
                    window.location.href = '/pages/dashboard.html';
                }
            } else {
                // Si está en una ruta protegida, verificar que corresponda a su rol
                const isBusiness = currentPath.endsWith('dashboardbusiness.html');
                const isUser = currentPath.endsWith('dashboard.html');
                
                if ((this.userRole === 'business' && !isBusiness) || 
                    (this.userRole === 'user' && !isUser)) {
                    window.location.href = this.userRole === 'business' ? 
                        '/pages/dashboardbusiness.html' : 
                        '/pages/dashboard.html';
                }
            }
        } else {
            // Si no está autenticado y está en una ruta protegida, redirigir al login
            if (!isPublicRoute) {
                window.location.href = '/pages/login.html';
            }
        }
    }

    static init() {
        return new RouteGuard();
    }
}

export default RouteGuard; 