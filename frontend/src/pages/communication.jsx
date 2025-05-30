// communication.jsx
import React, { useState, useEffect } from "react";
import { ConversationList } from "../components/Communication/ConversationList";
import { Message } from "../components/Communication/Message";
import { Editor } from "../components/Communication/Editor";

export function Communication() {
    const [entradas, setEntradas] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChatData, setSelectedChatData] = useState(null);

    const usuarioId = parseInt(localStorage.getItem("user_id"), 10);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/mensajes/get_conversaciones/${usuarioId}`);
            const data = await response.json();
            setEntradas(data);
        } catch (error) {
            console.error('Error al obtener las conversaciones:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/users");
                const data = await res.json();

                if (Array.isArray(data.users)) {
                    setUsers(data.users);
                } else {
                    console.error("La API no devolvió un array de usuarios");
                }
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleSelectChat = async (idPersonaConversa) => {
        setSelectedChat(idPersonaConversa);
        try {
            const response = await fetch(`http://localhost:3000/api/mensajes/get_mensajes/${usuarioId}/${idPersonaConversa}`);
            const data = await response.json();
            setSelectedChatData(data);
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
        }
    };

    const refreshAndSelectChat = async (recipientId) => {
        try {
            await fetchData();
            setTimeout(() => {
                handleSelectChat(recipientId);
            }, 100);
        } catch (error) {
            console.error("Error al actualizar las conversaciones:", error);
        }
    };

    return (
        <div className="comunicacion-container">
            <ConversationList
                entradas={entradas}
                onSelectChat={handleSelectChat}
                users={users}
                selectedChatId={selectedChat}
                onDataUpdate={refreshAndSelectChat}
            />

            <div className="comunicacion-chat">
                {selectedChatData ? (
                    selectedChatData.length > 0 ? (
                        <Message entradas={selectedChatData} usuarioId={usuarioId} />
                    ) : (
                        <p>No hay mensajes en esta conversación.</p>
                    )
                ) : (
                    <p>Selecciona un chat para ver los mensajes.</p>
                )}
                <Editor
                    authorId={usuarioId}
                    recipientId={selectedChat}
                    onMessageSent={() => handleSelectChat(selectedChat)}
                />
            </div>
        </div>
    );
}
