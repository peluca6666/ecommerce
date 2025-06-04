export class Venta{
    constructor(
      venta_id,
      usuario_id,
      fecha_venta,
      total,
      estado,
      metodo_pago,
      direccion_envio 
    ){
        this.venta_id = venta_id;
        this.usuario_id = usuario_id;
        this.fecha_venta = fecha_venta;
        this.total = total;
        this.estado = estado;
        this.metodo_pago = metodo_pago;
        this.direccion_envio = direccion_envio;
    }
}