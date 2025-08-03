import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as carritoService from '../services/carritoService.js'; 
import * as ventaService from '../services/ventaService.js';   

// configuracion global de MP con access token desde variables de entorno
// importante para seguridad - nunca hardcodear tokens
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// controlador para crear la orden de pago
export const createOrder = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { direccion_envio } = req.body;

        // obtenemos el carrito para procesar los productos
        const carrito = await carritoService.obtenerCarrito(usuarioId);

        // validacion de negocio - no procesar carritos vacios
        if (carrito.productos.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'El carrito está vacío.' });
        }

        // creamos venta pendiente ANTES del pago para tracking
        // esto nos permite relacionar el pago con nuestra venta interna
        const ventaPendiente = await ventaService.crearVentaPendiente(usuarioId, carrito.productos, 'Mercado Pago', direccion_envio);

        // transformamos nuestros productos al formato que exige MP
        const items = carrito.productos.map(p => ({
            title: p.nombre_producto,
            unit_price: Number(p.precio_actual), // MP requiere numeros, no strings
            quantity: p.cantidad,
            currency_id: 'ARS'
        }));

        // objeto preference con toda la config del pago
        const body = {
            items,
            payer: {
                name: req.usuario.nombre,
                surname: req.usuario.apellido,
                email: req.usuario.email,
                // formato especifico que requiere el SDK nuevo de MP
                phone: {
                    area_code: "54", // codigo de argentina
                    number: Number(req.usuario.telefono)
                },
                address: {
                    street_name: direccion_envio,
                    street_number: 123, // MP requiere numero aunque sea generico
                    zip_code: "5196" // codigo postal requerido por MP
                }
            },
            // URLs de redireccion segun resultado del pago
            back_urls: {
                success: 'https://salomarket.shop/orden-confirmada',
               failure: 'https://salomarket.shop/carrito?error=payment_failed',
                pending: 'https://salomarket.shop/orden-confirmada'
            },
            // webhook para notificaciones en tiempo real
            notification_url: 'https://salomarket.shop/api/webhook',
            auto_return: 'approved',
            // clave para conectar pago de MP con nuestra venta interna
            external_reference: ventaPendiente.venta_id.toString(),
        };

       const preference = new Preference(client);
        const result = await preference.create({ body });

        // devolvemos solo el init_point para redirigir al usuario
        res.json({ init_point: result.init_point });

    } catch (error) {
        console.error('Error al crear la orden de pago:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
    }
};

// controlador para recibir notificaciones por webhook
export const receiveWebhook = async (req, res) => {
    const { query } = req;
    const topic = query.topic || query.type;

  try {
        // solo procesamos notificaciones de pagos
        if (topic === 'payment') {
            const paymentId = query.id || query['data.id'];

            // instanciamos el servicio Payment del SDK de MP
            const paymentService = new Payment(client);
            const payment = await paymentService.get({ id: paymentId });
            
            // external_reference conecta el pago con nuestra venta
            const ventaId = payment.external_reference;

            // solo confirmamos ventas cuando el pago esta aprobado
            if (payment.status === 'approved') {
                await ventaService.confirmarVentaExitosa(ventaId);
            }
        }
        // siempre responder 204 para que MP no reintente el webhook
        res.sendStatus(204);
    } catch (error) {
        console.error("Error en el webhook:", error);
        res.sendStatus(500);
    }
};