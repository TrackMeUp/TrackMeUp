import { Articulo } from "../components/UI/Articulo";
import { useEffect, useState } from "react";

export function Profile() {

    const [usuario, setUsuario] = useState();
    const rol = localStorage.getItem("user_role");
    const userName = localStorage.getItem("user_name");
    const usuarioId = parseInt(localStorage.getItem("user_id"));

    const handleChangePassw = async (event) => {
        // Controlador del botón "¿Has olvidado tu contraseña?
        event.preventDefault();
        alert('Solicitud de cambio de contraseña recibido. El centro de estudios contactará contigo por correo electrónico.');
    };

    const handleChangeInfo = async (event) => {
        // Controlador del botón "¿Has olvidado tu contraseña?
        event.preventDefault();
        alert('Solicitud de modificación de datos personales recibida. El centro de estudios contactará contigo por correo electrónico.');
    };


     useEffect(() => {
        const obtenerDatosUsuario = async () => {
            try {
                const respuesta = await fetch(`http://localhost:3000/api/usuario/${usuarioId}`);
                const datos = await respuesta.json();
                setUsuario(datos);

            } catch (error) {
                console.error("Error al obtener los datos del usuario: ", error);
            }
        };

        if (usuarioId) {
            obtenerDatosUsuario();
        }

     }, [usuarioId]);


     if (!usuario) {
        return <div>Cargando información...</div>;
     }

     // Vista de Estudiante
     const StudentView = () => (
     <>
            <div className="informacion-container">

                <Articulo titulo="Información personal" entradas={[
                    { texto: "Nombre:", info: `${usuario.first_name} ${usuario.last_name1} ${usuario.last_name2}`},
                    { texto: "Nombre padre/tutor:",
                        info: usuario.parents?.map(p => `${p.first_name} ${p.last_name1} ${p.last_name2}`).join(", ") || "No disponible"},
                    { texto: "Correo:", info: usuario.email }
                ]}
                />

                <Articulo titulo="Configuración" entradas={[
                    { texto: "Contraseña:", info: 
                        <div className="passw-button">
                            <a href="#" onClick={handleChangePassw}>Cambiar contraseña</a>
                        </div>
                    },

                    { texto: "Información personal", info:
                        <div className="passw-button">
                            <a href="#" onClick={handleChangeInfo}>Solicitar modificación</a>
                        </div>
                    }
                ]}/>

            </div>
        </>
     );

    // Vista de Padre/Tutor
     const ParentView = () => (
      <>
            <div className="informacion-container">

                <Articulo titulo="Información personal" entradas={[
                    { texto: "Nombre:", info: ""},
                    { texto: "Nombre padre/tutor:", info: ""},
                    { texto: "Correo:", info: ""},
                ]}/>

            </div>
        </>
     )

    // Vista de Personal Docente 
    const TeacherView = () => (
      <>
            <div className="informacion-container">

                <Articulo titulo="Información personal" entradas={[
                    { texto: "Nombre:", info: ""},
                    { texto: "Nombre padre/tutor:", info: ""},
                    { texto: "Correo:", info: ""},
                ]}/>

            </div>
        </>
     )     


    const renderVistaPorRol = () => {
        
        switch (rol) {
        case "student":
            return <StudentView />;
        case "parent":
            return <ParentView />;
        case "teacher":
            return <TeacherView />;
        default:
            return <div>Rol no reconocido</div>;
        }
    };

    return <div className="informacion-container">{renderVistaPorRol()}</div>;

}