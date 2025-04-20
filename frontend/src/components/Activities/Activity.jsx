export function Activity({ asignatura, titulo, fechaEntrega }) {
  return (
    <div className="activity">
        <p className="activity-detail">{asignatura}</p>
        <h4 className="activity-title">{titulo}</h4>
        <p className="activity-date">{fechaEntrega}</p>
    </div>
  );
}
