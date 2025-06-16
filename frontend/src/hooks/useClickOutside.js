import { useEffect, useRef } from 'react';

/**
 * Este hook detecta clics fuera de un elemento de referencia
 * @param {function} handler - La función a ejecutar cuando se detecta un clic afuera
 */
export function useClickOutside(handler) {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      // Si el clic fue dentro del elemento referenciado no se hace nada
      // Si el clic fue fuera del elemento referenciado, se ejecuta el handler
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    // Añadimos el listener al documento
    document.addEventListener('mousedown', maybeHandler);

    // Limpiamos el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  });

  return domNode;
}