export class Usuario {
    // 1. Añadimos 'verificado' como séptimo parámetro
    constructor(usuario_id, nombre, apellido, email, contrasenia, rol = 'cliente', verificado = false) {
        this.usuario_id = usuario_id;
        this.nombre = nombre;
        this.apellido = apellido;
        // Ojo: el parámetro es 'mail', asegúrate de pasarlo consistentemente como 'email' o 'mail'
        this.email = email; 
        this.contrasenia = contrasenia;
        this.rol = rol;
        // 2. Asignamos el valor que llega como parámetro
        this.verificado = verificado;
    }

    obtenerPerfil() {
        return {
            usuario_id: this.usuario_id,
            nombre: this.nombre,
            apellido: this.apellido,
            mail: this.mail,
            rol: this.rol,
            // (Opcional) Puedes añadir 'verificado' aquí si lo necesitas en el perfil
            verificado: this.verificado 
        };
    }
}