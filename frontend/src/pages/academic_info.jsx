// Página de Información académica

import { Articulo } from "../components/UI/Articulo" // Importa el fichero Articulo.jsx
import { useEffect, useState } from "react";

export function AcademicInfo() {

    const [infoAcademica, setInfoAcademica] = useState(null);
    const [error, setError] = useState(null);
    const usuarioId = parseInt(localStorage.getItem("user_id"), 10);
    const rol = localStorage.getItem("user_role");

    useEffect(() => {
        const obtenerInfoAcademica = async () => {

            try {
                const respuesta = await fetch(`http://localhost:3000/api/academic_info/${usuarioId}/${rol}`);
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                setInfoAcademica(datos);

            } catch (error) {
                console.error("Error al obtener la información académica:", error);
                setError("No se pudo cargar la información académica.");
            }
        };

        if (usuarioId && rol) {
            obtenerInfoAcademica();
        }

    }, [usuarioId, rol]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!infoAcademica) {
        return <div>Cargando información académica...</div>;
    }



    // Vista de "Estudiante"
    const StudentView = () => (
        <>
            <div className="informacion-container">
                <Articulo titulo="Información académica" entradas={[
                    { texto: "Curso:", info: infoAcademica.course_name || "No disponible" },
                    { texto: "Año académico:", info: infoAcademica.academic_year || "No disponible" },
                ]}
                />

                <Articulo titulo="Asignaturas y horarios" entradas={

                    Array.isArray(infoAcademica.subjects) ? infoAcademica.subjects.map((subject, idx) => ({

                        texto: (subject.subject_name + " | Grupo: " + subject.class_group) || `Asignatura ${idx + 1}`,
                        info: Array.isArray(subject.schedule) ? subject.schedule.map(h => `${h.day}: ${h.start} - ${h.end}`).join(", ") : "Horario no disponible"
                    })) : []
                }
                />

            </div>
        </>
    );

    // Vista de "Estudiante"
    const ParentView = () => (
        <>
            <div className="informacion-container">
                <Articulo titulo="Información académica del alumno" entradas={[
                    { texto: "Curso:", info: infoAcademica.course_name || "No disponible" },
                    { texto: "Año académico:", info: infoAcademica.academic_year || "No disponible" },
                ]}
                />

                <Articulo titulo="Asignaturas y horarios" entradas={

                    Array.isArray(infoAcademica.subjects) ? infoAcademica.subjects.map((subject, idx) => ({

                        texto:(subject.subject_name + " | Grupo: " + subject.class_group) || `Asignatura ${idx + 1}`,
                        info: Array.isArray(subject.schedule) ? subject.schedule.map(h => `${h.day}: ${h.start} - ${h.end}`).join(", ") : "Horario no disponible"
                    })) : []
                }
                />

            </div>
        </>
    );

    // Vista de "Personal docente"
    const TeacherView = () => (
        <>
            <div className="informacion-container">
                <Articulo titulo="Información académica" entradas={[
                    { texto: "Curso:", info: infoAcademica.course_name || "No disponible" },
                    { texto: "Año académico:", info: infoAcademica.academic_year || "No disponible" },
                ]}
                />

                <Articulo titulo="Asignaturas y horarios" entradas={

                    Array.isArray(infoAcademica.subjects) ? infoAcademica.subjects.map((subject, idx) => ({

                        texto: (subject.subject_name + " | Grupo: " + subject.class_group) || `Asignatura ${idx + 1}`,
                        info: Array.isArray(subject.schedule) ? subject.schedule.map(h => `${h.day}: ${h.start} - ${h.end}`).join(", ") : "Horario no disponible"
                    })) : []
                }
                />

            </div>
        </>
    );


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