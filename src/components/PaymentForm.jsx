import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../api';

export default function PaymentForm({ orderId, total, customerEmail, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage('Stripe aún no está cargado');
      return;
    }

    setLoading(true);
    setMessage('Procesando pago...');

    try {
      const cardElement = elements.getElement(CardElement);

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { email: customerEmail },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        onError(error.message);
        setLoading(false);
        return;
      }

      const result = await api.processPayment(orderId, paymentMethod.id, total);

      if (result.status === 'succeeded') {
        setMessage('¡Pago completado!');
        onSuccess(result);
      } else if (result.status === 'requires_action') {
        setMessage('Se requiere autenticación adicional');
        onError('requires_action');
      } else {
        setMessage('El pago fue rechazado');
        onError(result.message);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <h3>Procesar Pago</h3>
      <p>Monto a pagar: ${total}</p>

      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1b2838',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#fa755a' },
            },
          }}
        />
      </div>

      {message && <p className={`message ${loading ? '' : 'error'}`}>{message}</p>}

      <button type="submit" disabled={!stripe || loading} className="pay-button">
        {loading ? 'Procesando...' : `Pagar $${total}`}
      </button>

      <p className="test-info">
        Usa 4242 4242 4242 4242 para pruebas (expiry: 12/25, CVC: 123)
      </p>
    </form>
  );
}
