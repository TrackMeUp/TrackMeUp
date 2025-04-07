export function Message({ texto, hora }) {
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
  