import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validarLogin } from '../../validations/loginFrontend.js';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import { useContext } from 'react';
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

  // Actualiza el estado del formulario y limpia errores parciales si existían
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

  // Valida y envía el formulario para iniciar sesión
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

      const fueValido = login(response.data.token); // Actualiza contexto con token

      if (fueValido) {
        // Decodificamos el token para obtener el rol y redirigir según corresponda
        const rol = JSON.parse(atob(response.data.token.split('.')[1])).rol;

        if (rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/main');
        }
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
