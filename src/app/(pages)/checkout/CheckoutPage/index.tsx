'use client'

import React, { Fragment, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { useTheme } from '../../../_providers/Theme'
import cssVariables from '../../../cssVariables'
import { CheckoutForm } from '../CheckoutForm'
import { CheckoutItem } from '../CheckoutItem'

import classes from './index.module.scss'
import axios from 'axios'


export const CheckoutPage: React.FC<{
  settings: Settings
}> = props => {
  const {
    settings: { productsPage },
  } = props

  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [saleId, setSaleId] = React.useState<string | null>(null);
  const { theme } = useTheme()

  const { cart, cartIsEmpty, cartTotal } = useCart()

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  useEffect(() => {
    if (user && cart && !saleId) {
      const generateSale = async () => {
        try {
          const response = await axios.post(
            'https://sandbox.payme.io/api/generate-sale',
            {
              seller_payme_id: 'MPLDEMO-MPLDEMO-MPLDEMO-1234567', // Replace with your PayMe seller ID
              sale_price: 100,
              currency: 'ILS',
              product_name: 'Your Product Description',
              sale_return_url: `${window.location.origin}/order-confirmation`,
              sale_send_notification: true,
              sale_callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payme-callback`, // Replace with your callback URL
            }
          );

          setSaleId(response.data.sale_id);
        } catch (err) {
          setError('Something went wrong.');
        }
      };

      generateSale();
    }
  }, [user, cart, cartTotal, saleId]);

  if (!user) return null

  return (
    <Fragment>
    {cartIsEmpty && (
      <div>
        {'Your '}
        <Link href="/cart">cart</Link>
        {' is empty.'}
        {typeof productsPage === 'object' && productsPage?.slug && (
          <Fragment>
            {' '}
            <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
          </Fragment>
        )}
      </div>
    )}
    {!cartIsEmpty && (
      <div className={classes.items}>
        <div className={classes.header}>
          <p>Products</p>
          <div className={classes.headerItemDetails}>
            <p></p>
            <p className={classes.quantity}>Quantity</p>
          </div>
          <p className={classes.subtotal}>Subtotal</p>
        </div>

        <ul>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object') {
              const {
                quantity,
                product,
                product: { title, meta },
              } = item;

              if (!quantity) return null;

              const metaImage = meta?.image;

              return (
                <Fragment key={index}>
                  <CheckoutItem
                    product={product}
                    title={title}
                    metaImage={metaImage}
                    quantity={quantity}
                    index={index}
                  />
                </Fragment>
              );
            }
            return null;
          })}
          <div className={classes.orderTotal}>
            <p>Order Total</p>
            <p>{cartTotal.formatted}</p>
          </div>
        </ul>
      </div>
    )}
    {!saleId && !error && (
      <div className={classes.loading}>
        <LoadingShimmer number={2} />
      </div>
    )}
    {!saleId && error && (
      <div className={classes.error}>
        <p>{`Error: ${error}`}</p>
        <Button label="Back to cart" href="/cart" appearance="secondary" />
      </div>
    )}
    {saleId && (
      <Fragment>
        <h3 className={classes.payment}>Payment Details</h3>
        <CheckoutForm saleId={saleId} />
      </Fragment>
    )}
  </Fragment>
  )
}
