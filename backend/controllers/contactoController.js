import { enviarEmailDeContacto } from '../utils/emailService.js';

export const manejarFormularioContacto = async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;

        // validacion basica server-side aunque ya se valido en frontend
        // importante para seguridad - nunca confiar solo en frontend
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ exito: false, mensaje: 'Todos los campos son obligatorios.' });
        }

        // delegamos el envio de email al service para separar responsabilidades
        // si falla el envio, el catch maneja el error automaticamente
        await enviarEmailDeContacto({ nombre, email, mensaje });

        // respuesta exitosa con mensaje claro para el usuario
        return res.status(200).json({ exito: true, mensaje: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.' });

    } catch (error) {
        console.error("Error en el controlador de contacto:", error);
        // no exponemos detalles del error al cliente por seguridad
        return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al procesar el mensaje.' });
    }
};