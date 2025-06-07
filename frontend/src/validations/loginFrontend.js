function validarLogin(formulario) {

    const errores = {}

    //formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formulario.email || formulario.email.trim() === '') {
        errores.email = 'El campo email es obligatorio';
    } else if (!emailRegex.test(formulario.email)) {
        errores.email = 'El formato del email no es válido';
    }


    if (!formulario.contrasenia?.trim()) {
        errores.contrasenia = 'La contraseña es obligatoria';
    }

    return errores;
}
export { validarLogin };