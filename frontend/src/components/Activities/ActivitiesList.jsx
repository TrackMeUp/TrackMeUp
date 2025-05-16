// ActivitiesList.jsx
import { Droppable } from "@hello-pangea/dnd";
import { Activity } from "./Activity";

export function ActivitiesList({ title, status, actividades }) {
  const filteredActivities = actividades.filter(a => a.estado === status);

  return (
    <div className="activities-column">
      <div className="activities-header">
        <h3>{title}</h3>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            className="activities-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {filteredActivities.map((actividad, index) => (
              <Activity key={actividad.id} actividad={actividad} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
