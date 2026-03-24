import React, { useState } from 'react';

export default function ManualInventoryPanel({ products, onUpdate }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [delta, setDelta] = useState(1);

  const selectedProductDetails = products.find(p => p.productId === Number(selectedProduct));

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedProduct || delta === 0) return;
    onUpdate(Number(selectedProduct), delta);
    // Reset form for next adjustment
    setSelectedProduct('');
    setDelta(1);
  }

  return (
    <section className="admin-panel card">
      <div className="card-header">
        <h2><i className="fas fa-dolly-flatbed"></i> Ajuste de Inventario</h2>
        <p>Registra entradas o salidas de stock manualmente.</p>
      </div>
      <form className="inventory-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product-select">
            <i className="fas fa-box-open"></i> Producto
          </label>
          <select
            id="product-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar un perfume...</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
          {selectedProductDetails && (
            <div className="product-stock-info">
              Stock Actual: <strong>{selectedProductDetails.stock}</strong> unidades
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quantity-adjust">
            <i className="fas fa-sort-numeric-up-alt"></i> Cantidad a Ajustar
          </label>
          <input
            id="quantity-adjust"
            type="number"
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value || 0))}
            placeholder="Ej: 10, -5"
            required
          />
          <small>Usa un número positivo para agregar stock y uno negativo para quitar.</small>
        </div>

        <button
          type="submit"
          className="button-primary"
          disabled={!selectedProduct || delta === 0}
        >
          <i className="fas fa-check-circle"></i> Aplicar Ajuste
        </button>
      </form>
    </section>
  );
}
