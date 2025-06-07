import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/" element={<Register />} /> {/* Ruta temporal, cambia según necesites */}
          {/* Agrega aquí tus otras rutas */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;