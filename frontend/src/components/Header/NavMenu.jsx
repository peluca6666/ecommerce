// NavMenu.jsx (CÓDIGO COMPLETO Y REFACTORIZADO)
import React from 'react'; 
import { Button, Box } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// 1. Definimos nuestros enlaces en un solo lugar.
const navLinks = [
    { texto: 'OFERTAS', tipo: 'pagina', ruta: '/productos?es_oferta=true' },
    { texto: 'Catálogo', tipo: 'pagina', ruta: '/productos' },
    // 👇 CAMBIA EL TIPO DE 'scroll' A 'pagina' Y AJUSTA LA RUTA 👇
    { texto: 'Sobre Nosotros', tipo: 'pagina', ruta: '/sobreNosotros' },
    { texto: 'Contacto', tipo: 'pagina', ruta: '/contacto' },
];

const NavMenu = ({ mobile = false, onItemClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 2. Creamos una función para manejar el scroll suave
    const handleScroll = (elementId) => {
        // Si ya estamos en la página principal, hacemos scroll
        if (location.pathname === '/') {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Si estamos en otra página, navegamos a la principal y luego hacemos scroll
            navigate(`/#${elementId}`);
        }
        // Si es el menú móvil, lo cerramos después del clic
        if (onItemClick) onItemClick();
    };

    const navButtons = navLinks.map((link) => {
        if (link.tipo === 'pagina') {
            return (
                <Button
                    key={link.texto}
                    color="inherit"
                    component={RouterLink}
                    to={link.ruta}
                    onClick={onItemClick}
                >
                    {link.texto}
                </Button>
            );
        }
        if (link.tipo === 'scroll') {
            return (
                <Button
                    key={link.texto}
                    color="inherit"
                    onClick={() => handleScroll(link.ruta)}
                >
                    {link.texto}
                </Button>
            );
        }
        return null;
    });

    // 3. Renderizamos los botones. El layout cambia si es móvil, pero los botones son los mismos.
    if (mobile) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%'
            }}>
                {navButtons.map(button => (
                    // Clonamos el botón para añadirle estilos específicos para móvil
                    React.cloneElement(button, { 
                        sx: { 
                            justifyContent: 'flex-start', 
                            width: '100%', 
                            py: 1.5, 
                            px: 2,
                            textAlign: 'left'
                        } 
                    })
                ))}
            </Box>
        );
    }
    
    // Versión de escritorio
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {navButtons}
        </Box>
    );
};

export default NavMenu;

// NOTA: Para que el React.cloneElement funcione, necesitas importar React

// Asegúrate de que esta línea esté al principio del archivo.