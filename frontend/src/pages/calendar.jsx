// Página de Calendario

import React, { useState } from "react";
import '../styles/calendar.css'; // Incluye el estilo CSS

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function Calendar() {

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth - 1; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);


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

          {calendarDays.map((day, index) => {
            return (
              <div
                key={index}
                className={`calendar-day ${""}`}
                onClick={() => day && openDay(day)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
