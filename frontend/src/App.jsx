
import 'bootstrap/dist/css/bootstrap.min.css'  // Importa estilos
import 'bootstrap/dist/js/bootstrap.bundle.min' // Importa JavaScript

import { Route, Routes } from 'react-router-dom';
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


export function App() {
  return (
    <>

    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
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

