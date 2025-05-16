// frontend/src/components/Activities/ActivitiesList.jsx
import { Droppable } from "@hello-pangea/dnd";
import { Activity } from "./Activity";

export function ActivitiesList({ title, status, actividades }) {
  const filteredActivities = actividades.filter(a => a.status === status);

  return (
    <div className="activities-column">
      <div className="activities-header">
        <h2>{title}</h2>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            className="activities-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {filteredActivities.map((actividad, index) => (
              <Activity key={actividad.submission_id} actividad={actividad} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
