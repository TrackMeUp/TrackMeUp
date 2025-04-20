import { Activity } from "./Activity";

export function ActivitiesList({ title, status, actividades }) {
    const filteredActivities = actividades.filter(
      (actividad) => actividad.estado === status
    );
  
    return (
      <div className="activities-column">
        <div className="activities-header">
          <h2>{title}</h2>
        </div>
        <div className="activities-content">
          {filteredActivities.map((actividad) => (
            <Activity
              key={actividad.id}
              asignatura={actividad.asignatura}
              titulo={actividad.titulo}
              fechaEntrega={actividad.fechaEntrega}
            />
          ))}
        </div>
      </div>
    );
  }
  