import { Separator } from './UI/Separator'
import { UserProfile } from '../UserProfile'
import { Mboton } from './UI/Mboton'

export function Menu() {
    return (
        <>
    <article className="m-contenedor">

    <UserProfile name='USUARIO' avatarUrl='https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png' />

    <Mboton name='Inicio' url='https://www.systemuicons.com/images/icons/list.svg' />
    <Mboton name='Perfil' url='https://www.systemuicons.com/images/icons/user_male.svg' />
    <Mboton name='Información académica' url='https://www.systemuicons.com/images/icons/bookmark_book.svg' />
    <Mboton name='Calendario' url='https://www.systemuicons.com/images/icons/calendar_date.svg' />

    <Separator />

    <Mboton name='Actividades' url='https://www.systemuicons.com/images/icons/clock.svg' />
    <Mboton name='Rendimiento' url='https://www.systemuicons.com/images/icons/star.svg' />
    <Mboton name='Comunicación' url='https://www.systemuicons.com/images/icons/mail.svg' />

    <Separator />

    <Mboton name='Tablón de anuncios' url='https://www.systemuicons.com/images/icons/clipboard_notes.svg' />
    <Mboton name='Notificaciones' url='https://www.systemuicons.com/images/icons/bell.svg' />
    <Mboton name='Cerrar Sesión' url='https://www.systemuicons.com/images/icons/exit_left.svg' />
    </article>
    </>
)
}