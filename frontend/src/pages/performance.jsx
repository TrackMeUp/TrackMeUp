import { useState, useEffect } from "react";
import {
  getStudentPerformance,
  getAccessibleStudents,
} from "../services/api/PerformanceApiService";
import Fuse from "fuse.js";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  FaUser,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaBookOpen,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "../styles/performance.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export function Performance() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [activeSearch, setActiveSearch] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      fetchAccessibleStudents(user);
    }
  }, []);

  useEffect(() => {
    if (students.length > 0 && searchQuery) {
      const fuse = new Fuse(students, {
        keys: ["first_name", "last_name1", "last_name2"],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      setFilteredStudents(results.map((result) => result.item));
    } else {
      setFilteredStudents(students.slice(0, 10));
    }
  }, [students, searchQuery]);

  const fetchAccessibleStudents = async (user) => {
    try {
      const response = await getAccessibleStudents(
        user.user_id,
        user.role.name,
      );
      if (response.success) {
        const students = response.data.students || [];
        setStudents(students);

        if (user.role.name === "student") {
          const studentData = students.find((s) => s.user_id === user.user_id);
          if (studentData) {
            setSelectedStudent(studentData);
            fetchStudentPerformance(studentData.user_id);
          }
        } else if (user.role.name === "parent") {
          if (students.length === 1) {
            setSelectedStudent(students[0]);
            fetchStudentPerformance(students[0].user_id);
          } else if (students.length === 0) {
            setError("No se encontraron hijos asociados a este padre");
          } else {
            console.warn(
              "Parent has multiple children - this shouldn't happen",
            );
            setError("Error en la configuración de relaciones padre-hijo");
          }
        }
      } else {
        setError(
          "Error al cargar estudiantes: " + (response.error || "Unknown error"),
        );
      }
    } catch (err) {
      setError("Error al cargar estudiantes: " + err.message);
    }
  };

  const fetchStudentPerformance = async (studentId, subjectId = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudentPerformance(studentId, subjectId);
      if (response.success) {
        setPerformanceData(response.data);
        if (response.data.subjects) {
          setAvailableSubjects(response.data.subjects);
        }
      } else {
        setError("Error al cargar datos de rendimiento");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery("");
    setActiveSearch(false);
    setSelectedSubject(null);
    fetchStudentPerformance(student.user_id);
  };

  const handleSubjectFilter = (subjectId) => {
    setSelectedSubject(subjectId);
    if (selectedStudent) {
      fetchStudentPerformance(selectedStudent.user_id, subjectId);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "success",
      pending: "warning",
      in_progress: "info",
    };
    const labels = {
      completed: "Completado",
      pending: "Pendiente",
      in_progress: "En Progreso",
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const getGradeColor = (grade) => {
    if (grade >= 9.0) return "text-success";
    if (grade >= 7.0) return "text-warning";
    return "text-danger";
  };

  const getPunctualityBadge = (score) => {
    if (score >= 80) return <Badge bg="success">Excelente Puntualidad</Badge>;
    if (score >= 60) return <Badge bg="warning">Puntualidad Regular</Badge>;
    return <Badge bg="danger">Necesita Mejorar Puntualidad</Badge>;
  };

  const getConsistencyBadge = (stability) => {
    const badges = {
      stable: <Badge bg="success">Rendimiento Estable</Badge>,
      moderate: <Badge bg="warning">Rendimiento Moderado</Badge>,
      unstable: <Badge bg="danger">Rendimiento Inconsistente</Badge>,
    };
    return badges[stability] || <Badge bg="secondary">Sin Datos</Badge>;
  };

  const getProcrastinationRisk = (risk) => {
    const risks = {
      low: { color: "success", text: "Bajo Riesgo" },
      medium: { color: "warning", text: "Riesgo Moderado" },
      high: { color: "danger", text: "Alto Riesgo" },
    };
    const riskData = risks[risk] || { color: "secondary", text: "Sin Datos" };
    return <Badge bg={riskData.color}>{riskData.text}</Badge>;
  };

  const subjectGradesChart =
    performanceData && performanceData.performance?.by_subject
      ? {
          labels: Object.values(performanceData.performance.by_subject).map(
            (s) => s.subject_name,
          ),
          datasets: [
            {
              label: "Promedio por Asignatura",
              data: Object.values(performanceData.performance.by_subject).map(
                (s) => s.average_grade || 0,
              ),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        }
      : null;

  const gradeDistributionChart =
    performanceData && performanceData.performance?.grade_distribution
      ? {
          labels: [
            "Excelente (9.0-10)",
            "Muy Bueno (8.0-8.9)",
            "Bueno (7.0-7.9)",
            "Regular (6.0-6.9)",
            "Insuficiente (0-5.9)",
          ],
          datasets: [
            {
              data: [
                performanceData.performance.grade_distribution["9.0-10.0"] || 0,
                performanceData.performance.grade_distribution["8.0-8.9"] || 0,
                performanceData.performance.grade_distribution["7.0-7.9"] || 0,
                performanceData.performance.grade_distribution["6.0-6.9"] || 0,
                performanceData.performance.grade_distribution["0.0-5.9"] || 0,
              ],
              backgroundColor: [
                "#28a745",
                "#ffc107",
                "#17a2b8",
                "#fd7e14",
                "#dc3545",
              ],
            },
          ],
        }
      : null;

  const gradeTrendsChart =
    performanceData &&
    performanceData.performance?.grade_trends &&
    performanceData.performance.grade_trends.length > 0
      ? {
          labels: performanceData.performance.grade_trends.map((t) =>
            new Date(t.date).toLocaleDateString("es-ES"),
          ),
          datasets: [
            {
              label: "Promedio Móvil (5 actividades)",
              data: performanceData.performance.grade_trends.map(
                (t) => t.moving_average || 0,
              ),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
            },
          ],
        }
      : null;

  const monthlyTrendsChart =
    performanceData &&
    performanceData.performance?.time_analytics?.monthly_trends &&
    Object.keys(performanceData.performance.time_analytics.monthly_trends)
      .length > 0
      ? {
          labels: Object.keys(
            performanceData.performance.time_analytics.monthly_trends,
          ),
          datasets: [
            {
              label: "Promedio de Calificaciones",
              data: Object.values(
                performanceData.performance.time_analytics.monthly_trends,
              ).map((m) => m.average_grade || 0),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              yAxisID: "y",
            },
            {
              label: "Tasa de Finalización (%)",
              data: Object.values(
                performanceData.performance.time_analytics.monthly_trends,
              ).map((m) => m.completion_rate || 0),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              yAxisID: "y1",
            },
          ],
        }
      : null;

  const weeklyPatternsChart =
    performanceData &&
    performanceData.performance?.time_analytics?.weekly_patterns
      ? {
          labels: Object.keys(
            performanceData.performance.time_analytics.weekly_patterns,
          ),
          datasets: [
            {
              label: "Entregas por Día de la Semana",
              data: Object.values(
                performanceData.performance.time_analytics.weekly_patterns,
              ),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
              ],
            },
          ],
        }
      : null;

  if (!currentUser) {
    return (
      <Alert variant="warning">
        Por favor, inicia sesión para acceder a esta función.
      </Alert>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>
          <FaChartLine /> Rendimiento Estudiantil
        </h2>

        {(currentUser.role.name === "admin" ||
          currentUser.role.name === "teacher") && (
          <div className="admin-controls">
            <div className="search-container" style={{ width: "400px" }}>
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setActiveSearch(true)}
                onBlur={() => setTimeout(() => setActiveSearch(false), 200)}
                className="form-control"
              />
              {activeSearch && filteredStudents.length > 0 && (
                <div className="search-dropdown">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.user_id}
                      className="search-item"
                      onMouseDown={() => selectStudent(student)}
                    >
                      <FaUser className="me-2" />
                      {student.first_name} {student.last_name1}{" "}
                      {student.last_name2}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {!selectedStudent &&
        (currentUser.role.name === "admin" ||
          currentUser.role.name === "teacher") && (
          <Alert variant="info">
            <FaUser className="me-2" />
            Selecciona un estudiante para ver su rendimiento académico.
          </Alert>
        )}

      {!selectedStudent && currentUser.role.name === "parent" && (
        <Alert variant="warning">
          <FaUser className="me-2" />
          No se pudo cargar la información de tu hijo. Contacta al
          administrador.
        </Alert>
      )}

      {selectedStudent && (
        <div className="student-info-header mb-4">
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h4>
                    <FaUser className="me-2" />
                    {selectedStudent.first_name} {selectedStudent.last_name1}{" "}
                    {selectedStudent.last_name2}
                  </h4>
                  {performanceData && (
                    <p className="text-muted mb-0">
                      {performanceData.student?.email}
                    </p>
                  )}
                </Col>
                <Col md={6} className="text-end">
                  {performanceData && (
                    <div>
                      <h5 className="mb-1">
                        <FaTrophy className="me-2 text-warning" />
                        Promedio General:{" "}
                        <span
                          className={getGradeColor(
                            performanceData.performance?.overall
                              ?.overall_average || 0,
                          )}
                        >
                          {performanceData.performance?.overall
                            ?.overall_average || 0}
                        </span>
                      </h5>
                      <small className="text-muted">
                        {performanceData.performance?.overall
                          ?.completed_submissions || 0}{" "}
                        de{" "}
                        {performanceData.performance?.overall
                          ?.total_submissions || 0}{" "}
                        actividades completadas
                      </small>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}

      {selectedStudent && availableSubjects.length > 0 && (
        <div className="subject-filter-section mb-4">
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3}>
                  <h6 className="mb-0">Filtrar por Asignatura:</h6>
                </Col>
                <Col md={9}>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge
                      bg={
                        selectedSubject === null ? "primary" : "outline-primary"
                      }
                      className="p-2 cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSubjectFilter(null)}
                    >
                      Todas las Asignaturas
                    </Badge>
                    {availableSubjects.map((subject) => (
                      <Badge
                        key={subject.subject_id}
                        bg={
                          selectedSubject === subject.subject_id
                            ? "success"
                            : "outline-secondary"
                        }
                        className="p-2 cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSubjectFilter(subject.subject_id)}
                      >
                        {subject.subject_name}
                        {subject.class_group && ` (${subject.class_group})`}
                      </Badge>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {performanceData && !loading && (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="metric-card">
                <Card.Body>
                  <FaBookOpen className="metric-icon text-primary" />
                  <div className="metric-value">
                    {performanceData.performance?.overall?.total_submissions ||
                      0}
                  </div>
                  <p className="metric-label">Total Actividades</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="metric-card">
                <Card.Body>
                  <FaTrophy className="metric-icon text-success" />
                  <div className="metric-value">
                    {performanceData.performance?.overall
                      ?.completed_submissions || 0}
                  </div>
                  <p className="metric-label">Completadas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="metric-card">
                <Card.Body>
                  <FaClock className="metric-icon text-warning" />
                  <div className="metric-value">
                    {performanceData.performance?.overall
                      ?.pending_submissions || 0}
                  </div>
                  <p className="metric-label">Pendientes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="metric-card">
                <Card.Body>
                  <FaChartLine className="metric-icon text-info" />
                  <div className="metric-value">
                    {Math.round(
                      performanceData.performance?.overall?.completion_rate ||
                        0,
                    )}
                    %
                  </div>
                  <p className="metric-label">Tasa Finalización</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h5>
                    <FaClock className="me-2" />
                    Análisis de Puntualidad y Patrones
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="text-center">
                      <h6>Puntualidad en Entregas</h6>
                      {performanceData.performance?.time_analytics
                        ?.timing_analysis?.punctuality_score > 0 ? (
                        <div>
                          <h4
                            className={
                              performanceData.performance.time_analytics
                                .timing_analysis.punctuality_score >= 80
                                ? "text-success"
                                : performanceData.performance.time_analytics
                                      .timing_analysis.punctuality_score >= 60
                                  ? "text-warning"
                                  : "text-danger"
                            }
                          >
                            {Math.round(
                              performanceData.performance.time_analytics
                                .timing_analysis.punctuality_score,
                            )}
                            %
                          </h4>
                          {getPunctualityBadge(
                            performanceData.performance.time_analytics
                              .timing_analysis.punctuality_score,
                          )}
                          <div className="mt-2">
                            <small className="text-success">
                              Tempranas:{" "}
                              {performanceData.performance.time_analytics
                                .timing_analysis.early || 0}
                            </small>
                            <br />
                            <small className="text-warning">
                              A tiempo:{" "}
                              {performanceData.performance.time_analytics
                                .timing_analysis.on_time || 0}
                            </small>
                            <br />
                            <small className="text-danger">
                              Tardías:{" "}
                              {performanceData.performance.time_analytics
                                .timing_analysis.late || 0}
                            </small>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">
                          <p>
                            No hay datos suficientes para analizar puntualidad
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col md={3} className="text-center">
                      <h6>Riesgo de Procrastinación</h6>
                      <div className="mt-3">
                        {getProcrastinationRisk(
                          performanceData.performance?.time_analytics
                            ?.procrastination_risk || "low",
                        )}
                        <div className="mt-2">
                          <small className="text-muted">
                            {performanceData.performance?.time_analytics
                              ?.timing_analysis?.average_days_before_deadline
                              ? performanceData.performance.time_analytics
                                  .timing_analysis
                                  .average_days_before_deadline > 0
                                ? `Promedio: ${Math.round(performanceData.performance.time_analytics.timing_analysis.average_days_before_deadline)} días antes`
                                : `Promedio: ${Math.abs(Math.round(performanceData.performance.time_analytics.timing_analysis.average_days_before_deadline))} días tarde`
                              : "Sin datos de timing"}
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="text-center">
                      <h6>Consistencia de Rendimiento</h6>
                      <div className="mt-3">
                        {getConsistencyBadge(
                          performanceData.performance?.completion_analysis
                            ?.performance_stability || "stable",
                        )}
                        <div className="mt-2">
                          <small className="text-muted">
                            Desviación:{" "}
                            {performanceData.performance?.completion_analysis
                              ?.grade_consistency || 0}
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="text-center">
                      <h6>Actividades Pendientes</h6>
                      <div className="mt-3">
                        <h4
                          className={
                            (performanceData.performance?.completion_analysis
                              ?.overdue_count || 0) > 0
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {performanceData.performance?.completion_analysis
                            ?.overdue_count || 0}
                        </h4>
                        <small className="text-muted">Vencidas</small>
                        <br />
                        <small className="text-warning">
                          {performanceData.performance?.completion_analysis
                            ?.upcoming_deadlines || 0}{" "}
                          próximas (7 días)
                        </small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Card className="chart-card">
                <Card.Header>
                  <h5>
                    <FaChartLine className="me-2" />
                    Tendencia de Calificaciones
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="chart-container">
                    {gradeTrendsChart && gradeTrendsChart.labels.length > 0 ? (
                      <Line
                        data={gradeTrendsChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                            tooltip: {
                              mode: "index",
                              intersect: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 10,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="empty-state">
                        <p>No hay suficientes datos para mostrar tendencias</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="chart-card">
                <Card.Header>
                  <h5>
                    <FaBookOpen className="me-2" />
                    Patrones de Entrega Semanal
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="chart-container">
                    {weeklyPatternsChart ? (
                      <Bar
                        data={weeklyPatternsChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="empty-state">
                        <p>No hay datos de patrones semanales</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {monthlyTrendsChart && (
            <Row className="mb-4">
              <Col md={12}>
                <Card className="chart-card">
                  <Card.Header>
                    <h5>
                      <FaChartLine className="me-2" />
                      Tendencias Mensuales: Calificaciones vs Finalización
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="chart-container">
                      <Line
                        data={monthlyTrendsChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: "index",
                            intersect: false,
                          },
                          plugins: {
                            legend: {
                              position: "top",
                            },
                          },
                          scales: {
                            y: {
                              type: "linear",
                              display: true,
                              position: "left",
                              beginAtZero: true,
                              max: 10,
                              title: {
                                display: true,
                                text: "Promedio de Calificaciones",
                              },
                            },
                            y1: {
                              type: "linear",
                              display: true,
                              position: "right",
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: "Tasa de Finalización (%)",
                              },
                              grid: {
                                drawOnChartArea: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Row className="mb-4">
            <Col md={8}>
              <Card className="chart-card">
                <Card.Header>
                  <h5>
                    <FaChartLine className="me-2" />
                    Promedio por Asignatura
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="chart-container">
                    {subjectGradesChart ? (
                      <Bar
                        data={subjectGradesChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                            title: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 10,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="empty-state">
                        <p>No hay datos de asignaturas</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="chart-card">
                <Card.Header>
                  <h5>
                    <FaTrophy className="me-2" />
                    Distribución de Notas
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="chart-container">
                    {gradeDistributionChart ? (
                      <Doughnut
                        data={gradeDistributionChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="empty-state">
                        <p>No hay datos de distribución</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5>
                    <FaBookOpen className="me-2" />
                    Rendimiento por Tipo de Actividad
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="text-center">
                      <h4 className="text-primary">Exámenes</h4>
                      <h3
                        className={getGradeColor(
                          performanceData.performance?.by_type?.exams
                            ?.average || 0,
                        )}
                      >
                        {performanceData.performance?.by_type?.exams?.average ||
                          0}
                      </h3>
                      <p className="text-muted">
                        {performanceData.performance?.by_type?.exams?.count ||
                          0}{" "}
                        evaluaciones
                      </p>
                    </Col>
                    <Col md={6} className="text-center">
                      <h4 className="text-info">Tareas</h4>
                      <h3
                        className={getGradeColor(
                          performanceData.performance?.by_type?.assignments
                            ?.average || 0,
                        )}
                      >
                        {performanceData.performance?.by_type?.assignments
                          ?.average || 0}
                      </h3>
                      <p className="text-muted">
                        {performanceData.performance?.by_type?.assignments
                          ?.count || 0}{" "}
                        asignaciones
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5>
                    <FaUser className="me-2" />
                    Resumen de Asignaturas
                  </h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {performanceData.performance?.by_subject &&
                  Object.keys(performanceData.performance.by_subject).length >
                    0 ? (
                    Object.values(performanceData.performance.by_subject).map(
                      (subject, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom"
                        >
                          <div>
                            <strong>{subject.subject_name}</strong>
                            <br />
                            <small className="text-muted">
                              {subject.course_name}
                            </small>
                          </div>
                          <div className="text-end">
                            <span
                              className={`fw-bold ${getGradeColor(subject.average_grade)}`}
                            >
                              {subject.average_grade > 0
                                ? subject.average_grade.toFixed(1)
                                : "N/A"}
                            </span>
                            <br />
                            <small className="text-muted">
                              {subject.completed}/{subject.total_activities}{" "}
                              completadas
                            </small>
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="empty-state">
                      <p>No hay datos de asignaturas</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5>
                    <FaClock className="me-2" />
                    Actividades Críticas
                  </h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {(performanceData.performance?.completion_analysis
                    ?.overdue_activities?.length || 0) > 0 && (
                    <div className="mb-3">
                      <h6 className="text-danger">Actividades Vencidas</h6>
                      {performanceData.performance.completion_analysis.overdue_activities.map(
                        (activity, index) => (
                          <div
                            key={index}
                            className="border-left border-danger p-2 mb-2"
                          >
                            <strong>{activity.activity_title}</strong> -{" "}
                            {activity.subject_name}
                            <br />
                            <small className="text-danger">
                              Vencía:{" "}
                              {new Date(
                                activity.activity_end,
                              ).toLocaleDateString("es-ES")}
                            </small>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {(performanceData.performance?.completion_analysis
                    ?.upcoming_activities?.length || 0) > 0 && (
                    <div>
                      <h6 className="text-warning">
                        Próximas Entregas (7 días)
                      </h6>
                      {performanceData.performance.completion_analysis.upcoming_activities.map(
                        (activity, index) => (
                          <div
                            key={index}
                            className="border-left border-warning p-2 mb-2"
                          >
                            <strong>{activity.activity_title}</strong> -{" "}
                            {activity.subject_name}
                            <br />
                            <small className="text-warning">
                              Vence:{" "}
                              {new Date(
                                activity.activity_end,
                              ).toLocaleDateString("es-ES")}
                            </small>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {(performanceData.performance?.completion_analysis
                    ?.overdue_activities?.length || 0) === 0 &&
                    (performanceData.performance?.completion_analysis
                      ?.upcoming_activities?.length || 0) === 0 && (
                      <div className="text-center text-success">
                        <h5>¡Excelente!</h5>
                        <p>No hay actividades vencidas ni entregas urgentes</p>
                      </div>
                    )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5>
                    <FaTrophy className="me-2" />
                    Recomendaciones Personalizadas
                  </h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {(() => {
                    const recommendations = [];
                    const performance = performanceData.performance;

                    if (!performance)
                      return (
                        <p className="text-muted">
                          No hay datos suficientes para generar recomendaciones
                        </p>
                      );

                    if (
                      performance.time_analytics?.timing_analysis
                        ?.punctuality_score < 60
                    ) {
                      recommendations.push({
                        type: "warning",
                        icon: "⏰",
                        title: "Mejorar Puntualidad",
                        text: "Considera usar un calendario para planificar entregas con anticipación.",
                      });
                    }

                    if (
                      performance.completion_analysis?.performance_stability ===
                      "unstable"
                    ) {
                      recommendations.push({
                        type: "info",
                        icon: "📊",
                        title: "Estabilizar Rendimiento",
                        text: "Tus calificaciones varían mucho. Mantén rutinas de estudio consistentes.",
                      });
                    }

                    if (performance.by_subject) {
                      const weakSubjects = Object.values(performance.by_subject)
                        .filter(
                          (s) => s.average_grade > 0 && s.average_grade < 7,
                        )
                        .sort((a, b) => a.average_grade - b.average_grade);

                      if (weakSubjects.length > 0) {
                        recommendations.push({
                          type: "danger",
                          icon: "📚",
                          title: `Reforzar ${weakSubjects[0].subject_name}`,
                          text: `Tu promedio en esta asignatura es ${weakSubjects[0].average_grade.toFixed(1)}. Considera pedir ayuda adicional.`,
                        });
                      }
                    }

                    const examAvg = performance.by_type?.exams?.average || 0;
                    const assignmentAvg =
                      performance.by_type?.assignments?.average || 0;

                    if (
                      examAvg > 0 &&
                      assignmentAvg > 0 &&
                      Math.abs(examAvg - assignmentAvg) > 2
                    ) {
                      if (examAvg < assignmentAvg) {
                        recommendations.push({
                          type: "warning",
                          icon: "📝",
                          title: "Mejorar en Exámenes",
                          text: "Tus tareas están mejor que tus exámenes. Practica técnicas de estudio para evaluaciones.",
                        });
                      } else {
                        recommendations.push({
                          type: "info",
                          icon: "📋",
                          title: "Enfocarse en Tareas",
                          text: "Tienes buen rendimiento en exámenes pero puedes mejorar en tareas diarias.",
                        });
                      }
                    }

                    if ((performance.overall?.completion_rate || 0) > 90) {
                      recommendations.push({
                        type: "success",
                        icon: "🌟",
                        title: "¡Excelente Compromiso!",
                        text: "Mantienes una alta tasa de finalización. ¡Sigue así!",
                      });
                    }

                    if ((performance.overall?.overall_average || 0) >= 8.5) {
                      recommendations.push({
                        type: "success",
                        icon: "🏆",
                        title: "Rendimiento Sobresaliente",
                        text: "Tu promedio general es excelente. ¡Eres un ejemplo a seguir!",
                      });
                    }

                    if (recommendations.length === 0) {
                      recommendations.push({
                        type: "info",
                        icon: "📈",
                        title: "Sigue Trabajando",
                        text: "Continúa con tu esfuerzo. Cada actividad completada es un paso hacia el éxito.",
                      });
                    }

                    return recommendations.map((rec, index) => (
                      <Alert key={index} variant={rec.type} className="py-2">
                        <strong>
                          {rec.icon} {rec.title}
                        </strong>
                        <br />
                        <small>{rec.text}</small>
                      </Alert>
                    ));
                  })()}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h5>
                    <FaClock className="me-2" />
                    Actividades Recientes
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive striped hover className="activity-table">
                    <thead>
                      <tr>
                        <th>Actividad</th>
                        <th>Asignatura</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Nota</th>
                        <th>Fecha Entrega</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.performance?.latest_submissions?.length >
                      0 ? (
                        performanceData.performance.latest_submissions.map(
                          (submission, index) => (
                            <tr key={index}>
                              <td>
                                <strong>{submission.activity_title}</strong>
                              </td>
                              <td>{submission.subject_name}</td>
                              <td>
                                <Badge
                                  bg={
                                    submission.activity_type === "exam"
                                      ? "danger"
                                      : "primary"
                                  }
                                  className="status-badge"
                                >
                                  {submission.activity_type === "exam"
                                    ? "Examen"
                                    : "Tarea"}
                                </Badge>
                              </td>
                              <td>{getStatusBadge(submission.status)}</td>
                              <td>
                                {submission.grade !== null ? (
                                  <span
                                    className={getGradeColor(submission.grade)}
                                  >
                                    <strong>{submission.grade}</strong>
                                  </span>
                                ) : (
                                  <span className="text-muted">
                                    Sin calificar
                                  </span>
                                )}
                              </td>
                              <td>
                                {submission.submission_date ? (
                                  new Date(
                                    submission.submission_date,
                                  ).toLocaleDateString("es-ES")
                                ) : (
                                  <span className="text-muted">
                                    No entregado
                                  </span>
                                )}
                              </td>
                            </tr>
                          ),
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center text-muted empty-state"
                          >
                            No hay actividades registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
