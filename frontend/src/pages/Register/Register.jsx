import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import RegistroForm from '../../components/RegistroForm/RegistroForm.jsx';
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
  const [estadoRegistro, setEstadoRegistro] = useState('formulario'); // puede ser 'formulario', 'exito' o 'error'
  const [emailRegistrado, setEmailRegistrado] = useState('');
  const navigate = useNavigate();

  // actualiza los campos del formulario y limpia error si existía
  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
    
    if (errores[e.target.name]) {
      setErrores({
        ...errores,
        [e.target.name]: ''
      });
    }
  };

  // envía el formulario, valida y llama al backend
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const nuevosErrores = {};
    
    // validación nombre
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'el nombre es obligatorio';
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'el nombre debe tener al menos 3 caracteres';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formulario.nombre.trim())) {
      nuevosErrores.nombre = 'el nombre no puede contener números ni caracteres especiales';
    }
    
    // validación apellido
    if (!formulario.apellido.trim()) {
      nuevosErrores.apellido = 'el apellido es obligatorio';
    } else if (formulario.apellido.trim().length < 3) {
      nuevosErrores.apellido = 'el apellido debe tener al menos 3 caracteres';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formulario.apellido.trim())) {
      nuevosErrores.apellido = 'el apellido no puede contener números ni caracteres especiales';
    }
    
    // validación email
    if (!formulario.email.trim()) {
      nuevosErrores.email = 'el email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'el email no es válido';
    }
    
    // validación contraseña
    if (!formulario.contrasenia) {
      nuevosErrores.contrasenia = 'la contraseña es obligatoria';
    } else if (formulario.contrasenia.length < 8) {
      nuevosErrores.contrasenia = 'la contraseña debe tener al menos 8 caracteres';
    }
    
    // validación confirmación contraseña
    // validación confirmación contraseña
if (!formulario.confirmarContrasenia) {
  nuevosErrores.confirmarContrasenia = 'la confirmación de contraseña es obligatoria';
} else if (formulario.contrasenia !== formulario.confirmarContrasenia) {
  nuevosErrores.confirmarContrasenia = 'las contraseñas no coinciden';
}

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setIsLoading(true);
      setEstadoRegistro('formulario');
      
      // debug para ver datos enviados
      console.log('enviando datos:', {
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        contrasenia: formulario.contrasenia
      });
        
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
          nombre: formulario.nombre,
          apellido: formulario.apellido,
          email: formulario.email,
          contrasenia: formulario.contrasenia,
	confirmarContrasenia: formulario.confirmarContrasenia
        });

        console.log('respuesta del registro:', response.data);
        
        setIsLoading(false);
        setEmailRegistrado(formulario.email);
        setEstadoRegistro('exito');
        setFormulario(initialState);
        setErrores({});

      } catch (error) {
        console.error('error completo:', error);
        console.error('respuesta del servidor:', error.response?.data);
        
        setIsLoading(false);
        setEstadoRegistro('formulario');
        
        // manejo de errores desde backend
        if (error.response?.data?.errores) {
          // backend devuelve array de errores
          const errorMessage = error.response.data.errores.join('. ');
          setErrores({ general: errorMessage });
        } else if (error.response?.data?.error) {
          // backend devuelve error específico (ej: email ya registrado)
          setErrores({ general: error.response.data.error });
        } else {
          // error genérico de conexión
          setErrores({ general: 'error de conexión con el servidor' });
        }
      }
    }
  };

  // si el registro fue exitoso, muestra pantalla de verificación
  if (estadoRegistro === 'exito') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          {/* icono de email */}
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#e3f2fd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px'
          }}>
            📧
          </div>
          
          <h2 style={{
            color: '#1976d2',
            marginBottom: '16px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            ¡Registro exitoso!
          </h2>
          
          <p style={{
            color: '#666',
            marginBottom: '24px',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Te hemos enviado un correo de verificación a:
          </p>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontWeight: 'bold',
            color: '#1976d2',
            fontSize: '16px'
          }}>
            {emailRegistrado}
          </div>
          
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              color: '#856404',
              fontSize: '16px'
            }}>
              📋 Pasos siguientes:
            </h4>
            <ol style={{ 
              margin: 0, 
              paddingLeft: '20px',
              color: '#856404',
              fontSize: '14px'
            }}>
              <li>Revisa tu bandeja de entrada</li>
              <li>Busca el correo de SaloMarket</li>
              <li>Cliqueá el enlace de verificación</li>
              <li>¡Inicia sesión y disfruta!</li>
            </ol>
          </div>
          
          <div style={{
            backgroundColor: '#f0f8ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#0066cc'
          }}>
            💡 <strong>tip:</strong> Si no encontrás el correo, revisá tu carpeta de spam o correo no deseado
          </div>
          
          {/* botones de acción */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexDirection: 'window.innerWidth < 480 ? column : row'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // muestra el formulario de registro
  return (
    <RegistroForm
      formulario={formulario}
      errores={errores}
      isLoading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      mensajeExito={''} 
    />
  );
}
