// MessageController.js
export class MessageController {
    async obtenerConversaciones(idUsuario) {
        try {
            const response = await fetch(`/api/mensajes/get_conversaciones/${idUsuario}`);
            
            if (!response.ok) {
                throw new Error("Error al obtener las conversaciones");
            }
            
            const data = await response.json();
            return data; // Devuelve las conversaciones recibidas
        } catch (error) {
            console.error("Error al obtener conversaciones:", error);
            return { success: false, message: error.message };
        }
    }
}
