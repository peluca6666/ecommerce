import { useState, useEffect } from 'react';

//Este hook sirve para incorporar en el buscador, espera a que el usuario deje de escribir por un tiempo determinado antes de realizar la busqueda
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Temporizador que se ejecuta después del delay especificado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el valor cambia antes de que se cumpla el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Se ejecuta solo si el valor o el delay cambian

  return debouncedValue;
}