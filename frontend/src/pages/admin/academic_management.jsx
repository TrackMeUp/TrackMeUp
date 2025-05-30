import { useState, useEffect } from "react";
import { getUsers } from "../../services/api/UserApiService";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/api/CourseApiService";
import {
  createSubject,
  updateSubject,
  deleteSubject,
  assignUserToSubject,
} from "../../services/api/SubjectApiService";
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
  ListGroup,
} from "react-bootstrap";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../../styles/adminManagement.css";

export function AcademicManagement() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear() + 1,
    subjects: [],
  });
  const [teacherQueries, setTeacherQueries] = useState({});
  const [studentQueries, setStudentQueries] = useState({});
  const [activeTeacherSearch, setActiveTeacherSearch] = useState(null);
  const [activeStudentSearch, setActiveStudentSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await getUsers();
      if (userRes.success) setUsers(userRes.data.users || []);
      const courseRes = await getCourses();
      if (courseRes.success) {
        const coursesData = courseRes.data.courses || [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...courses];

    if (searchTerm) {
      const courseFuse = new Fuse(result, {
        keys: ["name", "start_year", "end_year"],
        threshold: 0.3,
      });
      const searchResults = courseFuse.search(searchTerm);
      result = searchResults.map((res) => res.item);
    }

    setFilteredCourses(result);
  }, [courses, searchTerm]);

  const teacherFuse = new Fuse(
    users.filter((u) => u.role.name === "teacher"),
    {
      keys: ["first_name", "last_name1", "last_name2"],
      threshold: 0.3,
    },
  );

  const studentFuse = new Fuse(
    users.filter((u) => u.role.name === "student"),
    {
      keys: ["first_name", "last_name1", "last_name2"],
      threshold: 0.3,
    },
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][field] = value;
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const getTeacherName = (teacherId) => {
    const teacher = users.find((u) => u.user_id === teacherId);
    return teacher
      ? `${teacher.first_name} ${teacher.last_name1} ${teacher.last_name2}`.trim()
      : "";
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: "",
          class_group: "",
          teacher_id: "",
          student_ids: [],
          schedules: [],
        },
      ],
    }));
  };

  const removeSubject = (index) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects.splice(index, 1);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const addScheduleToSubject = (subjectIndex) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[subjectIndex].schedules.push({
      weekday: "Lunes",
      start_time: "08:00",
      end_time: "09:00",
    });
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const removeSchedule = (subjectIndex, scheduleIndex) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[subjectIndex].schedules.splice(scheduleIndex, 1);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const handleScheduleChange = (subjectIndex, scheduleIndex, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[subjectIndex].schedules[scheduleIndex][field] = value;
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const handleTeacherSearch = (subjectIndex, value) => {
    setTeacherQueries((prev) => ({ ...prev, [subjectIndex]: value }));
    setActiveTeacherSearch(subjectIndex);
  };

  const handleStudentSearch = (subjectIndex, value) => {
    setStudentQueries((prev) => ({ ...prev, [subjectIndex]: value }));
    setActiveStudentSearch(subjectIndex);
  };

  const selectTeacher = (subjectIndex, teacherId) => {
    handleSubjectChange(subjectIndex, "teacher_id", teacherId);
    setTeacherQueries((prev) => ({ ...prev, [subjectIndex]: "" }));
    setActiveTeacherSearch(null);
  };

  const addStudent = (subjectIndex, studentId) => {
    const subject = formData.subjects[subjectIndex];
    if (!subject.student_ids.includes(studentId)) {
      handleSubjectChange(subjectIndex, "student_ids", [
        ...subject.student_ids,
        studentId,
      ]);
    }
    setStudentQueries((prev) => ({ ...prev, [subjectIndex]: "" }));
    setActiveStudentSearch(null);
  };

  const removeStudent = (subjectIndex, studentId) => {
    const subject = formData.subjects[subjectIndex];
    handleSubjectChange(
      subjectIndex,
      "student_ids",
      subject.student_ids.filter((id) => id !== studentId),
    );
  };

  const getEnrolledStudents = (studentIds) => {
    return studentIds
      .map((id) => users.find((u) => u.user_id === id))
      .filter(Boolean)
      .sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name1}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name1}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  };

  const saveCourse = async () => {
    if (!formData.name.trim()) {
      alert("El nombre del curso es requerido");
      return;
    }

    for (let i = 0; i < formData.subjects.length; i++) {
      const subject = formData.subjects[i];

      if (!subject.name.trim()) {
        alert(`El nombre de la asignatura ${i + 1} es requerido`);
        return;
      }

      if (!subject.class_group.trim()) {
        alert(`El grupo de la asignatura ${i + 1} es requerido`);
        return;
      }

      if (!subject.teacher_id || subject.teacher_id === "") {
        alert(
          `Debe asignar un profesor a la asignatura "${subject.name}" antes de guardar el curso`,
        );
        return;
      }
    }

    try {
      let courseId;
      if (editingCourse) {
        await updateCourse(editingCourse.course_id, {
          name: formData.name,
          start_year: formData.start_year,
          end_year: formData.end_year,
        });
        courseId = editingCourse.course_id;

        if (editingCourse.subjects) {
          for (const existingSubject of editingCourse.subjects) {
            await deleteSubject(existingSubject.subject_id);
          }
        }
      } else {
        const res = await createCourse({
          name: formData.name,
          start_year: formData.start_year,
          end_year: formData.end_year,
        });
        courseId = res.data.course_id;
      }

      for (const subject of formData.subjects) {
        const subjectData = {
          course_id: courseId,
          name: subject.name.trim(),
          class_group: subject.class_group.trim(),
          teacher_id: subject.teacher_id,
          schedules: subject.schedules || [],
          student_ids: subject.student_ids || [],
        };

        const subjectRes = await createSubject(subjectData);

        if (!subjectRes.success) {
          throw new Error(
            `Error creating subject "${subject.name}": ${subjectRes.error}`,
          );
        }

        const subjectId = subjectRes.data.subject_id;

        if (subject.teacher_id) {
          try {
            await assignUserToSubject(subjectId, subject.teacher_id, "teacher");
          } catch (err) {
            console.log(err);
          }
        }

        if (subject.student_ids && subject.student_ids.length > 0) {
          for (const studentId of subject.student_ids) {
            if (studentId && studentId !== "") {
              try {
                await assignUserToSubject(subjectId, studentId, "student");
              } catch (err) {
                console.log(err);
              }
            }
          }
        }
      }

      const updatedCourses = await getCourses();
      if (updatedCourses.success) {
        const coursesData = updatedCourses.data.courses || [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      }

      closeModal();
    } catch (error) {
      alert(`Error al guardar el curso: ${error.message}`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      name: "",
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear() + 1,
      subjects: [],
    });
    setTeacherQueries({});
    setStudentQueries({});
    setActiveTeacherSearch(null);
    setActiveStudentSearch(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ width: "300px" }}
          />
          <div style={{ marginLeft: "auto" }}>
            <button className="btn-add" onClick={() => setShowModal(true)}>
              <FaPlus /> Nuevo Curso
            </button>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre del Curso</th>
              <th>Período Académico</th>
              <th>Asignaturas</th>
              <th style={{ width: "120px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr
                key={course.course_id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEditingCourse(course);
                  setFormData({
                    name: course.name,
                    start_year: course.start_year,
                    end_year: course.end_year,
                    subjects: course.subjects.map((s) => ({
                      name: s.name,
                      class_group: s.class_group,
                      teacher_id: s.teacher.user_id,
                      student_ids: s.students.map((stu) => stu.user_id),
                      schedules: s.schedules,
                    })),
                  });
                  setShowModal(true);
                }}
              >
                <td>
                  <strong>{course.name}</strong>
                </td>
                <td>
                  <span className="badge badge-secondary">
                    {course.start_year} - {course.end_year}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary">
                    {course.subjects?.length || 0}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-edit">
                      <FaEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm("¿Eliminar este curso?")) {
                          await deleteCourse(course.course_id);
                          const res = await getCourses();
                          if (res.success) {
                            const coursesData = res.data.courses || [];
                            setCourses(coursesData);
                            setFilteredCourses(coursesData);
                          }
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredCourses.length && (
              <tr>
                <td colSpan="4" className="empty-state">
                  No se encontraron cursos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal size="xl" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCourse ? "Editar Curso" : "Nuevo Curso"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-section">
            <div className="section-title">Información del Curso</div>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="form-label">Nombre del Curso</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="form-control"
                    required
                  />
                </div>
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label className="form-label">Año Inicio</label>
                  <input
                    type="number"
                    name="start_year"
                    value={formData.start_year}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label className="form-label">Año Fin</label>
                  <input
                    type="number"
                    name="end_year"
                    value={formData.end_year}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <div className="section-title">
              Asignaturas
              <button className="btn-add btn-small" onClick={addSubject}>
                <FaPlus /> Añadir
              </button>
            </div>

            {formData.subjects.length === 0 ? (
              <div className="empty-state">
                No hay asignaturas. Haz clic en "Añadir" para crear una.
              </div>
            ) : (
              formData.subjects.map((subject, index) => (
                <div key={index} className="subject-card">
                  <div className="subject-header">
                    <span>Asignatura {index + 1}</span>
                    <button
                      className="btn-delete btn-small"
                      onClick={() => removeSubject(index)}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>

                  <Row className="mb-3">
                    <Col md={8}>
                      <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) =>
                            handleSubjectChange(index, "name", e.target.value)
                          }
                          className="form-control"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="form-group">
                        <label className="form-label">Grupo</label>
                        <input
                          type="text"
                          value={subject.class_group}
                          onChange={(e) =>
                            handleSubjectChange(
                              index,
                              "class_group",
                              e.target.value,
                            )
                          }
                          className="form-control"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label">Profesor</label>
                        <div className="search-container">
                          <input
                            type="text"
                            placeholder={
                              subject.teacher_id
                                ? getTeacherName(subject.teacher_id)
                                : "Buscar profesor..."
                            }
                            value={teacherQueries[index] || ""}
                            onChange={(e) =>
                              handleTeacherSearch(index, e.target.value)
                            }
                            onFocus={() => setActiveTeacherSearch(index)}
                            onBlur={() =>
                              setTimeout(
                                () => setActiveTeacherSearch(null),
                                200,
                              )
                            }
                            className="form-control"
                          />
                          {activeTeacherSearch === index && (
                            <div className="search-dropdown">
                              {(teacherQueries[index]
                                ? teacherFuse
                                    .search(teacherQueries[index])
                                    .map((r) => r.item)
                                : users
                                    .filter((u) => u.role.name === "teacher")
                                    .slice(0, 10)
                              ).map((teacher) => (
                                <div
                                  key={teacher.user_id}
                                  className="search-item"
                                  onMouseDown={() =>
                                    selectTeacher(index, teacher.user_id)
                                  }
                                >
                                  {teacher.first_name} {teacher.last_name1}{" "}
                                  {teacher.last_name2}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label">
                          Estudiantes ({subject.student_ids.length})
                        </label>
                        <div className="search-container">
                          <input
                            type="text"
                            placeholder="Buscar estudiante..."
                            value={studentQueries[index] || ""}
                            onChange={(e) =>
                              handleStudentSearch(index, e.target.value)
                            }
                            onFocus={() => setActiveStudentSearch(index)}
                            onBlur={() =>
                              setTimeout(
                                () => setActiveStudentSearch(null),
                                200,
                              )
                            }
                            className="form-control"
                          />
                          {activeStudentSearch === index && (
                            <div className="search-dropdown">
                              {(studentQueries[index]
                                ? studentFuse
                                    .search(studentQueries[index])
                                    .map((r) => r.item)
                                : users
                                    .filter(
                                      (u) =>
                                        u.role.name === "student" &&
                                        !subject.student_ids.includes(
                                          u.user_id,
                                        ),
                                    )
                                    .slice(0, 10)
                              )
                                .filter(
                                  (s) =>
                                    !subject.student_ids.includes(s.user_id),
                                )
                                .map((student) => (
                                  <div
                                    key={student.user_id}
                                    className="search-item"
                                    onMouseDown={() =>
                                      addStudent(index, student.user_id)
                                    }
                                  >
                                    {student.first_name} {student.last_name1}{" "}
                                    {student.last_name2}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {subject.student_ids.length > 0 && (
                    <div className="form-group mb-3">
                      <div className="students-list">
                        {getEnrolledStudents(subject.student_ids).map(
                          (student) => (
                            <div key={student.user_id} className="student-item">
                              <span>
                                {student.first_name} {student.last_name1}{" "}
                                {student.last_name2}
                              </span>
                              <button
                                className="btn-delete btn-small"
                                onClick={() =>
                                  removeStudent(index, student.user_id)
                                }
                              >
                                ×
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <label className="form-label">Horarios</label>
                      <button
                        className="btn-add btn-small"
                        onClick={() => addScheduleToSubject(index)}
                      >
                        <FaPlus /> Horario
                      </button>
                    </div>

                    {subject.schedules.length > 0 ? (
                      subject.schedules.map((schedule, schedIdx) => (
                        <div key={schedIdx} className="schedule-item">
                          <select
                            value={schedule.weekday}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                schedIdx,
                                "weekday",
                                e.target.value,
                              )
                            }
                          >
                            {weekdays.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          <input
                            type="time"
                            value={schedule.start_time}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                schedIdx,
                                "start_time",
                                e.target.value,
                              )
                            }
                          />
                          <input
                            type="time"
                            value={schedule.end_time}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                schedIdx,
                                "end_time",
                                e.target.value,
                              )
                            }
                          />
                          <button
                            className="btn-delete btn-small"
                            onClick={() => removeSchedule(index, schedIdx)}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div
                        className="empty-state"
                        style={{ padding: "1rem", fontSize: "0.875rem" }}
                      >
                        Sin horarios configurados
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-secondary" onClick={closeModal}>
            Cancelar
          </button>
          <button className="btn-add" onClick={saveCourse}>
            {editingCourse ? "Guardar" : "Crear"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
