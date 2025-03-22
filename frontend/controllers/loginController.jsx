// Validación del formulario de acceso (cliente)

export const validateLogin = (user, password) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!user || !password) {
        alert("Debe rellenar todos los campos para iniciar sesión.");
        return false;
    }

    if (!emailRegex.test(user)) {
        alert("El usuario debe ser un correo electrónico.");
        return false;
    }

    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }
    return true;
};
