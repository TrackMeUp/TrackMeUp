import { Articulo } from "../components/UI/Articulo";

export function AcademicInfo () {
    return (
        <>
            <div className="informacion-container" >

                <Articulo titulo="Curso" entradas={[
                    { texto: "Curso:", info: "Curso" },
                    { texto: "Curso:", info: "Curso" },
                    { texto: "Curso:", info: "Curso" }]}/>

                <Articulo titulo="Asignaturas" entradas={[
                    { texto: "Asignatura1:", info: "Asignatura1" },
                    { texto: "Asignatura2:", info: "Asignatura2" },
                    { texto: "Asignatura3:", info: "Asignatura3" },
                    { texto: "Asignatura4:", info: "Asignatura4" },
                    { texto: "Asignatura5:", info: "Asignatura5" },
                    { texto: "Asignatura6:", info: "Asignatura6" }]}/>

                <Articulo titulo="Horario" entradas={[
                    { texto: "Consultar horario:", info: "Horario" }]}/>  

            </div>
        </>
    )
}

