import React from 'react'
import Banner from './components/Banner'
import HomeContainer from './components/HomeContainer'
import ClearCartOnReturn from './components/ClearCartOnReturn'

const Home = () => {
  return (
    <main className='container'>
      <ClearCartOnReturn />
      <Banner />
      <HomeContainer />
    </main>
  )
}

export default Home