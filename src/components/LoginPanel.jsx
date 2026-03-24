import React, { useState } from 'react';

export default function LoginPanel({ onLogin }) {
  const [email, setEmail] = useState('cliente@gmail.com');
  const [password, setPassword] = useState('Cliente.2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function quickLogin(demoEmail, demoPassword, role) {
    setEmail(demoEmail);
    setPassword(demoPassword);
  }

  return (
    <section className="login-wrap">
      <div className="login-container">
        <div className="login-branding">
          <div className="brand-icon">✨</div>
          <h2>Essence Boutique</h2>
          <p>Descubre tu fragancia perfecta</p>

          <div className="perfume-showcase">
            <div className="perfume-bottle">
              <div className="bottle-cap"></div>
              <div className="bottle-body"></div>
              <div className="bottle-spray"></div>
            </div>
            <div className="perfume-notes">
              <span className="note top">🌸 Florales</span>
              <span className="note heart">🍊 Cítricos</span>
              <span className="note base">🌿 Orientales</span>
            </div>
          </div>

          <div className="trust-items">
            <div className="trust-item">
              <span className="trust-icon">💎</span>
              <span>Fragancias premium</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <span>Envío express</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>Pagos seguros</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💝</span>
              <span>Regalos personalizados</span>
            </div>
          </div>
        </div>

        <article className="login-card">
          <div className="login-header">
            <h1>Bienvenido</h1>
            <p>Accede a tu cuenta personal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Accediendo...
                </>
              ) : (
                'Acceder a mi cuenta'
              )}
            </button>
          </form>

          <div className="divider">O prueba con una cuenta demo</div>

          <div className="demo-cards">
            <div
              className="demo-card customer"
              onClick={() => quickLogin('cliente@gmail.com', 'Cliente.2026', 'CUSTOMER')}
            >
              <div className="card-role">👩‍💼 Cliente</div>
              <p className="card-email">cliente@gmail.com</p>
              <p className="card-pass">Cliente.2026</p>
              <span className="card-hint">Haz clic para probar</span>
            </div>

            <div
              className="demo-card admin"
              onClick={() => quickLogin('admin@gmail.com', 'Admin.2026', 'INTERNAL')}
            >
              <div className="card-role">👨‍💼 Administrador</div>
              <p className="card-email">admin@gmail.com</p>
              <p className="card-pass">Admin.2026</p>
              <span className="card-hint">Haz clic para probar</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
