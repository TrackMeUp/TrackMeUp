// Activity.jsx
import { Draggable } from "@hello-pangea/dnd";

export function Activity({ actividad, index }) {
  return (
    <Draggable draggableId={actividad.id} index={index}>
      {(provided) => (
        <div
          className="activity"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <strong>{actividad.asignatura}</strong>
          <p>{actividad.titulo}</p>
          <small>{actividad.fechaEntrega}</small>
        </div>
      )}
    </Draggable>
  );
}
