export function ChatItem({ nombre, fecha, hora, nuevo = false }) {
    return (
      <div className="chat-item">
        <img
          className="avatar"
          src="https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png"
          alt="avatar"
        />
        <div className="chat-info">
          <span className="chat-nombre">{nombre}</span>
          <span className="chat-fecha">{`${fecha} ${hora}`}</span>
        </div>
        {nuevo && <span className="nuevo-indicador">1</span>}
      </div>
    );
  }
  