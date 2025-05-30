import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Alert
} from "react-bootstrap";

export function StudentResolveModal({ isOpen, onClose, actividad }) {
  const { subject_name, title, end_date, activity_content, submission_id } = actividad;
  const [respuesta, setRespuesta] = useState(actividad.student_comment || "");
  const [guardado, setGuardado] = useState(null);

  const handleGuardar = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/actividades/comentario_estudiante", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId: submission_id,
          studentComment: respuesta,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar respuesta");

      setGuardado("guardado");
      setTimeout(() => setGuardado(null), 2000);
    } catch (error) {
      console.error(error);
      setGuardado("error");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Resolver Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5 className="activity-subject">{subject_name}</h5>
        </div>

        <div className="mb-3">
          <strong>Título:</strong> <p>{title}</p>
        </div>

        <div className="mb-3">
          <strong>Fecha de entrega:</strong>{" "}
          <p>{new Date(end_date).toLocaleDateString()}</p>
        </div>

        <div className="mb-3">
          <strong>Enunciado:</strong>
          <p>{activity_content}</p>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Tu respuesta:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
          />
        </Form.Group>

        {guardado === "guardado" && <Alert variant="success">Respuesta guardada</Alert>}
        {guardado === "error" && <Alert variant="danger">Error al guardar</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
