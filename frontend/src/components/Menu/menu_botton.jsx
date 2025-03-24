import { Link } from 'react-router-dom';

export function Mboton({ name, url, ruta }) {
    return (
        <Link to={ruta} className="m-opcion">
            <img className='m-icono' alt={name} src={url}/>
            <strong className='m-pagina'>{name}</strong>
        </Link>
)
}