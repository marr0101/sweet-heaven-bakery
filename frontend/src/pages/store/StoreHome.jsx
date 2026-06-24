/**
 * StoreHome.jsx — Página principal de la tienda pública.
 * Secciones: Hero · Productos Destacados · Promociones ·
 *            Pedidos Personalizados · Reseñas · Sobre Nosotros · Contacto
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingCart, ArrowRight, Star, Phone,
  Mail, MapPin, Clock, Heart, Award, Smile,
  ClipboardList, CheckCircle, AlertCircle, Send,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const API = 'http://localhost:5000/api';

/* ═══════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════ */
const Hero = () => {
  const { setCartOpen } = useStore();
  return (
    <section style={{
      background:'linear-gradient(135deg,var(--primary-pink-light) 0%,#fff 50%,var(--bg-cream) 100%)',
      padding:'clamp(3rem,8vw,6rem) 1.5rem', textAlign:'center',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute',top:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'var(--primary-pink)',opacity:0.12 }} />
      <div style={{ position:'absolute',bottom:-40,left:-40,width:160,height:160,borderRadius:'50%',background:'var(--soft-gold)',opacity:0.10 }} />
      <div style={{ maxWidth:'680px',margin:'0 auto',position:'relative' }}>
        <img src={logoImg} alt="Sweet Heaven" style={{ width:90,animation:'float 4s ease-in-out infinite',marginBottom:'1.5rem' }} />
        <p style={{ fontSize:'0.85rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'3px',color:'var(--primary-pink-hover)',margin:'0 0 0.75rem' }}>
          🎂 Pastelería Artesanal
        </p>
        <h1 style={{ fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:800,color:'var(--dark-chocolate)',margin:'0 0 1.25rem',lineHeight:1.15 }}>
          Endulzamos cada<br/>momento especial
        </h1>
        <p style={{ fontSize:'1.1rem',color:'var(--text-muted)',margin:'0 0 2.25rem',lineHeight:1.7,maxWidth:520,marginLeft:'auto',marginRight:'auto' }}>
          Pasteles artesanales hechos con ingredientes premium, recetas únicas y mucho amor. Haz tu pedido hoy y recíbelo en casa.
        </p>
        <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
          <Link to="/productos" style={{
            display:'inline-flex',alignItems:'center',gap:'0.5rem',
            background:'var(--dark-chocolate)',color:'white',
            padding:'0.9rem 1.75rem',borderRadius:'12px',
            fontWeight:700,fontSize:'1rem',textDecoration:'none',transition:'all 0.2s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='var(--primary-pink-hover)'; e.currentTarget.style.color='var(--dark-chocolate)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='var(--dark-chocolate)'; e.currentTarget.style.color='white'; }}
          >Ver catálogo <ArrowRight size={18}/></Link>
          <button onClick={()=>setCartOpen(true)} style={{
            display:'inline-flex',alignItems:'center',gap:'0.5rem',
            background:'var(--primary-pink)',color:'var(--dark-chocolate)',
            padding:'0.9rem 1.75rem',borderRadius:'12px',
            fontWeight:700,fontSize:'1rem',border:'none',cursor:'pointer',transition:'all 0.2s',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--primary-pink-hover)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--primary-pink)'}
          ><ShoppingCart size={18}/> Mi carrito</button>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCTOS DESTACADOS
═══════════════════════════════════════════════════════════════════════ */
const FeaturedProducts = () => {
  const { products, addToCart, catalogLoading } = useStore();
  
  // Diccionario completo de imágenes por nombre exacto
  const IMAGENES_PRODUCTOS = {
    'Red Velvet Cake': '/images/red-velvet-cake.jpg',
    'Strawberry Cheesecake': '/images/strawberry-cheesecake.jpg',
    'Lemon Tart': '/images/lemon-tart.jpg',
    'Chocolate Cake': '/images/chocolate-cake.jpg',
    'Macaron Box (12 pcs)': 'https://images.unsplash.com/photo-1542473418-1d3cbc5d019c?w=400&h=300&fit=crop',
    'Tiramisu Slice': '/images/tiramisu-slice.jpg',
    'Oreo Brownie': '/images/oreo-brownie.jpg',
    'Vanilla Cupcake': '/images/vanilla-cupcake.jpg',  // ✅ SÍ tiene imagen (para el catálogo)
    'Chocolate Cookies': '/images/chocolate-cookies.jpg',
    'Café Latte Especial': '/images/cafe-latte-especial.jpg',
  };

  // Descripciones exactas por producto
  const DESC_MAP = {
    'Red Velvet Cake': 'Pastel Red Velvet clásico con frosting de queso crema',
    'Strawberry Cheesecake': 'Cheesecake neoyorquino con salsa de frutas',
    'Lemon Tart': 'Tarta de limón sobre base crujiente de mantequilla con merengue italiano',
    'Chocolate Cake': 'Bizcocho de chocolate con ganache y decoración de fresas',
    'Macaron Box (12 pcs)': 'Caja de 12 macarons en variedad: fresa, pistacho, chocolate y vainilla',
    'Tiramisu Slice': 'Porción de tiramisú clásico italiano con mascarpone y dulce de leche',
    'Oreo Brownie': 'Fudge brownie cubierto con galletas Oreo trituradas',
    'Vanilla Cupcake': 'Cupcake esponjoso de vainilla con frosting de crema',
    'Chocolate Cookies': 'Galletas de mantequilla con chispas dobles de chocolate',
    'Café Latte Especial': 'Café latte con leche de avena, sirope de caramelo y espuma de canela',
  };

  // Categorías correctas por producto
  const CATEGORY_MAP = {
    'Red Velvet Cake': 'Pasteles',
    'Strawberry Cheesecake': 'Cheesecakes',
    'Lemon Tart': 'Tartas',
    'Chocolate Cake': 'Pasteles',
    'Macaron Box (12 pcs)': 'Macarons',
    'Tiramisu Slice': 'Postres',
    'Oreo Brownie': 'Brownies',
    'Vanilla Cupcake': 'Cupcakes',
    'Chocolate Cookies': 'Galletas',
    'Café Latte Especial': 'Bebidas',
  };

  // Búsqueda exacta por nombre
  const getImagenProducto = (name) => {
    if (!name) return undefined;
    return IMAGENES_PRODUCTOS[name];
  };


  // Excluye explícitamente "Vanilla Cupcake" de los destacados
  const featured = products
    .filter(p => p.stock > 0 && p.nombre !== 'Vanilla Cupcake')
    .slice(0, 4);

  if (catalogLoading) return null;

  return (
    <section style={{ padding:'4rem 1.5rem',background:'white' }}>
      <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:'2.5rem' }}>
          <span style={{ fontSize:'0.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:'var(--primary-pink-hover)' }}>✨ Lo más pedido</span>
          <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)',color:'var(--dark-chocolate)',fontWeight:800,margin:'0.5rem 0 0' }}>Productos Destacados</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:'1.5rem',marginBottom:'2rem' }}>
          {featured.map(p => {
            const imgFromMap = getImagenProducto(p.nombre);
            const img = imgFromMap || p.imagen || `https://placehold.co/400x300/F8BBD0/5D4037?text=${encodeURIComponent((p.nombre||'').charAt(0))}`;
            const descripcion = DESC_MAP[p.nombre] || p.descripcion || '';
            const categoria = CATEGORY_MAP[p.nombre] || (p.categoria === 'Sin definir' ? 'Bebidas' : p.categoria);
            return (
              <div key={p.id} style={{ background:'var(--bg-cream)',borderRadius:'16px',border:'2px solid var(--border-color)',overflow:'hidden',transition:'all 0.25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='var(--primary-pink)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(244,143,177,0.2)'; const imgEl=e.currentTarget.querySelector('img'); if(imgEl) imgEl.style.transform='scale(1.06)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--border-color)'; e.currentTarget.style.boxShadow='none'; const imgEl=e.currentTarget.querySelector('img'); if(imgEl) imgEl.style.transform='scale(1)'; }}
              >
                <div style={{ height:160,overflow:'hidden',background:'white',position:'relative' }}>
                  <img src={img} alt={p.nombre} onError={e=>{ e.target.onerror=null; e.target.src=`https://placehold.co/400x300/F8BBD0/5D4037?text=${encodeURIComponent((p.nombre||'').charAt(0))}`; }}
                    style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s' }}
                  />
                  {/* Badge de categoría en esquina inferior izquierda */}
                  <span style={{ position:'absolute',left:10,bottom:10,background:'rgba(0,0,0,0.65)',color:'white',padding:'6px 10px',borderRadius:10,fontSize:'0.75rem',fontWeight:700,boxShadow:'0 6px 18px rgba(0,0,0,0.12)' }}>{categoria}</span>
                </div>
                <div style={{ padding:'1rem' }}>
                  <p style={{ margin:'0 0 4px',fontWeight:700,fontSize:'0.95rem',color:'var(--dark-chocolate)' }}>{p.nombre}</p>
                  {descripcion && <p style={{ margin:'0 0 0.75rem',fontSize:'0.78rem',color:'var(--text-muted)',lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{descripcion}</p>}
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <span style={{ fontWeight:800,color:'var(--primary-pink-hover)',fontSize:'1.1rem' }}>${Number(p.precio).toFixed(2)}</span>
                    <button onClick={()=>addToCart(p)} style={{ display:'flex',alignItems:'center',gap:'4px',background:'var(--dark-chocolate)',color:'white',border:'none',borderRadius:'8px',padding:'0.45rem 0.875rem',fontSize:'0.8rem',fontWeight:700,cursor:'pointer',transition:'background 0.2s',fontFamily:'var(--font-main)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--primary-pink-hover)'}
                      onMouseLeave={e=>e.currentTarget.style.background='var(--dark-chocolate)'}
                    ><ShoppingCart size={13}/> Agregar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:'center' }}>
          <Link to="/productos" style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem',border:'2px solid var(--primary-pink)',color:'var(--dark-chocolate)',padding:'0.75rem 1.5rem',borderRadius:'10px',textDecoration:'none',fontWeight:700,transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--primary-pink)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >Ver todos los productos <ArrowRight size={16}/></Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   PROMOCIONES
═══════════════════════════════════════════════════════════════════════ */
const Promotions = () => {
  const promos = [
    { emoji:'🎂', title:'Envío gratis',       desc:'En pedidos mayores a $50. Sin código, sin complicaciones.', badge:'Siempre activo' },
    { emoji:'🧁', title:'Pack Cupcakes x6',   desc:'6 cupcakes a tu elección con 15% de descuento especial.',   badge:'Oferta limitada' },
    { emoji:'🎁', title:'Torta personalizada',desc:'Nombre y mensaje incluidos. Reserva con 48 h de anticipación.', badge:'Solo WhatsApp' },
    { emoji:'☕', title:'Café + Postre',       desc:'Bebida caliente + postre del día a precio especial.',       badge:'Lun – Vie' },
  ];
  return (
    <section style={{ padding:'4rem 1.5rem',background:'var(--bg-cream)' }}>
      <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:'2.5rem' }}>
          <span style={{ fontSize:'0.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:'var(--soft-gold)' }}>🎉 Ofertas especiales</span>
          <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)',color:'var(--dark-chocolate)',fontWeight:800,margin:'0.5rem 0 0' }}>Promociones</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:'1.25rem' }}>
          {promos.map(p => (
            <div key={p.title} style={{ background:'white',borderRadius:'16px',border:'2px solid var(--border-color)',padding:'1.75rem',position:'relative',overflow:'hidden',transition:'all 0.25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='var(--soft-gold)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(212,175,55,0.15)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--border-color)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <span style={{ position:'absolute',top:12,right:12,background:'#FFF3E0',color:'#E65100',fontSize:'0.65rem',fontWeight:700,padding:'3px 8px',borderRadius:'50px' }}>{p.badge}</span>
              <div style={{ fontSize:'2.5rem',marginBottom:'0.875rem' }}>{p.emoji}</div>
              <h3 style={{ margin:'0 0 0.5rem',fontSize:'1rem',color:'var(--dark-chocolate)',fontWeight:700 }}>{p.title}</h3>
              <p style={{ margin:0,fontSize:'0.875rem',color:'var(--text-muted)',lineHeight:1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   PEDIDOS PERSONALIZADOS
═══════════════════════════════════════════════════════════════════════ */
const EMPTY_FORM = { nombre:'', correo:'', telefono:'', fecha_entrega:'', tipo_producto:'Pastel', descripcion:'' };

const CustomOrderSection = () => {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [status, setStatus]   = useState(null); // null | 'loading' | 'ok' | 'error'
  const [msg, setMsg]         = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.descripcion) {
      setStatus('error'); setMsg('Nombre, correo y descripción son obligatorios.'); return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo);
    if (!emailOk) { setStatus('error'); setMsg('Ingresa un correo válido.'); return; }

    setStatus('loading');
    try {
      const res = await fetch(`${API}/custom-orders`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('ok');
      setMsg(`¡Pedido #${data.id} enviado! Te contactaremos pronto al correo ${form.correo}.`);
      setForm(EMPTY_FORM);
    } catch(err) {
      setStatus('error'); setMsg(err.message || 'Error al enviar. Intenta de nuevo.');
    }
  };

  const inp = {
    width:'100%', boxSizing:'border-box',
    padding:'0.75rem 1rem', borderRadius:'10px',
    border:'2px solid var(--border-color)', fontSize:'0.9rem',
    outline:'none', fontFamily:'var(--font-main)',
    background:'var(--bg-cream)', color:'var(--text-main)',
    transition:'border-color 0.2s',
  };
  const focus = e => { e.target.style.borderColor='var(--primary-pink)'; e.target.style.background='white'; };
  const blur  = e => { e.target.style.borderColor='var(--border-color)'; e.target.style.background='var(--bg-cream)'; };

  return (
    <section id="pedido-personalizado" style={{ padding:'4rem 1.5rem', background:'linear-gradient(135deg,#fff 0%,var(--primary-pink-light) 100%)' }}>
      <div style={{ maxWidth:'760px', margin:'0 auto' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'var(--primary-pink)',borderRadius:'50px',padding:'0.4rem 1.25rem',marginBottom:'1rem' }}>
            <ClipboardList size={16} color="var(--dark-chocolate)"/>
            <span style={{ fontSize:'0.8rem',fontWeight:700,color:'var(--dark-chocolate)',textTransform:'uppercase',letterSpacing:'1px' }}>Diseño a tu medida</span>
          </div>
          <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)',color:'var(--dark-chocolate)',fontWeight:800,margin:'0 0 0.75rem' }}>
            Pedidos Personalizados
          </h2>
          <p style={{ color:'var(--text-muted)',margin:0,lineHeight:1.7,maxWidth:520,marginLeft:'auto',marginRight:'auto' }}>
            ¿Tienes una idea especial? Cuéntanos y creamos el postre perfecto para tu ocasión. Bodas, cumpleaños, graduaciones o simplemente porque sí 🎉
          </p>
        </div>

        {/* Form card */}
        <div style={{ background:'white',borderRadius:'20px',border:'2px solid var(--border-color)',padding:'2rem',boxShadow:'0 12px 40px var(--shadow-color)' }}>
          {status === 'ok' ? (
            <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
              <div style={{ width:64,height:64,borderRadius:'50%',background:'#E8F5E9',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem' }}>
                <CheckCircle size={36} color="#2E7D32"/>
              </div>
              <h3 style={{ color:'var(--dark-chocolate)',margin:'0 0 0.5rem' }}>¡Solicitud enviada!</h3>
              <p style={{ color:'var(--text-muted)',margin:'0 0 1.5rem',lineHeight:1.6 }}>{msg}</p>
              <button onClick={()=>setStatus(null)} style={{ background:'var(--primary-pink)',border:'none',color:'var(--dark-chocolate)',padding:'0.7rem 1.5rem',borderRadius:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font-main)' }}>
                Hacer otro pedido
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.1rem',marginBottom:'1.1rem' }}>
                <div>
                  <label style={{ display:'block',marginBottom:'0.4rem',fontWeight:600,fontSize:'0.82rem',color:'var(--text-main)' }}>Nombre completo *</label>
                  <input type="text" placeholder="María García" value={form.nombre} onChange={e=>set('nombre',e.target.value)} style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{ display:'block',marginBottom:'0.4rem',fontWeight:600,fontSize:'0.82rem',color:'var(--text-main)' }}>Correo electrónico *</label>
                  <input type="email" placeholder="tu@correo.com" value={form.correo} onChange={e=>set('correo',e.target.value)} style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{ display:'block',marginBottom:'0.4rem',fontWeight:600,fontSize:'0.82rem',color:'var(--text-main)' }}>Teléfono</label>
                  <input type="tel" placeholder="+34 600 000 000" value={form.telefono} onChange={e=>set('telefono',e.target.value)} style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{ display:'block',marginBottom:'0.4rem',fontWeight:600,fontSize:'0.82rem',color:'var(--text-main)' }}>Fecha de entrega deseada</label>
                  <input type="date" value={form.fecha_entrega} onChange={e=>set('fecha_entrega',e.target.value)} style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div style={{ gridColumn:'1 / -1' }}>
                  <label style={{ display:'block',marginBottom:'0.4rem',fontWeight:600,fontSize:'0.82rem',color:'var(--text-main)' }}>Tipo de producto *</label>
                  <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap' }}>
                    {['Pastel','Cupcakes','Galletas','Otro'].map(t => (
                      <button type="button" key={t} onClick={()=>set('tipo_producto',t)} style={{
                        padding:'0.5rem 1.1rem',borderRadius:'50px',border:`2px solid ${form.tipo_producto===t?'var(--primary-pink)':'var(--border-color)'}`,
                        background:form.tipo_producto===t?'var(--primary-pink)':'transparent',
                        color:'var(--dark-chocolate)',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',
                        transition:'all 0.2s',fontFamily:'var(--font-main)',
                      }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ gridColumn:'1 / -1' }}>
                  <label style={{ display:'block',marginBottom:'0.4rem',fontWeight:600,fontSize:'0.82rem',color:'var(--text-main)' }}>Descripción del pedido *</label>
                  <textarea rows={4} placeholder="Cuéntanos colores, sabores, decoración, número de porciones, mensaje especial..." value={form.descripcion} onChange={e=>set('descripcion',e.target.value)} style={{ ...inp,resize:'vertical',minHeight:100,paddingTop:'0.75rem' }} onFocus={focus} onBlur={blur}/>
                </div>
              </div>

              {status === 'error' && (
                <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',background:'#FFEBEE',border:'1px solid var(--error)',borderRadius:'8px',padding:'0.75rem 1rem',marginBottom:'1rem',color:'#C62828',fontSize:'0.875rem' }}>
                  <AlertCircle size={16}/> {msg}
                </div>
              )}

              <button type="submit" disabled={status==='loading'} style={{
                width:'100%',padding:'0.9rem',
                background:status==='loading'?'var(--border-color)':'var(--dark-chocolate)',
                color:'white',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'1rem',
                cursor:status==='loading'?'not-allowed':'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',
                transition:'all 0.2s',fontFamily:'var(--font-main)',
              }}
              onMouseEnter={e=>{ if(status!=='loading'){ e.currentTarget.style.background='var(--primary-pink-hover)'; e.currentTarget.style.color='var(--dark-chocolate)'; }}}
              onMouseLeave={e=>{ if(status!=='loading'){ e.currentTarget.style.background='var(--dark-chocolate)'; e.currentTarget.style.color='white'; }}}
              >
                {status==='loading' ? 'Enviando...' : <><Send size={17}/> Enviar solicitud</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   RESEÑAS
═══════════════════════════════════════════════════════════════════════ */
const REVIEWS = [
  { name:'María González',  text:'Encargué un pastel para el cumpleaños de mi hija y quedó mucho mejor de lo que imaginaba. El sabor y la decoración fueron perfectos.', stars:5 },
  { name:'Carlos Rodríguez',text:'Excelente atención y productos frescos. Los panes artesanales son mis favoritos.',                                                        stars:5 },
  { name:'Ana Martínez',    text:'Pedí una torta personalizada para un aniversario y todos quedaron encantados. Muy recomendados.',                                         stars:5 },
  { name:'José Herrera',    text:'Servicio puntual, precios justos y una calidad increíble en cada producto.',                                                             stars:5 },
  { name:'Laura Sánchez',   text:'Las galletas decoradas quedaron hermosas y deliciosas. Volveré a comprar sin duda.',                                                     stars:5 },
];

const Reviews = () => (
  <section style={{ padding:'4rem 1.5rem', background:'var(--bg-cream)' }}>
    <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
        <span style={{ fontSize:'0.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:'var(--soft-gold)' }}>⭐ Opiniones reales</span>
        <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)',color:'var(--dark-chocolate)',fontWeight:800,margin:'0.5rem 0 0.5rem' }}>
          Lo que dicen nuestros clientes
        </h2>
        <p style={{ color:'var(--text-muted)',margin:0 }}>Más de 2000 familias ya confían en nosotros</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{
            background:'white', borderRadius:'18px',
            border:'2px solid var(--border-color)', padding:'1.75rem',
            display:'flex', flexDirection:'column', gap:'1rem',
            transition:'all 0.25s', position:'relative',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor='var(--soft-gold)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(212,175,55,0.15)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--border-color)'; e.currentTarget.style.boxShadow='none'; }}
          >
            {/* Quote mark */}
            <span style={{ position:'absolute',top:16,right:20,fontSize:'3rem',color:'var(--primary-pink)',opacity:0.3,lineHeight:1,fontFamily:'serif' }}>"</span>

            {/* Stars */}
            <div style={{ display:'flex', gap:'3px' }}>
              {[...Array(r.stars)].map((_,si) => (
                <Star key={si} size={16} fill="var(--soft-gold)" color="var(--soft-gold)"/>
              ))}
            </div>

            {/* Text */}
            <p style={{ margin:0,fontSize:'0.92rem',color:'var(--text-muted)',lineHeight:1.7,fontStyle:'italic',flex:1 }}>
              "{r.text}"
            </p>

            {/* Author */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', paddingTop:'0.75rem', borderTop:'1px solid var(--border-color)' }}>
              <div style={{
                width:40, height:40, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--primary-pink),var(--primary-pink-hover))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:'1rem', color:'var(--dark-chocolate)',
                flexShrink:0,
              }}>
                {r.name.charAt(0)}
              </div>
              <div>
                <p style={{ margin:0, fontWeight:700, fontSize:'0.9rem', color:'var(--dark-chocolate)' }}>{r.name}</p>
                <p style={{ margin:0, fontSize:'0.75rem', color:'var(--text-muted)' }}>Cliente verificado ✓</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   SOBRE NOSOTROS (snippet)
═══════════════════════════════════════════════════════════════════════ */
const AboutSnippet = () => (
  <section style={{ padding:'4rem 1.5rem', background:'linear-gradient(135deg,var(--primary-pink) 0%,#F48FB1 100%)' }}>
    <div style={{ maxWidth:'1000px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'2.5rem',alignItems:'center' }}>
      <div>
        <span style={{ fontSize:'0.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:'var(--dark-chocolate)',opacity:0.7 }}>💛 Nuestra historia</span>
        <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)',color:'var(--dark-chocolate)',fontWeight:800,margin:'0.5rem 0 1rem' }}>Hechos con amor desde 2020</h2>
        <p style={{ color:'#7B3F35',lineHeight:1.8,margin:'0 0 1.5rem' }}>
          Nacimos de la pasión de nuestra fundadora Elena por compartir postres artesanales de calidad. Hoy, más de 2000 clientes confían en nosotros para sus momentos más especiales.
        </p>
        <Link to="/nosotros" style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'var(--dark-chocolate)',color:'white',padding:'0.75rem 1.5rem',borderRadius:'10px',textDecoration:'none',fontWeight:700,transition:'all 0.2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='white'; e.currentTarget.style.color='var(--dark-chocolate)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='var(--dark-chocolate)'; e.currentTarget.style.color='white'; }}
        >Conocer más <ArrowRight size={16}/></Link>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
        {[
          { icon:<Heart size={24} color="#F48FB1"/>, val:'Honestidad' },
          { icon:<Award size={24} color="#D4AF37"/>, val:'Calidad' },
          { icon:<Star size={24} color="#64B5F6"/>,  val:'Innovación' },
          { icon:<Smile size={24} color="#81C784"/>, val:'Servicio' },
        ].map(v => (
          <div key={v.val} style={{ background:'rgba(255,255,255,0.85)',borderRadius:'12px',padding:'1.25rem',textAlign:'center',border:'1px solid rgba(255,255,255,0.6)' }}>
            <div style={{ marginBottom:'0.5rem' }}>{v.icon}</div>
            <p style={{ margin:0,fontWeight:700,fontSize:'0.9rem',color:'var(--dark-chocolate)' }}>{v.val}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   CONTACTO
═══════════════════════════════════════════════════════════════════════ */
const Contact = () => (
  <section id="contacto" style={{ padding:'4rem 1.5rem', background:'white' }}>
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
        <span style={{ fontSize:'0.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:'var(--primary-pink-hover)' }}>📬 Estamos aquí para ti</span>
        <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)',color:'var(--dark-chocolate)',fontWeight:800,margin:'0.5rem 0 0' }}>Contacto</h2>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.25rem',marginBottom:'2.5rem' }}>
        {[
          { icon:<Phone size={22} color="var(--primary-pink-hover)"/>, title:'WhatsApp',  val:'+34 600 000 000',    href:'https://wa.me/34600000000' },
          { icon:<Mail  size={22} color="var(--primary-pink-hover)"/>, title:'Correo',    val:'hisweetheaven@gmail.com', href:'mailto:hisweetheaven@gmail.com' },
          { icon:<MapPin size={22} color="var(--primary-pink-hover)"/>,title:'Ubicación', val:'Calle Dulce 12, Panamá', href:'#' },
          { icon:<Clock size={22} color="var(--primary-pink-hover)"/>, title:'Horario',   val:'Lun–Sáb: 8am – 8pm', href:'#' },
        ].map(c => (
          <a key={c.title} href={c.href} target={c.href.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer"
            style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'1.25rem',background:'var(--bg-cream)',borderRadius:'14px',border:'2px solid var(--border-color)',textDecoration:'none',transition:'all 0.2s',color:'var(--text-main)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--primary-pink)'; e.currentTarget.style.transform='translateY(-3px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-color)'; e.currentTarget.style.transform='none'; }}
          >
            <div style={{ width:44,height:44,borderRadius:'10px',background:'var(--primary-pink-light)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{c.icon}</div>
            <div>
              <p style={{ margin:'0 0 2px',fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',color:'var(--text-muted)' }}>{c.title}</p>
              <p style={{ margin:0,fontWeight:600,color:'var(--dark-chocolate)',fontSize:'0.9rem' }}>{c.val}</p>
            </div>
          </a>
        ))}
      </div>
      <div style={{ display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap' }}>
        {[
          { label:'Instagram',url:'https://instagram.com/sweetheavenbakery',color:'#E1306C',emoji:'📸' },
          { label:'Facebook', url:'https://facebook.com/SweetHeavenBakery', color:'#1877F2',emoji:'📘' },
          { label:'TikTok',   url:'https://tiktok.com/@sweetheavenbakery',  color:'#010101',emoji:'🎵' },
          { label:'YouTube',  url:'https://youtube.com/SweetHeavenBakery',  color:'#FF0000',emoji:'▶️' },
        ].map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.5rem 1rem',border:`2px solid ${s.color}22`,borderRadius:'50px',textDecoration:'none',color:s.color,fontWeight:600,fontSize:'0.85rem',transition:'all 0.2s',background:`${s.color}11` }}
            onMouseEnter={e=>{ e.currentTarget.style.background=s.color; e.currentTarget.style.color='white'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=`${s.color}11`; e.currentTarget.style.color=s.color; }}
          >{s.emoji} {s.label}</a>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════ */
const StoreHome = () => (
  <div>
    <Hero />
    <FeaturedProducts />
    <Promotions />
    <CustomOrderSection />
    <Reviews />
    <AboutSnippet />
    <Contact />
  </div>
);

export default StoreHome;
