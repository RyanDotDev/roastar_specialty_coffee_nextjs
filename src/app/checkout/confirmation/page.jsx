import dynamic from 'next/dynamic'

const CheckoutReturnRedirect = dynamic(() => import('./RedirectClient'), {
  ssr: false,
})

export default function RedirectPage() {
  return <CheckoutReturnRedirect />
}