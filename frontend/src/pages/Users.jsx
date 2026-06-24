import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Edit2, Trash2, Shield, User, Mail, X } from 'lucide-react';

const Users = () => {
  const { apiFetch, user: currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  
  // Form fields
  const [userId, setUserId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('Empleado');

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/users');
      setUsers(data);
    } catch (err) {
      showToast('Error al cargar la lista de usuarios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setUserId(null);
    setNombre('');
    setCorreo('');
    setContrasena('');
    setRol('Empleado');
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setUserId(user.id);
    setNombre(user.nombre);
    setCorreo(user.correo);
    setContrasena(''); // Keep blank unless resetting
    setRol(user.rol);
    setShowModal(true);
  };

  const handleOpenDeleteModal = (user) => {
    if (user.id === currentUser.id) {
      showToast('No puedes eliminar tu propia cuenta.', 'warning');
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !correo || (modalMode === 'create' && !contrasena)) {
      showToast('Por favor, complete todos los campos obligatorios.', 'warning');
      return;
    }

    try {
      const payload = { nombre, correo, rol };
      if (contrasena) payload.contrasena = contrasena;

      if (modalMode === 'create') {
        await apiFetch('/users', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Usuario creado exitosamente.', 'success');
      } else {
        await apiFetch(`/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Usuario actualizado exitosamente.', 'success');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Error al procesar la solicitud.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await apiFetch(`/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      showToast('Usuario eliminado exitosamente.', 'success');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el usuario.', 'error');
    }
  };

  return (
    <div className="users-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">Administra los accesos y roles de tus empleados</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </header>

      {loading ? (
        <div className="loading-spinner">Cargando personal...</div>
      ) : (
        <div className="card table-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo Electrónico</th>
                  <th>Rol</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={u.id === currentUser.id ? 'current-user-row' : ''}>
                    <td>{u.id}</td>
                    <td className="user-name-cell">
                      <div className="avatar-small">{u.nombre.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{u.nombre}</strong>
                        {u.id === currentUser.id && <span className="label-you"> (Tú)</span>}
                      </div>
                    </td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`badge ${u.rol === 'Administrador' ? 'badge-warning' : 'badge-success'}`}>
                        <Shield size={12} style={{ marginRight: '4px' }} />
                        {u.rol}
                      </span>
                    </td>
                    <td>{new Date(u.fecha_creacion).toLocaleDateString('es-ES')}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-secondary btn-icon" onClick={() => handleOpenEditModal(u)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleOpenDeleteModal(u)} 
                          title="Eliminar"
                          disabled={u.id === currentUser.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2 className="pixel-text">{modalMode === 'create' ? 'Agregar Usuario' : 'Editar Usuario'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
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
                    placeholder="juan@sweetheaven.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contraseña {modalMode === 'edit' && <span className="text-muted" style={{ fontWeight: 'normal' }}>(Dejar en blanco para conservar la actual)</span>}
                </label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" style={{ opacity: 0 }} /> {/* spacer */}
                  <input
                    type="password"
                    className="form-control"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder={modalMode === 'create' ? 'Mínimo 6 caracteres' : 'Nueva contraseña'}
                    required={modalMode === 'create'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rol del Sistema</label>
                <select className="form-control" value={rol} onChange={(e) => setRol(e.target.value)}>
                  <option value="Empleado">Empleado (Ventas y Clientes)</option>
                  <option value="Administrador">Administrador (Acceso Total)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
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
              <AlertTriangle size={40} color="var(--error)" />
              <h3 className="pixel-text" style={{ color: 'var(--error)' }}>¿Confirmar Eliminación?</h3>
            </div>
            <p className="delete-warning-text">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>? Esta acción no se puede deshacer y revocará sus accesos de inmediato.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar Usuario</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .users-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .table-card {
          padding: 1rem !important;
        }

        .user-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary-pink-light);
          color: var(--primary-pink-hover);
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }

        .label-you {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .current-user-row {
          background-color: var(--primary-pink-light);
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          padding: 0.5rem !important;
          border-radius: var(--border-radius-sm);
        }

        /* Modal styling helper */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px dashed var(--border-color);
          padding-bottom: 0.75rem;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
        }

        .close-btn:hover {
          color: var(--error);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-with-icon {
          position: relative;
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

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
          border-top: 2px dashed var(--border-color);
          padding-top: 1rem;
        }

        /* Delete warnings */
        .delete-modal {
          max-width: 450px !important;
          text-align: center;
        }

        .delete-warning-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .delete-warning-text {
          margin-bottom: 1.5rem;
          color: var(--text-main);
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default Users;
