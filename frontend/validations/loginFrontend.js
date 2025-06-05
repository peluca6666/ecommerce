function validarLogin(formulario) {

    const errores = {}

    //formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formulario.mail || formulario.mail.trim() === '') {
        errores.email = 'El campo email es obligatorio';
    } else if (!emailRegex.test(formulario.email)) {
        errores.email = 'El formato del email no es válido';
    }


    if (!formulario.contrasenia?.trim()) {
        errores.contrasenia = 'La contraseña es obligatoria';
    }

    return errores;
}
