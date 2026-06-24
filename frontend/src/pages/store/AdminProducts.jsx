/**
 * AdminProducts.jsx
 * Simple product management panel for the store owner.
 * Accessible at /gestion-productos — uses the existing admin API with JWT.
 * The owner logs in via the normal /login route first; token is reused here.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Save, ArrowLeft, Lock } from 'lucide-react';

const API = 'http://localhost:5000/api';

const EMPTY_FORM = {
  nombre: '', descripcion: '', precio: '',
  stock: '', imagen: '', categoria_id: '',
};

const AdminProducts = () => {
  const [token] = useState(() => localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // product id being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        fetch(`${API}/products`, { headers }).then((r) => r.json()),
        fetch(`${API}/categories`, { headers }).then((r) => r.json()),
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
    } catch {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  if (!token) {
    return (
      <div style={{
        minHeight: '70vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-main)',
      }}>
        <Lock size={48} color="var(--text-muted)" strokeWidth={1.5} />
        <h2 style={{ color: 'var(--dark-chocolate)' }}>Acceso restringido</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Este panel es solo para administradores. Inicia sesión con tu cuenta de administrador.
        </p>
        <a href="/admin/login" style={{
          background: 'var(--primary-pink)', color: 'var(--dark-chocolate)',
          fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '10px',
          textDecoration: 'none',
        }}>
          Ir al login →
        </a>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setSuccess('');
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: String(product.precio),
      stock: String(product.stock),
      imagen: product.imagen || '',
      categoria_id: String(product.categoria_id || ''),
    });
    setError('');
    setSuccess('');
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`${API}/products/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSuccess(`"${nombre}" eliminado.`);
      fetchData();
    } catch (err) {
      setError(err.message || 'Error al eliminar.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.stock) {
      setError('Nombre, precio y stock son obligatorios.');
      return;
    }
    setError('');
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      imagen: form.imagen || null,
      categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
    };

    try {
      const url = editing ? `${API}/products/${editing}` : `${API}/products`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(editing ? 'Producto actualizado.' : 'Producto creado.');
      setShowForm(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      setError(err.message || 'Error al guardar.');
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '0.65rem 0.875rem',
    borderRadius: '8px', border: '2px solid var(--border-color)',
    fontSize: '0.9rem', outline: 'none',
    fontFamily: 'var(--font-main)', background: 'var(--bg-cream)',
    color: 'var(--text-main)', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Volver a la tienda
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--dark-chocolate)', fontWeight: 800 }}>
            Gestión de Productos
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Panel de administración rápida
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--dark-chocolate)', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '0.75rem 1.25rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-main)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-pink-hover)'; e.currentTarget.style.color = 'var(--dark-chocolate)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--dark-chocolate)'; e.currentTarget.style.color = 'white'; }}
        >
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: '#FFEBEE', border: '1px solid var(--error)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#C62828', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#E8F5E9', border: '1px solid var(--success)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#2E7D32', marginBottom: '1rem', fontSize: '0.875rem' }}>
          ✅ {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div ref={formRef} style={{
          background: 'white', borderRadius: '16px',
          border: '2px solid var(--primary-pink)',
          padding: '1.75rem', marginBottom: '2rem',
          boxShadow: '0 8px 30px var(--shadow-color)',
          animation: 'scaleIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--dark-chocolate)', fontWeight: 700 }}>
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>Nombre *</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>Precio *</label>
                <input type="number" step="0.01" min="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>Stock *</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>Categoría</label>
                <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre_categoria}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>Descripción</label>
                <textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  URL de imagen <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(pega aquí la URL de tu imagen)</span>
                </label>
                <input type="url" placeholder="https://ejemplo.com/mi-imagen.jpg" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                {form.imagen && (
                  <img src={form.imagen} alt="preview" style={{ marginTop: '0.5rem', height: 60, borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    onError={(e) => e.target.style.display = 'none'} />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{
                padding: '0.65rem 1.25rem', border: '2px solid var(--border-color)',
                background: 'transparent', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontFamily: 'var(--font-main)', color: 'var(--text-muted)',
              }}>
                Cancelar
              </button>
              <button type="submit" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.65rem 1.25rem', background: 'var(--primary-pink)',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 700, fontFamily: 'var(--font-main)', color: 'var(--dark-chocolate)',
              }}>
                <Save size={16} /> {editing ? 'Actualizar' : 'Crear producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando...</div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '14px', border: '2px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ background: 'var(--primary-pink-light)' }}>
                {['Imagen', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)', borderBottom: '2px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-pink-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <img
                      src={p.imagen || 'https://placehold.co/48x48/F8BBD0/5D4037?text=🎂'}
                      alt={p.nombre}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/48x48/F8BBD0/5D4037?text=🎂'; }}
                    />
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark-chocolate)' }}>{p.nombre}</p>
                    {p.descripcion && (
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.descripcion}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {p.nombre_categoria || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--primary-pink-hover)' }}>
                    ${Number(p.precio).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700,
                      background: p.stock === 0 ? '#FFEBEE' : p.stock <= 5 ? '#FFF3E0' : '#E8F5E9',
                      color: p.stock === 0 ? '#C62828' : p.stock <= 5 ? '#E65100' : '#2E7D32',
                    }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => openEdit(p)} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)',
                        background: 'white', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)',
                        transition: 'all 0.2s', fontFamily: 'var(--font-main)',
                      }}>
                        <Edit2 size={12} /> Editar
                      </button>
                      <button onClick={() => handleDelete(p.id, p.nombre)} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '0.4rem 0.75rem', border: '1px solid var(--error)',
                        background: '#FFEBEE', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600, color: '#C62828',
                        transition: 'all 0.2s', fontFamily: 'var(--font-main)',
                      }}>
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              No hay productos. Crea el primero haciendo clic en "Nuevo producto".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
