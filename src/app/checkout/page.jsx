import React, { Suspense } from 'react';
import CheckoutContainer from './components/CheckoutContainer';

const page = () => {
  return (
    <Suspense >
      <CheckoutContainer />
    </Suspense>
  )
}

export default page;
