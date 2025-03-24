import { Articulo } from "../components/UI/Articulo"


      {/* <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-8 col-lg-6"> 
                    <h2 className="text-center mb-4">Información Académica</h2> */}
                   
const AcademicInfo = () => {
    return (
        <>
            <div className="informacion-container">

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

export default AcademicInfo;

