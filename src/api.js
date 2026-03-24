const API_URL =
  import.meta.env.VITE_URL_BACKEND ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api';

function getToken() {
  const session = localStorage.getItem('session');
  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session).token;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Error en la solicitud');
  }

  return response.json();
}

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  listProducts: () => request('/products'),
  adjustInventory: (productId, delta) =>
    request(`/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    }),
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  listOrders: () => request('/orders'),
  listOrderHistory: (email) => request(`/orders/history?email=${encodeURIComponent(email)}`),
  processPayment: (orderId, paymentMethodId, amount) =>
    request('/payments', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, paymentMethodId }),
    }),
};
