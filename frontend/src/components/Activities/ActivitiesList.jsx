import { useState, useEffect } from "react";
import { Activity } from "./Activity";
import { Droppable } from "@hello-pangea/dnd";
import { CreateActivityModal } from "./CreateActivityModal";

export function ActivitiesList({ title, status, actividades, rol, onDataUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  // Filtrado según rol y título
  let filteredActivities = [];

  if (rol === "teacher") {
    if (title === "Pendientes") {
      filteredActivities = actividades.filter(
        a => a.status === "pending" || a.status === "in_progress"
      );
    } else if (title === "Entregadas") {
      filteredActivities = actividades.filter(
        a => a.status === "completed" && a.grade == null
      );
    } else if (title === "Calificadas") {
      filteredActivities = actividades.filter(
        a => a.status === "completed" && a.grade != null
      );
    }
  } else if (rol === "student") {
    if (title === "Pendientes") {
      filteredActivities = actividades.filter(a => a.status === "pending");
    } else if (title === "En progreso") {
      filteredActivities = actividades.filter(a => a.status === "in_progress");
    } else if (title === "Completadas") {
      filteredActivities = actividades.filter(a => a.status === "completed");
    }
  }

  useEffect(() => {
    const fetchSubjectsWithGroups = async () => {
      try {
        const teacherId = parseInt(localStorage.getItem("teacher_id"), 10);
        const resNames = await fetch(`http://localhost:3000/api/subjects/${teacherId}/names`);
        if (!resNames.ok) throw new Error("Error al obtener asignaturas");

        const subjectNames = await resNames.json();

        const subjectsWithGroups = await Promise.all(
          subjectNames.map(async (subject) => {
            const resGroups = await fetch(
              `http://localhost:3000/api/subjects/${teacherId}/groups/${encodeURIComponent(subject.name)}`
            );
            if (!resGroups.ok) throw new Error("Error al obtener grupos");

            const groups = await resGroups.json();

            return {
              name: subject.name,
              groups: groups.map((g) => ({
                subject_id: g.subject_id,
                name: g.course_and_group,
              })),
            };
          })
        );

        setSubjects(subjectsWithGroups);
      } catch (err) {
        console.error("Error al obtener asignaturas y grupos:", err);
      }
    };

    if (rol === "teacher") {
      fetchSubjectsWithGroups();
    }
  }, [rol]);

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
            {title === "Pendientes" && rol === "teacher" ? (
              Object.entries(
                actividades
                  .filter(a => a.status === "pending" || a.status === "in_progress" || a.status === "completed")
                  .reduce((acc, act) => {
                    const key = `${act.title}||${act.subject_name}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(act);
                    return acc;
                  }, {})
              ).map(([key, acts], index) => {
                const [actTitle, subject] = key.split("||");

                const totalEstudiantes = acts.length;
                const entregadas = acts.filter(a => a.status === "completed").length;

                const hayPendientes = acts.some(a => a.status === "pending" || a.status === "in_progress");
                if (!hayPendientes) return null;

                return (
                  <div className="activity grouped-activity" key={key}>
                    <div className="activity-subject">{subject}</div>
                    <div className="activity-title">{actTitle}</div>
                    <div className="activity-date">
                      Actividad para: {totalEstudiantes} estudiante(s) — Entregas: {entregadas} / {totalEstudiantes}
                    </div>
                  </div>
                );
              })
            ) : (
              filteredActivities.map((actividad, index) => (
                <Activity
                  key={actividad.submission_id}
                  actividad={actividad}
                  index={index}
                  rol={rol}
                  status={status}
                  onUpdateData={onDataUpdate}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {rol === "teacher" && status === "pending" && (
        <div className="new-activity-button-container">
          <button
            className="new-activity-button"
            onClick={() => setIsModalOpen(true)}
          >
            Nueva Actividad
          </button>
        </div>
      )}

      <CreateActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onDataUpdate();
        }}
        subjects={subjects}
      />
    </div>
  );
}
