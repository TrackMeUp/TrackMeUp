import { Articulo } from "../Articulo"

export function InformacionAcademica () {
    return (
        <>
            <div className="informacion-container">
                <Articulo titulo="Curso" texto="Centro:" info="Centro"/>
                <Articulo titulo="Asignaturas" texto="Asignatura1:" info="Profesor"/>
                <Articulo titulo="Horario" texto="Consultar horario:" info="Horario"/>
            </div>
        </>
    )
}