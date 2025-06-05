import Joi from 'joi';

export const schemaRegistro = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es obligatorio',
    }),
    contrasenia: Joi.string().min(8).required().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'any.required': 'La contraseña es obligatoria',
    }),
    nombre: Joi.string().min(3).max(30).required().messages({
        'any.required': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede exceder los 30 caracteres',
    }),
    apellido: Joi.string().min(3).max(30).required().messages({
        'any.required': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 3 caracteres',
        'string.max': 'El apellido no puede exceder los 30 caracteres',
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

