import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarRegistro } from "../validations/registroFrontend.js";
import axios from "axios";
import RegistroForm from '../components/RegistroForm/RegistroForm.jsx';

const initialState = {
  nombre: '',
  apellido: '',
  email: '',
  contrasenia: '',
  confirmarContrasenia: ''
};

export default function Registro() {
  const [formulario, setFormulario] = useState(initialState);
  const [mensajeExito, setMensajeExito] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrores({});

    const erroresValidados = validarRegistro(formulario);
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/usuarios/registro', formulario);
      setMensajeExito('Registro exitoso! Redirigiendo...');
      setFormulario(initialState);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrores(error.response?.data?.errores ?? { general: 'Error al registrar. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <RegistroForm
    formulario={formulario}
    errores={errores}
    isLoading={isLoading}
    mensajeExito={mensajeExito}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
  />
);
}