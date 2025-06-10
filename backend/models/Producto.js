export class Producto {
  constructor(
    producto_id,
    nombre_producto,
    descripcion,
    precio,
    categoria,
    imagen, 
    imagenes,
    stock_actual,
    activo = true, // por default activo
    es_oferta = false // por default no es oferta
  ) {
    this.producto_id = producto_id;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
    this.imagenes = imagenes;
    this.stock_actual = stock_actual;
    this.nombre_producto = nombre_producto;
    this.activo = activo;
    this.es_oferta = es_oferta;
  }
}
