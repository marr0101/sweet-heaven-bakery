import React, { createContext, useContext, useState, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedClient, setSelectedClient] = useState({ id: 1, nombre: 'Público', apellido: 'General' });
  const { showToast } = useToast();

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.cantidad >= product.stock) {
          showToast(`No puedes agregar más de este producto. Stock disponible: ${product.stock}`, 'warning');
          return prevItems;
        }
        showToast(`Cantidad incrementada para ${product.nombre}`, 'success');
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        if (product.stock <= 0) {
          showToast(`Producto ${product.nombre} agotado.`, 'warning');
          return prevItems;
        }
        showToast(`${product.nombre} agregado al carrito`, 'success');
        return [...prevItems, { ...product, cantidad: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    showToast('Producto removido del carrito', 'info');
  };

  const updateQuantity = (productId, qty) => {
    const parsedQty = parseInt(qty);
    if (isNaN(parsedQty) || parsedQty < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          if (parsedQty > item.stock) {
            showToast(`Solo hay ${item.stock} unidades disponibles en stock.`, 'warning');
            return { ...item, cantidad: item.stock };
          }
          return { ...item, cantidad: parsedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedClient({ id: 1, nombre: 'Público', apellido: 'General' });
  };

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
  }, [cartItems]);

  const cartTotal = cartSubtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedClient,
        setSelectedClient,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
