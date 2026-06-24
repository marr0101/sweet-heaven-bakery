import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FolderPlus, Trash2, Tag, AlertTriangle } from 'lucide-react';

const Categories = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Category form field
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/categories');
      setCategories(data);
    } catch (err) {
      showToast('Error al cargar las categorías.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast('Por favor ingrese un nombre de categoría válido.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify({ nombre_categoria: newCategoryName.trim() })
      });
      showToast(`Categoría "${newCategoryName}" creada exitosamente.`, 'success');
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Error al crear la categoría.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (cat) => {
    setCategoryToDelete(cat);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await apiFetch(`/categories/${categoryToDelete.id}`, {
        method: 'DELETE'
      });
      showToast(`Categoría "${categoryToDelete.nombre_categoria}" eliminada exitosamente.`, 'success');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Error al eliminar la categoría.', 'error');
    }
  };

  return (
    <div className="categories-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Gestión de Categorías</h1>
          <p className="page-subtitle">Organiza tus postres y dulces en secciones y menús</p>
        </div>
      </header>

      <div className="categories-layout">
        {/* Left Side: Create form */}
        <div className="card create-category-card">
          <h3 className="pixel-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            <FolderPlus size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 
            Nueva Categoría
          </h3>
          
          <form onSubmit={handleCreateSubmit} className="category-form">
            <div className="form-group">
              <label className="form-label">Nombre de Categoría</label>
              <input
                type="text"
                placeholder="Ej. Cupcakes, Cheesecakes"
                className="form-control"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              <span>{submitting ? 'Creando...' : 'Crear Categoría'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: List categories */}
        <div className="card list-categories-card">
          <h3 className="pixel-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            <Tag size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Categorías Registradas
          </h3>

          {loading ? (
            <div className="loading-spinner">Cargando catálogo...</div>
          ) : categories.length > 0 ? (
            <div className="categories-grid-list">
              {categories.map((cat) => (
                <div key={cat.id} className="category-pill-card">
                  <div className="cat-pill-info">
                    <span className="cat-symbol">🍰</span>
                    <strong>{cat.nombre_categoria}</strong>
                  </div>
                  <button 
                    className="btn btn-danger btn-icon btn-small-del"
                    onClick={() => handleOpenDeleteModal(cat)}
                    title="Eliminar Categoría"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-msg" style={{ padding: '2rem', textAlign: 'center' }}>
              No hay categorías registradas. Comienza agregando una en el panel izquierdo.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content card delete-modal">
            <div className="delete-warning-header">
              <AlertTriangle size={40} color="var(--error)" />
              <h3 className="pixel-text" style={{ color: 'var(--error)' }}>¿Eliminar Categoría?</h3>
            </div>
            <p className="delete-warning-text">
              ¿Estás seguro de que deseas eliminar la categoría <strong>{categoryToDelete?.nombre_categoria}</strong>?
              <br /><br />
              <strong style={{ color: 'var(--error)' }}>Importante:</strong> Los productos asignados a esta categoría NO se eliminarán, pero pasarán a tener categoría <em>"Sin definir"</em>.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setCategoryToDelete(null); }}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar Categoría</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .categories-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .categories-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 800px) {
          .categories-layout {
            grid-template-columns: 1fr;
          }
        }

        .category-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .categories-grid-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .category-pill-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-cream);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
        }

        .category-pill-card:hover {
          border-color: var(--primary-pink);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow-color);
        }

        .cat-pill-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .cat-symbol {
          font-size: 1.1rem;
        }

        .btn-small-del {
          padding: 0.4rem !important;
          border-radius: var(--border-radius-sm);
        }
      `}</style>
    </div>
  );
};

export default Categories;
