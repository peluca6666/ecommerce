import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistroForm from '../../components/RegistroForm/RegistroForm.jsx'
import axios from 'axios';

const initialState = {
  nombre: '',
  apellido: '',
  email: '',
  contrasenia: '',
  confirmarContrasenia: ''
};

export default function Register() {
  const [formulario, setFormulario] = useState(initialState);
  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  // Función para actualizar los campos del formulario
  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[e.target.name]) {
      setErrores({
        ...errores,
        [e.target.name]: ''
      });
    }
  };

  // Función que maneja el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const nuevosErrores = {};
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!formulario.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';
    if (!formulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    if (!formulario.contrasenia) {
      nuevosErrores.contrasenia = 'La contraseña es obligatoria';
    } else if (formulario.contrasenia.length < 6) {
      nuevosErrores.contrasenia = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formulario.contrasenia !== formulario.confirmarContrasenia) {
      nuevosErrores.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      // Si no hay errores, enviar al backend
      setIsLoading(true);
      setMensajeExito('');
        
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          nombre: formulario.nombre,
          apellido: formulario.apellido,
          email: formulario.email,
          contrasenia: formulario.contrasenia
        });

        setIsLoading(false);
        setMensajeExito('Usuario registrado con éxito! Redirigiendo...');
        setFormulario(initialState);
        setErrores({});

        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
        setErrores({
          general: error.response?.data?.message || 'Error de conexión con el servidor'
        });
      }
    }
  };

  return (
    <RegistroForm
      formulario={formulario}
      errores={errores}
      isLoading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      mensajeExito={mensajeExito}
    />
  );
}