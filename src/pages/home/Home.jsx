import React from 'react'
import Banner from './components/Banner'
import HomeContainer from './components/HomeContainer'
import '../../App.css'
import './Home.css'

const Home = () => {
  return (
    <main className='container'>
      <Banner />
      <HomeContainer />
    </main>
  )
}

export default Home