import { useState, useEffect, useRef } from 'react';
import { Separator } from './UI/Separator';
import { UserProfile } from './Menu/UserProfile';
import { Mboton } from './Menu/menu_botton';


export function Menu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Alternar estado del menú
    const toggleMenu = () => setMenuOpen((prevState) => !prevState);

    // Cerrar el menú al hacer clic fuera de él
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    // Efecto para manejar clics fuera del menú
    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <>
            <nav className="menu-container" ref={menuRef}>
                <div className="menu-header d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                        <h3 className="mb-0 d-none d-md-block">Menú</h3>
                        <button
                            className="menu-toggle btn btn-light d-md-none ms-3"
                            onClick={toggleMenu}
                            aria-label="Abrir menú"
                            aria-expanded={menuOpen ? 'true' : 'false'}
                        >
                            ☰
                        </button>
                    </div>
                </div>

                <article className={`m-contenedor ${menuOpen ? 'd-block' : 'd-none d-md-block'}`}>
                    <UserProfile name="USUARIO" avatarUrl="https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png" />

                    <Separator />
                    <Mboton name="Login" url="https://www.systemuicons.com/images/icons/mail.svg" ruta="/login" />
                    <Separator />

                    <Mboton name="Inicio" url="https://www.systemuicons.com/images/icons/list.svg" ruta="/" />
                    <Mboton name="Perfil" url="https://www.systemuicons.com/images/icons/user_male.svg" ruta="/profile" />
                    <Mboton name="Información académica" url="https://www.systemuicons.com/images/icons/bookmark_book.svg" ruta="/academic_info" />
                    <Mboton name="Calendario" url="https://www.systemuicons.com/images/icons/calendar_date.svg" ruta="/calendar" />

                    <Separator />

                    <Mboton name="Actividades" url="https://www.systemuicons.com/images/icons/clock.svg" ruta="/activities" />
                    <Mboton name="Rendimiento" url="https://www.systemuicons.com/images/icons/star.svg" ruta="/performance" />
                    <Mboton name="Comunicación" url="https://www.systemuicons.com/images/icons/mail.svg" ruta="/communication" />

                    <Separator />

                    <Mboton name="Tablón de anuncios" url="https://www.systemuicons.com/images/icons/clipboard_notes.svg" ruta="/announcements" />
                    <Mboton name="Notificaciones" url="https://www.systemuicons.com/images/icons/bell.svg" ruta="/notice_board" />
                    <Mboton name="Cerrar Sesión" url="https://www.systemuicons.com/images/icons/exit_left.svg" ruta="/logout" />
                </article>
            </nav>

            
        </>
    );
}
