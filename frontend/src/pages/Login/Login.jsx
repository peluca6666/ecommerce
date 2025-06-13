import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validarLogin } from '../../validations/loginFrontend.js';
import LoginForm from '../../components/LoginForm/LoginForm.jsx'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // asegurate que el path esté bien


const Login = () => {
  const [formulario, setFormulario] = useState({
    email: '',
    contrasenia: ''
  });

  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });

    if (errores[e.target.name]) {
      setErrores({
        ...errores,
        [e.target.name]: ''
      });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrores({});

  const erroresValidados = validarLogin(formulario);
  if (Object.keys(erroresValidados).length > 0) {
    setErrores(erroresValidados);
    setIsLoading(false);
    return;
  }

try {
  const response = await axios.post('http://localhost:3000/api/login', formulario);
  const data = response.data;

  if (data.token && typeof data.token === 'string' && data.token.includes('.')) {
    const fueValido = login(data.token);

    if (fueValido) {
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const rol = payload.rol;

      if (rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/main');
      }
    } else {
      setErrores({ general: 'Token inválido o expirado' });
    }

  } else if (data.error) {
    setErrores({ general: data.error }); // error tipo "no verificado" o credenciales inválidas
  } else {
    setErrores({ general: 'Respuesta inesperada del servidor' });
  }

} catch (error) {
  setErrores({
    general: error.response?.data?.error || 'Error al iniciar sesión'
  });
}
 finally {
    setIsLoading(false);
  }
};

  return (
    <LoginForm
      formulario={formulario}
      errores={errores}
      isLoading={isLoading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
