import React, { useState } from "react";
import { ConversationList } from "../components/Communication/ConversationList";

import { Message } from "../components/Communication/Message";
import { Editor } from "../components/Communication/Editor";

export function Communication() {
  const [selectedChat, setSelectedChat] = useState(null); // guardar el chat seleccionado

  const handleSelectChat = (chatId) => {
      setSelectedChat(chatId); // actualizar estado
  };

  // ejemplo (recibir del backend)
  const entradas = [
      {
          id_mensaje: 1,
          avatar: 'https://banner2.cleanpng.com/20180401/eww/avinxqqry.webp',
          usuario: 'Juan Pérez',
          fecha: '2025-04-07',
          nuevo: true,
          mensajes: [
            {
                id_mensaje: 1,
                remitente: "true",
                avatar: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png',
                contenido: "Hola, ¿cómo estás?",
                fecha: "2025-04-07",
                hora: "14:30"
              },
              {
                id_mensaje: 2,
                remitente: "false",
                avatar: 'https://banner2.cleanpng.com/20180401/eww/avinxqqry.webp',
                contenido: "Muy bien, gracias. ¿Y tú?",
                fecha: "2025-04-07",
                hora: "14:35"
              },
              {
                id_mensaje: 3,
                remitente: "true",
                avatar: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png',
                contenido: "¿Podemos hablar sobre el proyecto?",
                fecha: "2025-04-07",
                hora: "16:28"
              },
              {
                id_mensaje: 2,
                remitente: "false",
                avatar: 'https://banner2.cleanpng.com/20180401/eww/avinxqqry.webp',
                contenido: "Claro, ¿qué necesitas saber?",
                fecha: "2025-04-07",
                hora: "14:35"
              }
          ]
      },
      {
          id_mensaje: 2,
          avatar: 'https://banner2.cleanpng.com/20180331/eow/avibquy0n.webp',
          usuario: 'Ana Gómez',
          fecha: '2025-04-06',
          nuevo: false,
          mensajes: [
              { id_mensaje: 1, remitente:"false", avatar:'https://banner2.cleanpng.com/20180331/eow/avibquy0n.webp', contenido: '¿Has recibido el mensaje?', fecha: '2025-04-06', hora: '16:45' }
          ]
      }
  ];

  // Filtrar el chat seleccionado para mostrar los mensajes
  const selectedChatData = entradas.find(chat => chat.id_mensaje === selectedChat);

  return (
      <div className="comunicacion-container">

              <ConversationList
                  entradas={entradas}
                  onSelectChat={handleSelectChat}
                  selectedChatId={selectedChat}
              />


          <div className="comunicacion-chat">
              {selectedChatData ? (
                  <Message entradas={selectedChatData.mensajes} 
                           avatar={selectedChatData.avatar}
                           usuario={selectedChatData.usuario}/>
              ) : (
                  <p>Selecciona un chat para ver los mensajes.</p>
              )}
              <Editor />
          </div>
      </div>
  );
}
