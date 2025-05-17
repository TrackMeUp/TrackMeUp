import { Draggable } from "@hello-pangea/dnd";

export function Activity({ actividad, index }) {
  const {
    submission_id,
    title,
    content,
    start_date,
    end_date,
    type
  } = actividad;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <Draggable draggableId={submission_id.toString()} index={index}>
      {(provided) => (
        <div
          className="activity"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="activity-title">{title}</div>
          <div className="activity-detail">{content}</div>
          <div className="activity-date">
            {type === "exam" ? "Fecha del examen:" : "Fecha de entrega:"} {formatDate(end_date)}
          </div>
        </div>
      )}
    </Draggable>
  );
}
