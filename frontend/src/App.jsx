import { useState } from 'react'
import RegistroForm from '../components/RegistroForm/RegistroForm.jsx'

function App() {
  // Estado para los datos del formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasenia: '',
    confirmarContrasenia: '',
  })

  // Estado para los errores de validación
  const [errores, setErrores] = useState({})

  // Estado para indicar carga durante envío
  const [isLoading, setIsLoading] = useState(false)

  // Estado para mensaje de éxito
  const [mensajeExito, setMensajeExito] = useState('')

  // Función para actualizar los campos del formulario
  const onChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    })
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[e.target.name]) {
      setErrores({
        ...errores,
        [e.target.name]: ''
      })
    }
  }

  // Función que maneja el submit del formulario
  const onSubmit = async (e) => {
    e.preventDefault()

    // Validaciones
    const nuevosErrores = {}
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (!formulario.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio'
    if (!formulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'El email no es válido'
    }
    if (!formulario.contrasenia) {
      nuevosErrores.contrasenia = 'La contraseña es obligatoria'
    } else if (formulario.contrasenia.length < 6) {
      nuevosErrores.contrasenia = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (formulario.contrasenia !== formulario.confirmarContrasenia) {
      nuevosErrores.confirmarContrasenia = 'Las contraseñas no coinciden'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length === 0) {
      // Si no hay errores, enviar al backend
      setIsLoading(true)
      setMensajeExito('')
        
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            email: formulario.email,
            contrasenia: formulario.contrasenia
          })
        })

        if (response.ok) {
          const data = await response.json()
          setIsLoading(false)
          setMensajeExito('Usuario registrado con éxito!')
          setFormulario({
            nombre: '',
            apellido: '',
            email: '',
            contrasenia: '',
            confirmarContrasenia: '',
          })
          setErrores({})
        } else {
          const errorData = await response.json()
          setIsLoading(false)
          setErrores({ general: errorData.message || 'Error al registrar usuario' })
        }
      } catch (error) {
        console.error('Error:', error)
        setIsLoading(false)
        setErrores({ general: 'Error de conexión con el servidor' })
      }
    }
  }

  return (
    <div>
      <RegistroForm
        formulario={formulario}
        errores={errores}
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        mensajeExito={mensajeExito}
      />
    </div>
  )
}

export default App