import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Alert,
  Spinner,
} from "react-bootstrap";

export function CreateActivityModal({ isOpen, onClose, subjects }) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [activityType, setActivityType] = useState("assignment");
  const [startDateFormatted, setStartDateFormatted] = useState("");
  const [groupOptions, setGroupOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    setStartDateFormatted(now.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find((s) => s.name === selectedSubject);
      if (subject) {
        setGroupOptions(subject.groups);
      } else {
        setGroupOptions([]);
      }
    } else {
      setGroupOptions([]);
      setSelectedGroup("");
    }
  }, [selectedSubject, subjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const activity = {
      subject_id: parseInt(selectedGroup, 10),
      title,
      content: description,
      start_date: startDateFormatted,
      end_date: deadline,
      type: activityType,
      submission_date: deadline,
    };

    try {
      const response = await fetch("http://localhost:3000/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        let errorMessage = "Error creando la actividad";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Si todo ok, cierra el modal
      onClose();
      // También podrías limpiar el formulario si quieres
      setSelectedSubject("");
      setSelectedGroup("");
      setTitle("");
      setDescription("");
      setDeadline("");
      setActivityType("assignment");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nueva Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de inicio</Form.Label>
                <Form.Control type="text" value={startDateFormatted} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de entrega</Form.Label>
                <Form.Control
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Selecciona una asignatura</Form.Label>
            <Form.Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">-- Selecciona una asignatura --</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Selecciona curso y grupo</Form.Label>
            <Form.Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
              disabled={!selectedSubject}
            >
              <option value="">-- Selecciona un grupo --</option>
              {groupOptions.map((group) => (
                <option key={group.subject_id} value={group.subject_id}>
                  {group.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={!selectedGroup}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enunciado</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={!selectedGroup}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              disabled={!selectedGroup}
            >
              <option value="assignment">Tarea</option>
              <option value="exam">Examen</option>
            </Form.Select>
          </Form.Group>

          <div className="text-end">
            <Button variant="success" type="submit" disabled={!selectedGroup || loading}>
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> Creando...
                </>
              ) : (
                "Crear Actividad"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
