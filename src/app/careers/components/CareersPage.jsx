"use client"
import React, { useEffect } from 'react'
import AppButton from './AppButton'

const CareersPage = () => {
  const [vacancy, setVacancy] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchVacancy = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/firebase/vacancies?jobId=1', { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch vacancy")
        const data = await response.json();
        if (data && typeof data === 'object') {
          setVacancy({
            ...data,
            status: data.isOpen ? "open" : "closed",
            message: data.isOpen ? "Interested? Apply down below." : "No vacancies available.",
          });
        } else {
          throw new Error('Invalid vacancy data received')
        }
        setError(null);
      } catch(error) {
        console.error("Error fetching vacancy status:", error);
        setError("Failed to fetch vacancy details. Please try again later.");
        setVacancy({ status: "closed", message: "No vacancies available" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVacancy();
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, []);

  if (loading) 
    return (
      <div className='app-container'>
        <div className='app-content'>
          <h2>JOIN THE TEAM</h2>
          <div className='careers-image'>
            <img 
              src='/images/imageThree.webp'
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
               you the ways of roastery styled coffee.
            </p>
            <div className='apply'>
              <p>Loading vacancy status</p>
            </div>
          </div>
        </div>
      </div>
    )

    if (error) 
      return (
        <div className='app-container'>
          <div className='app-content'>
            <h2>JOIN THE TEAM</h2>
            <div className='careers-image'>
              <img 
                src='/images/imageThree.webp'
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
                 you the ways of roastery styled coffee.
              </p>
              <div className='apply'>
                <p>{error}</p>
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
            src='/images/imageThree.webp'
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
             you the ways of roastery styled coffee.
          </p>
          <div className='apply'>
            {vacancy.status === "open" ? (
              <>
                {/* If vacancies are available */}
                <p>{vacancy.message}</p>
                <AppButton />
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

export default CareersPage