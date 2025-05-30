// Página Tablón de anuncios

import { Articulo } from "../components/UI/Articulo";
import { Modal } from "../components/UI/inputModal";
import { useEffect, useState } from "react";

const AnnouncementForm = ({ subjects, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    subject_id: "",
    title: "",
    content: "",
    attachment_url: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      subject_id: "",
      title: "",
      content: "",
      attachment_url: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "15px" }}>
        <label>Asignatura:</label>
        <select
          name="subject_id"
          value={formData.subject_id}
          onChange={handleInputChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        >
          <option value="">Seleccionar asignatura</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.name} - {subject.class_group}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Título:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Contenido:</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows="4"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>URL de archivo adjunto (opcional):</label>
        <input
          type="url"
          name="attachment_url"
          value={formData.attachment_url}
          onChange={handleInputChange}
          placeholder="https://ejemplo.com/archivo.pdf"
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creando..." : "Crear Entrada"}
        </button>
      </div>
    </form>
  );
};

export function Announcements() {
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const rol = localStorage.getItem("user_role");
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.role[rol + "_id"];
  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    const obtenerTablonAnuncios = async () => {
      try {
        let url = `${API_URL}/announcements/${id}/${rol}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        setAnnouncement(datos);
      } catch (error) {
        console.error("Error al obtener la información académica:", error);
        setError("No se pudo cargar la información académica.");
      }
    };

    const obtenerAsignaturas = async () => {
      if (rol === "teacher") {
        try {
          const respuesta = await fetch(`${API_URL}/subjects/teacher/${id}`);
          const datos = await respuesta.json();
          if (respuesta.ok) {
            setSubjects(datos.subjects || []);
          }
        } catch (error) {
          console.error("Error al obtener asignaturas:", error);
        }
      }
    };

    if (id && rol) {
      obtenerTablonAnuncios();
      obtenerAsignaturas();
    }
  }, [id, rol, API_URL]);

  const crearAnnouncement = async (announcementData) => {
    try {
      const response = await fetch(`${API_URL}/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating announcement");
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    try {
      const response = await crearAnnouncement(formData);

      if (response.success) {
        setShowModal(false);

        const url = `${API_URL}/announcements/${id}/${rol}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        if (respuesta.ok) {
          setAnnouncement(datos);
        }
      } else {
        alert("Error al crear la entrada: " + response.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la entrada");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!announcement) {
    return <div>Cargando tablón de anuncios...</div>;
  }

  // Vista de "Estudiante"
  const StudentView = () => (
    <>

      {announcement.length > 0 ? (
        announcement.map((entry, index) => (
          <div className="informacion-container" key={index}>
            <Articulo
              titulo="Nueva entrada"
              entradas={[
                {
                  texto: "Título:",
                  info: entry.entry_title || "No disponible",
                },
                {
                  texto: "Contenido:",
                  info: entry.entry_content || "No disponible",
                },
                {
                  texto: "Asignatura:",
                  info: entry.entry_subject || "No disponible",
                },
                {
                  texto: "Profesor:",
                  info: entry.entry_teacher || "No disponible",
                },
              ]}
            />
          </div>
        ))
      ) : (
        <p>No hay entradas disponibles.</p>
      )}
    </>
  );

  // Vista de "Padre"
  const ParentView = () => (
    <>

      {announcement.length > 0 ? (
        announcement.map((entry, index) => (
          <div className="informacion-container" key={index}>
            <Articulo
              titulo="Nueva entrada"
              entradas={[
                {
                  texto: "Título:",
                  info: entry.entry_title || "No disponible",
                },
                {
                  texto: "Contenido:",
                  info: entry.entry_content || "No disponible",
                },
                {
                  texto: "Asignatura:",
                  info: entry.entry_subject || "No disponible",
                },
                {
                  texto: "Profesor:",
                  info: entry.entry_teacher || "No disponible",
                },
              ]}
            />
          </div>
        ))
      ) : (
        <p>No hay entradas disponibles.</p>
      )}
    </>
  );

  // Vista de "Personal docente"
  const TeacherView = () => (
    <>
      {announcement.length > 0 ? (
        announcement.map((entry, index) => (
          <div className="informacion-container" key={index}>
            <Articulo
              titulo="Nueva entrada"
              entradas={[
                {
                  texto: "Título:",
                  info: entry.entry_title || "No disponible",
                },
                {
                  texto: "Contenido:",
                  info: entry.entry_content || "No disponible",
                },
                {
                  texto: "Asignatura:",
                  info: entry.entry_subject || "No disponible",
                },
                {
                  texto: "Profesor:",
                  info: entry.entry_teacher || "No disponible",
                },
              ]}
            />
          </div>
        ))
      ) : (
        <p>No hay entradas disponibles.</p>
      )}

      <button onClick={() => setShowModal(true)}>Añadir entrada</button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>Crear Nueva Entrada</h2>
        <AnnouncementForm
          subjects={subjects}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      </Modal>
    </>
  );

  const renderVistaPorRol = () => {
    switch (rol) {
      case "student":
        return <StudentView />;
      case "parent":
        return <ParentView />;
      case "teacher":
        return <TeacherView />;
      default:
        return <div>Rol no reconocido</div>;
    }
  };

  return <div className="informacion-container">{renderVistaPorRol()}</div>;
}
