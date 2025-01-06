import React from 'react'
import Header from './components/Header'
import Products from './components/Products'
import '../../App.css'
import './Shop.css'
import Footer from '../../components/Footer'

const Shop = () => {
  return (
    <div className='shop-container'>
      <Header />
      <Products />
      <Footer />
    </div>
  )
}

export default Shop