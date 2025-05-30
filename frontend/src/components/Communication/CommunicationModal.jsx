import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";

export function CommunicationModal({ isOpen, onClose, users }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all"); // "all" | "teacher" | "student"

  // Filtrar usuarios por nombre y rol (excluyendo admins)
  const filteredUsers = (users || [])
    .filter((user) => user.role?.name !== "admin")
    .filter((user) => {
      const nameMatch = user.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const roleMatch =
        roleFilter === "all" || user.role?.name === roleFilter;
      return nameMatch && roleMatch;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !message.trim()) return;
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      onClose();
      setSelectedUserId(null);
      setSearchTerm("");
      setMessage("");
      setRoleFilter("all");
    }, 1000);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nueva conversación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Botones de filtro por rol */}
          <ButtonGroup className="mb-3">
            <Button
              variant={roleFilter === "all" ? "primary" : "outline-primary"}
              onClick={() => setRoleFilter("all")}
            >
              Todos
            </Button>
            <Button
              variant={roleFilter === "teacher" ? "primary" : "outline-primary"}
              onClick={() => setRoleFilter("teacher")}
            >
              Profesores
            </Button>
            <Button
              variant={roleFilter === "student" ? "primary" : "outline-primary"}
              onClick={() => setRoleFilter("student")}
            >
              Estudiantes
            </Button>
          </ButtonGroup>

          {/* Buscador */}
          <Form.Group className="mb-3">
            <Form.Label>Buscar usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </Form.Group>

          {/* Lista de usuarios */}
          <ListGroup
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              marginBottom: "15px",
            }}
          >
            {filteredUsers.length === 0 && (
              <ListGroup.Item>No hay usuarios que coincidan</ListGroup.Item>
            )}
            {filteredUsers.map((user) => (
              <ListGroup.Item
                key={user.user_id}
                action
                active={selectedUserId === user.user_id}
                onClick={() => setSelectedUserId(user.user_id)}
              >
                {user.first_name} {user.last_name1}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Mensaje */}
          <Form.Group className="mb-3">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
          </Form.Group>

          <div className="text-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              style={{ marginRight: "10px" }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!selectedUserId || !message.trim() || loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Enviando...
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
