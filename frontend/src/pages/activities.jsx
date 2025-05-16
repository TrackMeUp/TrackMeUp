// Activities.jsx
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { ActivitiesList } from "../components/Activities/ActivitiesList";

const initialActivities = [
  { id: "1", asignatura: "Matemáticas", titulo: "Resolver ecuaciones", fechaEntrega: "2025-04-25", estado: "pending" },
  { id: "2", asignatura: "Lengua", titulo: "Ensayo literario", fechaEntrega: "2025-04-22", estado: "in_progress" },
  { id: "3", asignatura: "Historia", titulo: "Resumen de la Revolución Francesa", fechaEntrega: "2025-04-20", estado: "completed" },
  { id: "4", asignatura: "Física", titulo: "Ley de Newton", fechaEntrega: "2025-05-01", estado: "pending" },
];

export function Activities() {
  const [actividades, setActividades] = useState(initialActivities);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    setActividades(prev =>
      prev.map(act =>
        act.id === draggableId ? { ...act, estado: destination.droppableId } : act
      )
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="activities-container">
        <ActivitiesList title="Pendientes" status="pending" actividades={actividades} />
        <ActivitiesList title="En Proceso" status="in_progress" actividades={actividades} />
        <ActivitiesList title="Finalizadas" status="completed" actividades={actividades} />
      </div>
    </DragDropContext>
  );
}
