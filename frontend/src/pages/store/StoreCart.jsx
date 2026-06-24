/**
 * StoreCart.jsx
 * Sliding cart drawer for the public store.
 */
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

const StoreCart = () => {
  const {
    cartOpen, setCartOpen,
    cartItems, removeFromCart, updateQuantity,
    cartTotal, customer,
    showToast,
  } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!customer) {
      showToast('Debes identificarte antes de continuar.', 'warning');
      setCartOpen(false);
      navigate('/ingresar');
      return;
    }
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(93,64,55,0.35)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(420px, 95vw)',
        background: 'white',
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(93,64,55,0.15)',
        transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'var(--font-main)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '2px solid var(--border-color)',
          background: 'var(--primary-pink-light)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--dark-chocolate)" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--dark-chocolate)', fontWeight: 700 }}>
              Mi Carrito
            </h2>
            {cartItems.length > 0 && (
              <span style={{
                background: 'var(--primary-pink)',
                color: 'var(--dark-chocolate)',
                borderRadius: '50px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {cartItems.reduce((s, i) => s + i.cantidad, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px',
              borderRadius: '6px', display: 'flex',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: '1rem',
              color: 'var(--text-muted)',
            }}>
              <ShoppingBag size={56} strokeWidth={1} />
              <p style={{ fontSize: '1rem', textAlign: 'center' }}>Tu carrito está vacío</p>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  background: 'var(--primary-pink)', border: 'none',
                  color: 'var(--dark-chocolate)', fontWeight: 700,
                  padding: '0.6rem 1.25rem', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem',
                  transition: 'all 0.2s',
                }}
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                  background: 'var(--bg-cream)', borderRadius: '12px',
                  padding: '0.875rem', border: '1px solid var(--border-color)',
                }}>
                  {/* Product image */}
                  <img
                    src={item.imagen || `https://placehold.co/60x60/F8BBD0/5D4037?text=${encodeURIComponent(item.nombre.charAt(0))}`}
                    alt={item.nombre}
                    style={{
                      width: 60, height: 60, objectFit: 'cover',
                      borderRadius: '8px', flexShrink: 0,
                      border: '1px solid var(--border-color)',
                    }}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/60x60/F8BBD0/5D4037?text=${encodeURIComponent(item.nombre.charAt(0))}`;
                    }}
                  />
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: '0 0 4px', fontWeight: 600,
                      fontSize: '0.9rem', color: 'var(--dark-chocolate)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.nombre}
                    </p>
                    <p style={{ margin: '0 0 8px', color: 'var(--primary-pink-hover)', fontWeight: 700, fontSize: '0.9rem' }}>
                      ${Number(item.precio).toFixed(2)}
                    </p>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        style={{
                          width: 26, height: 26, borderRadius: '6px',
                          border: '1px solid var(--border-color)', background: 'white',
                          cursor: item.cantidad <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: item.cantidad <= 1 ? 0.4 : 1,
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock}
                        style={{
                          width: 26, height: 26, borderRadius: '6px',
                          border: '1px solid var(--border-color)', background: 'white',
                          cursor: item.cantidad >= item.stock ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: item.cantidad >= item.stock ? 0.4 : 1,
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  {/* Subtotal + delete */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--dark-chocolate)', fontSize: '0.9rem' }}>
                      ${(item.cantidad * item.precio).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '2px',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '2px solid var(--border-color)',
            background: 'var(--bg-cream)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1rem',
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--dark-chocolate)' }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: '100%', padding: '0.875rem',
                background: 'var(--dark-chocolate)', color: 'white',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-pink-hover)'; e.currentTarget.style.color = 'var(--dark-chocolate)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--dark-chocolate)'; e.currentTarget.style.color = 'white'; }}
            >
              <ShoppingBag size={18} />
              Confirmar pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StoreCart;
