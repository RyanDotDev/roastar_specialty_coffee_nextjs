import React from 'react'
import Header from './components/Header'
import Products from './components/Products'
import '@/styles/shop.css'

const page = () => {
  return (
    <div className='shop-container'>
      <Header />
      <Products />
    </div>
  )
}

export default page