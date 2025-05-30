// Modal para mostrar actividades en el calendario

import '../../styles/calendar.css';

export function Modal({ isOpen, onClose, children }) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay-calendar" onClick={onClose}>
            <div className="modal-content-calendar" onClick={e => e.stopPropagation()}>
                <button className="modal-close-calendar" onClick={onClose}>
                    <img src="https://www.systemuicons.com/images/icons/cross_circle.svg" alt="Cerrar" /></button>
                {children}
            </div>
        </div>
    );
}