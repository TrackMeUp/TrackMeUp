import logo from '../assets/Logo.png';

export function Header() {
    return (
        <header className="c">
            <div className="c-contenedor">
                <a href="index.html">
                    <img className='c-logo' alt="logo" src={logo}/>
                </a>
            </div>
        </header>
    )
}