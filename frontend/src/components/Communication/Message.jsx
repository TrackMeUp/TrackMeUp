export function Message({ entradas }) {
    return (
        <div className="mensajes">
            {entradas.map((entrada) => (
                <div
                    key={entrada.id_mensaje}
                    className={`mensaje ${entrada.remitente === 'true' ? 'mensaje-true' : 'mensaje-false'}`}
                >
                    <img className="avatar" src={entrada.avatar} alt="avatar" />
                    <div className={`mensaje-contenido ${entrada.remitente === 'true' ? 'mensaje-contenido-true' : 'mensaje-contenido-false'}`}>
                        <p className="mensaje-texto">{entrada.contenido}</p>
                        <span className="mensaje-hora">{entrada.fecha} {entrada.hora}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
