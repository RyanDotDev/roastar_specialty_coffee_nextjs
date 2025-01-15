import React, { useState, useEffect } from 'react'
import { Badge } from '@mui/material';
import { ShoppingCart } from 'lucide-react'

const CartButton = ({ cart, colourOnScroll, cartOpen, open, close }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null;
  }

  return (
    <Badge
      badgeContent={cart.length}
      invisible={cart.length === 0}
      className='cart-badge'
      color="secondary"
      sx={{
        "& .MuiBadge-badge": {
          right: 12,
          top: '1px',
          padding: '0 4px',
          height: '14px',
          minWidth: '13px',
          zIndex: 100,
          fontVariantNumeric: 'tabular-nums',
        }
      }}
    >
      <button 
        className={`cart-btn ${colourOnScroll ? 'cart-white cart-black' : 'cart-white'}` }
        onClick={() => cartOpen ? close() : open()}
      >
        <ShoppingCart
          style={{
            position: 'absolute', 
            left: '6px', 
            top: '7px'
          }}
        />
      </button>
    </Badge>
  )
}

export default CartButton