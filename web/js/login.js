const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', ()=>{
    container.classList.add("active");
});

loginBtn.addEventListener('click', ()=>{
    container.classList.remove("active");
});

// Validacion y retroalimentacion al usuario en el login

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');

    const nameInput = signupForm.querySelector('input[name="nom_usu"]');
    const emailInput = signupForm.querySelector('input[name="email"]');
    const passwordInput = signupForm.querySelector('input[name="contra"]');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const signinEmailInput = signinForm.querySelector('input[name="email"]');
    const signinPasswordInput = signinForm.querySelector('input[name="contra"]');
    const signinEmailError = document.getElementById('signinEmailError');
    const signinPasswordError = document.getElementById('signinPasswordError');

    const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ_]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ_]+)*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*_\-!])[A-Za-z\d@#$%^&*_\-!]{8,}$/;

    signupForm.addEventListener('submit', (event) => {
        let valid = true;

        const name = nameInput.value;
        if (!nameRegex.test(name)) {
            nameError.textContent = 'El nombre solo puede contener letras y espacios.';
            nameInput.classList.add('invalid');
            valid = false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('invalid');
        }

        const email = emailInput.value;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'El correo no es válido.';
            emailInput.classList.add('invalid');
            valid = false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('invalid');
        }

        const password = passwordInput.value;
        if (!passwordRegex.test(password)) {
            passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un dígito y un carácter especial (@#$%^&*_-!).';
            passwordInput.classList.add('invalid');
            valid = false;
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('invalid');
        }

        if (!valid) {
            event.preventDefault();
        }
    });

    signinForm.addEventListener('submit', (event) => {
        let valid = true;

        const email = signinEmailInput.value;
        if (!emailRegex.test(email)) {
            signinEmailError.textContent = 'El correo no es válido.';
            signinEmailInput.classList.add('invalid');
            valid = false;
        } else {
            signinEmailError.textContent = '';
            signinEmailInput.classList.remove('invalid');
        }

        const password = signinPasswordInput.value;
        if (!passwordRegex.test(password)) {
            signinPasswordError.textContent = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un dígito y un carácter especial (@#$%^&*_-!).';
            signinPasswordInput.classList.add('invalid');
            valid = false;
        } else {
            signinPasswordError.textContent = '';
            signinPasswordInput.classList.remove('invalid');
        }

        if (!valid) {
            event.preventDefault();
        }
    });
});