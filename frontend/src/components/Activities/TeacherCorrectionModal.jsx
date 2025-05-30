import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export function TeacherCorrectionModal({ isOpen, onClose, actividad, onSuccess }) {
  const {
    subject_name,
    title,
    end_date,
    activity_content,
    submission_id,
    student_comment,
    teacher_comment,
    grade,
  } = actividad;

  const [gradeValue, setGradeValue] = useState("");
  const [teacherComment, setTeacherComment] = useState("");
  const [status, setStatus] = useState(null);

  const studentCommentRef = useRef(null);
  const activityContentRef = useRef(null);

  useEffect(() => {
    setGradeValue(grade ?? "");
    setTeacherComment(teacher_comment ?? "");
  }, [actividad]);

  useEffect(() => {
    if (studentCommentRef.current) {
      studentCommentRef.current.style.height = "auto";
      studentCommentRef.current.style.height = `${studentCommentRef.current.scrollHeight}px`;
    }
  }, [student_comment]);

  useEffect(() => {
    if (activityContentRef.current) {
      activityContentRef.current.style.height = "auto";
      activityContentRef.current.style.height = `${activityContentRef.current.scrollHeight}px`;
    }
  }, [activity_content]);

  const handleGuardar = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/actividades/corregir", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission_id,
          grade: parseFloat(gradeValue),
          teacherComment,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar corrección");

      if (onSuccess) { 
        onSuccess();
      }
      
      setStatus("success");
      setTimeout(() => {
        setStatus(null);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Corregir Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <h5 className="activity-subject">{subject_name}</h5>
        </div>

        <p><strong>Título:</strong> {title}</p>
        <p><strong>Fecha de entrega:</strong> {new Date(end_date).toLocaleDateString()}</p>

        <Form.Group className="mb-3">
          <Form.Label>Enunciado:</Form.Label>
          <Form.Control
            as="textarea"
            readOnly
            ref={activityContentRef}
            value={activity_content || ""}
            style={{
              resize: "none",
              overflow: "hidden",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ced4da",
              borderRadius: "0.375rem",
              padding: "0.5rem",
              lineHeight: "1.4",
              fontSize: "0.95rem",
              minHeight: "2.5rem",
            }}
            rows={1}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Respuesta del estudiante:</Form.Label>
          <Form.Control
            as="textarea"
            readOnly
            ref={studentCommentRef}
            value={student_comment || ""}
            style={{
              resize: "none",
              overflow: "hidden",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ced4da",
              borderRadius: "0.375rem",
              padding: "0.5rem",
              lineHeight: "1.4",
              fontSize: "0.95rem",
              minHeight: "2.5rem",
            }}
            rows={1}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nota (0-10):</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={gradeValue}
            onChange={(e) => setGradeValue(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comentario del profesor:</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={teacherComment}
            onChange={(e) => setTeacherComment(e.target.value)}
            style={{
              resize: "vertical",
              maxHeight: "4.5rem",
              minHeight: "2.5rem",
              fontSize: "0.95rem",
              padding: "0.4rem",
            }}
          />
        </Form.Group>

        {status === "success" && <Alert variant="success">Corrección guardada</Alert>}
        {status === "error" && <Alert variant="danger">Error al guardar</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleGuardar}>Guardar corrección</Button>
      </Modal.Footer>
    </Modal>
  );
}
