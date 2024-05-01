'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'

import classes from './index.module.scss'

export const priceFromJSON = (price: string, quantity: string = '1',raw?: boolean): string => {
  const formattedPrice =  +price * +quantity
  return formattedPrice.toString()
}

export const Price: React.FC<{
  product: Product
  quantity?: string
  button?: 'addToCart' | 'removeFromCart' | false
}> = props => {
  const { product, product: { price } = {}, button = 'addToCart', quantity } = props
  const [formattedPrice, setFormattedPrice] = useState<string>('')
  const [priceWithQuantity, setPriceWithQuantity] = useState<string>('')

  useEffect(() => {
    if (price) {
      setFormattedPrice(priceFromJSON(price))
      setPriceWithQuantity(priceFromJSON(price, quantity))
    }
  }, [price, quantity])

  return (
    <div className={classes.actions}>
      {formattedPrice && priceWithQuantity && (
        <div className={classes.price}>
          <p>{priceWithQuantity}</p>
        </div>
      )}
    </div>
  )
}
