import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Redirect = dynamic(() => import('./Redirect'), { ssr: false })

export default function RedirectPage() {
  return (
    <Suspense fallback={<p>Redirecting...</p>}>
      <Redirect />
    </Suspense>
  )
}