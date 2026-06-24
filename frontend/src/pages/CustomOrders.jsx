/**
 * CustomOrders.jsx — Admin panel for personalized order requests.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ClipboardList, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
  'Pendiente':   { bg:'#FFF3E0', color:'#E65100', dot:'#FFB74D' },
  'En proceso':  { bg:'#E3F2FD', color:'#1565C0', dot:'#64B5F6' },
  'Completado':  { bg:'#E8F5E9', color:'#2E7D32', dot:'#81C784' },
};

const CustomOrders = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/custom-orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch { showToast('Error al cargar pedidos personalizados.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const updateStatus = async (id, estado) => {
    setUpdating(id);
    try {
      await apiFetch(`/custom-orders/${id}`, { method:'PUT', body: JSON.stringify({ estado }) });
      showToast(`Estado actualizado a "${estado}"`, 'success');
      setOrders(prev => prev.map(o => o.id === id ? { ...o, estado } : o));
    } catch(e) { showToast(e.message || 'Error al actualizar.', 'error'); }
    finally { setUpdating(null); }
  };

  const counts = {
    total:     orders.length,
    pendiente: orders.filter(o => o.estado === 'Pendiente').length,
    proceso:   orders.filter(o => o.estado === 'En proceso').length,
    completado:orders.filter(o => o.estado === 'Completado').length,
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 className="pixel-text page-title">Pedidos Personalizados</h1>
          <p className="page-subtitle">Solicitudes de clientes para productos a medida</p>
        </div>
        <button className="btn btn-secondary" onClick={fetch_}>
          <RefreshCw size={16}/> Actualizar
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
        {[
          { label:'Total',       val:counts.total,      bg:'var(--primary-pink-light)',   color:'var(--dark-chocolate)' },
          { label:'Pendientes',  val:counts.pendiente,  bg:'#FFF3E0',                     color:'#E65100' },
          { label:'En proceso',  val:counts.proceso,    bg:'#E3F2FD',                     color:'#1565C0' },
          { label:'Completados', val:counts.completado, bg:'#E8F5E9',                     color:'#2E7D32' },
        ].map(s => (
          <div key={s.label} className="card" style={{ background:s.bg, border:'none', padding:'1.25rem', textAlign:'center' }}>
            <p style={{ margin:'0 0 4px', fontSize:'1.8rem', fontWeight:800, color:s.color }}>{s.val}</p>
            <p style={{ margin:0, fontSize:'0.8rem', color:s.color, fontWeight:600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="card" style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
          <ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom:'1rem' }}/>
          <h3 style={{ color:'var(--dark-chocolate)', margin:'0 0 0.5rem' }}>Sin solicitudes aún</h3>
          <p style={{ color:'var(--text-muted)', margin:0 }}>Cuando un cliente envíe un pedido personalizado aparecerá aquí.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {orders.map(order => {
            const sc = STATUS_COLORS[order.estado] || STATUS_COLORS['Pendiente'];
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="card" style={{ padding:0, overflow:'hidden' }}>
                {/* Row header */}
                <button onClick={()=>setExpanded(isOpen ? null : order.id)}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.1rem 1.5rem', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-main)', gap:'1rem', flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', flex:1 }}>
                    <span style={{ fontWeight:700, color:'var(--text-muted)', fontSize:'0.8rem', minWidth:32 }}>#{order.id}</span>
                    <div style={{ textAlign:'left' }}>
                      <p style={{ margin:'0 0 2px', fontWeight:700, color:'var(--dark-chocolate)', fontSize:'0.95rem' }}>{order.nombre}</p>
                      <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)' }}>{order.correo} {order.telefono ? `· ${order.telefono}` : ''}</p>
                    </div>
                    <span style={{ background:'var(--primary-pink-light)', color:'var(--dark-chocolate)', borderRadius:'50px', padding:'3px 10px', fontSize:'0.78rem', fontWeight:600 }}>
                      {order.tipo_producto}
                    </span>
                    {order.fecha_entrega && (
                      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>📅 {order.fecha_entrega}</span>
                    )}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
                    <span style={{ background:sc.bg, color:sc.color, borderRadius:'50px', padding:'4px 12px', fontSize:'0.78rem', fontWeight:700, display:'flex', alignItems:'center', gap:'5px' }}>
                      <span style={{ width:7, height:7, borderRadius:'50%', background:sc.dot, display:'inline-block' }}/>
                      {order.estado}
                    </span>
                    {isOpen ? <ChevronUp size={16} color="var(--text-muted)"/> : <ChevronDown size={16} color="var(--text-muted)"/>}
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ padding:'1.25rem 1.5rem', borderTop:'1px solid var(--border-color)', background:'var(--bg-cream)', animation:'fadeIn 0.2s ease' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.25rem', marginBottom:'1.25rem' }}>
                      <div>
                        <p style={{ margin:'0 0 4px', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', letterSpacing:'0.5px' }}>Descripción del pedido</p>
                        <p style={{ margin:0, color:'var(--text-main)', lineHeight:1.6, fontSize:'0.9rem' }}>{order.descripcion}</p>
                      </div>
                      <div>
                        <p style={{ margin:'0 0 4px', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', letterSpacing:'0.5px' }}>Fecha de creación</p>
                        <p style={{ margin:0, color:'var(--text-main)', fontSize:'0.9rem' }}>
                          {new Date(order.fecha_creacion).toLocaleString('es-ES', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Status update */}
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--text-muted)' }}>Cambiar estado:</span>
                      {['Pendiente','En proceso','Completado'].map(s => (
                        <button key={s} disabled={order.estado === s || updating === order.id}
                          onClick={() => updateStatus(order.id, s)}
                          style={{
                            padding:'0.45rem 1rem', borderRadius:'8px', border:'2px solid',
                            borderColor: order.estado===s ? STATUS_COLORS[s].dot : 'var(--border-color)',
                            background: order.estado===s ? STATUS_COLORS[s].bg : 'white',
                            color: order.estado===s ? STATUS_COLORS[s].color : 'var(--text-muted)',
                            fontWeight:600, fontSize:'0.82rem', cursor: order.estado===s ? 'default' : 'pointer',
                            transition:'all 0.2s', fontFamily:'var(--font-main)',
                            opacity: updating === order.id ? 0.6 : 1,
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomOrders;
