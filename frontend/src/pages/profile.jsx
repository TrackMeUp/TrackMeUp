import { Articulo } from "../Articulo"
//import {Link} from "react-router-dom";

export function Perfil() {
    return (
        <>
            <div className="perfil-container">
                <Articulo titulo="Información personal" texto="Nombre: " info="Alumno" />
                <Articulo titulo="Configuración" texto="Contraseña: " info="Cambiar contraseña" />

                {/* <Link to="/changePassword">
                    <button>Cambiar contraseña</button>
                </Link> */}

            </div>
        </>
    )
}