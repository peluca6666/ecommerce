import { useState } from 'react';

const ProductImageGallery = ({ producto }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  return (
    <div className="flex gap-4 w-full">
      {/* Thumbnails verticales a la izquierda */}
      {allImages.length > 1 && (
        <div className="flex flex-col gap-3 flex-shrink-0">
          {allImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Miniatura ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentImageIndex === index 
                  ? 'border-2 border-orange-500 shadow-lg' 
                  : 'border-2 border-gray-200 hover:border-orange-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="flex-1">
        <div className="relative shadow-lg rounded-xl overflow-hidden bg-gray-50">
          <img
            src={allImages[currentImageIndex]}
            alt={`${producto.nombre_producto} - Vista ${currentImageIndex + 1}`}
            onClick={() => openFullscreen(allImages[currentImageIndex])}
            className="w-full h-[400px] md:h-[500px] object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
          />
          
          {/* Botón fullscreen */}
          <button
            onClick={() => openFullscreen(allImages[currentImageIndex])}
            className="absolute top-4 right-4 w-12 h-12 bg-orange-500 bg-opacity-90 text-white rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Navegación de imágenes */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev > 0 ? prev - 1 : allImages.length - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 text-orange-500 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
              >
                <span className="text-xl md:text-2xl font-bold">‹</span>
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev < allImages.length - 1 ? prev + 1 : 0
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 text-orange-500 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
              >
                <span className="text-xl md:text-2xl font-bold">›</span>
              </button>
            </>
          )}

          {/* Indicadores de posición */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'bg-orange-500 w-6' 
                      : 'bg-white bg-opacity-70 hover:bg-opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;