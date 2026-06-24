/**
 * StoreCatalog.jsx
 * Main public catalog page — product grid, search, category filters.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Search, ShoppingCart, RefreshCw, Star,
  ChevronDown, Tag, AlertCircle,
} from 'lucide-react';

// ── Placeholder images per category (you can replace URLs later) ──────────
const PLACEHOLDER_IMAGES = {
  'Pasteles': 'https://placehold.co/400x300/F8BBD0/5D4037?text=🎂+Pastel',
  'Cupcakes': 'https://placehold.co/400x300/F48FB1/ffffff?text=🧁+Cupcake',
  'Galletas': 'https://placehold.co/400x300/EEDCC6/5D4037?text=🍪+Galleta',
  'Macarons': 'https://placehold.co/400x300/D4AF37/ffffff?text=🫐+Macaron',
  'Tartas': 'https://placehold.co/400x300/F8BBD0/5D4037?text=🍰+Tarta',
  'Panes': 'https://placehold.co/400x300/FFF8E7/5D4037?text=🍞+Pan',
  'Bebidas': 'https://placehold.co/400x300/64B5F6/ffffff?text=☕+Bebida',
  default: 'https://placehold.co/400x300/F8BBD0/5D4037?text=🎂+Producto',
};

function getPlaceholder(categoryName, productName) {
  if (categoryName && PLACEHOLDER_IMAGES[categoryName]) return PLACEHOLDER_IMAGES[categoryName];
  return PLACEHOLDER_IMAGES.default;
}

// ── ProductCard ───────────────────────────────────────────────────────────
const ProductCard = ({ product, onAdd }) => {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stockStatus = product.stock === 0
    ? { label: 'Sin stock', color: '#E57373', bg: '#FFEBEE' }
    : product.stock <= 5
      ? { label: `¡Solo ${product.stock} left!`, color: '#E65100', bg: '#FFF3E0' }
      : { label: 'Disponible', color: '#2E7D32', bg: '#E8F5E9' };

  const imgSrc = product.imagen || getPlaceholder(product.nombre_categoria, product.nombre);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: '16px',
        border: `2px solid ${hovered ? 'var(--primary-pink)' : 'var(--border-color)'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? '0 16px 40px rgba(244,143,177,0.2)' : '0 4px 15px var(--shadow-color)',
        animation: 'scaleIn 0.3s ease',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-cream)' }}>
        <img
          src={imgSrc}
          alt={product.nombre}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={(e) => {
            e.target.src = getPlaceholder(product.nombre_categoria, product.nombre);
          }}
        />
        {/* Category badge */}
        {product.nombre_categoria && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'rgba(255,255,255,0.92)',
            color: 'var(--dark-chocolate)',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: '50px',
            border: '1px solid var(--border-color)',
          }}>
            {product.nombre_categoria}
          </span>
        )}
        {/* Stock badge */}
        {product.stock <= 5 && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            background: stockStatus.bg, color: stockStatus.color,
            fontSize: '0.65rem', fontWeight: 700,
            padding: '3px 7px', borderRadius: '50px',
          }}>
            {stockStatus.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          margin: '0 0 0.3rem',
          fontSize: '1rem', fontWeight: 700,
          color: 'var(--dark-chocolate)',
          lineHeight: 1.3,
        }}>
          {product.nombre}
        </h3>
        {product.descripcion && (
          <p style={{
            margin: '0 0 0.75rem',
            fontSize: '0.82rem', color: 'var(--text-muted)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.descripcion}
          </p>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-pink-hover)' }}>
            ${Number(product.precio).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 0.875rem',
              background: product.stock === 0 ? '#eee'
                : added ? 'var(--success)'
                  : 'var(--dark-chocolate)',
              color: product.stock === 0 ? 'var(--text-muted)'
                : added ? 'white'
                  : 'white',
              border: 'none', borderRadius: '8px',
              fontWeight: 700, fontSize: '0.82rem',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-main)',
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0 && !added) {
                e.currentTarget.style.background = 'var(--primary-pink-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (product.stock > 0 && !added) {
                e.currentTarget.style.background = 'var(--dark-chocolate)';
              }
            }}
          >
            {product.stock === 0 ? (
              'Sin stock'
            ) : added ? (
              '✓ Agregado'
            ) : (
              <><ShoppingCart size={14} /> Agregar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── StoreCatalog ──────────────────────────────────────────────────────────
const StoreCatalog = () => {
  const {
    products, categories, catalogLoading, catalogError,
    addToCart, customer, fetchCatalog,
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Sync search from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
  }, [searchParams]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val) setSearchParams({ search: val });
    else setSearchParams({});
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => String(p.categoria_id) === selectedCategory);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(s) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(s)) ||
          (p.nombre_categoria && p.nombre_categoria.toLowerCase().includes(s))
      );
    }

    if (sortBy === 'price-asc') list.sort((a, b) => a.precio - b.precio);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.precio - a.precio);
    else if (sortBy === 'name') list.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return list;
  }, [products, selectedCategory, search, sortBy]);

  if (catalogLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', flexDirection: 'column', gap: '1rem',
        color: 'var(--text-muted)', fontFamily: 'var(--font-main)',
      }}>
        <div style={{
          width: 48, height: 48, border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary-pink)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p>Cargando catálogo...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (catalogError) {
    return (
      <div style={{
        maxWidth: 500, margin: '4rem auto', padding: '2rem',
        textAlign: 'center', fontFamily: 'var(--font-main)',
      }}>
        <AlertCircle size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--dark-chocolate)' }}>Error al cargar el catálogo</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{catalogError}</p>
        <button onClick={fetchCatalog} style={{
          background: 'var(--primary-pink)', border: 'none',
          color: 'var(--dark-chocolate)', padding: '0.75rem 1.5rem',
          borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
          fontFamily: 'var(--font-main)', fontSize: '0.95rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <RefreshCw size={16} /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-main)' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-pink-light) 0%, var(--bg-cream) 100%)',
        padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem',
        textAlign: 'center',
        borderBottom: '2px solid var(--border-color)',
      }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <p style={{
            margin: '0 0 0.5rem',
            fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '2px',
            color: 'var(--primary-pink-hover)',
          }}>
            🎂 Pastelería Artesanal
          </p>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: 'var(--dark-chocolate)', fontWeight: 800,
            margin: '0 0 1rem', lineHeight: 1.2,
          }}>
            Nuestro Catálogo
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '0 0 1.75rem', lineHeight: 1.6 }}>
            Productos elaborados con ingredientes premium, amor y mucha creatividad. Elige tu favorito y recíbelo en casa.
          </p>

          {/* Welcome banner if logged in */}
          {customer ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'white', borderRadius: '50px',
              padding: '0.5rem 1.25rem',
              border: '2px solid var(--primary-pink)',
              boxShadow: '0 4px 15px rgba(244,143,177,0.2)',
            }}>
              <span style={{ fontSize: '1rem' }}>👋</span>
              <span style={{ fontWeight: 600, color: 'var(--dark-chocolate)', fontSize: '0.9rem' }}>
                Hola, {customer.nombre}
              </span>
            </div>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              background: 'white', borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              border: '2px solid var(--border-color)',
            }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Para confirmar un pedido,
              </span>
              <Link to="/ingresar" style={{
                color: 'var(--dark-chocolate)', fontWeight: 700,
                fontSize: '0.875rem', textDecoration: 'none',
                background: 'var(--primary-pink)', padding: '0.3rem 0.75rem',
                borderRadius: '6px',
              }}>
                Identificarse →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters + Search ──────────────────────────────────── */}
      <div style={{
        background: 'white', borderBottom: '2px solid var(--border-color)',
        position: 'sticky', top: '70px', zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '180px', maxWidth: '300px' }}>
            <Search size={16} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={handleSearch}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.55rem 1rem 0.55rem 2.25rem',
                borderRadius: '8px', border: '2px solid var(--border-color)',
                fontSize: '0.875rem', outline: 'none',
                fontFamily: 'var(--font-main)', background: 'var(--bg-cream)',
                color: 'var(--text-main)', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary-pink)'; e.target.style.background = 'white'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'var(--bg-cream)'; }}
            />
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '0.45rem 0.875rem', borderRadius: '50px',
                border: `2px solid ${selectedCategory === 'all' ? 'var(--primary-pink)' : 'var(--border-color)'}`,
                background: selectedCategory === 'all' ? 'var(--primary-pink)' : 'transparent',
                color: selectedCategory === 'all' ? 'var(--dark-chocolate)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.2s ease', fontFamily: 'var(--font-main)',
              }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(String(cat.id))}
                style={{
                  padding: '0.45rem 0.875rem', borderRadius: '50px',
                  border: `2px solid ${selectedCategory === String(cat.id) ? 'var(--primary-pink)' : 'var(--border-color)'}`,
                  background: selectedCategory === String(cat.id) ? 'var(--primary-pink)' : 'transparent',
                  color: selectedCategory === String(cat.id) ? 'var(--dark-chocolate)' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'all 0.2s ease', fontFamily: 'var(--font-main)',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                }}
              >
                <Tag size={11} />
                {cat.nombre_categoria}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                appearance: 'none', WebkitAppearance: 'none',
                padding: '0.55rem 2rem 0.55rem 0.875rem',
                border: '2px solid var(--border-color)',
                borderRadius: '8px', fontSize: '0.82rem',
                fontFamily: 'var(--font-main)', color: 'var(--text-main)',
                background: 'var(--bg-cream)', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="default">Ordenar</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A–Z</option>
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute', right: '8px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
              color: 'var(--text-muted)',
            }} />
          </div>

          {/* Count */}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', flexShrink: 0 }}>
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 1rem',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'var(--dark-chocolate)' }}>No se encontraron productos</h3>
            <p>Intenta con otra búsqueda o categoría.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSearchParams({}); }}
              style={{
                marginTop: '1rem', background: 'var(--primary-pink)',
                border: 'none', color: 'var(--dark-chocolate)',
                padding: '0.6rem 1.25rem', borderRadius: '8px',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)',
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
            gap: '1.25rem',
          }}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCatalog;
