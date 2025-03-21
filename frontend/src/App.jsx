import './app.css'
import { Menu } from './components/Menu'
import { Cabecera } from './components/Header'

import { Articulo } from './Articulo'
import { InformacionAcademica } from './pages/academic_info'

export function App () {
  return (
    <>
    <Cabecera />
    <Menu />
    <InformacionAcademica />
    </>
  )
}
