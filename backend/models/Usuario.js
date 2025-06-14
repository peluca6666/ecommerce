// models/Usuario.js (VERSIÓN FINAL CORREGIDA)

export class Usuario {
    constructor(
      usuario_id,
      nombre,
      apellido,
      email,
      contrasenia,
      rol = 'cliente',
      verificado = false,
      dni = null,
      telefono = null,
      direccion = null
    ) {
        this.usuario_id = usuario_id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.contrasenia = contrasenia;
        this.rol = rol;
        this.verificado = verificado;
        this.dni = dni;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    obtenerPerfil() {
        return {
            usuario_id: this.usuario_id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            rol: this.rol,
            dni: this.dni,
            telefono: this.telefono,
            direccion: this.direccion,
        };
    }
}