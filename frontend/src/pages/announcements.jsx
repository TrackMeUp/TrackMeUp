// Página Tablón de anuncios

import { Articulo } from "../components/UI/Articulo" // Importa el fichero Articulo.jsx
import { useEffect, useState } from "react";

export function Announcements() {

    const [announcement, setAnnouncement] = useState(null);
    const [error, setError] = useState(null);
    //const teacherId = parseInt(localStorage.getItem("teacher_id"), 10);
    //const studentId = parseInt(localStorage.getItem("student_id"), 10);
    const rol = localStorage.getItem("user_role");
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user.role[rol + "_id"];

    useEffect(() => {
        const obtenerTablonAnuncios = async () => {

            try {

                let url = `http://localhost:3000/api/announcements/${id}/${rol}`;
                /*
                                if (userRole === "teacher") {
                
                                    url = `http://localhost:3000/api/announcements/${teacherId}/${rol}`;
                
                                } else {
                                    url = `http://localhost:3000/api/announcements/${studentId}/${rol}`;
                                }
                */
                const respuesta = await fetch(url);
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                setAnnouncement(datos);
                console.log(datos);

            } catch (error) {
                console.error("Error al obtener la información académica:", error);
                setError("No se pudo cargar la información académica.");
            }
        };

        if (id && rol) {
            obtenerTablonAnuncios();
        }

    }, [id, rol]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!announcement) {
        return <div>Cargando tablón de anuncios...</div>;
    }


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


    // Vista de "Estudiante"
    const StudentView = ({ announcement }) => (
        <>
            <h1>Tablón de anuncios</h1>

            {announcement.length > 0 ? (announcement.map((entry) => (

                        <div className="informacion-container" key={entry.entry_id}>
                            <Articulo
                                titulo="Nueva entrada"
                                entradas={[
                                    { texto: "Título:", info: entry.entry_title || "No disponible" },
                                    { texto: "Contenido:", info: entry.entry_content || "No disponible" },
                                    { texto: "Asignatura:", info: entry.entry_subject || "No disponible" },
                                    { texto: "Profesor:", info: entry.entry_teacher || "No disponible" },
                                ]}
                            />
                        </div>
                    ))
                ) : (

                    <p>No hay entradas disponibles.</p>
                )
            }
        </>
    );

    // Vista de "Estudiante"
    const ParentView = ({ announcement }) => (
        <>

            <h1>Tablón de anuncios</h1>

            {announcement.length > 0 ? (announcement.map((entry) => (

                        <div className="informacion-container" key={entry.entry_id}>
                            <Articulo
                                titulo="Nueva entrada"
                                entradas={[
                                    { texto: "Título:", info: entry.entry_title || "No disponible" },
                                    { texto: "Contenido:", info: entry.entry_content || "No disponible" },
                                    { texto: "Asignatura:", info: entry.entry_subject || "No disponible" },
                                    { texto: "Profesor:", info: entry.entry_teacher || "No disponible" },
                                ]}
                            />
                        </div>
                    ))
                ) : (

                    <p>No hay entradas disponibles.</p>
                )
            }
        </>
    );

    // Vista de "Personal docente"
    const TeacherView = ({ announcement }) => (
        <>
            <h1>Tablón de anuncios</h1>

            {announcement.length > 0 ? (announcement.map((entry) => (

                        <div className="informacion-container" key={entry.entry_id}>
                            <Articulo
                                titulo="Nueva entrada"
                                entradas={[
                                    { texto: "Título:", info: entry.entry_title || "No disponible" },
                                    { texto: "Contenido:", info: entry.entry_content || "No disponible" },
                                    { texto: "Asignatura:", info: entry.entry_subject || "No disponible" },
                                    { texto: "Profesor:", info: entry.entry_teacher || "No disponible" },
                                ]}
                            />
                        </div>
                    ))
                ) : (

                    <p>No hay entradas disponibles.</p>
                )
            }

            <button>Añadir entrada</button>

        </>

    );