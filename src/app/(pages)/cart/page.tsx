import apiServices from '@/services/apiServices'
import CartContents from '@/components/cart/CartContents'

export default async function Cart() {

  const cartResponse = await apiServices.getUserCart()

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Shopping cart</h1>
      {/* A different cart (another user) or a newer version of it -> a fresh CartContents */}
      <CartContents key={`${cartResponse.cartId}-${cartResponse.data?.updatedAt}`} cart={cartResponse} />
    </main>
  )
}
