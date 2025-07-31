import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validarLogin } from '../../validations/loginFrontend.js';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import { AuthContext } from '../../context/AuthContext'; 

const Login = () => {
  const [formulario, setFormulario] = useState({
    email: '',
    contrasenia: ''
  });

  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // maneja los cambios en los inputs y limpia el error si ya había
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

  // valida los datos y si todo está ok, manda la solicitud de login
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, formulario);

      const fueValido = login(response.data.token); // guarda el token en el contexto

      if (fueValido) {
        navigate('/main');
      } else {
        setErrores({ general: 'Debes verificar tu cuenta para poder iniciar' });
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
