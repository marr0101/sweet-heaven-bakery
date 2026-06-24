import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  TrendingUp, 
  ClipboardCheck, 
  FileDown, 
  Calendar, 
  AlertTriangle, 
  DollarSign,
  PackageCheck,
  PackageX
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const Reports = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  const [reportType, setReportType] = useState('sales'); // 'sales' | 'inventory'
  const [salesRange, setSalesRange] = useState('mes'); // 'dia' | 'semana' | 'mes'
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [reportType, salesRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'sales') {
        const data = await apiFetch(`/reports/sales?range=${salesRange}`);
        setSalesData(data);
      } else {
        const data = await apiFetch('/reports/inventory');
        setInventoryData(data);
      }
    } catch (err) {
      showToast('Error al cargar reportes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportSalesPDF = () => {
    if (!salesData) return;
    
    const doc = new jsPDF();
    doc.setTextColor('#5D4037');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    
    doc.text('SWEET HEAVEN BAKERY - REPORTE DE VENTAS', 15, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Rango del Reporte: ${salesRange.toUpperCase()}`, 15, 26);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleString()}`, 15, 31);
    doc.line(15, 35, 195, 35);

    // Totals Summary
    const totalRev = salesData.salesHistory.reduce((acc, curr) => acc + curr.total, 0);
    const totalTrs = salesData.salesHistory.reduce((acc, curr) => acc + curr.count, 0);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('RESUMEN DE FACTURACIÓN', 15, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Ingresos Totales en Período: $${totalRev.toFixed(2)}`, 15, 52);
    doc.text(`Total Transacciones Realizadas: ${totalTrs}`, 15, 58);
    doc.text(`Promedio de Venta por Transacción: $${(totalTrs > 0 ? totalRev / totalTrs : 0).toFixed(2)}`, 15, 64);
    
    // Top Products
    doc.setFont('helvetica', 'bold');
    doc.text('TOP PRODUCTOS MÁS VENDIDOS', 15, 76);
    doc.setFont('helvetica', 'normal');
    let y = 84;
    doc.text('Producto', 15, y);
    doc.text('Unidades Vendidas', 110, y);
    doc.text('Total Recaudado', 160, y);
    doc.line(15, y + 2, 195, y + 2);
    
    y += 8;
    salesData.bestSellers.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.nombre}`, 15, y);
      doc.text(`${item.cantidad_vendida} uds`, 110, y);
      doc.text(`$${item.total_recaudado.toFixed(2)}`, 160, y);
      y += 6;
    });

    // History Table
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIAL AGRUPADO DE VENTAS', 15, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    doc.text('Período / Hora / Fecha', 15, y);
    doc.text('Nro. Ventas', 110, y);
    doc.text('Total Recaudado', 160, y);
    doc.line(15, y + 2, 195, y + 2);
    
    y += 8;
    salesData.salesHistory.forEach((hist) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${hist.label}`, 15, y);
      doc.text(`${hist.count} transacciones`, 110, y);
      doc.text(`$${hist.total.toFixed(2)}`, 160, y);
      y += 6;
    });

    doc.save(`Reporte_Ventas_${salesRange}_${Date.now()}.pdf`);
    showToast('Reporte de ventas exportado en PDF.', 'success');
  };

  const exportInventoryPDF = () => {
    if (!inventoryData) return;
    
    const doc = new jsPDF();
    doc.setTextColor('#5D4037');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    
    doc.text('SWEET HEAVEN BAKERY - REPORTE DE INVENTARIO', 15, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleString()}`, 15, 26);
    doc.line(15, 30, 195, 30);

    // Valuation Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('VALORACIÓN DE EXISTENCIAS', 15, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Valor total del inventario en tienda: $${inventoryData.valuation.toFixed(2)}`, 15, 47);
    doc.text(`Productos agotados actualmente: ${inventoryData.outOfStock.length}`, 15, 53);
    doc.text(`Productos con nivel de stock bajo (Alertas): ${inventoryData.lowStock.length}`, 15, 59);
    
    // Out of stock
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCTOS AGOTADOS (STOCK 0)', 15, 70);
    doc.setFont('helvetica', 'normal');
    let y = 78;
    doc.text('ID', 15, y);
    doc.text('Nombre del Producto', 30, y);
    doc.text('Precio Unitario', 120, y);
    doc.text('Categoría', 160, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    if (inventoryData.outOfStock.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.text('No hay productos agotados.', 15, y);
      y += 8;
    } else {
      inventoryData.outOfStock.forEach((p) => {
        doc.text(`#${p.id}`, 15, y);
        doc.text(`${p.nombre}`, 30, y);
        doc.text(`$${p.precio.toFixed(2)}`, 120, y);
        doc.text(`${p.nombre_categoria || 'Sin definir'}`, 160, y);
        y += 6;
      });
    }

    // Low stock
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCTOS CON BAJO STOCK (ALERTA)', 15, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    doc.text('ID', 15, y);
    doc.text('Nombre del Producto', 30, y);
    doc.text('Stock Actual', 120, y);
    doc.text('Stock Mínimo', 160, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    if (inventoryData.lowStock.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.text('No hay productos con alertas de stock.', 15, y);
      y += 8;
    } else {
      inventoryData.lowStock.forEach((p) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`#${p.id}`, 15, y);
        doc.text(`${p.nombre}`, 30, y);
        doc.text(`${p.stock} uds`, 120, y);
        doc.text(`${p.cantidad_minima} uds`, 160, y);
        y += 6;
      });
    }

    doc.save(`Reporte_Inventario_${Date.now()}.pdf`);
    showToast('Reporte de inventario exportado en PDF.', 'success');
  };

  return (
    <div className="reports-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Módulo de Reportes</h1>
          <p className="page-subtitle">Genera análisis contables y de stock, y expórtalos en PDF</p>
        </div>

        <div className="tab-buttons card no-print" style={{ padding: '0.25rem' }}>
          <button 
            className={`tab-btn ${reportType === 'sales' ? 'active' : ''}`}
            onClick={() => setReportType('sales')}
          >
            <TrendingUp size={16} />
            <span>Reporte Ventas</span>
          </button>
          <button 
            className={`tab-btn ${reportType === 'inventory' ? 'active' : ''}`}
            onClick={() => setReportType('inventory')}
          >
            <ClipboardCheck size={16} />
            <span>Reporte Inventario</span>
          </button>
        </div>
      </header>

      {/* Main Reports Area */}
      {loading ? (
        <div className="loading-spinner">Generando reportes contables...</div>
      ) : reportType === 'sales' && salesData ? (
        /* SALES REPORT INTERFACE */
        <div className="report-content-wrapper">
          {/* Controls */}
          <div className="card pos-controls-card no-print" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Calendar size={18} color="var(--text-muted)" />
              <div className="range-pills">
                <button className={`range-pill ${salesRange === 'dia' ? 'active' : ''}`} onClick={() => setSalesRange('dia')}>Hoy</button>
                <button className={`range-pill ${salesRange === 'semana' ? 'active' : ''}`} onClick={() => setSalesRange('semana')}>Semana</button>
                <button className={`range-pill ${salesRange === 'mes' ? 'active' : ''}`} onClick={() => setSalesRange('mes')}>Mes</button>
              </div>
            </div>

            <button className="btn btn-primary" onClick={exportSalesPDF}>
              <FileDown size={16} />
              <span>Exportar PDF</span>
            </button>
          </div>

          {/* Cards metrics */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stats-card card flex-row">
              <div className="stats-icon-wrapper pink-bg"><DollarSign size={24} color="#5D4037" /></div>
              <div>
                <span className="stats-label">Facturación Total</span>
                <h3 className="stats-number">
                  ${salesData.salesHistory.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
                </h3>
              </div>
            </div>
            <div className="stats-card card flex-row">
              <div className="stats-icon-wrapper gold-bg"><TrendingUp size={24} color="#5D4037" /></div>
              <div>
                <span className="stats-label">Nro. Transacciones</span>
                <h3 className="stats-number">
                  {salesData.salesHistory.reduce((acc, curr) => acc + curr.count, 0)}
                </h3>
              </div>
            </div>
            <div className="stats-card card flex-row">
              <div className="stats-icon-wrapper success-bg"><ClipboardCheck size={24} color="#5D4037" /></div>
              <div>
                <span className="stats-label">Ticket Promedio</span>
                <h3 className="stats-number">
                  ${(
                    salesData.salesHistory.reduce((acc, curr) => acc + curr.total, 0) / 
                    (salesData.salesHistory.reduce((acc, curr) => acc + curr.count, 0) || 1)
                  ).toFixed(2)}
                </h3>
              </div>
            </div>
          </div>

          {/* Table history list */}
          <div className="card">
            <h3 className="pixel-text" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Detalle de Períodos Agrupados</h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Fecha / Hora / Período</th>
                    <th>Ventas Realizadas</th>
                    <th>Monto Recaudado</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.salesHistory.map((h, i) => (
                    <tr key={i}>
                      <td><strong>{h.label}</strong></td>
                      <td>{h.count} ventas</td>
                      <td><strong>${h.total.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* INVENTORY REPORT INTERFACE */
        <div className="report-content-wrapper">
          {/* Controls */}
          <div className="card pos-controls-card no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={exportInventoryPDF}>
              <FileDown size={16} />
              <span>Exportar PDF</span>
            </button>
          </div>

          {/* Cards metrics */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stats-card card flex-row">
              <div className="stats-icon-wrapper pink-bg"><DollarSign size={24} color="#5D4037" /></div>
              <div>
                <span className="stats-label font-bold">Valoración Inventario</span>
                <h3 className="stats-number">${inventoryData?.valuation.toFixed(2)}</h3>
              </div>
            </div>
            <div className="stats-card card flex-row">
              <div className="stats-icon-wrapper gold-bg"><PackageX size={24} color="#5D4037" /></div>
              <div>
                <span className="stats-label">Agotados (Stock 0)</span>
                <h3 className="stats-number" style={{ color: inventoryData?.outOfStock.length > 0 ? 'var(--error)' : 'inherit' }}>
                  {inventoryData?.outOfStock.length}
                </h3>
              </div>
            </div>
            <div className="stats-card card flex-row">
              <div className="stats-icon-wrapper warning-bg"><AlertTriangle size={24} color="#5D4037" /></div>
              <div>
                <span className="stats-label">Alertas (Stock Bajo)</span>
                <h3 className="stats-number" style={{ color: inventoryData?.lowStock.length > 0 ? 'var(--warning)' : 'inherit' }}>
                  {inventoryData?.lowStock.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Lists sections */}
          <div className="inventory-report-grid">
            {/* Out of stock list */}
            <div className="card">
              <h3 className="pixel-text" style={{ fontSize: '0.85rem', color: 'var(--error)', marginBottom: '1rem' }}>
                <PackageX size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Productos Agotados
              </h3>
              
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Cod</th>
                      <th>Producto</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData?.outOfStock.length > 0 ? (
                      inventoryData.outOfStock.map(p => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td><strong>{p.nombre}</strong></td>
                          <td>${p.precio.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-data-msg" style={{ textAlign: 'center', padding: '1rem' }}>
                          ¡Felicidades! No hay productos agotados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low stock list */}
            <div className="card">
              <h3 className="pixel-text" style={{ fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '1rem' }}>
                <AlertTriangle size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Alertas de Stock Bajo
              </h3>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Cod</th>
                      <th>Producto</th>
                      <th>Stock / Min</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData?.lowStock.length > 0 ? (
                      inventoryData.lowStock.map(p => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td><strong>{p.nombre}</strong></td>
                          <td><span className="badge badge-warning">{p.stock} / {p.cantidad_minima}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-data-msg" style={{ textAlign: 'center', padding: '1rem' }}>
                          No hay alertas de stock bajo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .reports-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .inventory-report-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 800px) {
          .inventory-report-grid {
            grid-template-columns: 1fr;
          }
        }

        .warning-bg {
          background-color: #FFF3E0;
        }
      `}</style>
    </div>
  );
};

export default Reports;
