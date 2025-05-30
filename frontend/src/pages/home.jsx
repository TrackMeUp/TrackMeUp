// Página Home

import imagenHome from '../assets/portada_inicio.jpg'; // Importa la imagen de la página Home
import '../styles/home.css'; // Incluye el estilo CSS

export function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">¡Bienvenido a Track Me Up!</h1>
      <p className="home-description">
        <img src='https://www.systemuicons.com/images/icons/book_text.svg' alt="Icono libro"></img>
        Gestor académico online
      </p>

    <div className="home-img-container">
      <img src={imagenHome} alt="Imagen de Inicio" className="home-image" />
    </div>

    </div>
  );
}