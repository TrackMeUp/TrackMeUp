export function Editor() {
    return (
      <div className="editor-mensaje">
        <label htmlFor="descripcion">Descripción del mensaje (opcional)</label>
        <div className="barra-herramientas">
          <select>
            <option value="normal">Normal</option>
            <option value="negrita">Negrita</option>
          </select>
          <button><b>B</b></button>
          <button><i>I</i></button>
          <button><s>S</s></button>
        </div>
        <textarea placeholder="Escribir mensaje..." />
        <button className="sendButton">Enviar</button>
      </div>
    );
}
  