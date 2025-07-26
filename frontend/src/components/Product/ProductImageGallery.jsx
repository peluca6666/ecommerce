import { useState } from 'react';

const ProductImageGallery = ({ producto }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  
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
    
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    setIsZoomed(false);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
    setIsZoomed(false);
  };

  return (
    <div className="flex gap-4 w-full max-w-4xl mx-auto">
      {/* Thumbnails verticales a la izquierda */}
      <div className="flex flex-col gap-3 flex-shrink-0 max-h-96 overflow-y-auto py-2">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 ${
              currentImageIndex === index 
                ? 'border-orange-500 shadow-lg transform scale-105' 
                : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
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
        <div className="bg-gray-50 rounded-xl overflow-hidden relative group shadow-lg border border-gray-200">
          {/* Contenedor de imagen con zoom */}
          <div 
            className="relative overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onClick={() => openFullscreen(allImages[currentImageIndex])}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={`${producto.nombre_producto} - Vista ${currentImageIndex + 1}`}
              className={`w-full h-80 md:h-96 object-contain transition-all duration-300 ${
                isZoomed ? 'scale-150 cursor-zoom-in' : 'scale-100 cursor-pointer'
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
          
          {/* Botón fullscreen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openFullscreen(allImages[currentImageIndex]);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-opacity-70 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Navegación con flechas - solo si hay múltiples imágenes */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 text-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-white hover:scale-110 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 text-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-white hover:scale-110 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Indicador de zoom */}
          {isZoomed && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Zoom
            </div>
          )}

          {/* Indicadores de navegación */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === index 
                      ? 'bg-orange-500 w-6' 
                      : 'bg-white bg-opacity-60 hover:bg-opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones de uso */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Pasa el cursor sobre la imagen para hacer zoom • Click para pantalla completa
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;