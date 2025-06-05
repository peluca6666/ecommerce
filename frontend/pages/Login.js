import {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import {validarLogin} from '../validations/loginFrontend.js';

const [formulario, setFormulario] = useState({
  email: '',
  contrasenia: ''
});

const [errores, setErrores] = useState({});

const handleChange = (e) => {
  setFormulario({
    ...formulario,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const erroresValidados = validarLogin(formulario);

  if (Object.keys(erroresValidados).length > 0) {
    setErrores(erroresValidados);
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/api/usuarios/login', formulario);

    console.log("Login exitoso:", response.data);

    // Guardar token
    localStorage.setItem('token', response.data.token);

    setErrores({});
  } catch (error) {
    console.error('Error al hacer login:', error.response?.data || error.message);

    setErrores({
      general: error.response?.data?.mensaje || 'Error al iniciar sesión'
    });
  }
};
 