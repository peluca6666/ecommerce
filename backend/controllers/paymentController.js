import mercadopago from 'mercadopago';
import * as carritoService from '../services/carritoService.js'; 
import * as ventaService from '../services/ventaService.js';   

// configuración inicial de mercadopago
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

//controlador para crear la orden de pago
export const createOrder = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { direccion_envio } = req.body; 

        // obtener el carrito desde el backend para seguridad
        const carrito = await carritoService.obtenerCarrito(usuarioId);

        if (carrito.productos.length === 0) {
            return res.status(400).json({ exito: false, mensaje: 'El carrito está vacío.' });
        }

        // crear la venta en estado 'pendiente de pago' usando el servicio
        const ventaPendiente = await ventaService.crearVentaPendiente(usuarioId, carrito.productos, 'Mercado Pago', direccion_envio);

        //  preparar los items para mercado Pago
        const items = carrito.productos.map(p => ({
            title: p.nombre_producto,
            unit_price: Number(p.precio_actual),
            quantity: p.cantidad,
            currency_id: 'ARS'
        }));

        //creamos un objeto preference para mercado pago
        const preference = {
            items,
            payer: {
                nombre: req.usuario.nombre,
                apellido: req.usuario.apellido,
                email: req.usuario.email,
                telefono: req.usuario.telefono,
                direccion: req.usuario.direccion
            },
            back_urls: {
                success: 'https://salomarket.shop/orden-confirmada',
               failure: 'https://salomarket.shop/carrito?error=payment_failed',
                pending: 'https://salomarket.shop/orden-confirmada'
            },
            notification_url: 'https://salomarket.shop/webhook',
            auto_return: 'approved',
                        external_reference: ventaPendiente.venta_id.toString(), 
        };

        const result = await mercadopago.preferences.create(preference);
        res.json ({init_point: result.body.init_point});

    } catch (error) {
        console.error('Error al crear la orden de pago:', error);
        res.status(500).json({exito: false, mensaje: 'Error interno del servidor'});
    }
};

//controlador para recibir notificaciones por webhook
export const receiveWebhook = async (req, res) => {
    const { query } = req;
    const topic = query.topic || query.type;

    try {
        if (topic === 'payment') {
            const paymentId = query.id || query['data.id'];
            const payment = await mercadopago.payment.findById(Number(paymentId));
            const ventaId = payment.body.external_reference;

            if (payment.body.status === 'approved') {
                // llamamos a nuestro servicio para finalizar la venta
                await ventaService.confirmarVentaExitosa(ventaId);
            }
        }
        res.sendStatus(204);
    } catch (error) {
        console.error("Error en el webhook:", error);
        res.sendStatus(500);
    }
};

        