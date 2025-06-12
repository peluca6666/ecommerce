import { Button, Box } from "@mui/material";

const NavMenu = ({ mobile = false, onItemClick, sx }) => {
  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  if (mobile) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        ...sx
      }}>
        <Button
          color="inherit"
          onClick={handleItemClick}
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            py: 1.5,
            px: 2,
            textAlign: 'left',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          OFERTAS
        </Button>
        <Button
          color="inherit"
          onClick={handleItemClick}
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            py: 1.5,
            px: 2,
            textAlign: 'left',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Sobre Nosotros
        </Button>
        <Button
          color="inherit"
          onClick={handleItemClick}
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            py: 1.5,
            px: 2,
            textAlign: 'left',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Contacto
        </Button>
        <Button
          color="inherit"
          onClick={handleItemClick}
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            py: 1.5,
            px: 2,
            textAlign: 'left',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Envios y Devoluciones
        </Button>
      </Box>
    );
  }

  // Versión desktop (horizontal) - mantiene tu estructura original
  return (
    <>
      <Button color="inherit">OFERTAS</Button>
      <Button color="inherit">Sobre Nosotros</Button>
      <Button color="inherit">Contacto</Button>
      <Button color="inherit">Envios y Devoluciones</Button>
    </>
  );
};

export default NavMenu;
