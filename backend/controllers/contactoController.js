import { enviarEmailDeContacto } from '../utils/emailService.js';

export const manejarFormularioContacto = async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;

        // Validación simple en el servidor
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ exito: false, mensaje: 'Todos los campos son obligatorios.' });
        }

        await enviarEmailDeContacto({ nombre, email, mensaje });

        return res.status(200).json({ exito: true, mensaje: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.' });

    } catch (error) {
        console.error("Error en el controlador de contacto:", error);
        return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al procesar el mensaje.' });
    }
};