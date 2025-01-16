"use client"
import React, { useEffect } from 'react'
import AppContent from './AppContent'

const Application = () => {
  const [vacancy, setVacancy] = React.useState(null);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await fetch('/api/firebase/vacancies?jobId=1', { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch vacancy")
        const data = await response.json();
        setVacancy({
          ...data,
          status: data.isOpen ? "open" : "closed",
          message: data.isOpen ? "Interested? Apply down below." : "No vacancies available.",
        });
      } catch(error) {
        console.error("Error fetching vacancy status:", error);
        setVacancy({ status: "closed", message: "No vacancies available" });
      }
    };

    fetchVacancy();
  }, []);

  if (!vacancy) 
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
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )

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
            {vacancy.status === "open" ? (
              <>
                {/* If vacancies are available */}
                <p>{vacancy.message}</p>
                <AppContent />
              </>
            ) : (
              <>
                {/* If vacancies are not available */}
                <p>{vacancy.message}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Application