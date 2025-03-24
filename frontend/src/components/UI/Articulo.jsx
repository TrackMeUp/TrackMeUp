import { Separator } from "./Separator";

export function Articulo({ titulo, entradas = [] }) {
    return (
        <article className="a">
            <h1 className="a-titulo">{titulo}</h1>
            {entradas.map((entrada, index) => (
                <div key={index} className="detalle">
                    <p className="a-texto">{entrada.texto}</p>
                    <p className="a-info">{entrada.info}</p>
                </div>
            ))}
            <Separator />
        </article>
    );
}

