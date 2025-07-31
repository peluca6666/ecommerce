import nodemailer from 'nodemailer';
import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { sign } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Aviso si faltan credenciales importantes
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.error('ERROR: Faltan credenciales de email');
}
if (!process.env.JWT_SECRET) {
  console.error('ERROR: Falta JWT_SECRET');
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
 * Envía un mail de bienvenida con link para verificar cuenta
 * @param {Object} usuario - debe tener id, nombre y email
 */
export async function enviarMailBienvenida(usuario) {
  try {
    const emailDestino = usuario.email || usuario.mail;
    if (!emailDestino || !usuario.id || !usuario.nombre) {
      throw new Error('Faltan datos del usuario para enviar el correo');
    }

    // Genero token JWT para verificar cuenta
    const token = sign(
      { usuario_id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // URL para que el usuario confirme su cuenta
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
    console.log(`Correo enviado a ${emailDestino} (ID: ${result.messageId})`);
    return result;

  } catch (error) {
    console.error('Error al enviar correo de verificación:', error.message);
    throw error;
  }
}

/**
 * Envía un email desde el formulario de contacto al dueño de la tienda
 * @param {object} datosFormulario - { nombre, email, mensaje }
 */
export async function enviarEmailDeContacto(datosFormulario) {
  const { nombre, email, mensaje } = datosFormulario;

  // El mail llega al dueño, con respuesta directa al cliente
  const mailOptions = {
    from: `"Formulario de Contacto" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: `Nuevo mensaje de contacto de: ${nombre}`,
    html: `
      <h2>Has recibido un nuevo mensaje desde SaloMarket</h2>
      <p><strong>De:</strong> ${nombre}</p>
      <p><strong>Email del remitente:</strong> ${email}</p>
      <hr>
      <h3>Mensaje:</h3>
      <p style="white-space: pre-wrap;">${mensaje}</p>
    `,
    replyTo: email
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(` Mensaje de contacto enviado (ID: ${result.messageId})`);
    return result;
  } catch (error) {
    console.error(' Error al enviar email de contacto:', error.message);
    throw new Error('Error en el servicio de envío de correos.');
  }
}

// Verifica que las credenciales SMTP estén bien configuradas
export async function probarConfiguracionEmail() {
  try {
    await transporter.verify();
    console.log('Configuración de email válida');
    return true;
  } catch (error) {
    console.error('Error en configuración de email:', error.message);
    return false;
  }
}

/**
 * Envía email para recuperar contraseña
 * @param {Object} usuario - debe tener email y nombre
 * @param {string} resetToken - token JWT para resetear
 */
export async function enviarEmailRecuperacion(usuario, resetToken) {
  try {
    const emailDestino = usuario.email || usuario.mail;
    if (!emailDestino || !usuario.nombre) {
      throw new Error('Faltan datos del usuario para enviar el correo de recuperación');
    }

    // URL para resetear contraseña
    const frontendBase = process.env.FRONTEND_URL;
    const urlReset = `${frontendBase}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Salo Market" <${process.env.MAIL_USER}>`,
      to: emailDestino,
      subject: 'Recuperar contraseña - Salo Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperar Contraseña</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Recibimos una solicitud para resetear la contraseña de tu cuenta en Salo Market.</p>
          <p>Para crear una nueva contraseña, hacé clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${urlReset}" 
               style="background-color: #e53e3e; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Resetear Contraseña
            </a>
          </div>
          <p><small>Este enlace expirará en 1 hora por seguridad.</small></p>
          <p><small>Si no solicitaste este cambio, podés ignorar este correo.</small></p>
          <p><small>Si no podés hacer clic, copiá y pegá este enlace en tu navegador:</small></p>
          <p><small>${urlReset}</small></p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email de recuperación enviado a ${emailDestino} (ID: ${result.messageId})`);
    return result;

  } catch (error) {
    console.error('Error al enviar email de recuperación:', error.message);
    throw error;
  }
}
