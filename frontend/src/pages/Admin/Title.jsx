import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

// Componente funcional llamado Title que recibe props
function Title(props) {
  return (
    // Typography se usa para mostrar un título estilizado
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children} {/* Muestra el contenido hijo pasado al componente */}
    </Typography>
  );
}

// Validación de tipo de props: children debe ser un nodo React válido
Title.propTypes = {
  children: PropTypes.node,
};

// Exporta el componente Title para que pueda ser usado en otros archivos
export default Title;
