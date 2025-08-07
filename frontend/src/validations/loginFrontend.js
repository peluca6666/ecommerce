import Joi from 'joi';

const schemaLogin = Joi.object({
 email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'any.required': 'El email es obligatorio',
    'string.email': 'El email debe ser válido',
  }),
  // En login solo validamos longitud mínima, no patrones complejos por seguridad
  contrasenia: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
});

function validarLogin(formulario) {
  // Valida todos los campos sin detenerse en el primer error
  const { error } = schemaLogin.validate(formulario, { abortEarly: false });
  
  if (!error) return {};
  
  // Transforma errores de Joi al formato de objeto plano que espera la aplicación
  const errores = {};
  error.details.forEach(detail => {
    errores[detail.path[0]] = detail.message;
  });
  
  return errores;
}

export { validarLogin };
