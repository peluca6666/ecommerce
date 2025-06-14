import {createPool} from "mysql2/promise"; 

export const pool = createPool({ 
    host: "localhost",
    port: 3306,
    database: "ecommerce",
    user: "root",
    password: "Miprimerproyecto2025!"
})