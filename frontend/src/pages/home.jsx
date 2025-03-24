export function Home() {
    return (
      <div className="container mt-5">
        {/* Sección de bienvenida */}
        <section className="text-center mb-5">
          <h1>¡Bienvenido a TrackMeUp!</h1>
          <p className="lead">Tu gestor académico todo en uno para llevar el control de tu aprendizaje.</p>
          <a href="/login" className="btn btn-primary mt-5">Empezar ahora</a>
        </section>
  
        {/* Sección de características */}
        <section className="row text-center">
          <div className="col-12 col-md-4 mb-4">
            <h3>📚 Gestión Académica</h3>
            <p>Accede a tus asignaturas, calificaciones y horarios fácilmente.</p>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <h3>🔔 Notificaciones</h3>
            <p>Recibe avisos importantes y mantente al día con tu progreso.</p>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <h3>📲 Comunicación</h3>
            <p>Conecta con profesores y padres directamente desde la plataforma.</p>
          </div>
        </section>
  
        {/* Llamado a la acción final */}
        <section className="text-center mt-5">
          <h2>¿Listo para mejorar tu experiencia académica?</h2>
          <a href="/registro" className="btn btn-success btn-lg mt-3">Regístrate gratis</a>
        </section>
      </div>
    );
  }