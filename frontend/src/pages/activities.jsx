import { ActivitiesList } from "../components/Activities/ActivitiesList.jsx";
import { Activity } from "../components/Activities/Activity.jsx";

const actividades = [
  {
    id: 1,
    asignatura: "Matemáticas",
    titulo: "Resolver ecuaciones",
    fechaEntrega: "2025-04-25",
    estado: "pending",
  },
  {
    id: 2,
    asignatura: "Lengua",
    titulo: "Ensayo literario",
    fechaEntrega: "2025-04-22",
    estado: "in_progress",
  },
  {
    id: 3,
    asignatura: "Historia",
    titulo: "Resumen de la Revolución Francesa",
    fechaEntrega: "2025-04-20",
    estado: "completed",
  },
  {
    id: 4,
    asignatura: "Historia",
    titulo: "Resumen de la Revolución Francesa",
    fechaEntrega: "2025-04-20",
    estado: "completed",
  },
  {
    id: 5,
    asignatura: "Historia",
    titulo: "Resumen de la Revolución Francesa",
    fechaEntrega: "2025-04-20",
    estado: "completed",
  },
  {
    id: 6,
    asignatura: "Historia",
    titulo: "Resumen de la Revolución Francesa",
    fechaEntrega: "2025-04-20",
    estado: "completed",
  },
  {
    id: 7,
    asignatura: "Historia",
    titulo: "Resumen de la Revolución Francesa",
    fechaEntrega: "2025-04-20",
    estado: "completed",
  },
  {
    id: 8,
    asignatura: "Historia",
    titulo: "Resumen de la Revolución Francesa",
    fechaEntrega: "2025-04-20",
    estado: "completed",
  },
];

export function Activities() {
  return (
    <div class="activities-container">
      <ActivitiesList title="PENDIENTES" status="pending" actividades={actividades} />
      <ActivitiesList title="EN PROCESO" status="in_progress" actividades={actividades} />
      <ActivitiesList title="FINALIZADAS" status="completed" actividades={actividades} />
    </div>
  );
}
