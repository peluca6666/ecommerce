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

    // Validaciones - CORREGIDAS para coincidir con el backend
    const nuevosErrores = {};
    
    // Validación de nombre (mínimo 3 caracteres como en el backend)
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formulario.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre no puede contener números ni caracteres especiales';
    }
    
    // Validación de apellido (mínimo 3 caracteres como en el backend)
    if (!formulario.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio';
    } else if (formulario.apellido.trim().length < 3) {
      nuevosErrores.apellido = 'El apellido debe tener al menos 3 caracteres';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formulario.apellido.trim())) {
      nuevosErrores.apellido = 'El apellido no puede contener números ni caracteres especiales';
    }
    
    // Validación de email
    if (!formulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    
    // Validación de contraseña - CORREGIDA: mínimo 8 caracteres
    if (!formulario.contrasenia) {
      nuevosErrores.contrasenia = 'La contraseña es obligatoria';
    } else if (formulario.contrasenia.length < 8) {
      nuevosErrores.contrasenia = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (formulario.contrasenia !== formulario.confirmarContrasenia) {
      nuevosErrores.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      // Si no hay errores, enviar al backend
      setIsLoading(true);
      setMensajeExito('');
      
      // Debug: ver qué datos se están enviando
      console.log('Enviando datos:', {
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        contrasenia: formulario.contrasenia
      });
        
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
        console.error('Error completo:', error);
        console.error('Respuesta del servidor:', error.response?.data);
        
        setIsLoading(false);
        
        // CORREGIDO: Manejar errores del backend correctamente
        if (error.response?.data?.errores) {
          // Si el backend devuelve un array de errores de validación
          const errorMessage = error.response.data.errores.join('. ');
          setErrores({ general: errorMessage });
        } else if (error.response?.data?.error) {
          // Si el backend devuelve un error específico (como email ya registrado)
          setErrores({ general: error.response.data.error });
        } else {
          // Error genérico
          setErrores({ general: 'Error de conexión con el servidor' });
        }
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