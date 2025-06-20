import { useState, useEffect } from 'react';

// hook para usar en buscadores, espera a que el usuario deje de tipear antes de hacer la búsqueda
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // setea el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // limpia el timer si cambia el valor antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // solo corre si cambia value o delay

  return debouncedValue;
}
