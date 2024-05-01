'use client'

import React from 'react'
import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'

import classes from './index.module.scss'
import axios from 'axios'
import { useRouter } from 'next/router'


export const CheckoutForm: React.FC<{}> = () => {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCheckout = async (e) => {
    e.preventDefault()

    const data = {
      pageCode: '0b7a16e03b25',
      userId: '4ec1d595ae764243',
      apiKey: '57ce86548429',
      chargeType: 1,
      sum: 2,
      successUrl: 'https://mysite.co.il/thank.html?test=1',
      cancelUrl: 'https://mysite.co.il',
      paymentNum: 10,
      maxPaymentNum: 12,
      saveCardToken: 1,
      description: 'Course',
      'pageField[invoiceName]': 'Jon Jon',
      'pageField[fullName]': 'Dor Teri',
      'pageField[phone]': '0538278886',
      'pageField[email]': 'dortayari@gmail.com',
      cField1: 'my_key123',
      cField2: 'next456',
      'product_data[0][catalog_number]': 8787989,
      'product_data[0][quantity]': 2,
      'product_data[0][price]': 1,
      'product_data[0][item_description]': 'first item description',
      notifyUrl: 'Url for server to sever request',
      companyCommission: 2.5,
      sendingMode: 1
    };

    try {
      const response = await axios.post('https://sandbox.meshulam.co.il/api/light/server/1.0/createFarPaymentRequest', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log("response", response.data); // Handle PayMe API response

      // Redirect to order confirmation page
      router.push(`/order-confirmation?order_id=${response.data.order_id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  }


  return (
    <form onSubmit={(e) => handleCheckout(e)} className={classes.form}>
      {error && <Message error={error} />}
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
