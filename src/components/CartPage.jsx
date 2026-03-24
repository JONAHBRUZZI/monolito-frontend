import React from 'react';
import { Link } from 'react-router-dom';

export default function CartPage({ cart, onUpdateCart }) {
  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <h2>Tu Carrito está Vacío</h2>
        <p>Parece que aún no has añadido ningún perfume a tu carrito.</p>
        <Link to="/tienda" className="button-primary">
          <i className="fas fa-store"></i> Explorar la Tienda
        </Link>
      </div>
    );
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Tu Carrito de Compras</h1>
        <p>Tienes {totalItems} productos en tu carrito.</p>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-quantity">
                {/* Quantity controls can be added here */}
                <span>Cantidad: {item.quantity}</span>
              </div>
              <div className="cart-item-total">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="cart-item-remove">
                {/* Remove button can be added here */}
                <button title="Eliminar"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Resumen del Pedido</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="button-primary checkout-button">
            Proceder al Pago <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
