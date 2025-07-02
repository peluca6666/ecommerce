import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

// componente para mostrar un título reutilizable
function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

// valida que se reciba un hijo válido
Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
