import './app.css'
import { Menu } from './Menu'
import { Cabecera } from './Cabecera'

import { Articulo } from './Articulo'
import { InformacionAcademica } from './InformacionAcademica'

export function App () {
  return (
    <>
    <Cabecera />
    <Menu />
    <InformacionAcademica />
    </>
  )
}
