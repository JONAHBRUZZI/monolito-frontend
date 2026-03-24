import React, { useMemo, useState } from 'react';

export default function OrderComposer({ cart, setCart, onSubmit }) {
  const [email, setEmail] = useState('cliente@gmail.com');
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [shippingAddress, setShippingAddress] = useState('');
  const disabled = cart.length === 0;

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0),
    [cart]
  );

  const shipping = subtotal >= 60 || subtotal === 0 ? 0 : 5.9;
  const total = subtotal + shipping;

  function updateQuantity(productId, quantity) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: Number(quantity) || 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <section className="checkout-card">
      <h2>Tu carrito</h2>
      <label>
        Email de compra
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>

      <div className="cart-list">
        {cart.map((item) => (
          <article key={item.productId} className="cart-row">
            <div>
              <strong>{item.name}</strong>
              <p className="muted">${Number(item.price).toFixed(2)} c/u</p>
            </div>
            <div className="qty-box">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, e.target.value)}
              />
              <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="totals-box">
        <p><span>Items</span><strong>{totalItems}</strong></p>
        <p><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></p>
        <p><span>Envío</span><strong>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</strong></p>
        <p className="grand-total"><span>Total</span><strong>${total.toFixed(2)}</strong></p>
      </div>

      <label>
        Metodo de envio
        <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
          <option value="STANDARD">Estandar (2-4 dias)</option>
          <option value="EXPRESS">Express (24h)</option>
          <option value="PICKUP">Retiro en tienda</option>
        </select>
      </label>

      <label>
        Direccion de envio
        <input
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          type="text"
          placeholder="Calle, numero, ciudad, referencia"
          disabled={shippingMethod === 'PICKUP'}
          required={shippingMethod !== 'PICKUP'}
        />
      </label>

      <button
        className="checkout-button"
        disabled={disabled || (shippingMethod !== 'PICKUP' && shippingAddress.trim().length < 8)}
        onClick={() =>
          onSubmit({
            email,
            shippingMethod,
            shippingAddress:
              shippingMethod === 'PICKUP' ? 'Retiro en tienda principal' : shippingAddress,
          })
        }
      >
        Continuar al pago
      </button>

      {disabled && <p className="muted">Agrega productos para iniciar el checkout.</p>}
    </section>
  );
}
