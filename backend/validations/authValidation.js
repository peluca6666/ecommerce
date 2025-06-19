import Joi from 'joi';

export const schemaRegistro = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio',
  }),
  contrasenia: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'))
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'Debe incluir en la contraseña una mayúscula, un número y un carácter especial',
      'any.required': 'La contraseña es obligatoria',
    }),
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
});

// Validación para cambio de contraseña
export const schemaCambioContraseña = Joi.object({
  contraseniaActual: Joi.string().required().messages({
    'any.required': 'La contraseña actual es obligatoria.',
    'string.empty': 'La contraseña actual no puede estar vacía.',
  }),
  nuevaContrasenia: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/)
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 8 caracteres.',
      'string.pattern.base': 'La nueva contraseña debe contener al menos una mayúscula y un caracter especial (@$!%*?&).',
      'any.required': 'La nueva contraseña es obligatoria.',
      'string.empty': 'La nueva contraseña no puede estar vacía.',
    }),
});

export const schemaLogin = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'El email es obligatorio',
    'string.email': 'El email debe ser válido',
  }),
  contrasenia: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
});
