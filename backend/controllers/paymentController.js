import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as carritoService from '../services/carritoService.js'; 
import * as ventaService from '../services/ventaService.js';   

// configuración inicial de mercadopago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

//controlador para crear la orden de pago
export const createOrder = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { direccion_envio } = req.body;

        const carrito = await carritoService.obtenerCarrito(usuarioId);

        if (carrito.productos.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'El carrito está vacío.' });
        }

        const ventaPendiente = await ventaService.crearVentaPendiente(usuarioId, carrito.productos, 'Mercado Pago', direccion_envio);

        const items = carrito.productos.map(p => ({
            title: p.nombre_producto,
            unit_price: Number(p.precio_actual),
            quantity: p.cantidad,
            currency_id: 'ARS'
        }));

        //creamos un objeto preference para mercado pago
      const body = {
            items,
            payer: {
                name: req.usuario.nombre,
                surname: req.usuario.apellido,
                email: req.usuario.email,
                // El SDK nuevo requiere un formato específico para teléfono y dirección
                phone: {
                    area_code: "54", // Código de área de Argentina
                    number: Number(req.usuario.telefono)
                },
                address: {
                    street_name: direccion_envio,
                    street_number: 123, // El SDK puede requerir un número
                    zip_code: "5196" // Y un código postal
                }
            },
            back_urls: {
                success: 'https://salomarket.shop/orden-confirmada',
               failure: 'https://salomarket.shop/carrito?error=payment_failed',
                pending: 'https://salomarket.shop/orden-confirmada'
            },
             notification_url: 'https://salomarket.shop/webhook', // Asegúrate que tu VPS tenga HTTPS
            auto_return: 'approved',
            external_reference: ventaPendiente.venta_id.toString(),
        };

       const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({ init_point: result.init_point });

    } catch (error) {
        console.error('Error al crear la orden de pago:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
    }
};

//controlador para recibir notificaciones por webhook
export const receiveWebhook = async (req, res) => {
    const { query } = req;
    const topic = query.topic || query.type;

  try {
        if (topic === 'payment') {
            const paymentId = query.id || query['data.id'];

            
            // 1. Creamos una instancia del servicio Payment y le pasamos el cliente
            const paymentService = new Payment(client);
            const payment = await paymentService.get({ id: paymentId });
            
            // La información del pago ahora está en el objeto 'payment' directamente
            const ventaId = payment.external_reference;

            if (payment.status === 'approved') {
                await ventaService.confirmarVentaExitosa(ventaId);
            }
        }
        res.sendStatus(204);
    } catch (error) {
        console.error("Error en el webhook:", error);
        res.sendStatus(500);
    }
};
        