# 🛒 Proyecto E-commerce

Este proyecto es una aplicación completa de comercio electrónico. Cuenta con un **backend en Node.js (Express)** y un **frontend en React (Vite)**. Permite a los usuarios explorar productos, registrarse, iniciar sesión, agregar al carrito y realizar compras.

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegurate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión recomendada: >=16)
- npm (o yarn)
- Servidor MySQL activo y en funcionamiento
- git

---

## 📁 Estructura del Proyecto

El repositorio está organizado así:

```
ecommerce/
├── backend/    → Código del servidor (Node.js + Express)
├── frontend/   → Código del cliente (React + Vite)
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/peluca6666/ecommerce.git
cd ecommerce
```

---

### 2. Configuración del Backend

#### a. Instalar dependencias

```bash
cd backend
npm install
```

#### b. Configurar variables de entorno

Creá un archivo `.env` en la carpeta `/backend` basado en `.env.example` y completá los valores necesarios.

```env
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRATION=1h
MAIL_USER=tu_email_para_enviar_correos
MAIL_PASS=tu_contraseña_del_email
FRONTEND_URL=http://localhost:5173
```

#### c. Preparar la base de datos

1. Iniciá tu servidor de MySQL.
2. Creá una base de datos llamada `Ecommerce`. la contraseña debe ser "Miprimerproyecto2025!"
3. Importá el script `/backend/db/init.sql` en esa base para crear las tablas y datos iniciales.

---

### 3. Configuración del Frontend

Desde la raíz del proyecto, entrá a la carpeta `frontend` e instalá dependencias:

```bash
cd ../frontend
npm install
```

---

## ▶️ Ejecución del Proyecto

### Iniciar Backend

Desde `/backend`:

```bash
npm run dev
```

El servidor corre en: [http://localhost:3000](http://localhost:3000)

---

### Iniciar Frontend

Desde `/frontend`:

```bash
npm run dev
```

La aplicación se verá en: [http://localhost:5173](http://localhost:5173)

---

## 📝 Notas Adicionales
CUENTA DE ADMINISTRADOR!!!
EMAIL: gercab666@gmail.com
CONTRASEÑA: 12345678!A

- Verificá que MySQL esté corriendo y accesible con los datos del archivo `.env`.
- El script `init.sql` incluye tanto la estructura como los datos iniciales para que el sitio funcione correctamente.
- Consultá el archivo `.env.example` ante cualquier duda sobre las variables necesarias.

---

## 📫 Autor

Proyecto desarrollado por [peluca6666](https://github.com/peluca6666).
