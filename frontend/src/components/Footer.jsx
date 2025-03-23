import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from '../assets/Logo.png'; 

export default function Footer() {
  return (
    <footer className="c">
      <div className="c-contenedor flex flex-col md:flex-row justify-between items-center p-4">
        <p className="text-sm mb-2 md:mb-0 text-gray-600">© 2025 TrackMeUp. Todos los derechos reservados.</p>

        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-500">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-sky-400">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-400">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}
