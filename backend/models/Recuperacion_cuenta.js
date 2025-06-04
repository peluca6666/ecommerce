export class Recuperacion_cuenta{
    constructor(
        email,
        token_recuperacion,
        fecha_expiracion_token,
        estado
    ){
        this.email = email;
        this.token_recuperacion = token_recuperacion;
        this.fecha_expiracion_token = fecha_expiracion_token;
        this.estado = estado;
    }
}