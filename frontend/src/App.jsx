import 'bootstrap/dist/css/bootstrap.min.css'  // Importa estilos
import 'bootstrap/dist/js/bootstrap.bundle.min' // Importa JavaScript
import './styles/app.css'
import { Menu } from './components/Menu'
import { Cabecera } from './components/Header'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { Articulo } from './Articulo'
import { InformacionAcademica } from './pages/academic_info'
//import { Footer } from './components/Footer' 

export function App() {
  return (
    <>
    <Cabecera />
    <Menu />
    <InformacionAcademica />
    
    
      
      </>
  )
}
      
    
