export function validarRegistro(formulario) {
    const errores = {}

    //formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    //Validar nombre
    if (!formulario.nombre?.trim()) {
        errores.nombre = 'El nombre es obligatorio';
    }
    //Validar apellido
    if (!formulario.apellido?.trim()) {
        errores.apellido = 'El apellido es obligatorio';
    }

    //validar email
    if (!formulario.email?.trim()) {
        errores.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formulario.email)) {
        errores.email = 'El email no tiene un formato válido';
    }

    //validar contraseña
    if (!formulario.contrasenia?.trim()) {
        errores.contrasenia = 'La contraseña es obligatoria';
    } else if (formulario.contrasenia.length < 8) {
        errores.contrasenia = 'La contraseña debe tener al menos 8 caracteres';
    }

    //validar confirmacion de contraseña
    if (!formulario.confirmarContrasenia?.trim()) {
        errores.confirmarContrasenia = 'La confirmación de contraseña es obligatoria';

    } else if (formulario.contrasenia !== formulario.confirmarContrasenia) {
        errores.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    return errores;
}