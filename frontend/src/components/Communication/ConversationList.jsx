import { useState } from "react";
import { ChatItem } from './ChatItem';
import { CommunicationModal } from './CommunicationModal';

export function ConversationList({ entradas, onSelectChat, selectedChatId, onDataUpdate, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleNewMessageSent = (recipientId) => {
        onDataUpdate(recipientId); // Refresh and select the correct chat
        handleCloseModal();
    };

    return (
        <div className="comunicacion-listado">
            <div className="comunicacion-header">
                <h2>Mensajes</h2>
                <button className="nuevo-btn" onClick={handleOpenModal}>NUEVO +</button>
            </div>

            {entradas.map((entrada) => (
                <div key={entrada.id_persona_conversa} onClick={() => onSelectChat(entrada.id_persona_conversa)}>
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

            <CommunicationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onMessageSent={handleNewMessageSent}
                users={users}
            />
        </div>
    );
}
