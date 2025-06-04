export class Cliente{
  constructor(
        usuario_id,
        nombre, 
        apellido,
        telefono,
        direccion,
        historial_compras,
        dni
    ){
        this.usuario_id = usuario_id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.direccion = direccion
        this.historial_compras = historial_compras;
        this.dni = dni;
    }
} 