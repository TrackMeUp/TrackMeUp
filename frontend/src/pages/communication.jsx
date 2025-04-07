import React, { useState } from "react";
import { ConversationList } from "../components/Communication/ConversationList";

import { Message } from "../components/Communication/Message";
import { Editor } from "../components/Communication/Editor";


export function Communication() {
  const [selectedChat, setSelectedChat] = useState(null); // Estado para guardar el chat seleccionado

  const handleSelectChat = (chatId) => {
      setSelectedChat(chatId); // Actualizamos el estado con el chat seleccionado
  };

  // Datos de ejemplo (esto sería lo que recibirías del backend)
  const entradas = [
      {
          id_mensaje: 1,
          avatar: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png',
          usuario: 'Juan Pérez',
          fecha: '2025-04-07',
          nuevo: true,
          mensajes: [
              { id_mensaje: 1, texto: 'Hola, ¿cómo estás?', fecha: '2025-04-07', hora: '14:30' },
              { id_mensaje: 2, texto: 'Muy bien, gracias. ¿Y tú?', fecha: '2025-04-07', hora: '14:35' }
          ]
      },
      {
          id_mensaje: 2,
          avatar: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png',
          usuario: 'Ana Gómez',
          fecha: '2025-04-06',
          nuevo: false,
          mensajes: [
              { id_mensaje: 1, texto: '¿Me puedes ayudar con el proyecto?', fecha: '2025-04-06', hora: '16:45' }
          ]
      }
  ];

  // Filtrar el chat seleccionado para mostrar los mensajes
  const selectedChatData = entradas.find(chat => chat.id_mensaje === selectedChat);

  return (
      <div className="comunicacion-container">

              <ConversationList
                  entradas={entradas}
                  onSelectChat={handleSelectChat} // Pasamos el manejador de clics
              />


          <div className="comunicacion-chat">
              {selectedChatData ? (
                  <Message entradas={selectedChatData.mensajes} />
              ) : (
                  <p>Selecciona un chat para ver los mensajes.</p>
              )}
              <Editor />
          </div>
      </div>
  );
}
