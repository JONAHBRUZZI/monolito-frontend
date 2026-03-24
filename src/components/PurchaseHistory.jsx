import React from 'react';

const SHIPPING_LABELS = {
  STANDARD: 'Envio estandar',
  EXPRESS: 'Envio express',
  PICKUP: 'Retiro en tienda',
};

export default function PurchaseHistory({ orders }) {
  return (
    <section className="history-card">
      <h3>Historial de compras</h3>
      {orders.length === 0 && <p className="muted">Aun no tienes compras registradas.</p>}

      <div className="history-list">
        {orders.map((order) => (
          <article key={order.orderId} className="history-item">
            <div>
              <strong>Pedido #{order.orderId}</strong>
              <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <p>Estado: {order.status}</p>
            <p>Metodo de envio: {SHIPPING_LABELS[order.shippingMethod] ?? order.shippingMethod}</p>
            <p>Direccion: {order.shippingAddress}</p>
            <p><strong>Total: ${Number(order.totalAmount).toFixed(2)}</strong></p>
          </article>
        ))}
      </div>
    </section>
  );
}
