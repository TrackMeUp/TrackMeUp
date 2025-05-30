// Menú de navegación

import { Separator } from './UI/Separator'
import { UserProfile } from './Menu/UserProfile'
import { Mboton } from './Menu/menu_botton'

export function Menu() {

    const usuarioId = parseInt(localStorage.getItem("user_id"), 10);
    const usuarioNombre = localStorage.getItem("user_name");
    const rol = localStorage.getItem("user_role");

    return (
        <article className="m-contenedor">

            <UserProfile name={`${usuarioNombre}`} avatarUrl={`../../public/${usuarioId}.png`} />

            {rol === "admin" ? (
                <>
                    <Mboton name="Panel de Administración" url="https://www.systemuicons.com/images/icons/settings.svg" ruta="/admin" />
                    <Mboton name="Gestión de Usuarios" url="https://www.systemuicons.com/images/icons/users.svg" ruta="/admin/user_management" />
                    <Mboton name="Gestión Académica" url="https://www.systemuicons.com/images/icons/clipboard.svg" ruta="/admin/academic_management" />
                    {/* <Mboton name="Gestión de Rendimiento" url="https://www.systemuicons.com/images/icons/graph_bar.svg" ruta="/admin/performance_management" /> */}
                    
                    <Separator />
                    
                    <Mboton name='Rendimiento' url='https://www.systemuicons.com/images/icons/star.svg' ruta="/performance" />
                </>

            ) : (

                <>
                    <Mboton name='Inicio' url='https://www.systemuicons.com/images/icons/list.svg' ruta="/home" />
                    <Mboton name='Perfil' url='https://www.systemuicons.com/images/icons/user_male.svg' ruta="/profile" />
                    <Mboton name='Información académica' url='https://www.systemuicons.com/images/icons/bookmark_book.svg' ruta="/academic_info" />
                    <Mboton name='Calendario' url='https://www.systemuicons.com/images/icons/calendar_date.svg' ruta="/calendar" />

                    <Separator />

                    <Mboton name='Actividades' url='https://www.systemuicons.com/images/icons/clock.svg' ruta="/activities" />
                    <Mboton name='Tablón de anuncios' url='https://www.systemuicons.com/images/icons/clipboard_notes.svg' ruta="/announcements" />
                    <Mboton name='Comunicación' url='https://www.systemuicons.com/images/icons/mail.svg' ruta="/communication" />
                    <Mboton name='Rendimiento' url='https://www.systemuicons.com/images/icons/star.svg' ruta="/performance" />

                    <Separator />
                </>
            )}

            <Mboton name='Cerrar Sesión' url='https://www.systemuicons.com/images/icons/exit_left.svg' ruta="/logout" />

        </article>
    );
}
