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
                    key={entrada.id_mensaje} 
                    onClick={() => onSelectChat(entrada.id_mensaje)}
                >
                    <div className="lista-conversaciones">
                        <ChatItem
                            avatar={entrada.avatar}
                            nombre={entrada.usuario}
                            fecha={entrada.fecha}
                            nuevo={entrada.nuevo}
                            activo={entrada.id_mensaje === selectedChatId}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
