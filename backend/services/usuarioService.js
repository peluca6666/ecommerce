import { encriptarContrasenia } from "../utils/encriptador";    
import { pool } from "../database/connectionMySQL";
import { Usuario } from "../models/Usuario";

export async function crearUsuario(datosUsuario){
   try{
    //Encriptamos la contraseña
    const hash = await encriptarContrasenia(datosUsuario.contrasenia);

    //Armar query SQL para insertar usuario 
    const sql = 'INSERT INTO usuario ( nombre, apellido, mail, contrasenia, rol) VALUES (?, ?, ?, ?, ?)';
 
    //Ejectutar la query usando la conexion
    const [resultado] = await pool.execute(sql, [
        datosUsuario.nombre,
        datosUsuario.apellido,
        datosUsuario.mail,
        hash,                                                                           
        datosUsuario.rol || 'cliente'
    ]);

    //Creamos una instancia de usuario para mostrar los datos de manera clara 
  const nuevoUsuario = new Usuario(
  resultado.insertId,                      // Id generado por la base
  datosUsuario.nombre,
  datosUsuario.apellido,
  datosUsuario.mail,
  undefined,                               // Undefined para no devolver la contraseña
  datosUsuario.rol || 'cliente'
);

return nuevoUsuario.obtenerPerfil();

} catch (error) {
    console.error('Error creando usuario:', error);
    throw error;  // Lo podés manejar en el controlador o middleware
  }
}
