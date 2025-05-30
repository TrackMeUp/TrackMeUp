// Página de Calendario

import { useState, useEffect } from "react";
import '../styles/calendar.css'; // Incluye el estilo CSS
import { Modal } from "../components/Calendar/Modal.jsx"

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function Calendar() {

  const today = new Date();

  const userId = parseInt(localStorage.getItem("user_id"), 10);
  const userRole = localStorage.getItem("user_role");

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvents, setModalEvents] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth - 1; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Cargar actividades propias del usuario (estudiante o profesor)
  useEffect(() => {
    const fetchEvents = async () => {

      try {
        let url = "";

        if (userRole === "teacher") {

          url = `http://localhost:3000/api/actividades/profesor/${userId}`;

        } else {
          url = `http://localhost:3000/api/actividades/estudiante/${userId}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        console.log(data);

        // Agrupar eventos por fecha
        const eventosPorFecha = {};

        data.forEach((actividad) => {

          const fechaInicio = new Date(actividad.start_date);
          const fechaLimite = new Date(actividad.end_date);

          const eventoInicio = { ...actividad, tipoEvento: "Inicio de actividad" };
          const eventoLimite = { ...actividad, tipoEvento: "Límite de entrega" };

          const fechas = [fechaInicio, fechaLimite];

          fechas.forEach((fecha, i) => {

            const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
            if (!eventosPorFecha[key]) eventosPorFecha[key] = [];
            eventosPorFecha[key].push(i === 0 ? eventoInicio : eventoLimite);
          });
        });

        setEvents(eventosPorFecha);

      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    fetchEvents();

  }, [userId, userRole, currentDate]);

  // Modal para visualizar actividades
  const openModal = (day, eventos) => {
    setSelectedDay(day);
    setModalEvents(eventos);
    setModalOpen(true);
  };


  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="btn-calendar" onClick={prevMonth}> <img src='https://www.systemuicons.com/images/icons/arrow_left_circle.svg' /> </button>

        <h1 className="a-titulo">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h1>

        <button className="btn-calendar" onClick={nextMonth}> <img src='https://www.systemuicons.com/images/icons/arrow_right_circle.svg' /> </button>

      </div>

      <div className="calendar-grid-wrapper">
        <div className="calendar-grid">

          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-name">{day}</div>
          ))}

          {calendarDays.map((day, index) => { // Mostrar los días pasados de otro color

            if (!day) {

              return <div key={index} className="calendar-day past-day"></div>;
            }

            const dateKey = `${year}-${month + 1}-${day}`;
            const eventosDelDia = events[dateKey] || [];

            const tipos = [...new Set(eventosDelDia.map(e => e.type === 'exam' ? 'Examen' : 'Actividad'))];
            const tipoTexto = tipos.length === 2 ? 'Examen \n Actividad' : (tipos[0] || '');

            const dayDate = new Date(year, month, day);

            const isPastDay = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isSelected = selectedDay === day;

            return (
              <div key={index}
                className={`calendar-day ${isPastDay ? "past-day" : ""} ${isSelected ? "selected-day" : ""}`}
                onClick={() => eventosDelDia.length > 0 && openModal(day, eventosDelDia)}
              >

                <div>{day}</div>
                {eventosDelDia.length > 0 && (
                  <div className="event-type">{tipoTexto}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>

        <h2>Actividades del {selectedDay} de {currentDate.toLocaleString("default", { month: "long" })}</h2>
        {modalEvents.map((e, idx) => (
          <div key={idx} className="modal-event-item-calendar">
            <strong>{e.title}</strong><br />
            {e.content && (
              <>
                <em>{e.content}</em><br />
              </>
            )}
            {e.activity_content}<br />
          </div>
        ))}

      </Modal>
    </div>
  );
}