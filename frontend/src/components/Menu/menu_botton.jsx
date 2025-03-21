export function Mboton({ name, url }) {
    return (
        <button className="m-opcion">
            <img 
            className='m-icono'
            alt={name} src={url}/>
        <strong className='m-pagina'>{name}</strong>
    
        </button>
)
}