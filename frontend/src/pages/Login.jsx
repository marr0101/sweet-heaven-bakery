import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/logo.png';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      showToast('Por favor, complete todos los campos.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(correo, contrasena);
      showToast('¡Sesión iniciada con éxito!', 'success');
      navigate('/admin');
    } catch (err) {
      showToast(err.message || 'Credenciales incorrectas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <img src={logoImg} alt="Sweet Heaven Bakery Logo" className="login-logo" />
          <h1 className="pixel-text login-title">SWEET HEAVEN</h1>
          <p className="login-subtitle">"Making Every Moment Sweeter"</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="correo">Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="correo"
                type="email"
                placeholder="ejemplo@sweetheaven.com"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contrasena">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="contrasena"
                type="password"
                placeholder="••••••••"
                className="form-control"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Iniciando sesión...' : 'Ingresar'}</span>
          </button>
        </form>

        <div className="login-hints">
          <p><strong>Cuentas por defecto:</strong></p>
          <p>Admin: <code>admin@sweetheaven.com</code> / <code>admin123</code></p>
          <p>Ventas: <code>empleado@sweetheaven.com</code> / <code>empleado123</code></p>
        </div>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--bg-cream);
          padding: 1.5rem;
        }

        .login-card {
          max-width: 440px;
          width: 100%;
          border-width: 3px !important;
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo {
          width: 100px;
          height: auto;
          margin-bottom: 0.75rem;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.1));
        }

        .login-title {
          font-size: 1.25rem;
          color: var(--dark-chocolate);
          margin-bottom: 0.25rem;
        }

        .login-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-with-icon {
          position: relative;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-with-icon .form-control {
          padding-left: 2.5rem;
        }

        .login-btn {
          margin-top: 1rem;
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
        }

        .login-hints {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background-color: var(--primary-pink-light);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
        }

        .login-hints code {
          background-color: var(--bg-cream-card);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          color: var(--dark-chocolate);
          font-family: monospace;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Login;
