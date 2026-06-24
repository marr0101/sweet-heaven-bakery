import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  DollarSign, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // For charts
  const [salesHistory, setSalesHistory] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [reportRange, setReportRange] = useState('semana'); // 'dia', 'semana', 'mes'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [reportRange]);

  const fetchDashboardData = async () => {
    try {
      const data = await apiFetch('/reports/dashboard');
      setStats(data);
    } catch (err) {
      showToast('Error al cargar datos del dashboard.', 'error');
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/reports/sales?range=${reportRange}`);
      setSalesHistory(data.salesHistory || []);
      setTopProducts(data.bestSellers || []);
    } catch (err) {
      showToast('Error al cargar gráficos del dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return <div className="loading-spinner">Cargando estadísticas...</div>;
  }

  // Calculate SVG dimensions for the sales line chart
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 30;

  const getLineChartPoints = () => {
    if (salesHistory.length === 0) return '';
    const maxVal = Math.max(...salesHistory.map(d => d.total), 10);
    
    return salesHistory.map((d, i) => {
      const x = padding + (i / (salesHistory.length - 1 || 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - (d.total / maxVal) * (svgHeight - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  const getAreaChartPoints = () => {
    const points = getLineChartPoints();
    if (!points) return '';
    const startX = padding;
    const endX = padding + (svgWidth - padding * 2);
    const baseY = svgHeight - padding;
    return `${startX},${baseY} ${points} ${endX},${baseY}`;
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Panel de Control</h1>
          <p className="page-subtitle">Bienvenido al sistema administrativo de Sweet Heaven Bakery</p>
        </div>
        <div className="badge badge-success date-badge">
          <Clock size={14} style={{ marginRight: '4px' }} />
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      {/* Stats Cards Section */}
      <section className="stats-grid">
        <div className="stats-card card flex-row">
          <div className="stats-icon-wrapper pink-bg">
            <DollarSign size={24} color="#5D4037" />
          </div>
          <div>
            <span className="stats-label">Ventas del Día</span>
            <h3 className="stats-number">${stats.salesToday.toFixed(2)}</h3>
          </div>
        </div>

        <div className="stats-card card flex-row">
          <div className="stats-icon-wrapper gold-bg">
            <TrendingUp size={24} color="#5D4037" />
          </div>
          <div>
            <span className="stats-label">Ventas del Mes</span>
            <h3 className="stats-number">${stats.salesMonth.toFixed(2)}</h3>
          </div>
        </div>

        <div className="stats-card card flex-row">
          <div className="stats-icon-wrapper cream-bg">
            <Users size={24} color="#5D4037" />
          </div>
          <div>
            <span className="stats-label">Total de Clientes</span>
            <h3 className="stats-number">{stats.totalClients}</h3>
          </div>
        </div>

        <div className="stats-card card flex-row">
          <div className="stats-icon-wrapper success-bg">
            <Sparkles size={24} color="#5D4037" />
          </div>
          <div>
            <span className="stats-label">Total de Productos</span>
            <h3 className="stats-number">{stats.totalProducts}</h3>
          </div>
        </div>

        <Link to="/inventory" className="stats-card card flex-row link-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`stats-icon-wrapper ${stats.lowStockCount > 0 ? 'danger-bg error-shake' : 'success-bg'}`}>
            <AlertTriangle size={24} color={stats.lowStockCount > 0 ? '#C62828' : '#2E7D32'} />
          </div>
          <div>
            <span className="stats-label">Bajo Stock (Alertas)</span>
            <h3 className="stats-number" style={{ color: stats.lowStockCount > 0 ? 'var(--error)' : 'inherit' }}>
              {stats.lowStockCount}
            </h3>
          </div>
        </Link>
      </section>

      {/* Main Charts & Lists Layout */}
      <div className="dashboard-layout">
        {/* Left Side: Interactive SVG Charts */}
        <div className="dashboard-left card">
          <div className="chart-header">
            <div>
              <h3 className="pixel-text">Reporte Gráfico de Ventas</h3>
              <p className="text-muted">Resumen visual de facturación</p>
            </div>
            <div className="range-pills">
              <button 
                className={`range-pill ${reportRange === 'dia' ? 'active' : ''}`}
                onClick={() => setReportRange('dia')}
              >
                Hoy
              </button>
              <button 
                className={`range-pill ${reportRange === 'semana' ? 'active' : ''}`}
                onClick={() => setReportRange('semana')}
              >
                7 días
              </button>
              <button 
                className={`range-pill ${reportRange === 'mes' ? 'active' : ''}`}
                onClick={() => setReportRange('mes')}
              >
                30 días
              </button>
            </div>
          </div>

          <div className="chart-body">
            {loading ? (
              <div className="chart-loading">Actualizando gráfico...</div>
            ) : salesHistory.length > 0 ? (
              <div className="svg-chart-container">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-line-chart">
                  {/* Grid Lines */}
                  <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1={padding} y1={svgHeight/2} x2={svgWidth - padding} y2={svgHeight/2} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="var(--border-color)" strokeWidth="2" />
                  
                  {/* Fill Gradient Area under line */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-pink)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary-pink)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  <polygon points={getAreaChartPoints()} fill="url(#chartGradient)" />
                  
                  {/* SVG line */}
                  <polyline
                    fill="none"
                    stroke="var(--primary-pink-hover)"
                    strokeWidth="3"
                    points={getLineChartPoints()}
                  />
                  
                  {/* Scatter circles on data points */}
                  {salesHistory.map((d, i) => {
                    const maxVal = Math.max(...salesHistory.map(d => d.total), 10);
                    const x = padding + (i / (salesHistory.length - 1 || 1)) * (svgWidth - padding * 2);
                    const y = svgHeight - padding - (d.total / maxVal) * (svgHeight - padding * 2);
                    return (
                      <g key={i} className="chart-marker">
                        <circle cx={x} cy={y} r="5" fill="var(--bg-cream-card)" stroke="var(--primary-pink-hover)" strokeWidth="3" />
                        <title>{`${d.label}: $${d.total.toFixed(2)}`}</title>
                      </g>
                    );
                  })}
                </svg>

                {/* X Axis labels */}
                <div className="chart-x-labels">
                  <span>{salesHistory[0]?.label}</span>
                  <span>{salesHistory[Math.floor(salesHistory.length / 2)]?.label}</span>
                  <span>{salesHistory[salesHistory.length - 1]?.label}</span>
                </div>
              </div>
            ) : (
              <div className="no-data-msg">No hay registros de ventas en el período seleccionado.</div>
            )}
          </div>

          {/* Top Selling Products */}
          <div className="top-sellers-section">
            <h4 className="pixel-text section-subtitle">Productos Más Vendidos</h4>
            <div className="sellers-bars">
              {topProducts.length > 0 ? (
                topProducts.map((p, idx) => {
                  const maxQty = Math.max(...topProducts.map(x => x.cantidad_vendida), 1);
                  const percentage = (p.cantidad_vendida / maxQty) * 100;
                  return (
                    <div key={idx} className="seller-bar-row">
                      <div className="bar-info">
                        <span className="bar-name">{p.nombre}</span>
                        <span className="bar-val">{p.cantidad_vendida} uds. (${p.total_recaudado.toFixed(2)})</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-data-msg">Cargando top productos...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Lists (Recent Sales, Low Stock Warnings) */}
        <div className="dashboard-right">
          {/* Recent sales */}
          <div className="card list-card-wrapper" style={{ marginBottom: '1.5rem' }}>
            <div className="list-card-header">
              <h3 className="pixel-text"><Clock size={16} /> Últimas Ventas</h3>
              <Link to="/sales" className="view-all-link">POS <ArrowRight size={14} /></Link>
            </div>
            
            <div className="list-items">
              {stats.recentSales.length > 0 ? (
                stats.recentSales.map((sale) => (
                  <div key={sale.id} className="list-item">
                    <div className="item-icon-circle">
                      <ShoppingBag size={18} color="var(--dark-chocolate)" />
                    </div>
                    <div className="item-details">
                      <span className="item-title">Factura #{sale.id}</span>
                      <span className="item-meta">{sale.cliente_nombre} • {new Date(sale.fecha_venta).toLocaleDateString('es-ES')}</span>
                    </div>
                    <span className="item-price">${sale.total.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="no-data-msg">No se han realizado ventas hoy.</div>
              )}
            </div>
          </div>

          {/* Low stock alerts list */}
          <div className="card list-card-wrapper">
            <div className="list-card-header">
              <h3 className="pixel-text" style={{ color: stats.lowStockCount > 0 ? 'var(--error)' : 'inherit' }}>
                <AlertTriangle size={16} /> Alertas de Inventario
              </h3>
              <Link to="/inventory" className="view-all-link">Ver todo <ArrowRight size={14} /></Link>
            </div>

            <div className="list-items">
              {stats.lowStockList.length > 0 ? (
                stats.lowStockList.map((prod) => (
                  <div key={prod.id} className="list-item low-stock-item">
                    <div className="item-details">
                      <span className="item-title">{prod.nombre}</span>
                      <span className="item-meta">Categoría: {prod.nombre_categoria || 'Sin categoría'}</span>
                    </div>
                    <span className="badge badge-danger">Stock: {prod.stock} / {prod.cantidad_minima}</span>
                  </div>
                ))
              ) : (
                <div className="list-item-empty">
                  <span className="badge badge-success">¡Todo en orden! No hay alertas de stock.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 1.5rem;
          color: var(--dark-chocolate);
        }

        .page-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .date-badge {
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .stats-card {
          padding: 1.5rem;
          align-items: center;
          gap: 1.25rem;
        }

        .flex-row {
          display: flex;
          flex-direction: row;
        }

        .link-card {
          cursor: pointer;
        }

        .stats-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--border-color);
        }

        .pink-bg { background-color: var(--primary-pink-light); }
        .gold-bg { background-color: #FFF9C4; }
        .cream-bg { background-color: #FFF3E0; }
        .success-bg { background-color: #E8F5E9; }
        .danger-bg { background-color: #FFEBEE; }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        .error-shake {
          animation: shake 0.5s ease-in-out infinite alternate;
        }

        .stats-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .stats-number {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--dark-chocolate);
          margin-top: 0.25rem;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 1100px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .range-pills {
          display: flex;
          gap: 0.5rem;
          background-color: var(--bg-cream);
          padding: 0.25rem;
          border-radius: 50px;
          border: 1px solid var(--border-color);
        }

        .range-pill {
          background: none;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .range-pill.active {
          background-color: var(--primary-pink);
          color: #5D4037;
        }

        .chart-body {
          height: 220px;
          position: relative;
        }

        .chart-loading, .no-data-msg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-style: italic;
        }

        .svg-chart-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .svg-line-chart {
          width: 100%;
          height: 180px;
          overflow: visible;
        }

        .chart-marker {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .chart-marker:hover circle {
          r: 7;
          fill: var(--primary-pink);
        }

        .chart-x-labels {
          display: flex;
          justify-content: space-between;
          padding: 0 30px;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .top-sellers-section {
          margin-top: 2rem;
          border-top: 2px dashed var(--border-color);
          padding-top: 1.5rem;
        }

        .section-subtitle {
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          color: var(--text-muted);
        }

        .sellers-bars {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .seller-bar-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .bar-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .bar-track {
          width: 100%;
          height: 10px;
          background-color: var(--bg-cream);
          border-radius: 50px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background-color: var(--primary-pink);
          border-radius: 50px;
          transition: width 1s ease-out;
        }

        .list-card-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .list-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px dashed var(--border-color);
          padding-bottom: 0.75rem;
        }

        .list-card-header h3 {
          font-size: 0.95rem;
          color: var(--dark-chocolate);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .view-all-link {
          font-size: 0.8rem;
          text-decoration: none;
          color: var(--primary-pink-hover);
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .list-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .list-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-pink-light);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }

        .item-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .item-title {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .item-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .item-price {
          font-weight: 700;
          color: var(--dark-chocolate);
          font-size: 0.95rem;
        }

        .low-stock-item {
          border-left: 4px solid var(--error);
          padding-left: 0.75rem;
        }

        .list-item-empty {
          text-align: center;
          padding: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
