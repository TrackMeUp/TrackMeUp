import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { ActivitiesList } from "../components/Activities/ActivitiesList";

export function Activities() {
  const [actividades, setActividades] = useState([]);
  const rol = localStorage.getItem("user_role");
  const userId = parseInt(localStorage.getItem("user_id"), 10);

  const fetchActividades = async () => {
    if (!rol || !userId) return;

    try {
      const endpoint =
        rol === "teacher"
          ? `http://localhost:3000/api/actividades/profesor/${userId}`
          : `http://localhost:3000/api/actividades/estudiante/${userId}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Error al cargar actividades");

      const data = await res.json();
      setActividades(data);
      console.log("Actividades cargadas:", data);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, [rol, userId]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const submissionId = parseInt(draggableId);
    const nuevoEstado = destination.droppableId;

    try {
      const res = await fetch("http://localhost:3000/api/actividades/actualizar_estado", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      await fetchActividades();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const titles = rol === "teacher"
    ? ["Pendientes", "Entregadas", "Calificadas"]
    : ["Pendientes", "En progreso", "Completadas"];

  const statuses = ["pending", "in_progress", "completed"];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="activities-container">
        {titles.map((title, index) => (
          <ActivitiesList
            key={statuses[index]}
            title={title}
            status={statuses[index]}
            actividades={actividades}
            rol={rol}
            onDataUpdate={fetchActividades}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
