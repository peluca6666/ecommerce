const ProductDescription = ({ descripcionLarga }) => {
  // Si no hay descripción larga, no renderizar nada
  if (!descripcionLarga) return null;

  // Procesar texto para párrafos y listas
  const processDescription = (text) => {
    // Dividir por párrafos (doble salto de línea)
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, index) => {
      // Detectar si es una lista (líneas que empiezan con -, *, •, o números)
      const lines = paragraph.split('\n');
      const isList = lines.some(line => 
        /^\s*[-*•]\s/.test(line) || /^\s*\d+\.\s/.test(line)
      );

      if (isList) {
        return (
          <ul key={index} className="pl-6 mb-4 space-y-2">
            {lines.filter(line => line.trim()).map((line, lineIndex) => (
              <li 
                key={lineIndex} 
                className="text-gray-700 leading-relaxed text-lg list-disc"
              >
                {line.replace(/^\s*[-*•]\s*/, '').replace(/^\s*\d+\.\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Párrafo normal
      return (
        <p 
          key={index}
          className="text-gray-700 leading-relaxed text-lg mb-4 last:mb-0"
        >
          {paragraph.trim()}
        </p>
      );
    });
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 relative overflow-hidden">
      {/* Header con icono */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            Descripción Detallada
          </h3>
          <p className="text-gray-600 text-sm">
            Información completa sobre este producto
          </p>
        </div>
      </div>

      {/* Divider con gradiente */}
      <div className="w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 mb-6"></div>
      
      {/* Contenido procesado */}
      <div className="prose prose-lg max-w-none">
        <div className="first:text-xl first:font-medium first:text-gray-800">
          {processDescription(descripcionLarga)}
        </div>
      </div>

      {/* Decoración sutil */}
      <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default ProductDescription;