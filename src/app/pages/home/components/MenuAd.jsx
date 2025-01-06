import React from 'react'
import { Link } from 'react-router-dom'

const MenuAd = () => {
  return (
    <div className="menu-container">
      <img 
        src="/images/roastar_menu_image.webp"
        height={1000}
        width={1440}
        loading='lazy'
      />
      <div className='menu-content'> 
        <div className='menu-text'>
          <h3>OUR MENU</h3>
          <p>
            From our range of whole grain Vietnamese coffee beans to our homemade Banh Mih sandwiches and baked goods, Our menu
            contains a wide variety of delicious foods, coffee and other beverages guaranteed to satisfy your tastebuds.
            <br></br><br></br>
          </p>
          <div className='menu-link'>
            <Link to='/Menu' reloadDocument>
              <button>VIEW MENU</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuAd