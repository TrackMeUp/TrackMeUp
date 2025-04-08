// PIE DE PÁGINA

//import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from '../assets/Logo.png'; // Si quieres agregar el logo

export function Footer() {
  return (
    <footer className="c-footer bg-light py-4 mt-4">
      <div className="container">
        <div className="row">
          {/* Columna con texto */}
          <div className="col-12 col-md-6 text-center text-md-left mb-4 mb-md-0">
            <p className="text-muted mb-0">© 2025 TrackMeUp. Todos los derechos reservados.</p>
          </div>

          {/*
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark mx-2">
              <FaFacebookF size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark mx-2">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark mx-2">
              <FaInstagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark mx-2">
              <FaLinkedinIn size={24} />
            </a>
          </div>

          */}

        </div>
      </div>
    </footer>
  );
}
