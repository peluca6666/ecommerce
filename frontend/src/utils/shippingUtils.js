// utils/shippingUtils.js

// Localidades del Valle de Calamuchita
const CALAMUCHITA_LOCALIDADES = [
  'villa general belgrano',
  'santa rosa de calamuchita', 
  'la cumbrecita',
  'villa berna',
  'villa alpina',
  'los reartes',
  'villa yacanto',
  'amboy',
  'villa del dique',
  'embalse'
];

// Costos de envío
const SHIPPING_COSTS = {
  CALAMUCHITA: 1500,
  NACIONAL: 5000
};

/**
 * Determina si una localidad pertenece al valle de Calamuchita
 * @param {string} localidad - Nombre de la localidad
 * @returns {boolean} - true si es de Calamuchita
 */
export const isCalamuchitaLocation = (localidad) => {
  if (!localidad) return false;
  
  const normalizedLocation = localidad.toLowerCase().trim();
  return CALAMUCHITA_LOCALIDADES.some(loc => 
    normalizedLocation.includes(loc) || loc.includes(normalizedLocation)
  );
};

/**
 * Calcula el costo de envío según la localidad
 * @param {string} localidad - Nombre de la localidad
 * @returns {number} - Costo del envío
 */
export const calculateShippingCost = (localidad) => {
  return isCalamuchitaLocation(localidad) 
    ? SHIPPING_COSTS.CALAMUCHITA 
    : SHIPPING_COSTS.NACIONAL;
};

/**
 * Obtiene información completa del envío
 * @param {string} localidad - Nombre de la localidad
 * @param {number} subtotal - Subtotal de la compra
 * @returns {object} - Información del envío
 */
export const getShippingInfo = (localidad, subtotal) => {
  const isLocal = isCalamuchitaLocation(localidad);
  const cost = calculateShippingCost(localidad);
  const total = subtotal + cost;
  
  return {
    isLocal,
    cost,
    total,
    region: isLocal ? 'Calamuchita' : 'Nacional',
    deliveryTime: isLocal ? 'Entrega en el día' : 'Entrega en 3-5 días hábiles',
    description: isLocal 
      ? `$${cost.toLocaleString('es-AR')} (Calamuchita)`
      : `$${cost.toLocaleString('es-AR')} (Nacional)`,
    message: isLocal
      ? '✨ Envío local a Calamuchita - ¡Llegás en el día!'
      : '📦 Envío nacional - Entrega en 3-5 días hábiles'
  };
};

export { SHIPPING_COSTS };