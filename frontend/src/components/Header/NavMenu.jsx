import React from 'react'; 
import { Button, Box } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

const navLinks = [
    { texto: 'Catálogo', ruta: '/productos' },
    { texto: 'Sobre Nosotros', ruta: '/sobre-nosotros' },
    { texto: 'Contacto', ruta: '/contacto' },
];

const NavMenu = ({ mobile = false, onItemClick }) => {
 
    const navButtons = navLinks.map((link) => (
        <Button
            key={link.texto}
            color="inherit"
            component={RouterLink}
            to={link.ruta}
            onClick={onItemClick} // Para cerrar el menú en móvil cuando clickean
        >
            {link.texto}
        </Button>
    ));

    // Si es móvil, mostramos los botones en columna con estilo adaptado
    if (mobile) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%'
            }}>
                {navButtons.map(button => (
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
    
    // Menú para escritorio, en fila
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {navButtons}
        </Box>
    );
};

export default NavMenu;
