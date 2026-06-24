import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ClipboardList, RefreshCw, AlertTriangle, ArrowUpDown, History, Edit, X } from 'lucide-react';

const Inventory = () => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'history'

  // Update Stock Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cantidadActual, setCantidadActual] = useState('');
  const [cantidadMinima, setCantidadMinima] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [updating, setUpdating] = useState(false);

  const isAdmin = user?.rol === 'Administrador';

  useEffect(() => {
    fetchInventoryData();
  }, [activeTab]);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'list') {
        const data = await apiFetch('/inventory');
        setInventory(data);
      } else {
        const data = await apiFetch('/inventory/movements');
        setMovements(data);
      }
    } catch (err) {
      showToast('Error al cargar datos de inventario.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (item) => {
    if (!isAdmin) return; // double check
    setSelectedProduct(item);
    setCantidadActual(item.cantidad_actual.toString());
    setCantidadMinima(item.cantidad_minima.toString());
    setDescripcion('');
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const currentNum = parseInt(cantidadActual);
    const minNum = parseInt(cantidadMinima);

    if (isNaN(currentNum) || isNaN(minNum) || currentNum < 0 || minNum < 0) {
      showToast('Por favor ingrese números enteros válidos.', 'warning');
      return;
    }

    setUpdating(true);
    try {
      await apiFetch(`/inventory/${selectedProduct.producto_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          cantidad_actual: currentNum,
          cantidad_minima: minNum,
          descripcion: descripcion.trim() || 'Ajuste manual de inventario'
        })
      });
      showToast(`Stock de "${selectedProduct.nombre}" actualizado con éxito.`, 'success');
      setShowModal(false);
      fetchInventoryData();
    } catch (err) {
      showToast(err.message || 'Error al actualizar inventario.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStockStatusBadge = (current, min) => {
    if (current === 0) {
      return <span className="badge badge-danger">Agotado</span>;
    } else if (current <= min) {
      return <span className="badge badge-warning">Bajo Stock</span>;
    }
    return <span className="badge badge-success">Normal</span>;
  };

  return (
    <div className="inventory-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Gestión de Inventario</h1>
          <p className="page-subtitle">Monitorea y ajusta las existencias en almacén en tiempo real</p>
        </div>
        
        <div className="tab-buttons card no-print" style={{ padding: '0.25rem' }}>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <ClipboardList size={16} />
            <span>Existencias</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={16} />
            <span>Movimientos</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-spinner">Sincronizando inventario...</div>
      ) : activeTab === 'list' ? (
        /* Inventory Existences List */
        <div className="card table-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cod. Prod</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad Actual</th>
                  <th>Cantidad Mínima</th>
                  <th>Estado</th>
                  <th>Última Actualización</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {inventory.length > 0 ? (
                  inventory.map((item) => (
                    <tr key={item.id} className={item.cantidad_actual <= item.cantidad_minima ? 'low-stock-tr' : ''}>
                      <td>#{item.producto_id}</td>
                      <td><strong>{item.nombre}</strong></td>
                      <td>{item.nombre_categoria || 'Sin definir'}</td>
                      <td>
                        <strong className={item.cantidad_actual <= item.cantidad_minima ? 'text-danger' : ''}>
                          {item.cantidad_actual} uds.
                        </strong>
                      </td>
                      <td>{item.cantidad_minima} uds.</td>
                      <td>{getStockStatusBadge(item.cantidad_actual, item.cantidad_minima)}</td>
                      <td>{new Date(item.fecha_actualizacion).toLocaleString('es-ES')}</td>
                      {isAdmin && (
                        <td>
                          <button 
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleOpenUpdateModal(item)}
                            title="Ajustar Stock"
                          >
                            <Edit size={15} />
                            <span>Ajustar</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="no-data-msg" style={{ padding: '2rem', textAlign: 'center' }}>
                      No hay productos registrados en el inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Inventory Movements History Log */
        <div className="card table-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Fecha de Registro</th>
                  <th>Detalle / Descripción</th>
                </tr>
              </thead>
              <tbody>
                {movements.length > 0 ? (
                  movements.map((mov) => {
                    const isEntrada = mov.tipo_movimiento === 'ENTRADA';
                    const isSalida = mov.tipo_movimiento === 'SALIDA';
                    return (
                      <tr key={mov.id}>
                        <td>#{mov.id}</td>
                        <td><strong>{mov.producto_nombre}</strong></td>
                        <td>
                          <span className={`badge ${isEntrada ? 'badge-success' : isSalida ? 'badge-danger' : 'badge-warning'}`}>
                            {mov.tipo_movimiento}
                          </span>
                        </td>
                        <td>
                          <strong>{isEntrada ? '+' : isSalida ? '-' : ''}{mov.cantidad} uds.</strong>
                        </td>
                        <td>{new Date(mov.fecha).toLocaleString('es-ES')}</td>
                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>{mov.descripcion}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-msg" style={{ padding: '2rem', textAlign: 'center' }}>
                      No se registran movimientos en el historial.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="pixel-text">Ajustar Inventario</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="modal-form">
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--primary-pink-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span className="sub-label">Producto seleccionado:</span>
                <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--dark-chocolate)' }}>{selectedProduct?.nombre}</h3>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Cantidad Actual (Stock)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={cantidadActual}
                    onChange={(e) => setCantidadActual(e.target.value)}
                    required
                    disabled={updating}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mínimo para Alerta</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={cantidadMinima}
                    onChange={(e) => setCantidadMinima(e.target.value)}
                    required
                    disabled={updating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Motivo de la Modificación</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej. Ingreso de lote semanal, merma por descarte, ajuste por auditoría..."
                  required
                  disabled={updating}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={updating}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  <span>{updating ? 'Procesando...' : 'Aplicar Ajuste'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .inventory-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tab-buttons {
          display: flex;
          gap: 0.25rem;
          background-color: var(--bg-cream-card);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: none;
          border: none;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background-color: var(--primary-pink-light);
          color: var(--primary-pink-hover);
        }

        .tab-btn.active {
          background-color: var(--primary-pink);
          color: #5D4037;
        }

        .low-stock-tr {
          background-color: #FFFDE7;
        }

        body.dark-theme .low-stock-tr {
          background-color: #382C15;
        }
      `}</style>
    </div>
  );
};

export default Inventory;
