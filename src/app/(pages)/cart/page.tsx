import apiServices from '@/services/apiServices'
import CartContents from '@/components/cart/CartContents'
import RequestError from '@/components/shared/RequestError'
import { toResult } from '@/lib/apiError'

export default async function Cart() {

  const result = await toResult(apiServices.getUserCart())

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Shopping cart</h1>
      {result.ok ? (
        // A different cart (another user) or a newer version of it -> a fresh CartContents
        <CartContents key={`${result.data.cartId}-${result.data.data?.updatedAt}`} cart={result.data} />
      ) : (
        <RequestError
          title="We couldn't load your cart"
          message={result.error.message}
          needsSignIn={result.error.isUnauthorized}
        />
      )}
    </main>
  )
}
