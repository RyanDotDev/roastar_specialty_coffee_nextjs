'use client'

export const dynamic = 'force-dynamic';

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Redirect() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const intentId = searchParams.get('payment_intent')
    const status = searchParams.get('redirect_status')

    if (intentId && status === 'succeeded') {
      router.replace(`/confirmation/${intentId}`)
    } else {
      router.replace('/checkout?error=payment_failed')
    }
  }, [searchParams, router])

  return <p>Redirecting to confirmation…</p>
}