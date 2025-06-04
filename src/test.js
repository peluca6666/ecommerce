import { crearUsuario } from "../backend/services/usuarioService.js";

const run = async () => {
  try {
    const nuevo = await crearUsuario({
      nombre: "German",
      apellido: "Cabrera",
      mail: "test@gmail.com",
      contrasenia: "1234",
      rol: "cliente"
    });
    
    console.log("Usuario creado:", nuevo);
  } catch (error) {
    console.error("Error en test:", error);
  }
};

run();