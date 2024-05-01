'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'

import classes from './index.module.scss'

export const priceFromJSON = (price: string, quantity: string = '1', raw?: boolean): string => {

  const priceValue = parseFloat(price);
    const quantityValue = parseFloat(quantity);

    // Calculate the total price by multiplying price and quantity
    const totalPrice = priceValue * quantityValue;

    // Format the total price to include commas for thousands and a decimal point
    const formattedPrice = totalPrice.toLocaleString('he-IL', {
        style: 'currency',
        currency: 'ILS'
    });

    // Return the formatted total price
    return formattedPrice;
}

export const Price: React.FC<{
  product: Product
  quantity?: string
  button?: 'addToCart' | 'removeFromCart' | false
}> = props => {
  const { product, product: { price } = {}, button = 'addToCart', quantity } = props
  console.log("product", product)
  console.log("price", price)
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
