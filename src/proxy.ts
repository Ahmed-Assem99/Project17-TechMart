import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  // Same secret as authOptions in src/lib/auth.ts. Without it getToken looks for
  // NEXTAUTH_SECRET first, and a different value there would sign everyone out
  const token = await getToken({req:request, secret:process.env.AUTH_SECRET})

  const isAuthenticated = !!token
  const pathname= request.nextUrl.pathname


// The brackets matter: && runs before ||, so without them the
// pathname check after || would apply to every user, logged in or not
if(isAuthenticated && (pathname==="/auth/signin"||pathname==="/auth/signup")){
  return NextResponse.redirect(new URL("/products",request.url))
}
if(!isAuthenticated && (pathname==="/cart"||pathname==="/allorders"||pathname==="/addresses"||pathname.startsWith("/checkout"))){
  return NextResponse.redirect(new URL("/auth/signin",request.url))
}

return NextResponse.next()
}

export const config = {
// "/checkout/:path*" = /checkout and anything after it, like /checkout/<cartId>
matcher: ['/cart',"/allorders","/addresses","/checkout/:path*","/auth/signin","/auth/signup"],
}