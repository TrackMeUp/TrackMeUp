// Modal para mostrar actividades en el calendario

import '../../styles/calendar.css';

export function Modal({ isOpen, onClose, children }) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <img src="https://www.systemuicons.com/images/icons/cross_circle.svg" alt="Cerrar" /></button>
                {children}
            </div>
        </div>
    );
}