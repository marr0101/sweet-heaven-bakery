import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';

// Layouts and Route Guards
import Layout from './layouts/Layout';
import StoreLayout from './layouts/StoreLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages  (moved to /admin/*)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Clients from './pages/Clients';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Users from './pages/Users';
import Reports from './pages/Reports';

// Public Store Pages
import StoreHome from './pages/store/StoreHome';
import StoreCatalog from './pages/store/StoreCatalog';
import StoreLogin from './pages/store/StoreLogin';
import StoreCheckout from './pages/store/StoreCheckout';
import AboutUs from './pages/store/AboutUs';
import MyOrders from './pages/store/MyOrders';
import AdminProducts from './pages/store/AdminProducts';

import CustomOrders from './pages/CustomOrders';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <StoreProvider>
                <Routes>

                  {/* ── Public Store (root) ──────────────────────── */}
                  <Route element={<StoreLayout />}>
                    <Route path="/"                  element={<StoreHome />} />
                    <Route path="/productos"         element={<StoreCatalog />} />
                    <Route path="/ingresar"          element={<StoreLogin />} />
                    <Route path="/checkout"          element={<StoreCheckout />} />
                    <Route path="/nosotros"          element={<AboutUs />} />
                    <Route path="/mis-pedidos"       element={<MyOrders />} />
                    <Route path="/gestion-productos" element={<AdminProducts />} />
                  </Route>

                  {/* ── Admin Login ───────────────────────────────── */}
                  <Route path="/admin/login" element={<Login />} />

                  {/* ── Admin Panel (Employee + Admin) ────────────── */}
                  <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Empleado']} />}>
                    <Route element={<Layout />}>
                      <Route path="/admin"           element={<Dashboard />} />
                      <Route path="/admin/ventas"    element={<Sales />} />
                      <Route path="/admin/clientes"  element={<Clients />} />
                      <Route path="/admin/inventario" element={<Inventory />} />
                      <Route path="/admin/reportes"  element={<Reports />} />
                      <Route path="/admin/pedidos-personalizados" element={<CustomOrders />} />
                    </Route>
                  </Route>

                  {/* ── Admin Panel (Admin only) ──────────────────── */}
                  <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route element={<Layout />}>
                      <Route path="/admin/categorias" element={<Categories />} />
                      <Route path="/admin/productos"  element={<Products />} />
                      <Route path="/admin/usuarios"   element={<Users />} />
                    </Route>
                  </Route>

                  {/* Legacy redirects so old bookmarks still work */}
                  <Route path="/login"   element={<Navigate to="/admin/login" replace />} />
                  <Route path="/tienda"  element={<Navigate to="/" replace />} />
                  <Route path="/tienda/*" element={<Navigate to="/" replace />} />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
              </StoreProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
