/**
 * MyOrders.jsx
 * Customer order history page.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, STORE_API } from '../../context/StoreContext';
import { ShoppingBag, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const MyOrders = () => {
  const { customer } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!customer) return;
    setLoading(true);
    fetch(`${STORE_API}/orders/${customer.id}`)
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [customer]);

  if (!customer) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-main)',
      }}>
        <ShoppingBag size={52} color="var(--text-muted)" strokeWidth={1.5} />
        <h2 style={{ color: 'var(--dark-chocolate)' }}>Debes identificarte para ver tus pedidos</h2>
        <Link to="/ingresar" style={{
          background: 'var(--primary-pink)', color: 'var(--dark-chocolate)',
          fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none',
        }}>
          Identificarse →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: 'var(--font-main)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--dark-chocolate)', fontWeight: 800, margin: '0 0 0.4rem' }}>
          Mis pedidos
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Hola, <strong>{customer.nombre}</strong> — aquí está tu historial de compras.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{
            width: 36, height: 36, border: '4px solid var(--border-color)',
            borderTopColor: 'var(--primary-pink)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          Cargando historial...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'white', borderRadius: '16px',
          border: '2px solid var(--border-color)',
        }}>
          <ShoppingBag size={48} color="var(--text-muted)" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--dark-chocolate)', margin: '0 0 0.5rem' }}>Sin pedidos aún</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Aún no has realizado ningún pedido. ¡Ve al catálogo y elige tus favoritos!
          </p>
          <Link to="/" style={{
            background: 'var(--primary-pink)', color: 'var(--dark-chocolate)',
            fontWeight: 700, padding: '0.7rem 1.25rem', borderRadius: '10px', textDecoration: 'none',
          }}>
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              background: 'white', borderRadius: '14px',
              border: '2px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 4px 15px var(--shadow-color)',
            }}>
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '1.1rem 1.25rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '10px',
                    background: 'var(--primary-pink-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShoppingBag size={18} color="var(--primary-pink-hover)" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--dark-chocolate)', fontSize: '0.95rem' }}>
                      Pedido #{order.id}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      {new Date(order.fecha_venta).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-pink-hover)' }}>
                    ${Number(order.total).toFixed(2)}
                  </span>
                  {expandedId === order.id ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </div>
              </button>

              {/* Expandable details */}
              {expandedId === order.id && order.detalles && (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  padding: '1rem 1.25rem',
                  background: 'var(--bg-cream)',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  {order.detalles.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: idx < order.detalles.length - 1 ? '1px solid var(--border-color)' : 'none',
                      fontSize: '0.875rem',
                    }}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--dark-chocolate)' }}>{item.nombre}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          × {item.cantidad}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--dark-chocolate)' }}>
                        ${Number(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--dark-chocolate)' }}>
                      Total: ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
