import { Suspense } from 'react'
import RedirectHandler from './RedirectHandler'

export default function RedirectPage() {
  return (
    <Suspense fallback={<p>Loading redirect...</p>}>
      <RedirectHandler />
    </Suspense>
  )
}