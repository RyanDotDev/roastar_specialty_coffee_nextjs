"use client"
import React, { useEffect } from 'react';
import { AdvancedMarker, Pin, APIProvider, Map } from '@vis.gl/react-google-maps'

const GoogleMaps = ({ apiKey }) => {
  const position = { lat: 51.4064, lng: 0.0158 };
  const markerPosition = { lat: 51.40643, lng: 0.01575 }

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <section id="location" className='map-container'>
      {/* Map title */}
      <h2 className='google-maps-title'>LOCATION</h2>
      <h2>ROASTAR COFFEE</h2>
      <div className='google-maps-address'>
        <p>MONDAY - FRIDAY | 7:45am - 5pm</p>
        <p>SATURDAY | 8am - 5:30pm</p>
        <p>SUNDAY | 9am - 5pm</p>
      </div>
      <p>8 EAST ST, BROMLEY, BR1 1QX</p>
      {/* Map content */}
      <div  className='google-maps'>
        {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <Map 
            style={{ width: '100%', height: '100vh' }}
            defaultCenter={position} 
            defaultZoom={20} 
            mapId="DEMO_MAP_ID"
          >
            <AdvancedMarker position={markerPosition}>
              <Pin 
                background={'var(--main-green)'}
                borderColor={'black'}
                glyphColor={'black'}
                scale={1.2}
              />
            </AdvancedMarker>
          </Map>
        </APIProvider>
        ) : (
          <p style={{ height: '100vh', position: 'relative', top: '21.5rem' }}>...Loading</p>
        )}
      </div>
    </section>
  )
}

export default GoogleMaps