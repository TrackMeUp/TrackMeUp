import { Separator } from './UI/Separator'
import { UserProfile } from './Menu/UserProfile'
import { Mboton } from './Menu/menu_botton'

export function Menu() {
    return (
    <article className="m-contenedor">

    <UserProfile name='USUARIO' avatarUrl='https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png' />

    <Separator />
    <Mboton name='Login' url='https://www.systemuicons.com/images/icons/mail.svg' ruta="/login"/>
    <Separator />

    <Mboton name='Inicio' url='https://www.systemuicons.com/images/icons/list.svg' ruta="/" />
    <Mboton name='Perfil' url='https://www.systemuicons.com/images/icons/user_male.svg' ruta="/profile"/>
    <Mboton name='Información académica' url='https://www.systemuicons.com/images/icons/bookmark_book.svg' ruta="/academic_info"/>
    <Mboton name='Calendario' url='https://www.systemuicons.com/images/icons/calendar_date.svg' ruta="/calendar"/>

    <Separator />

    <Mboton name='Actividades' url='https://www.systemuicons.com/images/icons/clock.svg' ruta="/activities"/>
    <Mboton name='Rendimiento' url='https://www.systemuicons.com/images/icons/star.svg' ruta="/performance"/>
    <Mboton name='Comunicación' url='https://www.systemuicons.com/images/icons/mail.svg' ruta="/communication"/>

    <Separator />

    <Mboton name='Tablón de anuncios' url='https://www.systemuicons.com/images/icons/clipboard_notes.svg' ruta="/announcements"/>
    <Mboton name='Notificaciones' url='https://www.systemuicons.com/images/icons/bell.svg' ruta="/notice_board"/>
    <Mboton name='Cerrar Sesión' url='https://www.systemuicons.com/images/icons/exit_left.svg' ruta="/logout"/>
    </article>
)
}