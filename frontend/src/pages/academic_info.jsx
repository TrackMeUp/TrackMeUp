import { Articulo } from "../Articulo"

export function InformacionAcademica() {
    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <h2 className="text-center mb-4">Información Académica</h2>
                    <Articulo titulo="Curso" texto="Centro:" info="Centro" />
                    <Articulo titulo="Asignaturas" texto="Asignatura1:" info="Profesor" />
                    <Articulo titulo="Horario" texto="Consultar horario:" info="Horario" />
                </div>
            </div>
        </div>
    );
}