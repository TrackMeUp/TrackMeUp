import { Articulo } from "../components/UI/Articulo";
import { useState, useEffect } from "react";

export function AcademicInfo({ menuOpen }) {
    //const AcademicInfo = ({ menuOpen }) => {
    const cursoData = Array(3).fill({ texto: "Curso:", info: "Curso" });
    const asignaturasData = Array.from({ length: 6 }, (_, i) => ({ texto: `Asignatura ${i + 1}:`, info: `Asignatura ${i + 1}`}));
    const horarioData = [{ texto: "Consultar horario:", info: "Horario" }];

    return (
        <div
            className="container-fluid"
            style={{
                marginLeft: menuOpen ? "250px" : "0", // Ajusta el margen cuando el menú está abierto o cerrado
                transition: "margin-left 0.3s ease-in-out",
                display: "flex", // Utilizamos flexbox para centrar
                alignItems: "center", // Centrar verticalmente
                justifyContent: "center", // Centrar horizontalmente
                height: "100vh", // Ocupa toda la pantalla
                padding: "1rem",
                overflowY: "auto", // Agrega esta propiedad para hacer scroll si el contenido es demasiado grande
            }}
        >
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 text-center">
                    <h2 className="mb-4">Información Académica</h2>
                    <Articulo titulo="Curso" entradas={cursoData} />
                    <Articulo titulo="Asignaturas" entradas={asignaturasData} />
                    <Articulo titulo="Horario" entradas={horarioData} />
                </div>
            </div>
        </div>
    );
}

//export default AcademicInfo;
