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
import "../../styles/adminManagement.css";

export function UserManagement() {
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
      const _users = Array.isArray(res.data.users) ? res.data.users : [];
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
          { name: "first_name", weight: 0.4 },
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
          badge_class: "badge-danger",
        };
      case "teacher":
        return {
          display_name: "Profesor",
          badge_class: "badge-primary",
        };
      case "student":
        return {
          display_name: "Alumno",
          badge_class: "badge-success",
        };
      case "parent":
        return {
          display_name: "Padre",
          badge_class: "badge-secondary",
        };
      default:
        return {
          display_name: "Usuario",
          badge_class: "badge-secondary",
        };
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
    closeModal();
  };

  const closeModal = () => {
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

  const handleDeleteUser = async (user, e) => {
    e.stopPropagation();

    if (!window.confirm(`¿Eliminar a ${user.first_name} ${user.last_name1}?`)) {
      return;
    }

    if (user.role.name === "student") {
      const parentUsers = users.filter(
        (u) =>
          u.role.name === "parent" &&
          u.role.student_id === user.role.student_id,
      );

      for (const parentUser of parentUsers) {
        await deleteUser(parentUser.user_id);
      }
    }

    await deleteUser(user.user_id);
    await fetchUsers();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ width: "250px" }}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-control"
            style={{ width: "200px" }}
          >
            <option value="all">Todos</option>
            <option value="admin">Administradores</option>
            <option value="teacher">Profesores</option>
            <option value="student">Alumnos</option>
            <option value="parent">Padres</option>
          </select>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn-add" onClick={() => setShowModal(true)}>
              <FaPlus /> Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Rol</th>
              <th style={{ width: "120px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const roleData = getRoleDisplayData(user.role);
              return (
                <tr
                  key={user.user_id}
                  style={{ cursor: "pointer" }}
                  onClick={() => editUser(user)}
                >
                  <td>
                    <strong>{user.first_name}</strong>
                  </td>
                  <td>
                    {user.last_name1} {user.last_name2}
                  </td>
                  <td
                    style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                  >
                    {user.email}
                  </td>
                  <td>
                    <span className={`badge ${roleData.badge_class}`}>
                      {roleData.display_name}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          editUser(user);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={(e) => handleDeleteUser(user, e)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filteredUsers.length && (
              <tr>
                <td colSpan="5" className="empty-state">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal size="lg" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Personal Info */}
          <div className="form-section">
            <div className="section-title">Información Personal</div>
            <Row>
              <Col md={12}>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={formInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="form-label">Primer Apellido</label>
                  <input
                    type="text"
                    name="last_name1"
                    value={formData.last_name1}
                    onChange={formInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="form-label">Segundo Apellido</label>
                  <input
                    type="text"
                    name="last_name2"
                    value={formData.last_name2}
                    onChange={formInputChange}
                    className="form-control"
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Account Info */}
          <div className="form-section">
            <div className="section-title">Información de Cuenta</div>
            <Row>
              <Col md={12}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={formInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="form-group">
                  <label className="form-label">
                    {editingUser ? "Nueva Contraseña (opcional)" : "Contraseña"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={formInputChange}
                    className="form-control"
                    required={!editingUser}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <div className="section-title">Configuración de Rol</div>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="form-label">Rol</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={formInputChange}
                    className="form-control"
                  >
                    <option value="student">Alumno</option>
                    <option value="teacher">Profesor</option>
                    <option value="parent">Padre</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </Col>
              <Col md={6}>
                {formData.role === "admin" && (
                  <div className="form-group">
                    <label className="form-label">Nivel de Acceso</label>
                    <select
                      name="access_level"
                      value={formData.access_level}
                      onChange={formInputChange}
                      className="form-control"
                    >
                      <option value="1">1 - Básico</option>
                      <option value="2">2 - Intermedio</option>
                      <option value="3">3 - Avanzado</option>
                      <option value="4">4 - Supervisor</option>
                      <option value="5">5 - Total</option>
                    </select>
                  </div>
                )}
                {formData.role === "parent" && (
                  <div className="form-group">
                    <label className="form-label">ID del Alumno</label>
                    <input
                      type="number"
                      name="parent_student_id"
                      value={formData.parent_student_id || ""}
                      onChange={formInputChange}
                      className="form-control"
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={closeModal}>
            Cancelar
          </button>
          <button className="btn-add" onClick={submitUser}>
            {editingUser ? "Guardar" : "Crear"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
