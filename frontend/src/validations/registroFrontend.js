import Joi from 'joi';

// Schema de validación para registro de usuario
// Define reglas de negocio: email válido, contraseña segura, nombres sin números
const schemaRegistro = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio',
  }),
  // Contraseña requiere: mínimo 8 caracteres, mayúscula, número y carácter especial
  contrasenia: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'))
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'Debe incluir en la contraseña una mayúscula, un número y un carácter especial',
      'any.required': 'La contraseña es obligatoria',
    }),
  // Pattern acepta solo letras (incluye acentos y ñ), espacios. Longitud 3-30 caracteres
  nombre: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    .messages({
      'any.required': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder los 30 caracteres',
      'string.pattern.base': 'El nombre no puede contener números ni caracteres especiales',
    }),
  apellido: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    .messages({
      'any.required': 'El apellido es obligatorio',
      'string.min': 'El apellido debe tener al menos 3 caracteres',
      'string.max': 'El apellido no puede exceder los 30 caracteres',
      'string.pattern.base': 'El apellido no puede contener números ni caracteres especiales',
    }),
  // Validación cruzada: confirmarContrasenia debe coincidir exactamente con contrasenia
  confirmarContrasenia: Joi.string()
    .valid(Joi.ref('contrasenia'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de contraseña es obligatoria',
    }),
});

export function validarRegistro(formulario) {
  // Ejecuta todas las validaciones sin detenerse en el primer error (abortEarly: false)
  const { error } = schemaRegistro.validate(formulario, { abortEarly: false });
  
  if (!error) return {};
  
  // Convierte errores de Joi al formato esperado por la aplicación
  const errores = {};
  error.details.forEach(detail => {
    errores[detail.path[0]] = detail.message;
  });
  
  return errores;
}