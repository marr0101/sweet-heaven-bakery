/**
 * AboutUs.jsx
 * "Sobre Nosotros" public page.
 */
import React from 'react';
import { Heart, Target, Eye, Star, Award, Users, Leaf, Smile } from 'lucide-react';

const values = [
  {
    icon: <Heart size={28} color="#F48FB1" />,
    title: 'Honestidad',
    desc: 'Trabajamos con transparencia en cada ingrediente y precio, porque te lo mereces.',
  },
  {
    icon: <Award size={28} color="#D4AF37" />,
    title: 'Calidad',
    desc: 'Solo usamos insumos premium: mantequilla real, chocolate belga, frutas de temporada.',
  },
  {
    icon: <Star size={28} color="#64B5F6" />,
    title: 'Innovación',
    desc: 'Cada temporada lanzamos nuevas recetas y diseños para sorprenderte.',
  },
  {
    icon: <Smile size={28} color="#81C784" />,
    title: 'Servicio al cliente',
    desc: 'Tu satisfacción es nuestra razón de ser. Respondemos en menos de 2 horas.',
  },
];

const socialLinks = [
  {
    name: 'Instagram',
    handle: '@sweetheavenbakery',
    url: 'https://instagram.com/sweetheavenbakery',
    desc: 'Fotos de nuestros productos y novedades',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: '/SweetHeavenBakery',
    url: 'https://facebook.com/SweetHeavenBakery',
    desc: 'Eventos especiales y ofertas exclusivas',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    handle: '@sweetheavenbakery',
    url: 'https://tiktok.com/@sweetheavenbakery',
    desc: 'Videos del proceso y recetas cortas',
    color: '#010101',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: '/SweetHeavenBakery',
    url: 'https://youtube.com/SweetHeavenBakery',
    desc: 'Tutoriales y recetas completas',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    handle: '+34 600 000 000',
    url: 'https://wa.me/34600000000',
    desc: 'Pedidos personalizados y consultas directas',
    color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
];

const AboutUs = () => {
  return (
    <div style={{ fontFamily: 'var(--font-main)', color: 'var(--text-main)' }}>

      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-pink) 0%, #F48FB1 50%, var(--soft-gold) 100%)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎂</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--dark-chocolate)', fontWeight: 800, margin: '0 0 1rem' }}>
            Sobre Nosotros
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#7B3F35', lineHeight: 1.7, margin: 0 }}>
            Somos Sweet Heaven Bakery, una pastelería artesanal nacida con el sueño de endulzar cada momento especial de tu vida.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── Historia ──────────────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem', alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--primary-pink-light)', borderRadius: '50px',
                padding: '0.4rem 1rem', marginBottom: '1rem',
              }}>
                <span style={{ fontSize: '1rem' }}>📖</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-pink-hover)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Nuestra Historia
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--dark-chocolate)', fontWeight: 800, margin: '0 0 1rem' }}>
                Fundada con pasión en 2020
              </h2>
              <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Sweet Heaven Bakery nació en el verano de 2020, en la pequeña cocina de nuestra fundadora, Elena Martínez. Después de años trabajando como repostera en hoteles de cinco estrellas, Elena decidió que era hora de compartir su pasión directamente con su comunidad.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Lo que comenzó como un pequeño emprendimiento con pedidos por WhatsApp creció rápidamente gracias al boca a boca. Hoy contamos con un catálogo de más de 50 productos artesanales, desde pasteles de bodas hasta macarons y tartas personalizadas.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
                Cada producto que sale de nuestra cocina lleva consigo horas de cuidado, ingredientes seleccionados y el cariño de un equipo que ama lo que hace.
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-pink-light), var(--bg-cream))',
              borderRadius: '18px', padding: '2.5rem',
              border: '2px solid var(--border-color)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧁</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {[
                  { num: '+2000', label: 'Clientes felices' },
                  { num: '+50', label: 'Productos artesanales' },
                  { num: '4.9★', label: 'Valoración media' },
                  { num: '5 años', label: 'De experiencia' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: 'white', borderRadius: '12px',
                    padding: '1rem', border: '1px solid var(--border-color)',
                  }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary-pink-hover)' }}>
                      {stat.num}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Misión y Visión ───────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Misión */}
            <div style={{
              background: 'white', borderRadius: '18px',
              border: '2px solid var(--border-color)', padding: '2rem',
              boxShadow: '0 8px 30px var(--shadow-color)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: 'var(--primary-pink-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Target size={24} color="var(--primary-pink-hover)" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--dark-chocolate)' }}>Nuestra Misión</h3>
              </div>
              <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>
                Crear experiencias dulces excepcionales con ingredientes de primera calidad, garantizando la satisfacción total de cada cliente en cada bocado. Creemos que cada celebración merece un producto artesanal que la haga única e irrepetible.
              </p>
            </div>

            {/* Visión */}
            <div style={{
              background: 'white', borderRadius: '18px',
              border: '2px solid var(--border-color)', padding: '2rem',
              boxShadow: '0 8px 30px var(--shadow-color)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: '#E8F5E9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Eye size={24} color="#388E3C" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--dark-chocolate)' }}>Nuestra Visión</h3>
              </div>
              <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>
                Ser la pastelería artesanal de referencia en la región para 2030, reconocida por la innovación constante, el compromiso con el bienestar del cliente y la excelencia en cada producto. Queremos que cada hogar tenga un pedazo de nuestro cielo dulce.
              </p>
            </div>
          </div>
        </section>

        {/* ── Valores ───────────────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--primary-pink-light)', borderRadius: '50px',
              padding: '0.4rem 1rem', marginBottom: '0.75rem',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-pink-hover)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Nuestros Valores
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--dark-chocolate)', fontWeight: 800, margin: 0 }}>
              Lo que nos define
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {values.map((v) => (
              <div key={v.title} style={{
                background: 'white', borderRadius: '16px',
                border: '2px solid var(--border-color)', padding: '1.75rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--primary-pink)'; e.currentTarget.style.boxShadow = '0 12px 30px var(--shadow-color)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '16px',
                  background: 'var(--bg-cream)', margin: '0 auto 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {v.icon}
                </div>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--dark-chocolate)', fontWeight: 700 }}>{v.title}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Redes Sociales ────────────────────────────────────── */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--primary-pink-light)', borderRadius: '50px',
              padding: '0.4rem 1rem', marginBottom: '0.75rem',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-pink-hover)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Encuéntranos en
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--dark-chocolate)', fontWeight: 800, margin: '0 0 0.5rem' }}>
              Redes Sociales
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Síguenos y forma parte de nuestra comunidad dulce 🎉
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {socialLinks.map((sn) => (
              <a
                key={sn.name}
                href={sn.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: 'white', borderRadius: '16px',
                  border: '2px solid var(--border-color)', padding: '1.5rem 1rem',
                  textDecoration: 'none', textAlign: 'center',
                  transition: 'all 0.25s ease',
                  color: 'var(--text-main)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = sn.color;
                  e.currentTarget.style.boxShadow = `0 12px 30px ${sn.color}33`;
                  e.currentTarget.querySelector('.sn-icon').style.color = sn.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.querySelector('.sn-icon').style.color = 'var(--text-muted)';
                }}
              >
                <div className="sn-icon" style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', transition: 'color 0.2s' }}>
                  {sn.icon}
                </div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark-chocolate)' }}>{sn.name}</p>
                <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: 'var(--primary-pink-hover)', fontWeight: 600 }}>{sn.handle}</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{sn.desc}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
