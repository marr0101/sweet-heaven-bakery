/**
 * StoreLayout.jsx
 * Public-facing store shell: sticky header, nav, floating cart badge,
 * toast notifications, and footer with social links.
 */

import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Search, X, User, LogOut, Menu, Settings } from 'lucide-react';
import logoImg from '../assets/logo.png';
import StoreCart from '../pages/store/StoreCart';
import StoreToast from '../pages/store/StoreToast';

const StoreLayout = () => {
  const { customer, logoutCustomer, cartCount, setCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if there's an admin JWT in localStorage (logged into /login)
  const isAdmin = !!localStorage.getItem('token');

  // Handle anchor links to sections on the home page
  const handleNavClick = (e, path) => {
    if (path.includes('#')) {
      e.preventDefault();
      const id = path.split('#')[1];
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home first then scroll
        navigate('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
      setMobileMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Inicio',               path: '/' },
    { label: 'Productos',            path: '/productos' },
    { label: 'Pedido Personalizado', path: '/#pedido-personalizado' },
    { label: 'Sobre Nosotros',       path: '/nosotros' },
    { label: 'Mis Pedidos',          path: '/mis-pedidos' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="store-shell">
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="store-header">
        <div className="store-header-inner">
          {/* Brand */}
          <Link to="/tienda" className="store-brand">
            <img src={logoImg} alt="Sweet Heaven Bakery" className="store-logo" />
            <div className="store-brand-text">
              <span className="store-brand-name">Sweet Heaven</span>
              <span className="store-brand-tagline">Bakery</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="store-nav desktop-only">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path.includes('#') ? '/' : link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`store-nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {/* Admin shortcut — subtle, always visible */}
            {isAdmin ? (
              <Link
                to="/admin"
                className={`store-nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                title="Panel de administración"
              >
                <Settings size={14} />
                Admin
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="store-nav-link admin-link"
                title="Acceso administrador"
              >
                <Settings size={14} />
                Administrador
              </Link>
            )}
          </nav>

          {/* Search + actions */}
          <div className="store-header-actions">
            <form onSubmit={handleSearch} className="store-search-form desktop-only">
              <Search size={16} className="store-search-icon" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="store-search-input"
              />
            </form>

            {/* Customer greeting */}
            {customer ? (
              <div className="store-customer-pill">
                <User size={16} />
                <span className="customer-name-short">
                  {customer.nombre.split(' ')[0]}
                </span>
                <button
                  onClick={logoutCustomer}
                  className="store-logout-btn"
                  title="Cerrar sesión"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/ingresar" className="store-btn-login">
                Ingresar
              </Link>
            )}

            {/* Cart button */}
            <button
              className="store-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Ver carrito"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="store-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="store-mobile-menu">
            <form onSubmit={handleSearch} className="store-search-form mobile">
              <Search size={16} className="store-search-icon" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="store-search-input"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path.includes('#') ? '/' : link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`store-mobile-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {/* Admin link in mobile menu */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="store-mobile-link admin-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚙️ Panel Admin
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="store-mobile-link admin-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔐 Administrador
              </Link>
            )}
            {!customer && (
              <Link
                to="/tienda/ingresar"
                className="store-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ── Page Content ──────────────────────────────────────────── */}
      <main className="store-main">
        <Outlet />
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="store-footer">
        <div className="store-footer-inner">
          <div className="footer-brand">
            <img src={logoImg} alt="Sweet Heaven Bakery" className="footer-logo" />
            <p className="footer-tagline">"Making Every Moment Sweeter"</p>
            <p className="footer-copy">© {new Date().getFullYear()} Sweet Heaven Bakery. Todos los derechos reservados.</p>
          </div>

          <div className="footer-links">
            <h4 className="footer-section-title">Navegación</h4>
            <Link to="/"             className="footer-link">Inicio</Link>
            <Link to="/productos"    className="footer-link">Productos</Link>
            <Link to="/nosotros"     className="footer-link">Sobre Nosotros</Link>
            <Link to="/mis-pedidos"  className="footer-link">Mis Pedidos</Link>
            {isAdmin ? (
              <Link to="/admin" className="footer-link" style={{ color: 'var(--soft-gold)' }}>
                ⚙️ Panel Admin
              </Link>
            ) : (
              <Link to="/admin/login" className="footer-link" style={{ color: 'var(--soft-gold)', opacity: 0.7 }}>
                🔐 Administrador
              </Link>
            )}
          </div>

          <div className="footer-social">
            <h4 className="footer-section-title">Síguenos</h4>
            <div className="social-links">
              <a href="https://instagram.com/sweetheavenbakery" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>@sweetheavenbakery</span>
              </a>
              <a href="https://facebook.com/SweetHeavenBakery" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>/SweetHeavenBakery</span>
              </a>
              <a href="https://tiktok.com/@sweetheavenbakery" target="_blank" rel="noopener noreferrer" className="social-link tiktok">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                <span>@sweetheavenbakery</span>
              </a>
              <a href="https://youtube.com/SweetHeavenBakery" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                <span>/SweetHeavenBakery</span>
              </a>
              <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                <span>+34 600 000 000</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Sliding Cart Drawer ───────────────────────────────────── */}
      <StoreCart />

      {/* ── Toast Notifications ───────────────────────────────────── */}
      <StoreToast />

      <style>{`
        /* ── Shell ─────────────────────────────────────────────────── */
        .store-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-cream);
          font-family: var(--font-main);
        }

        .store-main {
          flex: 1;
        }

        /* ── Header ────────────────────────────────────────────────── */
        .store-header {
          position: sticky;
          top: 0;
          z-index: 200;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 2px solid var(--border-color);
          box-shadow: 0 2px 20px var(--shadow-color);
        }

        .store-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 70px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .store-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .store-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
          animation: float 4s ease-in-out infinite;
        }

        .store-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .store-brand-name {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--dark-chocolate);
        }

        .store-brand-tagline {
          font-size: 0.7rem;
          color: var(--primary-pink-hover);
          font-style: italic;
          letter-spacing: 1px;
        }

        /* ── Desktop Nav ───────────────────────────────────────────── */
        .store-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-grow: 1;
        }

        .store-nav-link {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--border-radius-sm);
          transition: all 0.2s ease;
        }

        .store-nav-link:hover {
          color: var(--dark-chocolate);
          background: var(--primary-pink-light);
        }

        .store-nav-link.active {
          color: var(--dark-chocolate);
          background: var(--primary-pink);
          font-weight: 700;
        }

        /* Admin link — subtle diferenciator */
        .store-nav-link.admin-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--text-muted);
          border: 1px dashed var(--border-color);
          font-size: 0.85rem;
        }

        .store-nav-link.admin-link:hover {
          color: var(--dark-chocolate);
          background: #FFF3E0;
          border-color: var(--soft-gold);
        }

        .store-nav-link.admin-link.active {
          background: var(--soft-gold);
          border-color: var(--soft-gold);
          color: var(--dark-chocolate);
        }

        .admin-mobile-link {
          border-top: 1px dashed var(--border-color) !important;
          margin-top: 0.25rem !important;
          padding-top: 0.875rem !important;
          color: var(--text-muted) !important;
        }

        /* ── Header Actions ────────────────────────────────────────── */
        .store-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: auto;
        }

        .store-search-form {
          position: relative;
          display: flex;
          align-items: center;
        }

        .store-search-form.mobile {
          width: 100%;
          margin-bottom: 0.5rem;
        }

        .store-search-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .store-search-input {
          padding: 0.45rem 1rem 0.45rem 2rem;
          border-radius: 50px;
          border: 2px solid var(--border-color);
          background: var(--bg-cream);
          font-size: 0.875rem;
          width: 180px;
          outline: none;
          transition: all 0.2s ease;
          color: var(--text-main);
        }

        .store-search-input:focus {
          width: 220px;
          border-color: var(--primary-pink);
          background: white;
        }

        .store-customer-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--primary-pink-light);
          border: 1px solid var(--border-color);
          border-radius: 50px;
          padding: 0.3rem 0.6rem 0.3rem 0.75rem;
          color: var(--dark-chocolate);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .store-logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 50%;
          transition: color 0.2s;
        }

        .store-logout-btn:hover { color: var(--error); }

        .store-btn-login {
          text-decoration: none;
          background: var(--primary-pink);
          color: var(--dark-chocolate);
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.45rem 1rem;
          border-radius: var(--border-radius-sm);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .store-btn-login:hover {
          background: var(--primary-pink-hover);
          transform: translateY(-1px);
        }

        .store-cart-btn {
          position: relative;
          background: var(--dark-chocolate);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .store-cart-btn:hover {
          background: var(--primary-pink-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244,143,177,0.4);
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--soft-gold);
          color: var(--dark-chocolate);
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 2px solid white;
          animation: scaleIn 0.2s ease;
        }

        .store-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--dark-chocolate);
          cursor: pointer;
          padding: 4px;
        }

        /* ── Mobile Menu ───────────────────────────────────────────── */
        .store-mobile-menu {
          background: white;
          border-top: 1px solid var(--border-color);
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          animation: fadeIn 0.2s ease;
        }

        .store-mobile-link {
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          padding: 0.7rem 0.75rem;
          border-radius: var(--border-radius-sm);
          transition: all 0.2s ease;
        }

        .store-mobile-link:hover,
        .store-mobile-link.active {
          background: var(--primary-pink-light);
          color: var(--dark-chocolate);
        }

        /* ── Footer ────────────────────────────────────────────────── */
        .store-footer {
          background: var(--dark-chocolate);
          color: #FFF8E7;
          padding: 3rem 1.5rem 1.5rem;
        }

        .store-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 3rem;
        }

        .footer-logo {
          width: 60px;
          margin-bottom: 0.75rem;
          filter: brightness(1.2);
        }

        .footer-tagline {
          font-style: italic;
          font-size: 0.9rem;
          color: var(--primary-pink);
          margin-bottom: 0.5rem;
        }

        .footer-copy {
          font-size: 0.78rem;
          color: var(--dark-chocolate-light);
          margin-top: 1rem;
        }

        .footer-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--primary-pink);
          margin-bottom: 1rem;
        }

        .footer-link {
          display: block;
          color: #D7CCC8;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }

        .footer-link:hover { color: var(--primary-pink); }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          color: #D7CCC8;
          font-size: 0.85rem;
          padding: 0.4rem 0;
          transition: color 0.2s;
        }

        .social-link:hover { color: white; }
        .social-link.instagram:hover { color: #E1306C; }
        .social-link.facebook:hover { color: #1877F2; }
        .social-link.tiktok:hover { color: #69C9D0; }
        .social-link.youtube:hover { color: #FF0000; }
        .social-link.whatsapp:hover { color: #25D366; }

        /* ── Responsive ────────────────────────────────────────────── */
        .desktop-only { display: flex; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .store-mobile-toggle { display: flex; }
          .customer-name-short { display: none; }

          .store-footer-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .store-header-inner { padding: 0 1rem; }
          .store-brand-name { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
};

export default StoreLayout;
