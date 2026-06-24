/**
 * StoreLogin.jsx
 * Customer identification page — name + email only, no password.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { User, Mail, ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const StoreLogin = () => {
  const { loginCustomer, customer } = useStore();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(null);

  // If already logged in, redirect to store
  if (customer) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setError('Por favor completa tu nombre y correo.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await loginCustomer(nombre.trim(), correo.trim().toLowerCase());
      setHistory(data.history);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.message || 'Error al ingresar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--bg-cream) 0%, var(--primary-pink-light) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-main)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logoImg} alt="Sweet Heaven Bakery" style={{
            width: 80, height: 80, objectFit: 'contain',
            animation: 'float 4s ease-in-out infinite',
            marginBottom: '1rem',
          }} />
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--dark-chocolate)', fontWeight: 800 }}>
            Sweet Heaven Bakery
          </h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            "Making Every Moment Sweeter"
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '18px',
          border: '2px solid var(--border-color)',
          padding: '2rem',
          boxShadow: '0 12px 40px var(--shadow-color)',
          animation: 'scaleIn 0.3s ease',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: 'var(--dark-chocolate)' }}>
            ¡Bienvenido/a! 👋
          </h2>
          <p style={{ margin: '0 0 1.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
           Dinos tu nombre y correo para enviarte la factura de tu pedido.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block', marginBottom: '0.5rem',
                fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)',
              }}>
                Tu nombre *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }} />
                <input
                  type="text"
                  placeholder="Ej: María García"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '10px', border: '2px solid var(--border-color)',
                    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                    background: 'var(--bg-cream)', color: 'var(--text-main)',
                    transition: 'border-color 0.2s',
                    fontFamily: 'var(--font-main)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-pink)'; e.target.style.background = 'white'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'var(--bg-cream)'; }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block', marginBottom: '0.5rem',
                fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)',
              }}>
                Tu correo electrónico *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }} />
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '10px', border: '2px solid var(--border-color)',
                    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                    background: 'var(--bg-cream)', color: 'var(--text-main)',
                    transition: 'border-color 0.2s',
                    fontFamily: 'var(--font-main)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-pink)'; e.target.style.background = 'white'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'var(--bg-cream)'; }}
                />
              </div>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Te enviaremos la factura de tu pedido a este correo.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#FFEBEE', border: '1px solid var(--error)',
                borderRadius: '8px', padding: '0.75rem 1rem',
                color: '#C62828', fontSize: '0.875rem', marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            {/* Success */}
            {history !== null && (
              <div style={{
                background: '#E8F5E9', border: '1px solid var(--success)',
                borderRadius: '8px', padding: '0.75rem 1rem',
                color: '#2E7D32', fontSize: '0.875rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                ✅ ¡Bienvenido/a de vuelta! {history.length > 0 ? `Tienes ${history.length} pedido(s) anteriores.` : 'Redirigiendo...'}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.875rem',
                background: loading ? 'var(--border-color)' : 'var(--primary-pink)',
                color: 'var(--dark-chocolate)', border: 'none',
                borderRadius: '10px', fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-main)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--primary-pink-hover)'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--primary-pink)'; }}
            >
              {loading ? 'Verificando...' : <><span>Ingresar al catálogo</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        {/* Purchase history preview */}
        {history && history.length > 0 && (
          <div style={{
            marginTop: '1.25rem',
            background: 'white',
            borderRadius: '14px',
            border: '2px solid var(--border-color)',
            padding: '1.25rem',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <Clock size={16} color="var(--text-muted)" />
              <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tus últimos pedidos</h3>
            </div>
            {history.map((order) => (
              <div key={order.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.875rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <ShoppingBag size={14} color="var(--primary-pink-hover)" />
                  <span>Pedido #{order.id}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    — {order.num_items} producto{order.num_items !== 1 ? 's' : ''}
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--dark-chocolate)' }}>
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          ¿Eres el administrador?{' '}
          <a href="/login" style={{ color: 'var(--primary-pink-hover)', fontWeight: 600, textDecoration: 'none' }}>
            Panel de administración →
          </a>
        </p>
      </div>
    </div>
  );
};

export default StoreLogin;
