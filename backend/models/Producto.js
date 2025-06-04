export class Producto {
  constructor(
    producto_id,
    nombre,
    descripcion,
    precio,
    categoria,
    imagen_url,
    stock_actual,
    activo = true // por default activo
  ) {
    this.producto_id = producto_id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen_url = imagen_url;
    this.stock_actual = stock_actual;
    this.activo = activo;
  }
}
