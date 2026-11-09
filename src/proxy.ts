import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  const token = await getToken({req:request})

  const isAuthenticated = !!token
  const pathname= request.nextUrl.pathname


if(isAuthenticated&& pathname==="/auth/signin"||pathname==="/auth/signup"){
  return NextResponse.redirect(new URL("/products",request.url))
}
if(!isAuthenticated&& pathname==="/cart"||pathname==="/allorders"){
  return NextResponse.redirect(new URL("/auth/signin",request.url))
}

return NextResponse.next()
}

export const config = {
matcher: ['/cart',"/allorders","/auth/signin","/auth/signup"],
}