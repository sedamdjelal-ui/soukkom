'use client'

import { useCart } from './CartContext'

type Props = {
  id: string
  name: string
  price: number
  image?: string
  disabled?: boolean
}

export default function AddToCartButton({ id, name, price, image, disabled }: Props) {
  const { addItem } = useCart()

  const handleClick = () => {
    addItem({ id, name, price, quantity: 1, image })
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-brand text-brand-dark hover:bg-brand-dark hover:text-white'
      }`}
    >
      {disabled ? 'غير متوفر' : 'أضف إلى السلة'}
    </button>
  )
}