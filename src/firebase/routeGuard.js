import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

class RouteGuard {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.initAuthListener();
    }

    initAuthListener() {
        onAuthStateChanged(auth, (user) => {
            this.isAuthenticated = !!user;
            this.currentUser = user;
            this.handleRouteProtection();
        });
    }

    handleRouteProtection() {
        const currentPath = window.location.pathname;
        const publicRoutes = ['/pages/login.html', '/pages/register.html', '/index.html', '/'];
        const isPublicRoute = publicRoutes.some(route => currentPath.endsWith(route));

        if (this.isAuthenticated) {
            // Si está autenticado y está en una ruta pública (login/register), redirigir al dashboard
            if (isPublicRoute) {
                window.location.href = '/pages/dashboard.html';
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