/**
 * StoreCheckout.jsx
 * Checkout page: shipping details form + order summary + confirmation.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { MapPin, Phone, FileText, CheckCircle, ArrowLeft, ShoppingBag, Mail, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Generate invoice PDF using jsPDF (same visual as backend HTML invoice)
function generateInvoicePDF(order) {
  const doc = new jsPDF();
  const pink = [248, 187, 208];
  const choc = [93, 64, 55];
  const gold = [212, 175, 55];
  const muted = [141, 110, 99];

  // Header bar
  doc.setFillColor(...pink);
  doc.rect(0, 0, 210, 38, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...choc);
  doc.text('Sweet Heaven Bakery', 105, 16, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(123, 63, 53);
  doc.text('"Making Every Moment Sweeter"', 105, 23, { align: 'center' });

  // Invoice title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...choc);
  doc.text('FACTURA', 15, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Pedido #${order.id}`, 15, 56);
  const fecha = new Date(order.fecha).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' });
  doc.text(`Fecha: ${fecha}`, 155, 50);

  // Client info box
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(13, 62, 85, 32, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(244, 143, 177);
  doc.text('CLIENTE', 17, 69);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...choc);
  doc.text(order.cliente_nombre || '-', 17, 76);
  doc.setTextColor(...muted);
  doc.text(order.cliente_correo || '-', 17, 82);
  if (order.cliente_telefono) doc.text(`Tel: ${order.cliente_telefono}`, 17, 88);

  // Shipping info box
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(112, 62, 85, 32, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(244, 143, 177);
  doc.text('ENVÍO', 116, 69);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...choc);
  const addr = order.direccion_envio || 'No especificada';
  const addrLines = doc.splitTextToSize(addr, 76);
  doc.text(addrLines, 116, 76);

  // Table header
  let y = 104;
  doc.setFillColor(255, 240, 245);
  doc.rect(13, y - 5, 184, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text('PRODUCTO',    17,  y);
  doc.text('CANT.',      120,  y, { align:'center' });
  doc.text('P. UNIT.',   150,  y, { align:'right' });
  doc.text('SUBTOTAL',   193,  y, { align:'right' });

  doc.setDrawColor(238, 220, 198);
  doc.line(13, y + 2, 197, y + 2);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...choc);

  (order.items || []).forEach((item, i) => {
    if (i % 2 === 0) { doc.setFillColor(255, 250, 245); doc.rect(13, y - 5, 184, 8, 'F'); }
    doc.text(String(item.nombre).substring(0, 40), 17, y);
    doc.text(String(item.cantidad),                120, y, { align:'center' });
    doc.text(`$${Number(item.precio_unitario).toFixed(2)}`, 150, y, { align:'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`$${Number(item.subtotal).toFixed(2)}`,       193, y, { align:'right' });
    doc.setFont('helvetica', 'normal');
    doc.line(13, y + 3, 197, y + 3);
    y += 9;
  });

  // Total
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...choc);
  doc.text('TOTAL', 150, y, { align:'right' });
  doc.setTextColor(244, 143, 177);
  doc.setFontSize(13);
  doc.text(`$${Number(order.total).toFixed(2)}`, 193, y, { align:'right' });

  // Footer
  y += 16;
  doc.setFillColor(255, 248, 231);
  doc.rect(0, y, 210, 25, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text('Gracias por tu compra en Sweet Heaven Bakery 🎉', 105, y + 8, { align:'center' });
  doc.setTextColor(...gold);
  doc.setFontSize(7);
  doc.text(`© ${new Date().getFullYear()} Sweet Heaven Bakery — Todos los derechos reservados`, 105, y + 16, { align:'center' });

  return doc;
}

const StoreCheckout = () => {
  const { customer, cartItems, cartTotal, placeOrder, showToast } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    direccion_envio: customer?.direccion || '',
    telefono: customer?.telefono || '',
    notas: '',
  });
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState('');

  if (!customer) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-main)',
      }}>
        <ShoppingBag size={52} color="var(--text-muted)" strokeWidth={1.5} />
        <h2 style={{ color: 'var(--dark-chocolate)' }}>Debes identificarte primero</h2>
        <p style={{ color: 'var(--text-muted)' }}>Para confirmar tu pedido necesitamos tu nombre y correo.</p>
        <Link to="/ingresar" style={{
          background: 'var(--primary-pink)', color: 'var(--dark-chocolate)',
          fontWeight: 700, padding: '0.75rem 1.5rem',
          borderRadius: '10px', textDecoration: 'none',
        }}>
          Identificarse →
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !confirmedOrder) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-main)',
      }}>
        <ShoppingBag size={52} color="var(--text-muted)" strokeWidth={1.5} />
        <h2 style={{ color: 'var(--dark-chocolate)' }}>Tu carrito está vacío</h2>
        <Link to="/" style={{
          background: 'var(--primary-pink)', color: 'var(--dark-chocolate)',
          fontWeight: 700, padding: '0.75rem 1.5rem',
          borderRadius: '10px', textDecoration: 'none',
        }}>
          ← Ver productos
        </Link>
      </div>
    );
  }

  // ── Order confirmed screen ─────────────────────────────────────────────
  if (confirmedOrder) {
    const emailOk = confirmedOrder._email?.sent;
    const previewUrl = confirmedOrder._email?.previewUrl;
    const emailErr = confirmedOrder._email?.error;

    const handleDownloadPDF = () => {
      const doc = generateInvoicePDF(confirmedOrder);
      doc.save(`Factura_Pedido_${confirmedOrder.id}.pdf`);
    };

    return (
      <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', fontFamily:'var(--font-main)' }}>
        <div style={{ background:'white', borderRadius:'20px', border:'2px solid var(--border-color)', padding:'2.5rem 2rem', maxWidth:'520px', width:'100%', textAlign:'center', boxShadow:'0 12px 40px var(--shadow-color)', animation:'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'#E8F5E9', margin:'0 auto 1.5rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CheckCircle size={40} color="#2E7D32"/>
          </div>
          <h2 style={{ fontSize:'1.5rem', color:'var(--dark-chocolate)', margin:'0 0 0.5rem', fontWeight:800 }}>¡Pedido confirmado! 🎉</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:'1.75rem', lineHeight:1.6 }}>
            Tu pedido <strong style={{ color:'var(--dark-chocolate)' }}>#{confirmedOrder.id}</strong> ha sido registrado con éxito.
          </p>

          {/* Summary */}
          <div style={{ background:'var(--bg-cream)', borderRadius:'12px', padding:'1.25rem', textAlign:'left', marginBottom:'1.25rem', border:'1px solid var(--border-color)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <span style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>N° de pedido</span>
              <span style={{ fontWeight:700, color:'var(--dark-chocolate)' }}>#{confirmedOrder.id}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <span style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Total</span>
              <span style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--primary-pink-hover)' }}>${Number(confirmedOrder.total).toFixed(2)}</span>
            </div>
            {/* Email status */}
            <div style={{ borderTop:'1px solid var(--border-color)', paddingTop:'0.75rem' }}>
              {emailOk ? (
                <div style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', color:'#2E7D32', fontSize:'0.875rem' }}>
                  <CheckCircle size={15} style={{ marginTop:2, flexShrink:0 }}/>
                  <div>
                    <p style={{ margin:0, fontWeight:600 }}>Factura enviada por correo ✓</p>
                    <p style={{ margin:'2px 0 0', fontSize:'0.78rem', color:'var(--text-muted)' }}>
                      {confirmedOrder.cliente_correo}
                      {previewUrl && <> · <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color:'var(--primary-pink-hover)' }}>Ver email de prueba</a></>}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', color:'#E65100', fontSize:'0.875rem' }}>
                  <Mail size={15} style={{ marginTop:2, flexShrink:0 }}/>
                  <div>
                    <p style={{ margin:0, fontWeight:600 }}>El correo no pudo enviarse</p>
                    <p style={{ margin:'2px 0 0', fontSize:'0.78rem', color:'var(--text-muted)' }}>
                      {emailErr || 'Error desconocido'}. Descarga la factura PDF abajo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', justifyContent:'center' }}>
            <button onClick={handleDownloadPDF} style={{
              display:'inline-flex', alignItems:'center', gap:'0.5rem',
              background:'var(--primary-pink)', color:'var(--dark-chocolate)',
              border:'none', borderRadius:'10px', padding:'0.75rem 1.25rem',
              fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
              transition:'all 0.2s', fontFamily:'var(--font-main)',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--primary-pink-hover)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--primary-pink)'}
            >
              <Download size={16}/> Descargar PDF
            </button>
            <Link to="/" style={{
              display:'inline-flex', alignItems:'center', gap:'0.5rem',
              background:'var(--dark-chocolate)', color:'white',
              borderRadius:'10px', padding:'0.75rem 1.25rem',
              fontWeight:700, fontSize:'0.9rem', textDecoration:'none',
              transition:'all 0.2s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='var(--primary-pink-hover)'; e.currentTarget.style.color='var(--dark-chocolate)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='var(--dark-chocolate)'; e.currentTarget.style.color='white'; }}
            >
              <ShoppingBag size={16}/> Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout form ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.direccion_envio.trim()) {
      setError('La dirección de envío es obligatoria.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const order = await placeOrder(form);
      setConfirmedOrder(order);
      showToast('¡Pedido creado! Revisa tu correo 📧', 'success');
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    borderRadius: '10px', border: '2px solid var(--border-color)',
    fontSize: '0.95rem', outline: 'none',
    fontFamily: 'var(--font-main)', background: 'var(--bg-cream)',
    color: 'var(--text-main)', transition: 'all 0.2s',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-main)' }}>
      {/* Back */}
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        color: 'var(--text-muted)', textDecoration: 'none',
        fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem',
      }}>
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <h1 style={{ fontSize: '1.6rem', color: 'var(--dark-chocolate)', fontWeight: 800, margin: '0 0 1.75rem' }}>
        Confirmar pedido
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* ── Form ──────────────────────────────────────────────── */}
        <div>
          {/* Customer info (readonly) */}
          <div style={{
            background: 'var(--primary-pink-light)', borderRadius: '14px',
            padding: '1.25rem', border: '2px solid var(--border-color)', marginBottom: '1.5rem',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-pink-hover)' }}>
              Comprando como
            </p>
            <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--dark-chocolate)' }}>{customer.nombre}</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{customer.correo}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Address */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                Dirección de envío *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Calle, número, colonia, ciudad"
                  value={form.direccion_envio}
                  onChange={(e) => setForm({ ...form, direccion_envio: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-pink)'; e.target.style.background = 'white'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'var(--bg-cream)'; }}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                Teléfono de contacto
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-pink)'; e.target.style.background = 'white'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'var(--bg-cream)'; }}
                />
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                Notas adicionales
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <textarea
                  placeholder="Alergias, instrucciones especiales, personalización..."
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  rows={3}
                  style={{
                    ...inputStyle,
                    paddingTop: '0.75rem',
                    resize: 'vertical',
                    minHeight: '90px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-pink)'; e.target.style.background = 'white'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'var(--bg-cream)'; }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: '#FFEBEE', border: '1px solid var(--error)',
                borderRadius: '8px', padding: '0.75rem 1rem',
                color: '#C62828', fontSize: '0.875rem', marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? 'var(--border-color)' : 'var(--dark-chocolate)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s', fontFamily: 'var(--font-main)',
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--primary-pink-hover)'; e.currentTarget.style.color = 'var(--dark-chocolate)'; } }}
              onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--dark-chocolate)'; e.currentTarget.style.color = 'white'; } }}
            >
              {loading ? 'Procesando...' : <><CheckCircle size={18} /> Confirmar y pagar</>}
            </button>
          </form>
        </div>

        {/* ── Order Summary ──────────────────────────────────────── */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '2px solid var(--border-color)', padding: '1.5rem',
          boxShadow: '0 8px 30px var(--shadow-color)',
        }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', color: 'var(--dark-chocolate)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} color="var(--primary-pink-hover)" /> Resumen del pedido
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img
                  src={item.imagen || `https://placehold.co/50x50/F8BBD0/5D4037?text=${encodeURIComponent(item.nombre.charAt(0))}`}
                  alt={item.nombre}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 0 }}
                  onError={(e) => { e.target.src = `https://placehold.co/50x50/F8BBD0/5D4037?text=${encodeURIComponent(item.nombre.charAt(0))}`; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark-chocolate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.nombre}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.cantidad} × ${Number(item.precio).toFixed(2)}
                  </p>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-chocolate)', flexShrink: 0 }}>
                  ${(item.cantidad * item.precio).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Total a pagar</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--dark-chocolate)' }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Invoice info */}
          <div style={{
            marginTop: '1.25rem', background: 'var(--bg-cream)',
            borderRadius: '10px', padding: '1rem',
            border: '1px solid var(--border-color)',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Factura enviada a
            </p>
            <p style={{ margin: '0 0 3px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-chocolate)' }}>
              📧 {customer.correo}
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              CC: ortegamaya990@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCheckout;
