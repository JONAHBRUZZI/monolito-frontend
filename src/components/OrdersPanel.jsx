import React from 'react';

function getStatusChip(status) {
  const statusMap = {
    PENDING: { label: 'Pendiente', className: 'status-pending' },
    PAID: { label: 'Pagado', className: 'status-paid' },
    SHIPPED: { label: 'Enviado', className: 'status-shipped' },
    DELIVERED: { label: 'Entregado', className: 'status-delivered' },
    CANCELLED: { label: 'Cancelado', className: 'status-cancelled' },
  };
  const { label, className } = statusMap[status] || { label: status, className: 'status-default' };
  return <span className={`status-chip ${className}`}>{label}</span>;
}

export default function OrdersPanel({ orders }) {
  return (
    <section className="admin-panel card">
      <div className="card-header">
        <h2><i className="fas fa-receipt"></i> Pedidos Recientes</h2>
        <p>Monitorea y gestiona los pedidos entrantes.</p>
      </div>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td data-label="ID Pedido">
                    <span className="order-id">#{order.orderId}</span>
                  </td>
                  <td data-label="Cliente">{order.customerEmail}</td>
                  <td data-label="Total" className="currency">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td data-label="Estado">{getStatusChip(order.status)}</td>
                  <td data-label="Fecha">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No hay pedidos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
