// Página de Calendario

import React, { useState, useEffect } from "react";
import '../styles/calendar.css'; // Incluye el estilo CSS

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function Calendar() {

  const today = new Date();

  const userId = parseInt(localStorage.getItem("user_id"), 10);
  const userRole = localStorage.getItem("user_role");

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

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

        // Agrupar eventos por fecha
        const eventosPorFecha = {};

        data.forEach((actividad) => {

          const fechaInicio = new Date(actividad.start_date);
          const fechaLimite = new Date(actividad.end_date);

          const startKey = `${fechaInicio.getFullYear()}-${fechaInicio.getMonth() + 1}-${fechaInicio.getDate()}`;
          const endKey = `${fechaLimite.getFullYear()}-${fechaLimite.getMonth() + 1}-${fechaLimite.getDate()}`;

          const eventoInicio = { ...actividad, tipoEvento: "Inicio" };
          const eventoLimite = { ...actividad, tipoEvento: "Límite" };

          if (!eventosPorFecha[startKey]) eventosPorFecha[startKey] = [];
          eventosPorFecha[startKey].push(eventoInicio);

          if (!eventosPorFecha[endKey]) eventosPorFecha[endKey] = [];
          eventosPorFecha[endKey].push(eventoLimite);

        });

        setEvents(eventosPorFecha);

      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    fetchEvents();

  }, [userId, userRole, currentDate]);


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

            const dayDate = new Date(year, month, day);

            const isPastDay = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isSelected = selectedDay === day;

            return (
              <div key={index}
                className={`calendar-day ${isPastDay ? "past-day" : ""} ${isSelected ? "selected-day" : ""}`}
                onClick={() => setSelectedDay(day)}
                title={eventosDelDia.map(e => `${e.title} - ${e.tipoEvento}: ${new Date(e.tipoEvento === "Inicio" ? e.start_date : e.end_date).toLocaleDateString()}`).join("\n")}
              >
                <div>{day}</div>

                {eventosDelDia.length > 0 && (

                  <ul className="event-list">

                    {eventosDelDia.slice(0, 2).map((e) => (

                      <li key={e.activity_id || e.submission_id}>
                        {e.title} <br />
                        {e.tipoEvento}: {new Date(e.tipoEvento === "Inicio" ? e.start_date : e.end_date).toLocaleDateString()}
                      </li>

                    ))}

                    {eventosDelDia.length > 2 && <li>+{eventosDelDia.length - 2} más</li>}

                  </ul>

                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
