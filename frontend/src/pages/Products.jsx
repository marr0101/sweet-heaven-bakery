import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Tag, Archive, Upload, Image as ImageIcon, X } from 'lucide-react';

const Products = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Form Fields
  const [productId, setProductId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(''); // Stores Base64 string or preset symbol
  const [categoriaId, setCategoriaId] = useState('');
  const [cantidadMinima, setCantidadMinima] = useState('5');
  
  // Clipart presets for easy creation
  const imagePresets = [
    { label: 'Pastel de Chocolate', value: '🍰' },
    { label: 'Cupcake Rosa', value: '🧁' },
    { label: 'Galleta de Chispas', value: '🍪' },
    { label: 'Dona Glaseada', value: '🍩' },
    { label: 'Muffin / Panqué', value: '🍞' },
    { label: 'Café / Bebida', value: '☕' },
    { label: 'Postre Helado', value: '🍨' },
    { label: 'Copa Dulce', value: '🥤' }
  ];

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/products');
      setProducts(data);
    } catch (err) {
      showToast('Error al cargar productos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setProductId(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setImagen('🍰'); // Default preset
    setCategoriaId(categories[0]?.id || '');
    setCantidadMinima('5');
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setModalMode('edit');
    setProductId(prod.id);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion || '');
    setPrecio(prod.precio.toString());
    setStock(prod.stock.toString());
    setImagen(prod.imagen || '🍰');
    setCategoriaId(prod.categoria_id || '');
    setCantidadMinima((prod.cantidad_minima || 5).toString());
    setShowModal(true);
  };

  const handleOpenDeleteModal = (prod) => {
    setProductToDelete(prod);
    setShowDeleteModal(true);
  };

  // Convert uploaded image file to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('La imagen es demasiado grande. Máximo 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagen(reader.result);
      showToast('Imagen cargada con éxito.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const priceNum = parseFloat(precio);
    const stockNum = parseInt(stock);
    const minQtyNum = parseInt(cantidadMinima);

    if (!nombre || isNaN(priceNum) || isNaN(stockNum)) {
      showToast('Nombre, precio y stock son obligatorios y deben ser válidos.', 'warning');
      return;
    }

    try {
      const payload = {
        nombre,
        descripcion,
        precio: priceNum,
        stock: stockNum,
        imagen,
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
        cantidad_minima: isNaN(minQtyNum) ? 5 : minQtyNum
      };

      if (modalMode === 'create') {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Producto creado exitosamente.', 'success');
      } else {
        await apiFetch(`/products/${productId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Producto actualizado exitosamente.', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Error al procesar el producto.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await apiFetch(`/products/${productToDelete.id}`, {
        method: 'DELETE'
      });
      showToast('Producto eliminado exitosamente.', 'success');
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el producto.', 'error');
    }
  };

  const filteredProducts = selectedCategoryFilter === 'all' 
    ? products 
    : products.filter(p => p.categoria_id === parseInt(selectedCategoryFilter));

  const renderProductImage = (imgSrc) => {
    if (!imgSrc) return <div className="product-image-fallback">🧁</div>;
    
    // Check if it's base64/url or emoji preset
    if (imgSrc.startsWith('data:') || imgSrc.startsWith('http') || imgSrc.startsWith('/')) {
      return <img src={imgSrc} alt="Producto" className="product-card-img" />;
    }
    
    // Default emoji representation
    return <div className="product-image-fallback">{imgSrc}</div>;
  };

  return (
    <div className="products-page">
      <header className="page-header">
        <div>
          <h1 className="pixel-text page-title">Catálogo de Productos</h1>
          <p className="page-subtitle">Administra los pasteles y postres disponibles para venta</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          <span>Nuevo Producto</span>
        </button>
      </header>

      {/* Categories Filter pills */}
      <section className="filters-section card">
        <div className="filter-pills">
          <button 
            className={`filter-pill ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategoryFilter('all')}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              className={`filter-pill ${selectedCategoryFilter === cat.id.toString() ? 'active' : ''}`}
              onClick={() => setSelectedCategoryFilter(cat.id.toString())}
            >
              {cat.nombre_categoria}
            </button>
          ))}
        </div>
      </section>

      {loading && products.length === 0 ? (
        <div className="loading-spinner">Cargando catálogo de repostería...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
              const isLowStock = p.stock <= (p.cantidad_minima || 5);
              return (
                <div key={p.id} className={`product-card card ${isLowStock ? 'low-stock-border' : ''}`}>
                  <div className="product-card-img-wrapper">
                    {renderProductImage(p.imagen)}
                    <span className="product-card-cat badge badge-success">
                      <Tag size={10} style={{ marginRight: '4px' }} />
                      {p.nombre_categoria || 'Sin definir'}
                    </span>
                    {isLowStock && (
                      <span className="product-card-alert badge badge-danger">
                        Bajo Stock
                      </span>
                    )}
                  </div>
                  
                  <div className="product-card-content">
                    <h3 className="product-card-title">{p.nombre}</h3>
                    <p className="product-card-desc">{p.descripcion || 'Sin descripción disponible.'}</p>
                    
                    <div className="product-card-metrics">
                      <div>
                        <span className="metric-label">Precio</span>
                        <h4 className="metric-value">${p.precio.toFixed(2)}</h4>
                      </div>
                      <div>
                        <span className="metric-label">Stock disponible</span>
                        <h4 className={`metric-value ${isLowStock ? 'text-danger' : ''}`}>{p.stock} uds.</h4>
                      </div>
                    </div>

                    <div className="product-card-actions">
                      <button className="btn btn-secondary btn-icon" onClick={() => handleOpenEditModal(p)}>
                        <Edit2 size={15} />
                        <span>Editar</span>
                      </button>
                      <button className="btn btn-danger btn-icon" onClick={() => handleOpenDeleteModal(p)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-products card">
              <Archive size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
              <h3>Catálogo Vacío</h3>
              <p className="text-muted">No hay productos disponibles en esta categoría.</p>
            </div>
          )}
        </div>
      )}

      {/* Register/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2 className="pixel-text">{modalMode === 'create' ? 'Agregar Producto' : 'Editar Producto'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Red Velvet Cake"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  <select
                    className="form-control"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    required
                  >
                    <option value="">-- Seleccionar --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Detallada</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles sobre ingredientes, tamaño o sabores..."
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Precio Unitario ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Inicial *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Mínimo (Alerta) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={cantidadMinima}
                    onChange={(e) => setCantidadMinima(e.target.value)}
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              {/* Image upload and presets */}
              <div className="image-select-section">
                <label className="form-label">Representación Visual (Imagen o Símbolo)</label>
                
                <div className="image-inputs-flex">
                  <div className="preview-box">
                    {imagen.length <= 4 ? (
                      <span className="preview-emoji">{imagen}</span>
                    ) : (
                      <img src={imagen} alt="Preview" className="preview-uploaded-img" />
                    )}
                  </div>

                  <div className="image-controls">
                    <div className="preset-selector">
                      <span className="sub-label">A. Elegir un emoticón de catálogo rápido:</span>
                      <div className="presets-list">
                        {imagePresets.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            className={`preset-btn ${imagen === preset.value ? 'selected' : ''}`}
                            onClick={() => setImagen(preset.value)}
                            title={preset.label}
                          >
                            {preset.value}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="upload-container">
                      <span className="sub-label">B. O subir una foto personalizada:</span>
                      <label className="upload-btn-label btn btn-secondary">
                        <Upload size={14} />
                        <span>Subir Imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Producto</button>
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
              <h3 className="pixel-text" style={{ color: 'var(--error)' }}>¿Eliminar Producto?</h3>
            </div>
            <p className="delete-warning-text">
              ¿Estás seguro de que deseas eliminar <strong>{productToDelete?.nombre}</strong> del catálogo de repostería? Se borrarán todos los registros asociados en el inventario.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setProductToDelete(null); }}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar Producto</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .products-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .filters-section {
          padding: 0.75rem 1.25rem !important;
        }

        .filter-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-pill {
          background-color: var(--bg-cream);
          border: 1px solid var(--border-color);
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          background-color: var(--primary-pink-light);
          border-color: var(--primary-pink);
        }

        .filter-pill.active {
          background-color: var(--primary-pink);
          border-color: var(--primary-pink);
          color: #5D4037;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .no-products {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .product-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0 !important;
        }

        .low-stock-border {
          border-color: var(--error) !important;
          box-shadow: 0 4px 15px rgba(229, 115, 115, 0.15) !important;
        }

        .product-card-img-wrapper {
          position: relative;
          height: 160px;
          background-color: var(--primary-pink-light);
          border-bottom: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .product-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image-fallback {
          font-size: 4rem;
          user-select: none;
          animation: float 5s ease-in-out infinite;
        }

        .product-card-cat {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 0.75rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .product-card-alert {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.7rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .product-card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex-grow: 1;
        }

        .product-card-title {
          font-size: 1.15rem;
          color: var(--dark-chocolate);
        }

        .product-card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
          height: 38px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-card-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px dashed var(--border-color);
          border-bottom: 1px dashed var(--border-color);
          padding: 0.75rem 0;
          margin-top: 0.25rem;
        }

        .metric-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .metric-value {
          font-size: 1.05rem;
          font-weight: 700;
          margin-top: 0.15rem;
        }

        .text-danger {
          color: var(--error);
        }

        .product-card-actions {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 0.5rem;
          margin-top: auto;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-row-3 {
            grid-template-columns: 1fr;
          }
        }

        /* Image selection styles */
        .image-select-section {
          border-top: 2px dashed var(--border-color);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        .image-inputs-flex {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 500px) {
          .image-inputs-flex {
            flex-direction: column;
          }
        }

        .preview-box {
          width: 90px;
          height: 90px;
          border-radius: var(--border-radius-md);
          background-color: var(--primary-pink-light);
          border: 2px dashed var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .preview-emoji {
          font-size: 2.75rem;
        }

        .preview-uploaded-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-controls {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sub-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .presets-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.25rem;
        }

        .preset-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background-color: var(--bg-cream-card);
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          transform: scale(1.1);
          border-color: var(--primary-pink);
        }

        .preset-btn.selected {
          border-color: var(--primary-pink-hover);
          background-color: var(--primary-pink-light);
          box-shadow: 0 0 0 3px var(--primary-pink-light);
        }

        .upload-container {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .upload-btn-label {
          width: fit-content;
          padding: 0.4rem 1rem !important;
          font-size: 0.85rem !important;
        }
      `}</style>
    </div>
  );
};

export default Products;
