export class Usuario{
    constructor(usuario_id, nombre, apellido, mail, contrasenia, rol = 'cliente'){
    this.usuario_id = usuario_id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.mail = mail;
    this.contrasenia = contrasenia;
    this.rol = rol; 
    }

    obtenerPerfil(){
        return{
            usuario_id: this.usuario_id,
            nombre: this.nombre,
            apellido: this.apellido,
            mail: this.mail,
            rol: this.rol,
        };
    }
}
   
