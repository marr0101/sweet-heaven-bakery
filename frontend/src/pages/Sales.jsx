import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Trash2, 
  User, 
  ShoppingBag, 
  Printer, 
  FileText, 
  ChevronRight, 
  Plus, 
  Minus,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import logoImg from '../assets/logo.png';

const Sales = () => {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();
  
  // Context cart state
  const { 
    cartItems, 
    selectedClient, 
    setSelectedClient, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartTotal 
  } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchClientQuery, setSearchClientQuery] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Checkout response state for invoice modal
  const [checkoutInvoice, setCheckoutInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Reference for printable area
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchClients();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/products');
      setProducts(data);
    } catch (err) {
      showToast('Error al cargar catálogo de ventas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await apiFetch('/clients');
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast('El carrito está vacío.', 'warning');
      return;
    }

    setProcessingCheckout(true);
    try {
      const payload = {
        cliente_id: selectedClient.id,
        productos: cartItems.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        }))
      };

      const invoiceData = await apiFetch('/sales', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Checkout Success! Celebrate!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F8BBD0', '#FFF8E7', '#5D4037', '#D4AF37']
      });

      showToast('¡Venta realizada exitosamente!', 'success');
      
      // Open Invoice Modal
      setCheckoutInvoice(invoiceData);
      setShowInvoiceModal(true);

      // Reset cart and reload products to sync stock
      clearCart();
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Error al procesar el checkout.', 'error');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!checkoutInvoice) return;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150] // Ticket format
    });

    const primaryColor = '#5D4037';
    doc.setTextColor(primaryColor);
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    
    // Header
    doc.text('SWEET HEAVEN BAKERY', 40, 10, { align: 'center' });
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text('"Making Every Moment Sweeter"', 40, 14, { align: 'center' });
    doc.text('-----------------------------------', 40, 18, { align: 'center' });

    // Invoice details
    doc.text(`TICKET NO: #${checkoutInvoice.id}`, 5, 22);
    doc.text(`FECHA: ${new Date(checkoutInvoice.fecha_venta).toLocaleString()}`, 5, 26);
    doc.text(`CLIENTE: ${checkoutInvoice.cliente_nombre}`, 5, 30);
    doc.text(`CAJERO: ${checkoutInvoice.usuario_nombre}`, 5, 34);
    doc.text('-----------------------------------', 40, 38, { align: 'center' });

    // Columns
    doc.text('PRODUCTO          CANT   P.U.   TOTAL', 5, 42);
    doc.text('-----------------------------------', 40, 46, { align: 'center' });

    let y = 50;
    checkoutInvoice.detalles.forEach((item) => {
      // Truncate name
      const name = item.producto_nombre.substring(0, 15).padEnd(15, ' ');
      const qty = item.cantidad.toString().padStart(3, ' ');
      const price = item.precio_unitario.toFixed(2).padStart(6, ' ');
      const sub = item.subtotal.toFixed(2).padStart(7, ' ');
      doc.text(`${name} ${qty} ${price} ${sub}`, 5, y);
      y += 5;
    });

    doc.text('-----------------------------------', 40, y, { align: 'center' });
    y += 5;
    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.text(`TOTAL: $${checkoutInvoice.total.toFixed(2)}`, 75, y, { align: 'right' });
    y += 8;
    doc.setFont('courier', 'italic');
    doc.setFontSize(7);
    doc.text('¡Gracias por su compra dulce!', 40, y, { align: 'center' });

    doc.save(`Ticket_Sweet_Heaven_#${checkoutInvoice.id}.pdf`);
    showToast('Factura PDF descargada.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Filters product listings
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoria_id === parseInt(selectedCategory);
    const matchesSearch = p.nombre.toLowerCase().includes(searchProduct.toLowerCase()) || 
                          (p.descripcion && p.descripcion.toLowerCase().includes(searchProduct.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderProductThumbnail = (imgSrc) => {
    if (!imgSrc) return <span className="thumbnail-emoji">🧁</span>;
    if (imgSrc.length <= 4) return <span className="thumbnail-emoji">{imgSrc}</span>;
    return <img src={imgSrc} alt="thumbnail" className="thumbnail-img" />;
  };

  const handleSearchClientInput = (e) => {
    const val = e.target.value;
    setSearchClientQuery(val);
    setShowClientDropdown(true);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchClientQuery('');
    setShowClientDropdown(false);
    showToast(`Cliente "${client.nombre} ${client.apellido}" asignado a la venta`, 'info');
  };

  // Filter clients for dropdown selector
  const filteredClients = clients.filter(c => 
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchClientQuery.toLowerCase()) ||
    (c.telefono && c.telefono.includes(searchClientQuery))
  );

  return (
    <div className="sales-pos-page">
      <header className="page-header no-print">
        <div>
          <h1 className="pixel-text page-title">Módulo de Ventas (POS)</h1>
          <p className="page-subtitle">Agrega productos al carrito, selecciona clientes y genera facturas instantáneas</p>
        </div>
      </header>

      <div className="pos-layout no-print">
        {/* Left column: Products catalog */}
        <section className="pos-left-panel">
          {/* Filters card */}
          <div className="card pos-controls-card">
            <div className="pos-search-wrapper">
              <Search size={16} className="pos-search-icon" />
              <input
                type="text"
                placeholder="Buscar pastel, pan o galleta..."
                className="form-control pos-search-input"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </div>

            <div className="pos-category-scroller">
              <button
                className={`pos-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`pos-cat-pill ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                >
                  {cat.nombre_categoria}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog grid */}
          {loading ? (
            <div className="loading-spinner">Buscando productos...</div>
          ) : (
            <div className="pos-catalog-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const inCartItem = cartItems.find(item => item.id === p.id);
                  const remainingStock = p.stock - (inCartItem ? inCartItem.cantidad : 0);
                  const isAgotado = remainingStock <= 0;

                  return (
                    <div 
                      key={p.id} 
                      className={`pos-product-card card ${isAgotado ? 'pos-card-out' : ''}`}
                      onClick={() => !isAgotado && addToCart(p)}
                    >
                      <div className="pos-card-thumb-area">
                        {renderProductThumbnail(p.imagen)}
                        {isAgotado && <span className="pos-badge-out">Agotado</span>}
                      </div>
                      
                      <div className="pos-card-info">
                        <h4 className="pos-card-title">{p.nombre}</h4>
                        <span className="pos-card-price">${p.precio.toFixed(2)}</span>
                        <span className={`pos-card-stock ${remainingStock <= 5 ? 'text-danger' : ''}`}>
                          Stock: {remainingStock} uds
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-data-msg card" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                  No hay productos que coincidan con la búsqueda.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right column: Sales receipt & checkout */}
        <section className="pos-right-panel card">
          <h3 className="pixel-text cart-header-title">
            <ShoppingBag size={18} />
            Detalle de Venta
          </h3>

          {/* Client selector */}
          <div className="pos-client-selector">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Vincular Cliente</label>
            <div className="client-search-box">
              <User size={16} className="client-search-icon" />
              <input
                type="text"
                className="form-control client-search-input"
                placeholder="Buscar cliente por nombre o cel..."
                value={searchClientQuery}
                onChange={handleSearchClientInput}
                onFocus={() => setShowClientDropdown(true)}
              />
              {selectedClient && (
                <div className="selected-client-badge">
                  <span>{selectedClient.nombre} {selectedClient.apellido}</span>
                  {selectedClient.id !== 1 && (
                    <button className="remove-client-btn" onClick={() => setSelectedClient({ id: 1, nombre: 'Público', apellido: 'General' })}>
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Clients search list dropdown */}
            {showClientDropdown && searchClientQuery && (
              <div className="clients-dropdown-list">
                {filteredClients.length > 0 ? (
                  filteredClients.map(c => (
                    <div key={c.id} className="client-dropdown-row" onClick={() => handleSelectClient(c)}>
                      <strong>{c.nombre} {c.apellido}</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{c.telefono || c.correo}</span>
                    </div>
                  ))
                ) : (
                  <div className="client-dropdown-row-empty">No hay clientes con ese nombre.</div>
                )}
              </div>
            )}
          </div>

          {/* Cart items list */}
          <div className="pos-cart-items-wrapper">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="pos-cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.nombre}</span>
                    <span className="cart-item-price">${item.precio.toFixed(2)} c/u</span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>
                        <Minus size={12} />
                      </button>
                      <input 
                        type="number" 
                        className="qty-input" 
                        value={item.cantidad} 
                        onChange={(e) => updateQuantity(item.id, e.target.value)}
                      />
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    <span className="cart-item-subtotal">
                      ${(item.cantidad * item.precio).toFixed(2)}
                    </span>

                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="cart-empty-state">
                <ShoppingBag size={48} className="cart-empty-icon" />
                <p>El carrito de ventas está vacío.</p>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Haga clic en los productos para agregarlos.</span>
              </div>
            )}
          </div>

          {/* Cart checkout footer summary */}
          <div className="pos-cart-footer">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span className="total-val">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="total-row main-total-row">
              <span className="total-label">TOTAL FACTURA</span>
              <span className="total-val">${cartTotal.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary pos-checkout-btn" 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || processingCheckout}
            >
              <Sparkles size={16} />
              <span>{processingCheckout ? 'Procesando Venta...' : 'Completar Facturación'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Printable Visual Invoice Modal */}
      {showInvoiceModal && checkoutInvoice && (
        <div className="modal-overlay">
          <div className="modal-content card print-invoice" style={{ maxWidth: '440px', padding: '1.5rem' }}>
            {/* Modal header controls (hidden on print) */}
            <div className="modal-header no-print">
              <h3 className="pixel-text" style={{ fontSize: '0.85rem' }}>Factura Visual</h3>
              <button className="close-btn" onClick={() => { setShowInvoiceModal(false); setCheckoutInvoice(null); }}><X size={20} /></button>
            </div>

            {/* Printable Area */}
            <div ref={invoiceRef} className="ticket-invoice-body">
              <div className="ticket-brand-header">
                <img src={logoImg} alt="Sweet Heaven Bakery Logo" className="ticket-logo" />
                <h2 className="pixel-text ticket-title">SWEET HEAVEN</h2>
                <p className="ticket-subtitle">"Making Every Moment Sweeter"</p>
                <p className="ticket-meta">Sweet Heaven Bakery S.A.C.</p>
                <p className="ticket-meta">Sucursal Principal • Tel: 555-789-10</p>
                <div className="ticket-divider"></div>
              </div>

              <div className="ticket-meta-info">
                <p><strong>Nro. Factura:</strong> #{checkoutInvoice.id}</p>
                <p><strong>Fecha Venta:</strong> {new Date(checkoutInvoice.fecha_venta).toLocaleString('es-ES')}</p>
                <p><strong>Cliente:</strong> {checkoutInvoice.cliente_nombre}</p>
                <p><strong>Cajero:</strong> {checkoutInvoice.usuario_nombre}</p>
                <div className="ticket-divider"></div>
              </div>

              {/* Items */}
              <div className="ticket-items-list">
                <div className="ticket-items-header">
                  <span className="col-name">Detalle</span>
                  <span className="col-qty text-center">Cant.</span>
                  <span className="col-price text-right">Precio</span>
                  <span className="col-sub text-right">Subtotal</span>
                </div>
                <div className="ticket-divider" style={{ borderStyle: 'dotted' }}></div>

                {checkoutInvoice.detalles.map((item) => (
                  <div key={item.id} className="ticket-item-row">
                    <span className="col-name">{item.producto_nombre}</span>
                    <span className="col-qty text-center">{item.cantidad}</span>
                    <span className="col-price text-right">${item.precio_unitario.toFixed(2)}</span>
                    <span className="col-sub text-right">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="ticket-divider" style={{ borderStyle: 'dotted' }}></div>
              </div>

              {/* Summary */}
              <div className="ticket-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${checkoutInvoice.total.toFixed(2)}</span>
                </div>
                <div className="summary-row main-sum-row">
                  <span>TOTAL A PAGAR:</span>
                  <span>${checkoutInvoice.total.toFixed(2)}</span>
                </div>
                <div className="ticket-divider"></div>
              </div>

              {/* Footer */}
              <div className="ticket-footer">
                <p className="footer-greeting">¡Gracias por hacer tu momento más dulce!</p>
                <p className="footer-website">www.sweetheavenbakery.com</p>
                <div className="mock-barcode">|||| | | |||| | || ||| || ||| | |||</div>
              </div>
            </div>

            {/* Print & Download actions (hidden on print) */}
            <div className="modal-actions no-print" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={handleDownloadPDF} style={{ flex: 1 }}>
                <FileText size={16} />
                <span>PDF Ticket</span>
              </button>
              <button className="btn btn-primary" onClick={handlePrint} style={{ flex: 1 }}>
                <Printer size={16} />
                <span>Imprimir Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sales-pos-page {
          height: calc(100vh - var(--header-height) - 4rem);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .pos-layout {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
          flex-grow: 1;
          min-height: 0; /* allows scrollable children inside grid */
        }

        @media (max-width: 1024px) {
          .pos-layout {
            grid-template-columns: 1fr;
          }
        }

        .pos-left-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 0;
        }

        .pos-controls-card {
          padding: 1rem !important;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pos-search-wrapper {
          position: relative;
        }

        .pos-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .pos-search-input {
          padding-left: 2.25rem !important;
          border-radius: 50px !important;
        }

        .pos-category-scroller {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .pos-cat-pill {
          background-color: var(--bg-cream);
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.85rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .pos-cat-pill:hover {
          background-color: var(--primary-pink-light);
          border-color: var(--primary-pink);
        }

        .pos-cat-pill.active {
          background-color: var(--primary-pink);
          border-color: var(--primary-pink);
          color: #5D4037;
        }

        .pos-catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
          overflow-y: auto;
          padding-right: 0.25rem;
          flex-grow: 1;
        }

        .pos-product-card {
          padding: 0 !important;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.2s;
          border-width: 1.5px !important;
        }

        .pos-product-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary-pink);
        }

        .pos-card-thumb-area {
          height: 100px;
          background-color: var(--primary-pink-light);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .thumbnail-emoji {
          font-size: 2.75rem;
          user-select: none;
        }

        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pos-badge-out {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(93, 64, 55, 0.65);
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2px);
        }

        .pos-card-out {
          opacity: 0.65;
          cursor: not-allowed;
          border-color: var(--border-color) !important;
          transform: none !important;
        }

        .pos-card-info {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .pos-card-title {
          font-size: 0.85rem;
          color: var(--dark-chocolate);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pos-card-price {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--dark-chocolate);
        }

        .pos-card-stock {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* Right POS shopping cart */
        .pos-right-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-height: 0;
        }

        .cart-header-title {
          font-size: 0.9rem;
          color: var(--dark-chocolate);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 2px dashed var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 0;
        }

        .pos-client-selector {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          position: relative;
        }

        .client-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .client-search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .client-search-input {
          padding-left: 2.25rem !important;
          border-radius: 50px !important;
        }

        .selected-client-badge {
          position: absolute;
          right: 12px;
          background-color: var(--primary-pink);
          color: #5D4037;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border: 1px solid var(--border-color);
        }

        .remove-client-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #5D4037;
          display: flex;
          align-items: center;
        }

        .clients-dropdown-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--bg-cream-card);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
          z-index: 10;
          box-shadow: 0 8px 20px var(--shadow-color);
          max-height: 150px;
          overflow-y: auto;
        }

        .client-dropdown-row {
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-color);
        }

        .client-dropdown-row:last-child {
          border-bottom: none;
        }

        .client-dropdown-row:hover {
          background-color: var(--primary-pink-light);
        }

        .client-dropdown-row-empty {
          padding: 0.75rem;
          text-align: center;
          font-style: italic;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .pos-cart-items-wrapper {
          flex-grow: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 0.25rem;
        }

        .cart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
          gap: 0.5rem;
        }

        .cart-empty-icon {
          opacity: 0.3;
          animation: float 4s ease-in-out infinite;
        }

        .pos-cart-item {
          background-color: var(--bg-cream);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cart-item-info {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .cart-item-name {
          color: var(--dark-chocolate);
        }

        .cart-item-price {
          color: var(--text-muted);
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          background-color: var(--bg-cream-card);
          border: 1px solid var(--border-color);
          border-radius: 50px;
          padding: 0.15rem;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          transition: all 0.2s;
        }

        .qty-btn:hover {
          background-color: var(--primary-pink-light);
          color: var(--primary-pink-hover);
        }

        .qty-input {
          width: 32px;
          text-align: center;
          border: none;
          background: none;
          font-size: 0.85rem;
          font-weight: 700;
          outline: none;
          /* Hide spinners */
          -moz-appearance: textfield;
        }
        
        .qty-input::-webkit-outer-spin-button,
        .qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .cart-item-subtotal {
          font-weight: 800;
          color: var(--dark-chocolate);
          font-size: 0.95rem;
        }

        .cart-item-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .cart-item-remove:hover {
          color: var(--error);
        }

        .pos-cart-footer {
          border-top: 2px dashed var(--border-color);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .main-total-row {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--dark-chocolate);
          border-top: 1px solid var(--border-color);
          padding-top: 0.5rem;
        }

        .pos-checkout-btn {
          width: 100%;
          padding: 0.95rem !important;
          font-size: 1.05rem !important;
          border-radius: var(--border-radius-lg) !important;
        }

        /* Receipt Invoice Styling */
        .ticket-invoice-body {
          font-family: 'courier', monospace;
          color: #000;
          background-color: #fff;
          padding: 10px;
          line-height: 1.4;
          font-size: 12px;
        }

        body.dark-theme .ticket-invoice-body {
          background-color: #fff; /* Keep receipt print background white */
          color: #000;
        }

        .ticket-brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 10px;
        }

        .ticket-logo {
          width: 50px;
          height: auto;
          margin-bottom: 5px;
        }

        .ticket-title {
          font-size: 14px;
          margin-bottom: 2px;
          color: #000 !important;
        }

        .ticket-subtitle {
          font-size: 10px;
          font-style: italic;
          margin-bottom: 6px;
        }

        .ticket-meta {
          font-size: 10px;
          margin: 0;
        }

        .ticket-divider {
          width: 100%;
          border-top: 1px dashed #000;
          margin: 8px 0;
        }

        .ticket-meta-info p {
          margin: 2px 0;
          font-size: 11px;
        }

        .ticket-items-list {
          display: flex;
          flex-direction: column;
        }

        .ticket-items-header {
          display: flex;
          font-weight: bold;
          font-size: 11px;
        }

        .ticket-item-row {
          display: flex;
          font-size: 11px;
          margin-bottom: 4px;
        }

        .col-name { flex: 2; word-break: break-all; }
        .col-qty { flex: 0.5; }
        .col-price { flex: 0.75; }
        .col-sub { flex: 0.75; }

        .text-center { text-align: center; }
        .text-right { text-align: right; }

        .ticket-summary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          width: 60%;
          font-size: 11px;
          margin-bottom: 2px;
        }

        .main-sum-row {
          font-weight: bold;
          font-size: 13px;
        }

        .ticket-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 10px;
        }

        .footer-greeting {
          font-size: 11px;
          font-weight: bold;
        }

        .footer-body {
          font-size: 9px;
        }

        .mock-barcode {
          font-size: 14px;
          margin-top: 8px;
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
};

export default Sales;
