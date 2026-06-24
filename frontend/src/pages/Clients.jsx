import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Edit2, Trash2, Search, Phone, Mail, MapPin, X } from 'lucide-react';

const Clients = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'

  // Form fields
  const [clientId, setClientId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/clients?search=${searchQuery}`);
      setClients(data);
    } catch (err) {
      showToast('Error al cargar la lista de clientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setClientId(null);
    setNombre('');
    setApellido('');
    setTelefono('');
    setCorreo('');
    setDireccion('');
    setShowModal(true);
  };

  const handleOpenEditModal = (client) => {
    setModalMode('edit');
    setClientId(client.id);
    setNombre(client.nombre);
    setApellido(client.apellido);
    setTelefono(client.telefono || '');
    setCorreo(client.correo || '');
    setDireccion(client.direccion || '');
    setShowModal(true);
  };

  const handleOpenDeleteModal = (client) => {
    if (client.id === 1) {
      showToast('No se puede eliminar el cliente de Público General.', 'warning');
      return;
    }
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido) {
      showToast('Nombre y Apellido son campos obligatorios.', 'warning');
      return;
    }

    try {
      const payload = { nombre, apellido, telefono, correo, direccion };

      if (modalMode === 'create') {
        await apiFetch('/clients', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Cliente creado exitosamente.', 'success');
      } else {
        await apiFetch(`/clients/${clientId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Cliente actualizado exitosamente.', 'success');
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      showToast(err.message || 'Error al procesar el cliente.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    try {
      await apiFetch(`/clients/${clientToDelete.id}`, {
        method: 'DELETE'
      });
      showToast('Cliente eliminado exitosamente.', 'success');
      setShowDeleteModal(false);
      setClientToDelete(null);
      fetchClients();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el cliente.', 'error');
    }
  };

  return (
    <div className="clients-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Gestión de Clientes</h1>
          <p className="page-subtitle">Registra y administra las cuentas de tus clientes habituales</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <UserPlus size={18} />
          <span>Registrar Cliente</span>
        </button>
      </header>

      {/* Filter and Search controls */}
      <section className="search-bar-section card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, teléfono o correo..."
            className="form-control search-bar-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {loading && clients.length === 0 ? (
        <div className="loading-spinner">Cargando directorio de clientes...</div>
      ) : (
        <div className="card table-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>
                        <strong>{c.nombre} {c.apellido}</strong>
                        {c.id === 1 && <span className="badge badge-success" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>Predeterminado</span>}
                      </td>
                      <td>
                        {c.telefono ? (
                          <span className="contact-link"><Phone size={14} /> {c.telefono}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {c.correo ? (
                          <span className="contact-link"><Mail size={14} /> {c.correo}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {c.direccion ? (
                          <span className="contact-link"><MapPin size={14} /> {c.direccion}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn btn-secondary btn-icon" onClick={() => handleOpenEditModal(c)} title="Editar" disabled={c.id === 1}>
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon" 
                            onClick={() => handleOpenDeleteModal(c)} 
                            title="Eliminar"
                            disabled={c.id === 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-msg" style={{ padding: '2rem', textAlign: 'center' }}>
                      No se encontraron clientes coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2 className="pixel-text">{modalMode === 'create' ? 'Registrar Cliente' : 'Editar Cliente'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Ana"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Ej. Gómez"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. +54 9 11 2345 6789"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      className="form-control"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="ana@correo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dirección Particular</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej. Av. Siempreviva 742"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content card delete-modal">
            <div className="delete-warning-header">
              <Trash2 size={40} color="var(--error)" />
              <h3 className="pixel-text" style={{ color: 'var(--error)' }}>¿Eliminar Cliente?</h3>
            </div>
            <p className="delete-warning-text">
              ¿Estás seguro de que deseas eliminar la ficha del cliente <strong>{clientToDelete?.nombre} {clientToDelete?.apellido}</strong>? Las ventas registradas previamente bajo este cliente no se borrarán, pero se desvinculará su información personal.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setClientToDelete(null); }}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar Cliente</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .clients-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-bar-section {
          padding: 1rem 1.5rem !important;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .search-bar-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar-input {
          padding-left: 2.75rem !important;
          border-radius: 50px !important;
        }

        .table-card {
          padding: 1rem !important;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .contact-link svg {
          color: var(--text-muted);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Clients;
