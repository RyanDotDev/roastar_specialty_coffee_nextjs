import React, { useState, useEffect } from 'react';
import { AdvancedMarker, Pin, APIProvider, Map } from '@vis.gl/react-google-maps'

const GoogleMaps = () => {
  const [apiKey, setApiKey] = useState('');
  const position = { lat: 51.4064, lng: 0.0158 };
  const markerPosition = { lat: 51.40648, lng: 0.01576 }

  useEffect(() => {
    // Fetch API key from backend
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/google-maps');
        const data = await response.json();
        setApiKey(data.apiKey)
      } catch(error) {
        console.error('Error fetching API key', error);
      }
    };

    fetchApiKey();

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
      <h2>ROASTAR SPECIALTY COFFEE</h2>
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
          <p>Loading map...</p>
        )}
      </div>
    </section>
  )
}

export default GoogleMaps