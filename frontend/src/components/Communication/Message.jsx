/*export function Message({ texto, hora }) {
    return (
      <div className="mensaje">
        <img
          className="avatar"
          src="https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png"
          alt="avatar"
        />
        <div className="mensaje-contenido">
          <p className="mensaje-texto">{texto}</p>
          <span className="mensaje-hora">{hora}</span>
        </div>
      </div>
    );
  }
  */

  
  export function Message({ entradas }) {
    return (
        <div className="mensajes">
            {entradas.map((entrada) => (
                <div key={entrada.id_mensaje} className="mensaje">
                    <img className="avatar" src={entrada.avatar} alt="avatar" />
                    <div className="mensaje-contenido">
                        <p className="mensaje-texto">{entrada.texto}</p>
                        <span className="mensaje-hora">{entrada.fecha} {entrada.hora}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

  