import 'bootstrap/dist/css/bootstrap.min.css';  // Importa estilos
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importa JavaScript
import { useEffect } from 'react';

import { Route, Routes, Navigate } from 'react-router-dom'; // Importa los componentes Route, Routes, Navigate de React
import './styles/app.css'; // Importa el fichero de estilo css

// Rutas
import { Layout } from './Layout';
import { AdminLayout } from "./pages/admin/admin_layout"

import { Home } from './pages/home';
import { Profile } from './pages/profile';
import { AcademicInfo } from './pages/academic_info';
import { Calendar } from './pages/calendar';
import { Activities } from './pages/activities';
import { Performance } from './pages/performance';
import { Communication } from './pages/communication';
import { Announcements } from './pages/announcements';

import { Login } from './pages/login';
import { LogOut } from './pages/logout';
import { PrivateRoute } from "./components/PrivateRoute";

// Usuario "Administrador"
import { AdminRoute } from './components/AdminRoute';
import { AdminView } from "./pages/admin/adminView";
import { UserManagement } from "./pages/admin/user_management";
import { AcademicManagement } from "./pages/admin/academic_management";
import { PerformanceManagement } from "./pages/admin/performance_management";


export function App() {

  useEffect(() => {
    const sessionAlive = sessionStorage.getItem("session_alive");

    if (!sessionAlive) {
      localStorage.clear();  // El usuario abrió una nueva ventana sin cerrar sesión antes
    }
  }, []);

  const user = localStorage.getItem("user");

  return (
    // Si el usuario ha iniciado sesión, se muestra el menú de navegación (Layout)
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

      <Route element={<PrivateRoute />}>

        {/* Rutas para roles: "Estudiante", "Padre", "Profesor" */}

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/academic_info" element={<AcademicInfo />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/logout" element={<LogOut />} />
        </Route>

        {/* Rutas para rol "Administrador" */}
        <Route element={<AdminRoute />}>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminView />} />
            <Route path="/admin/user_management" element={<UserManagement />} />
            <Route path="/admin/academic_management" element={<AcademicManagement />} />
            <Route path="/admin/performance_management" element={<PerformanceManagement />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/logout" element={<LogOut />} />
          </Route>

        </Route>

      </Route>

    </Routes>
  );
}
