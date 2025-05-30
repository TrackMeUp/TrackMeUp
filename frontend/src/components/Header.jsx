// CABECERA

import logo from '../assets/TrackMeUp.svg'; // Importa la imagen del logo

export function Header() {
    return (
        <header className="c">
            <div className="c-contenedor">
                <a href="/">
                    <img className='c-logo' alt="logo" src={logo} />
                </a>
            </div>
        </header>
    )
}
