import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { ActivitiesList } from "../components/Activities/ActivitiesList";

export function Activities() {
  const [actividades, setActividades] = useState([]);
  const studentId = parseInt(localStorage.getItem("user_id"), 10);

  // Obtener actividades del estudiante al cargar
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/actividades/estudiante/${studentId}`);
        const data = await res.json();
        setActividades(data);
      } catch (error) {
        console.error("Error al cargar actividades:", error);
      }
    };

    fetchActividades();
  }, [studentId]);

  // Al soltar una actividad en otra columna
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    const submissionId = parseInt(draggableId);
    const nuevoEstado = destination.droppableId;

    try {
      const res = await fetch("http://localhost:3000/api/actividades/actualizar_estado", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId, nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      // Recargar actividades actualizadas
      const updated = await fetch(`http://localhost:3000/api/actividades/estudiante/${studentId}`);
      const updatedData = await updated.json();
      setActividades(updatedData);
    } catch (error) {
      console.error("Error actualizando actividad:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="activities-container">
        <ActivitiesList
          title="Pendientes"
          status="pending"
          actividades={actividades}
        />
        <ActivitiesList
          title="En progreso"
          status="in_progress"
          actividades={actividades}
        />
        <ActivitiesList
          title="Completadas"
          status="completed"
          actividades={actividades}
        />
      </div>
    </DragDropContext>
  );
}
