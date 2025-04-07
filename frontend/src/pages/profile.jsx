import { Articulo } from "../components/UI/Articulo"

export function Profile() {
    return (
        <>
            <div className="informacion-container">

                <Articulo titulo="Información personal" entradas={[
                    { texto: "Nombre:", info: "Alumno" },
                    { texto: "Nombre padre/tutor:", info: "Padre" },
                    { texto: "Correo:", info: "alumno.apellido@gmail.com" }]}/>

                <Articulo titulo="Configuración" entradas={[
                    { texto: "Contraseña:", info: "Cambiar contrasña" },
                    { texto: "Notificaciones:", info: "Notificaciones" }]}/>

            </div>
        </>
    )
}