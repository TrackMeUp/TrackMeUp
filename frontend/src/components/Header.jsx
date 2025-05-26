// CABECERA

import logo from '../assets/Logo.png';

export function Header({ onToggleMenu }) {
    return (
        <header className="c">
            <div className="c-contenedor">
                <button className="hamburger" onClick={onToggleMenu}>
                    ☰
                </button>
                <a href="/">
                    <img className='c-logo' alt="logo" src={logo} />
                </a>
            </div>
        </header>
    );
}
