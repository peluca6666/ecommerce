import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validarLogin } from '../validations/loginFrontend.js';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [formulario, setFormulario] = useState({
    email: '',
    contrasenia: ''
  });

  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    const response = await axios.post('http://localhost:3000/api/usuarios/login', formulario);

    localStorage.setItem('token', response.data.token);

    const rol = response.data.rol;

    if (rol === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }

  } catch (error) {
    setErrores({
  general: error.response?.data?.error || 'Error al iniciar sesión'
});
  } finally {
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
