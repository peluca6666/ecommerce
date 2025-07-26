import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductInfo = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  const [cantidad, setCantidad] = useState(1);

  const handleCantidadChange = (change) => {
    setCantidad(prev => {
      const nuevaCantidad = prev + change;
      if (nuevaCantidad < 1) return 1;
      if (nuevaCantidad > producto.stock_actual) return producto.stock_actual;
      return nuevaCantidad;
    });
  };

  const handleAddToCart = async () => {
    await addToCart(producto.producto_id, cantidad);
  };

  const handleBuyNow = async () => {
    await addToCart(producto.producto_id, cantidad);
    navigate('/carrito');
  };

  const hasDiscount = producto.precio_original && producto.precio_original > producto.precio;
  const discountPercentage = hasDiscount 
    ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100) 
    : 0;

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Contenido superior */}
      <div className="space-y-6">
        {/* Marca y SKU */}
        <div>
          <p className="text-gray-500 font-semibold uppercase text-sm tracking-wide">
            {producto.marca || 'PRODUCTO'}
          </p>
          <p className="text-gray-400 text-sm">
            SKU: {producto.sku || producto.producto_id}
          </p>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          {producto.nombre_producto}
        </h1>

        {/* Precios con badge */}
        <div>
          {hasDiscount && (
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-orange-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                -{discountPercentage}%
              </span>
              <span className="text-lg text-gray-500 line-through font-medium">
                ${producto.precio_original?.toLocaleString('es-AR')}
              </span>
            </div>
          )}
          
          <div className="text-4xl md:text-5xl font-bold text-red-500 leading-none">
            ${producto.precio?.toLocaleString('es-AR')}
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            Precio sin Impuestos Nacionales ${(producto.precio * 0.85).toLocaleString('es-AR')}
          </p>
        </div>

        {/* Descripción */}
        <p className="text-gray-600 leading-relaxed text-base">
          {producto.descripcion}
        </p>

        {/* Stock */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Stock:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
            producto.stock_actual > 0 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {producto.stock_actual > 0 ? `${producto.stock_actual} disponibles` : 'Sin Stock'}
          </span>
        </div>
      </div>

      {/* Controles inferiores */}
      <div className="space-y-4 mt-8">
        {/* Selector de cantidad */}
        <div>
          <p className="text-gray-700 font-semibold mb-3">Cantidad:</p>
          <div className="inline-flex items-center border-2 border-gray-200 rounded-xl bg-white">
            <button 
              onClick={() => handleCantidadChange(-1)} 
              disabled={cantidad <= 1}
              className="w-10 h-10 flex items-center justify-center text-orange-500 hover:bg-orange-50 disabled:text-gray-300 disabled:hover:bg-white transition-colors rounded-l-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="min-w-12 text-center font-bold text-gray-800 text-lg px-4 py-2">
              {cantidad}
            </span>
            
            <button 
              onClick={() => handleCantidadChange(1)} 
              disabled={cantidad >= producto.stock_actual}
              className="w-10 h-10 flex items-center justify-center text-orange-500 hover:bg-orange-50 disabled:text-gray-300 disabled:hover:bg-white transition-colors rounded-r-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Botón principal de compra */}
        <button 
          onClick={handleBuyNow}
          disabled={producto.stock_actual <= 0}
          className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-xl hover:from-red-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          COMPRAR AHORA
        </button>
        
        {/* Botón secundario */}
        <button 
          onClick={handleAddToCart}
          disabled={producto.stock_actual <= 0}
          className="w-full py-3 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 hover:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:hover:bg-white transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H19" />
          </svg>
          Agregar al Carrito
        </button>

        {/* Información de envío */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H20" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Envío a domicilio</p>
                <p className="text-gray-600 text-sm">Ingresá tu código postal para conocer tu mejor opción de envío.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Retiro en sucursal</p>
                <p className="text-gray-600 text-sm">No disponible. Consultá otras opciones de retiro.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;