import React, { useState } from "react";

export function Editor({ authorId, recipientId, onMessageSent }) {
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = async () => {
    if (mensaje.trim() === "") return;

    try {
      const response = await fetch("http://localhost:3000/api/mensajes/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId,
          recipientId,
          content: mensaje
        }),
      });

      if (response.ok) {
        setMensaje("");
        onMessageSent();
      } else {
        console.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al hacer el POST:", error);
    }
  };

  return (
    <div className="editor-mensaje">
      <textarea
        placeholder="Escribir mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button
        className="sendButton"
        onClick={handleEnviar}
        disabled={mensaje.trim() === ""}
      >
        Enviar
      </button>
    </div>
  );
}
