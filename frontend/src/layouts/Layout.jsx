import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  FolderHeart, 
  Cake, 
  ClipboardList, 
  UserSquare2, 
  TrendingUp, 
  LogOut, 
  Sun, 
  Moon, 
  Search,
  Menu,
  X
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const Layout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const menuItems = [
    { name: 'Dashboard',              path: '/admin',                        icon: <LayoutDashboard size={20} />, roles: ['Administrador', 'Empleado'] },
    { name: 'Ventas (POS)',           path: '/admin/ventas',                 icon: <ShoppingBag size={20} />,     roles: ['Administrador', 'Empleado'] },
    { name: 'Clientes',               path: '/admin/clientes',               icon: <Users size={20} />,           roles: ['Administrador', 'Empleado'] },
    { name: 'Inventario',             path: '/admin/inventario',             icon: <ClipboardList size={20} />,   roles: ['Administrador', 'Empleado'] },
    { name: 'Pedidos Personalizados', path: '/admin/pedidos-personalizados', icon: <FolderHeart size={20} />,     roles: ['Administrador', 'Empleado'] },
    { name: 'Categorías',             path: '/admin/categorias',             icon: <FolderHeart size={20} />,     roles: ['Administrador'] },
    { name: 'Productos',              path: '/admin/productos',              icon: <Cake size={20} />,            roles: ['Administrador'] },
    { name: 'Usuarios',               path: '/admin/usuarios',               icon: <UserSquare2 size={20} />,     roles: ['Administrador'] },
    { name: 'Reportes',               path: '/admin/reportes',               icon: <TrendingUp size={20} />,      roles: ['Administrador', 'Empleado'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.rol));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    
    // Simple redirect search based on term
    const term = globalSearch.toLowerCase();
    if (term.includes('vent') || term.includes('sale') || term.includes('fact')) {
      navigate('/admin/ventas');
    } else if (term.includes('client')) {
      navigate('/admin/clientes');
    } else if (term.includes('inven') || term.includes('stock')) {
      navigate('/admin/inventario');
    } else if (term.includes('cat')) {
      navigate('/admin/categorias');
    } else if (term.includes('product') || term.includes('pastel') || term.includes('cake') || term.includes('cupc')) {
      navigate('/admin/productos');
    } else if (term.includes('user') || term.includes('usu')) {
      navigate('/admin/usuarios');
    } else if (term.includes('rep') || term.includes('graf')) {
      navigate('/admin/reportes');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <aside className={`sidebar no-print ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logoImg} alt="Sweet Heaven Bakery Logo" className="sidebar-logo" />
          <h2 className="pixel-text brand-title">Sweet Heaven</h2>
          <p className="brand-subtitle">"Making Every Moment Sweeter"</p>
        </div>

        <nav className="sidebar-nav">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '0.6rem',
            background: 'var(--primary-pink-light)',
            color: 'var(--dark-chocolate)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            textDecoration: 'none', fontWeight: 600,
            fontSize: '0.85rem', marginBottom: '0.75rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-pink)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-pink-light)'}
          >
            🏪 Ver Tienda
          </Link>
          <button onClick={logout} className="btn-logout">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="main-content-wrapper">
        <header className="topbar no-print">
          <div className="topbar-left">
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <form onSubmit={handleSearchSubmit} className="search-form">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscador global (ej. ventas, clientes, stock)..." 
                className="search-input"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </form>
          </div>

          <div className="topbar-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Cambiar Tema">
              {isDarkMode ? <Sun size={20} color="var(--soft-gold)" /> : <Moon size={20} color="var(--dark-chocolate)" />}
            </button>

            <div className="user-profile">
              <div className="user-avatar">
                {user?.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-text">
                <span className="user-name">{user?.nombre}</span>
                <span className="user-role badge badge-success">{user?.rol}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Custom styles inline for layout layout.css matches */}
      <style>{`
        .main-content-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          margin-left: var(--sidebar-width);
          transition: margin-left var(--transition-speed);
        }

        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: var(--sidebar-width);
          background-color: var(--bg-cream-card);
          border-right: 2px solid var(--border-color);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform var(--transition-speed);
        }

        .sidebar-brand {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-bottom: 2px solid var(--border-color);
        }

        .sidebar-logo {
          width: 80px;
          height: auto;
          margin-bottom: 0.75rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          animation: float 4s ease-in-out infinite;
        }

        .brand-title {
          font-size: 0.95rem;
          color: var(--dark-chocolate);
          margin-bottom: 0.25rem;
        }

        .brand-subtitle {
          font-size: 0.7rem;
          font-style: italic;
          color: var(--text-muted);
        }

        .sidebar-nav {
          padding: 1.5rem 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          border-radius: var(--border-radius-md);
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .sidebar-link:hover {
          background-color: var(--primary-pink-light);
          color: var(--primary-pink-hover);
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background-color: var(--primary-pink);
          color: #5D4037;
          font-weight: 700;
          border: 1px solid var(--border-color);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 2px solid var(--border-color);
        }

        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background-color: transparent;
          color: var(--text-muted);
          border: 2px dashed var(--border-color);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background-color: #FFEBEE;
          color: #C62828;
          border-color: #E57373;
        }

        .topbar {
          height: var(--header-height);
          background-color: var(--bg-cream-card);
          border-bottom: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-grow: 0.5;
        }

        .search-form {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.25rem;
          border-radius: 50px;
          border: 2px solid var(--border-color);
          background-color: var(--bg-cream);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--primary-pink);
          background-color: var(--bg-cream-card);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--dark-chocolate);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .theme-toggle-btn {
          background-color: var(--bg-cream);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          transform: scale(1.05);
          background-color: var(--primary-pink-light);
          border-color: var(--primary-pink);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-left: 2px solid var(--border-color);
          padding-left: 1.5rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-pink);
          color: #5D4037;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          border: 2px solid var(--border-color);
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .user-role {
          font-size: 0.7rem;
          padding: 0.05rem 0.5rem;
        }

        @media (max-width: 1024px) {
          .main-content-wrapper {
            margin-left: 0;
            padding-top: var(--header-height);
          }
          
          .sidebar {
            transform: translateX(-100%);
            top: var(--header-height);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .mobile-toggle {
            display: block;
          }

          .topbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--header-height);
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
