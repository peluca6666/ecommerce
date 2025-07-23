// hooks/useCheckout.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getShippingInfo } from '../utils/shippingUtils';
import axios from 'axios';

export const useCheckout = () => {
    const navigate = useNavigate();
    const { user, cart, getToken, showNotification, refreshCart } = useAuth();

    // Estados
    const [shippingData, setShippingData] = useState({
        nombre: '', apellido: '', dni: '', direccion: '', localidad: '', provincia: '', codigo_postal: '', telefono: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Calcular información de envío
    const shipping = getShippingInfo(shippingData.localidad, cart.total);

    // Cargar datos del perfil
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const token = getToken();
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profile = response.data;

                setShippingData({
                    nombre: profile.nombre || '',
                    apellido: profile.apellido || '',
                    dni: profile.dni || '',
                    direccion: profile.direccion || '',
                    localidad: profile.localidad || '',
                    provincia: profile.provincia || '',
                    codigo_postal: profile.codigo_postal || '',
                    telefono: profile.telefono || ''
                });
            } catch (error) {
                console.error("Error al cargar los datos del perfil:", error);
                showNotification('No se pudo cargar tu perfil. Por favor, complétalo.', 'warning');
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, getToken, showNotification, navigate]);

    // Handlers
    const handleShippingChange = (e) => {
        setShippingData({
            ...shippingData,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Validaciones
    const validateShippingData = () => {
        const requiredFields = ['nombre', 'apellido', 'dni', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
        const missingFields = requiredFields.filter(field => !shippingData[field].trim());
        return missingFields.length === 0;
    };

    // Procesar pedido
    const handlePlaceOrder = async () => {
        if (!validateShippingData()) {
            showNotification('Por favor completá todos los campos obligatorios', 'error');
            return;
        }

        if (!paymentMethod) {
            showNotification('Por favor seleccioná un método de pago', 'error');
            return;
        }

        setIsProcessing(true);
        const token = getToken();
        const formattedAddress = `${shippingData.direccion}, ${shippingData.localidad}, ${shippingData.provincia} (${shippingData.codigo_postal})`;

        try {
            if (paymentMethod === 'mercadopago') {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`,
                    { 
                        direccion_envio: formattedAddress,
                        costo_envio: shipping.cost,
                        total_con_envio: shipping.total
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { init_point } = response.data;
                window.location.href = init_point;

            } else {
                const orderData = {
                    productos: cart.productos.map(p => ({ producto_id: p.producto_id, cantidad: p.cantidad })),
                    metodo_pago: paymentMethod,
                    direccion_envio: formattedAddress,
                    costo_envio: shipping.cost,
                    total_con_envio: shipping.total
                };

                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ventas`,
                    orderData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                showNotification('¡Pedido realizado con éxito!', 'success');
                await refreshCart();
                navigate(`/orden-confirmada/${response.data.venta.venta_id}`);
            }

        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al procesar el pedido.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        // Estados
        shippingData,
        paymentMethod,
        isProcessing,
        loading,
        shipping,
        cart,
        
        // Handlers
        handleShippingChange,
        handlePaymentChange,
        handlePlaceOrder,
        
        // Validaciones
        validateShippingData
    };
};