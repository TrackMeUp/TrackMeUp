import { ChatItem } from './ChatItem';

export function ConversationList({ entradas, onSelectChat, selectedChatId }) {
    return (
        <div className="comunicacion-listado">
            <div className="comunicacion-header">
                <h2>Mensajes</h2>
                <button className="nuevo-btn">NUEVO +</button>
            </div>

            {entradas.map((entrada) => (
                <div
                    key={entrada.id_persona_conversa} // Usamos id_persona_conversa como clave
                    onClick={() => onSelectChat(entrada.id_persona_conversa)} // Pasamos id_persona_conversa para la selección
                >
                    <div className="lista-conversaciones">
                        <ChatItem
                            avatar={entrada.id_persona_conversa}
                            nombre={entrada.persona_conversa}
                            fecha={entrada.fecha_ultimo_mensaje}
                            activo={entrada.id_persona_conversa === selectedChatId} // Comparas con id_persona_conversa
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}


