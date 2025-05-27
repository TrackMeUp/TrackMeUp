import { Separator } from "./Separator";

export function Articulo({ titulo, entradas = [] }) {
    return (
        <article className="a">
            <h1 className="a-titulo">{titulo}</h1>
            {entradas.map((entrada, index) => (
                <div key={index}>
                    <div className="detalle">
                        <div className="a-texto"><b>{entrada.texto}</b></div>
                        <div className="a-info">{entrada.info}</div>
                    </div>
                {index !== entradas.length - 1 && <Separator />}
                </div>
            ))}
        </article>
    );
}

