import {createPool} from "mysql2/promise";

//Usé pool para evitar caidas de conexión con la bd en caso de haber mucho
//  tráfico de usuarios
export const pool = createPool({ 
    host: "localhost",
    port: 3306,
    database: "ecommerce",
    user: "root",
    password: "Miprimerproyecto2025!"
})