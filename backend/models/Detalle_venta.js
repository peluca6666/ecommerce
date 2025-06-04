export class Detalle_venta {
    constructor(
        detale_id,
        venta_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal
    ){
        this.detale_id = detale_id;
        this.venta_id = venta_id; 
        this.producto_id = producto_id;
        this.cantidad = cantidad;
        this.precio_unitario = precio_unitario;
        this.subtotal = subtotal;
    }
}