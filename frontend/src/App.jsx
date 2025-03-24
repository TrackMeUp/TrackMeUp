
import 'bootstrap/dist/css/bootstrap.min.css'  // Importa estilos
import 'bootstrap/dist/js/bootstrap.bundle.min' // Importa JavaScript


import React, { use, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './styles/app.css'

import { Layout } from './Layout';
import { Home } from './pages/home';
import { Profile } from './pages/profile';
import AcademicInfo from './pages/academic_info';
import { Calendar } from './pages/calendar';
import { Activities } from './pages/activities';
import { Performance } from './pages/performance';
import { Communication } from './pages/communication';
import { Announcements } from './pages/announcements';
import { Notifications } from './pages/notice_board';

import { Login } from './pages/login';

// Un hook useState false (No hay usuario autenticado)
// Un hook setIsAuthenticated para cambiar el estado del usuario autenticado
// Un hook useNavigate para redireccionar a la página de inicio
// Tenemos que lograr que cuando el usuario autentique se le asigne un valor true a isAuthenticated
// Si isAuthenticated es true, se muestra el layout

// El cerrar sesión dará valor de isAuthenticated(false) y asi volvera a login

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    Navigate('/home');
  }

  return (
    <>

    <Routes>
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      // Si isAuthenticated es true, se muestra el layout
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/academic_info" element={<AcademicInfo />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/notice_board" element={<Notifications />} />
      </Route>
    </Routes>
    </>
  )
  }

