import { useState } from 'react';

const ProductImageGallery = ({ producto }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  // Preparar imágenes
  const allImages = [producto.imagen, ...(Array.isArray(producto.imagenes) ? producto.imagenes : [])] 
    .filter(Boolean)
    .map(imgRelativa => `${import.meta.env.VITE_API_BASE_URL}${imgRelativa}`);

  // Si no hay imágenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push('https://via.placeholder.com/500x500?text=Imagen+no+disponible');
  }

  const openFullscreen = (imageUrl) => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.9); display: flex; align-items: center;
      justify-content: center; z-index: 9999; cursor: pointer;
    `;
    overlay.appendChild(img);
    overlay.onclick = () => document.body.removeChild(overlay);
    document.body.appendChild(overlay);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsZoomed(false);
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnails verticales a la izquierda */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
              currentImageIndex === index 
                ? 'border-orange-500 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={img}
              alt={`Vista ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
            />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div className="flex-1 relative">
        <div className="bg-gray-50 rounded-lg overflow-hidden relative group border border-gray-200">
          <div 
            className="relative cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={`${producto.nombre_producto} - Vista ${currentImageIndex + 1}`}
              className={`w-full h-80 md:h-96 object-contain transition-all duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed 
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
            />
          </div>
          
          {/* Botón fullscreen - solo visible en hover */}
          <button
            onClick={() => openFullscreen(allImages[currentImageIndex])}
            className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-opacity-70"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Navegación con flechas - solo si hay múltiples imágenes */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev > 0 ? prev - 1 : allImages.length - 1
                )}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-opacity-70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev < allImages.length - 1 ? prev + 1 : 0
                )}
                className="absolute right-11 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-opacity-70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Indicador de zoom */}
          {isZoomed && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Zoom activo
            </div>
          )}

          {/* Indicadores de navegación */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'bg-orange-500' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Pasa el cursor sobre la imagen para hacer zoom • Click para pantalla completa
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;