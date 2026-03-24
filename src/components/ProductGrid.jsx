import React, { useMemo, useState } from 'react';

export default function ProductGrid({ products, onAdd }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const text = `${product.name} ${product.sku}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === 'price-desc') {
      return [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === 'stock-desc') {
      return [...filtered].sort((a, b) => Number(b.available) - Number(a.available));
    }

    return filtered;
  }, [products, query, sortBy]);

  return (
    <section className="catalog-shell">
      <div className="catalog-toolbar">
        <h2>Tienda</h2>
        <div className="catalog-controls">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o SKU"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="stock-desc">Mayor stock</option>
          </select>
        </div>
      </div>

      <div className="store-grid">
        {visibleProducts.map((product) => (
          <article key={product.productId} className="product-card">
            <div className="product-visual">
              <span className="sku-badge">{product.sku}</span>
            </div>
            <div className="product-body">
              <h3>{product.name}</h3>
              <p className="product-price">${Number(product.price).toFixed(2)}</p>
              <p className="product-stock">
                {product.available > 0 ? `Disponibles: ${product.available}` : 'Agotado'}
              </p>
              <button disabled={product.available === 0} onClick={() => onAdd(product)}>
                {product.available > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p className="muted">No encontramos productos con ese criterio de búsqueda.</p>
      )}
    </section>
  );
}
