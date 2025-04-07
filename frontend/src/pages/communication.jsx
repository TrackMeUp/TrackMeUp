import { ChatItem } from "../components/Communication/ChatItem";
import { Message } from "../components/Communication/Message";
import { Editor } from "../components/Communication/Editor";

export function Communication() {
  return (
    <div className="comunicacion-container">
      {/* Lista de chats */}
      <div className="comunicacion-listado">
        <div className="comunicacion-header">
          <h2>Mensajes</h2>
          <button className="nuevo-btn">NUEVO +</button>
        </div>
        <div className="lista-conversaciones">
          <ChatItem nombre="Usuario" fecha="10/10" hora="10:30" nuevo />
          <ChatItem nombre="Usuario" fecha="12/10" hora="20:23" />
          {/* ...otros chats */}
        </div>
      </div>

      {/* Conversación activa */}
      <div className="comunicacion-chat">
        <div className="mensajes">
          <Message texto="Lorem Ipsum..." hora="10:30" />
        </div>
        <Editor />
      </div>
    </div>
  );
}
