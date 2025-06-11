"use client"
import React, { useState, useEffect } from 'react';
import AppButton from './AppButton';

const Vacancy = () => {
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId

    const getVacancy = async () => {
      try {
        const res = await fetch('/api/firebase/vacancies?jobId=1', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch vacancy');
        const data = await res.json();
  
        setVacancy({
          ...data,
          isOpen: data.isOpen ? 'open' : 'closed',
          message: data.isOpen
            ? 'Interested? Apply down below.'
            : 'No vacancies available.',
        });
      } catch (err) {
          setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    getVacancy();

    intervalId = setInterval(getVacancy, 30000);

    return () => clearInterval(intervalId);
  }, []);
  
  if (loading) return <div className='apply'><p>Loading vacancies...</p></div>;
  if (error) return <div className='apply'><p className="error">Error: {error}</p></div>
  
  return (
    <div className='apply'>
      {vacancy?.isOpen === 'open' ? (
        <>
          <p>{vacancy.message}</p>
          <AppButton />
        </>
      ) : (
        <p>{vacancy.message}</p>
      )}
    </div>
  )
}

export default Vacancy