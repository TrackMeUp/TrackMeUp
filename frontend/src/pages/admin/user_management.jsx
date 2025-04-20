/*
import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/api/UserApiService";
import Fuse from "fuse.js";

import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Badge,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
*/
export function UserManagement() {
  /*
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name1: "",
    last_name2: "",
    email: "",
    password: "",
    role: "student",
    access_level: 1,
    parent_student_id: null,
  });

  const fetchUsers = async () => {
    const res = await getUsers();

    if (res.success) {
      const _users = res.data.users;

      setUsers(_users);
      setFilteredUsers(_users);
    } else {
      alert(res.error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    if (searchTerm) {
      const options = {
        keys: [
          { name: "first_namef", weight: 0.4 },
          { name: "last_name1", weight: 0.3 },
          { name: "last_name2", weight: 0.2 },
          { name: "email", weight: 0.1 },
        ],
        threshold: 0.5,
      };

      const fuse = new Fuse(result, options);
      const searchResults = fuse.search(searchTerm);

      result = searchResults.map((res) => res.item);
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role.name === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);

  const getRoleDisplayData = (role) => {
    switch (role.name) {
      case "admin":
        return {
          display_name: `Admin${role.access_level}`,
          display_color: "danger",
        };
      case "teacher":
        return { display_name: "Profesor", display_color: "primary" };
      case "student":
        return { display_name: "Alumno", display_color: "success" };
      case "parent":
        return { display_name: "Padre", display_color: "secondary" };
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name1: user.last_name1,
      last_name2: user.last_name2,
      email: user.email,
      password: "",
      role: user.role.name,
      access_level: user.role.access_level || 1,
      parent_student_id: user.role.student_id,
    });

    setShowModal(true);
  };

  const formInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitUser = async () => {
    if (editingUser) {
      await updateUser(editingUser.user_id, formData);
    } else {
      await createUser(formData);
    }

    await fetchUsers();

    setShowModal(false);
    setEditingUser(null);
    setFormData({
      first_name: "",
      last_name1: "",
      last_name2: "",
      email: "",
      password: "",
      role: "student",
      access_level: 1,
      parent_student_id: null,
    });
  };
*/
  return (
    <h1>G</h1>
    /*
    <Container fluid className="mt-3">
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="admin">Administradores</option>
            <option value="teacher">Profesores</option>
            <option value="student">Alumnos</option>
            <option value="parent">Padres</option>
          </Form.Select>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            <FaPlus /> Nuevo Usuario
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido 1</th>
                <th>Apellido 2</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                return (
                  <tr key={user.user_id} onClick={() => editUser(user)}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name1}</td>
                    <td>{user.last_name2}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={getRoleDisplayData(user.role).display_color}>
                        {getRoleDisplayData(user.role).display_name}
                      </Badge>
                    </td>
                    <td className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => editUser(user)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={async (e) => {
                          e.stopPropagation(); // Evita que se muestre el modal
                          await deleteUser(user.user_id);
                          await fetchUsers();
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {!filteredUsers.length && (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No se han encontrado coincidencias
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Editar Usuario" : "Añadir Nuevo Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={formInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name1"
                    value={formData.last_name1}
                    onChange={formInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name2"
                    value={formData.last_name2}
                    onChange={formInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={formInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {editingUser
                      ? "Nueva Contraseña (dejar en blanco para mantener)"
                      : "Contraseña"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={formInputChange}
                    // Opcional al editar, requerido al crear un nuevo usuario
                    required={!editingUser}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={formInputChange}
                  >
                    <option value="student">Alumno</option>
                    <option value="teacher">Profesor</option>
                    <option value="parent">Padre</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {formData.role === "admin" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nivel de Acceso</Form.Label>
                    <Form.Select
                      name="access_level"
                      value={formData.access_level}
                      onChange={formInputChange}
                    >
                      <option value="1">Nulo</option>
                      <option value="2">Bajo</option>
                      <option value="3">Medio</option>
                      <option value="4">Alto</option>
                      <option value="5">Total</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {formData.role === "parent" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Alumno</Form.Label>
                    <Form.Control
                      type="number"
                      name="parent_student_id"
                      value={formData.parent_student_id}
                      onChange={formInputChange}
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setEditingUser(null);
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={submitUser}>
            {editingUser ? "Guardar Cambios" : "Añadir Usuario"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    */
  );
}
