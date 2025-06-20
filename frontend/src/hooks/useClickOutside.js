import { useEffect, useRef } from 'react';

/**
 * hook para detectar clics fuera de un elemento
 * @param {function} handler - función que se ejecuta al detectar el clic afuera
 */
export function useClickOutside(handler) {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      // si el clic no fue dentro del elemento, se llama al handler
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    // agregamos el listener al documento
    document.addEventListener('mousedown', maybeHandler);

    // limpiamos el listener cuando se desmonta el componente
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  });

  return domNode;
}
