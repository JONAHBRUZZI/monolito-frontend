import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ session, onLogout }) {
  return (
    <header className="app-header">
      <div className="layout">
        <div className="header-content">
          <Link to="/tienda" className="brand-link">
            <div className="brand-icon">✨</div>
            <h1>Essence Boutique</h1>
          </Link>

          {session && (
            <nav className="app-nav">
              <NavLink to="/tienda" className="nav-link">
                Tienda
              </NavLink>
              {session.role === 'INTERNAL' && (
                <NavLink to="/interno" className="nav-link">
                  Control Interno
                </NavLink>
              )}
            </nav>
          )}

          {session && (
            <div className="user-widget">
              <div className="user-info">
                <span className="user-name">{session.displayName}</span>
                <span className="user-role">{session.role === 'CUSTOMER' ? 'Cliente' : 'Admin'}</span>
              </div>
              <button onClick={onLogout} className="logout-button" title="Cerrar sesión">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}