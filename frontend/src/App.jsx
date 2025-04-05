import 'bootstrap/dist/css/bootstrap.min.css';  // Importa estilos
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importa JavaScript

import { Route, Routes, Navigate } from 'react-router-dom';
import './styles/app.css';

import { Layout } from './Layout';
import { Home } from './pages/home';
import { Profile } from './pages/profile';
import { AcademicInfo } from './pages/academic_info';
import { Calendar } from './pages/calendar';
import { Activities } from './pages/activities';
import { Performance } from './pages/performance';
import { Communication } from './pages/communication';
import { Announcements } from './pages/announcements';
import { Notifications } from './pages/notice_board';
import { Login } from './pages/login';
import { AdminView } from "./pages/admin/adminView";


export function App() {

  const isLogged = true; // Simulación de inicio de sesión

  return (
    <>
      <Routes>

        {isLogged ? (

          // Si el usuario ha iniciado sesión, se muestra el menú de navegación (Layout)

          <Route element={<Layout />}>

            {/* <Route path="/" element={<Navigate to="/login" />} /> */}

            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/academic_info" element={<AcademicInfo />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/notice_board" element={<Notifications />} />
            <Route path="/admin" element={<AdminView />} />

          </Route>

        ) : (

          // Si no ha iniciado sesión, mostramos el login

          <Route path="*" element={<Login />} />
        )}
        
      </Routes>


    </>
  );
}
