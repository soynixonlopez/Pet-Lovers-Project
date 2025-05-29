document.addEventListener('DOMContentLoaded', () => {
    // Mostrar/ocultar campos según tipo de cuenta
    const userAccount = document.getElementById('userAccount');
    const businessAccount = document.getElementById('businessAccount');
    const userFields = document.getElementById('userFields');
    const businessFields = document.getElementById('businessFields');

    userAccount.addEventListener('change', () => {
        userFields.style.display = 'block';
        businessFields.style.display = 'none';
    });

    businessAccount.addEventListener('change', () => {
        userFields.style.display = 'none';
        businessFields.style.display = 'block';
    });

    // Manejar el registro
    const form = document.querySelector('.auth-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener datos básicos
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones básicas
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // 1. Crear el usuario en Authentication
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            // 2. Preparar datos para Firestore
            const userData = {
                email,
                createdAt: new Date().toISOString(),
                role: businessAccount.checked ? 'seller' : 'buyer'
            };

            // Agregar datos según el tipo de cuenta
            if (businessAccount.checked) {
                userData.businessName = document.getElementById('businessName').value;
                userData.businessType = document.getElementById('businessType').value;
                userData.taxId = document.getElementById('taxId').value;
                userData.businessAddress = document.getElementById('businessAddress').value;
                userData.name = userData.businessName;
            } else {
                userData.firstName = document.getElementById('firstName').value;
                userData.lastName = document.getElementById('lastName').value;
                userData.name = `${userData.firstName} ${userData.lastName}`;
            }

            // 3. Guardar datos en Firestore
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set(userData);

            // 4. Redirigir según el rol
            alert('¡Registro exitoso!');
            window.location.href = userData.role === 'seller' 
                ? '/pages/seller-dashboard.html'
                : '/pages/marketplace.html';

        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar: ' + error.message);
        }
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
}); 