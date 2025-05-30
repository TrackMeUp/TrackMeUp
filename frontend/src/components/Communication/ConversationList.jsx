import { useState } from "react";
import { ChatItem } from './ChatItem';
import { CommunicationModal } from './CommunicationModal'; // Importamos el modal

export function ConversationList({ entradas, onSelectChat, selectedChatId, onDataUpdate, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

    return (
        <div className="comunicacion-listado">
            <div className="comunicacion-header">
                <h2>Mensajes</h2>
                <button
                    className="nuevo-btn"
                    onClick={() => setIsModalOpen(true)} // Abrimos el modal al hacer clic
                >
                    NUEVO +
                </button>
            </div>

            {entradas.map((entrada) => (
                <div
                    key={entrada.id_persona_conversa}
                    onClick={() => onSelectChat(entrada.id_persona_conversa)}
                >
                    <div className="lista-conversaciones">
                        <ChatItem
                            avatar={entrada.id_persona_conversa}
                            nombre={entrada.persona_conversa}
                            fecha={entrada.fecha_ultimo_mensaje}
                            activo={entrada.id_persona_conversa === selectedChatId}
                        />
                    </div>
                </div>
            ))}

            {/* Aquí montamos el modal como en ActivitiesList */}
            <CommunicationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    onDataUpdate(); // Lo mismo que hace ActivitiesList
                }}
                users={users}
            />
        </div>
    );
}

