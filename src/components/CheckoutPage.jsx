import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import OrderComposer from './OrderComposer';

export default function CheckoutPage({ session, cart, createOrder, pendingPayment, setPendingPayment }) {
  const location = useLocation();

  if (!session) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to the checkout page
    // after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (cart.length === 0) {
    // If the cart is empty, there's nothing to check out.
    return <Navigate to="/tienda" replace />;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <OrderComposer
          cart={cart}
          onCreateOrder={createOrder}
          pendingPayment={pendingPayment}
          onPaymentSuccess={() => setPendingPayment(null)}
        />
      </div>
    </div>
  );
}
