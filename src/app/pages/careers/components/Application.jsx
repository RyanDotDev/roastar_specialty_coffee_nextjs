import React from 'react'
import AppContent from './AppContent'

const Application = () => {
  return (
    <div className='app-container'>
      <div className='app-content'>
        <h2>JOIN THE TEAM</h2>
        <div className='careers-image'>
          <img 
            src='/images/roastar_advert.webp'
            width={1000}
            height={300}
          />
        </div>
        <div className='app-text'>
          <h3>FUN AT WORK? ABSOLUTELY!</h3>
          <p>Here at Roastar, we look after our staff just as much as our customers and always strive to
             maintain a pleasurable experience for all during their visit to our cafe.
          </p>
          <p>We do more than just train our employees to become a great barista, but we encourage a fun,
             friendly and enthusiastic workplace that we make sure you want to come back to whilst teaching
             you the ways of Roastery styled coffee.
          </p>
          <div className='apply'>
            <p>Interested? Apply down below.</p>
            <AppContent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Application