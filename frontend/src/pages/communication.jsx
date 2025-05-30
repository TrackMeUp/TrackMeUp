import React, { useState, useEffect } from "react";
import { ConversationList } from "../components/Communication/ConversationList";
import { Message } from "../components/Communication/Message";
import { Editor } from "../components/Communication/Editor";

export function Communication() {
    const [entradas, setEntradas] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChatData, setSelectedChatData] = useState(null); // Para los mensajes de la conversación seleccionada


    const usuarioId = parseInt(localStorage.getItem("user_id"), 10);
    // Llamada a la API para obtener las conversaciones
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/mensajes/get_conversaciones/${usuarioId}`);
                const data = await response.json();
                setEntradas(data); // Guardamos las conversaciones en el estado
            } catch (error) {
                console.error('Error al obtener las conversaciones:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
              const res = await fetch("http://localhost:3000/api/users");
              const data = await res.json();
          
              if (Array.isArray(data.users)) {
                setUsers(data.users);
                console.log("Usuarios obtenidos:", data.users);
              } else {
                console.error("La API no devolvió un array de usuarios");
              }
            } catch (error) {
              console.error("Error al obtener usuarios:", error);
            }
          };
          
      
        fetchUsers();
      }, []);

    // Función para manejar la selección de un chat
    const handleSelectChat = async (idPersonaConversa) => {
        setSelectedChat(idPersonaConversa);

        // Obtener los mensajes entre el usuario actual y la persona seleccionada
        try {
            const response = await fetch(`http://localhost:3000/api/mensajes/get_mensajes/${usuarioId}/${idPersonaConversa}`);
            const data = await response.json();
            setSelectedChatData(data); // Guardamos los mensajes en el estado
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
        }
    };

    // Buscar los datos del chat seleccionado
    const selectedChatDataFound = entradas.find(entrada => entrada.id_persona_conversa === selectedChat);

    return (
        <div className="comunicacion-container">
            <ConversationList
                entradas={entradas}  // Datos de las conversaciones
                onSelectChat={handleSelectChat}  // Función para manejar la selección
                users={users}  // Lista de usuarios para mostrar en el chat
                selectedChatId={selectedChat}  // El chat actualmente seleccionado
            />

            <div className="comunicacion-chat">
                {selectedChatData ? (
                    selectedChatData.length > 0 ? (
                        <Message 
                            entradas={selectedChatData}  // Los mensajes de la conversación seleccionada
                            usuarioId={usuarioId}
                        />
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
