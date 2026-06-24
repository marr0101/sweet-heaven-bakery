/**
 * StoreContext.jsx
 * Manages all public store state:
 *  - Customer identity (name + email, no password)
 *  - Shopping cart
 *  - Product catalog fetched from the backend
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const StoreContext = createContext();

export const STORE_API = 'http://localhost:5000/api/store';

export const StoreProvider = ({ children }) => {
  // ── Customer identity ──────────────────────────────────────────────────
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('store_customer');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Cart ───────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);

  // ── Catalog ────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  // ── UI ─────────────────────────────────────────────────────────────────
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Persist customer to localStorage whenever it changes
  useEffect(() => {
    if (customer) {
      localStorage.setItem('store_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('store_customer');
    }
  }, [customer]);

  // Fetch catalog on mount
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setCatalogLoading(true);
    setCatalogError('');
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${STORE_API}/products`),
        fetch(`${STORE_API}/categories`),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setCatalogError('No se pudo cargar el catálogo. Verifica que el servidor esté activo.');
    } finally {
      setCatalogLoading(false);
    }
  };

  // ── Toast helper ───────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Cart actions ───────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        if (existing.cantidad >= product.stock) {
          showToast(`Solo hay ${product.stock} unidades disponibles.`, 'warning');
          return prev;
        }
        showToast(`${product.nombre} +1 al carrito`, 'success');
        return prev.map((i) =>
          i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      if (product.stock <= 0) {
        showToast('Producto sin stock disponible.', 'warning');
        return prev;
      }
      showToast(`${product.nombre} agregado al carrito 🛒`, 'success');
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
    showToast('Producto eliminado del carrito.', 'info');
  };

  const updateQuantity = (productId, qty) => {
    const q = parseInt(qty);
    if (isNaN(q) || q < 1) return;
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id !== productId) return i;
        if (q > i.stock) {
          showToast(`Máximo disponible: ${i.stock}`, 'warning');
          return { ...i, cantidad: i.stock };
        }
        return { ...i, cantidad: q };
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.cantidad * i.precio, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.cantidad, 0),
    [cartItems]
  );

  // ── Customer actions ───────────────────────────────────────────────────
  const loginCustomer = async (nombre, correo) => {
    const res = await fetch(`${STORE_API}/client/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al ingresar.');
    setCustomer(data.client);
    return data;
  };

  const logoutCustomer = () => {
    setCustomer(null);
    clearCart();
  };

  // ── Place order ────────────────────────────────────────────────────────
  const placeOrder = async ({ direccion_envio, telefono, notas }) => {
    if (!customer) throw new Error('Debes identificarte primero.');
    if (cartItems.length === 0) throw new Error('El carrito está vacío.');

    const payload = {
      cliente_id: customer.id,
      items: cartItems.map((i) => ({
        producto_id: i.id,
        cantidad: i.cantidad,
      })),
      direccion_envio,
      telefono,
      notas,
    };

    const res = await fetch(`${STORE_API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear el pedido.');

    clearCart();
    await fetchCatalog(); // Refresh stock
    return data.order._email ? data.order : { ...data.order, _email: data.email || null };
  };

  return (
    <StoreContext.Provider
      value={{
        customer,
        loginCustomer,
        logoutCustomer,
        products,
        categories,
        catalogLoading,
        catalogError,
        fetchCatalog,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartOpen,
        setCartOpen,
        placeOrder,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
