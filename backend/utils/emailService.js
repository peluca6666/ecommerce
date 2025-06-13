import nodemailer from 'nodemailer';
import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { sign } = pkg;

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Validación básica de credenciales
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.error('❌ ERROR: Faltan credenciales de email');
}
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: Falta JWT_SECRET');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Envía un mail de bienvenida con link de verificación.
 * @param {Object} usuario - Objeto con id, nombre y mail
 */
export async function enviarMailBienvenida(usuario) {
  try {
    const emailDestino = usuario.email || usuario.mail;
    if (!emailDestino || !usuario.id || !usuario.nombre) {
      throw new Error('Faltan datos del usuario para enviar el correo');
    }

    // Generar token JWT
    const token = sign(
      { usuario_id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // URL de verificación (CORREGIDO: usa /cuenta-verificada y puerto 5173 por defecto)
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    const urlVerificacion = `${frontendBase}/cuenta-verificada?token=${token}`;

    const mailOptions = {
      from: `"Salo Market" <${process.env.MAIL_USER}>`,
      to: emailDestino,
      subject: 'Verifica tu cuenta en Salo Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Bienvenido a Salo Market!</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Gracias por registrarte en Salo Market.</p>
          <p>Para verificar tu cuenta, hacé clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${urlVerificacion}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verificar Cuenta
            </a>
          </div>
          <p><small>Este enlace expirará en 24 horas.</small></p>
          <p><small>Si no podés hacer clic, copiá y pegá este enlace en tu navegador:</small></p>
          <p><small>${urlVerificacion}</small></p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado a ${emailDestino} (ID: ${result.messageId})`);
    return result;

  } catch (error) {
    console.error('❌ Error al enviar correo de verificación:', error.message);
    throw error;
  }
}

// Test de configuración
export async function probarConfiguracionEmail() {
  try {
    await transporter.verify();
    console.log('✅ Configuración de email válida');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error.message);
    return false;
  }
}
