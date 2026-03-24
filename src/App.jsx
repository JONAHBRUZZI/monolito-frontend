import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPanel from './components/LoginPanel';
import ProductGrid from './components/ProductGrid';
import OrdersPanel from './components/OrdersPanel';
import ManualInventoryPanel from './components/ManualInventoryPanel';
import PaymentForm from './components/PaymentForm';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

function InternalControlView({ orders, products, onUpdateInventory }) {
  return (
    <div className="columns">
      <OrdersPanel orders={orders} />
      <ManualInventoryPanel products={products} onUpdate={onUpdateInventory} />
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('session');
    if (!saved) {
      return null;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [message, setMessage] = useState('');
  const [pendingPayment, setPendingPayment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  async function loadData() {
    try {
      const productsData = await api.listProducts();
      setProducts(productsData);

      if (session) {
        const [ordersData, historyData] = await Promise.all([
          api.listOrders(),
          api.listOrderHistory(session.email),
        ]);
        setOrders(ordersData);
        setHistory(historyData);
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [session]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  async function handleLogin(credentials) {
    try {
      const response = await api.login(credentials.email, credentials.password);
      localStorage.setItem('session', JSON.stringify(response));
      setSession(response);
      setMessage(`Hola ${response.displayName}, bienvenido.`);

      const from = location.state?.from?.pathname || '/tienda';
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.message || 'Error al iniciar sesión');
    }
  }

  function handleLogout() {
    localStorage.removeItem('session');
    setSession(null);
    // We don't clear the cart on logout, so the user can log in and recover it.
    setPendingPayment(null);
    setMessage('Sesión cerrada');
    navigate('/login');
  }

  function addToCart(product, quantity = 1) {
    setCart((prev) => {
      const exists = prev.find((item) => item.productId === product.productId);
      if (exists) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }

  async function createOrder(checkoutData) {
    try {
      const response = await api.createOrder({
        customerEmail: session.email, // Use session email
        shippingMethod: checkoutData.shippingMethod,
        shippingAddress: checkoutData.shippingAddress,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setPendingPayment(response);
      setMessage('Orden creada, pendiente de pago.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleUpdateInventory(productId, quantity) {
    try {
      await api.updateInventory(productId, quantity);
      await loadData();
      setMessage('Inventario actualizado.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (pendingPayment) {
    return (
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          order={pendingPayment}
          onSuccess={() => {
            setPendingPayment(null);
            setCart([]); // Clear cart after successful payment
            loadData();
            setMessage('¡Pago completado con éxito!');
            navigate('/tienda');
          }}
        />
      </Elements>
    );
  }

  // The login page is rendered outside the main shell
  if (location.pathname === '/login') {
    return <LoginPanel onLogin={handleLogin} message={message} />;
  }

  return (
    <div className="app-shell">
      <Header session={session} onLogout={handleLogout} cart={cart} />
      <main className="main-content layout">
        {message && <p className="message">{message}</p>}
        <Routes>
          <Route path="/login" element={<LoginPanel onLogin={handleLogin} />} />
          <Route path="/tienda" element={<ProductGrid products={products} onAddToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} />} />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                session={session}
                cart={cart}
                createOrder={createOrder}
                pendingPayment={pendingPayment}
                setPendingPayment={setPendingPayment}
              />
            }
          />
          <Route
            path="/interno"
            element={
              session?.role === 'INTERNAL' ? (
                <InternalControlView
                  orders={orders}
                  products={products}
                  onUpdateInventory={handleUpdateInventory}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/tienda" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
