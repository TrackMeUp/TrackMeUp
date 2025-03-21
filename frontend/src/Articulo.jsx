import { Separator } from "./components/UI/Separator";

export function Articulo ({ titulo, texto, info }) {
    return (
        <article className="a">
            <h1 className="a-titulo">{titulo}</h1>
            <div className="detalle">
                <p className="a-texto">{texto}</p>
                <span className="a-info">{info}</span>
            </div>
            <Separator />
        </article>
    )
}