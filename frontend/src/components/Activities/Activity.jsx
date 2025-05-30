import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "react-bootstrap";
import { StudentResolveModal } from "./ActivityModal";
import { TeacherCorrectionModal } from "./TeacherCorrectionModal";

export function Activity({ actividad, index, rol, status, onUpdateData }) {
  const {
    submission_id,
    title,
    activity_content,
    start_date,
    end_date,
    type,
    subject_name,
    first_name,
    last_name1,
    last_name2,
    grade,
    student_comment
  } = actividad;

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <Draggable draggableId={submission_id.toString()} index={index}>
        {(provided) => (
          <div
            className="activity"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="activity-subject">{subject_name}</div>

            <div className="activity-title">{title}</div>
            <div className="activity-date">
              {type === "exam" ? "Fecha del examen:" : "Fecha de entrega:"}{" "}
              {formatDate(end_date)}
            </div>

            {/* Nombre del alumno (solo para el profesor) */}
            {rol === "teacher" && (
  <div className="activity-student-name">
    {status === "pending"
      ? "Actividad para:"
      : grade === null
        ? "Entregado por:"
        : "Actividad de:"}{" "}
    {first_name} {last_name1} {last_name2}
  </div>
)}


            {/* Mostrar nota al alumno */}
            {rol === "student" && status === "completed" && (
              <div className="activity-grade">
                Nota: {grade !== null ? `${grade}/10` : "-/10"}
              </div>
            )}

            {/* Mostrar nota al profesor si ya está corregida */}
            {rol === "teacher" && grade !== null && (
              <div className="activity-grade">
                Nota: {`${grade}/10`}
              </div>
            )}

            {/* Botón para que el alumno resuelva */}
            {rol === "student" && status === "in_progress" && (
              <Button
                className="resolver-button"
                variant="outline-success"
                size="sm"
                onClick={() => setShowResolveModal(true)}
              >
                Resolver
              </Button>
            )}

            {/* Botón para que el profesor corrija si no tiene nota */}
            {rol === "teacher" && actividad.status === "completed" && grade === null && (
  <Button
    className="resolver-button"
    variant="outline-primary"
    size="sm"
    onClick={() => setShowCorrectionModal(true)}
  >
    Corregir
  </Button>
)}

          </div>
        )}
      </Draggable>

      {/* Modal para que el estudiante resuelva */}
      {rol === "student" && showResolveModal && (
        <StudentResolveModal
          isOpen={showResolveModal}
          onClose={() => setShowResolveModal(false)}
          actividad={actividad}
        />
      )}

      {/* Modal para que el profesor corrija */}
      {rol === "teacher" && showCorrectionModal && (
        <TeacherCorrectionModal
          isOpen={showCorrectionModal}
          onClose={() => setShowCorrectionModal(false)}
          actividad={actividad}
          onSuccess={onUpdateData}  // CALLBACK para refrescar actividades
        />
      )}
    </>
  );
}
