'use client'

import React, { useCallback } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

import { Order } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { priceFromJSON } from '../../../_components/Price'
import { useCart } from '../../../_providers/Cart'
import axios from 'axios';
import classes from './index.module.scss'

interface CheckoutFormProps {
  saleId: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ saleId }) => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { cart, cartTotal } = useCart()

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await axios.post(
          'https://sandbox.payme.io/api/generate-sale',
          {
            "layout": "string",
            "currency": "ILS",
            "language": "he",
            "sale_name": "Test User",
            "sale_type": "sale",
            "market_fee": 0.5,
            "sale_email": "test@payme.io",
            "sale_price": 1000,
            "sale_mobile": "+9725254448888",
            "installments": "1",
            "product_name": "Smartphone",
            "capture_buyer": false,
            "transaction_id": "12345",
            "sale_return_url": "https://www.payme.io",
            "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
            "sale_callback_url": "https://www.payme.io",
            "sale_payment_method": "credit-card",
            "sale_send_notification": true,
            "buyer_perform_validation": false
          },
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("response", response.data); // Handle PayMe API response

        // Redirect to order confirmation page
        router.push(`/order-confirmation?order_id=${response.data.order_id}`);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
        setIsLoading(false);
      }
    },
    [router, cartTotal]
  );

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {error && <Message error={error} />}
      <PaymentElement />
      <div className={classes.actions}>
        <Button label="Back to cart" href="/cart" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Checkout'}
          type="submit"
          appearance="primary"
          disabled={isLoading}
        />
      </div>
    </form>
  )
}

export default CheckoutForm
