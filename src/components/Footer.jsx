import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="layout">
        <div className="footer-content">
          <p>&copy; {currentYear} Essence Boutique. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#">Términos de Servicio</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
}