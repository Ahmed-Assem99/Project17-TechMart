import {
  CartResponse,
  CheckoutResponse,
  ProductDetailsResponse,
  ProductResponse,
  SigninResponse,
} from "@/types/response";

class ApiServices {
  #headers = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZTlkN2NhY2ZlYTNkMDAxMzA4Mjk3MyIsIm5hbWUiOiJBaG1lZCBBc3NlbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkzNzEwMDI2LCJleHAiOjE4MDE0ODYwMjZ9.caTLXoHQfobIPc412EJN2yA4Uj0mUMLRO-_U9F6XuvM",
    "content-type": "application/json",
  };

  async getProducts(): Promise<ProductResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/products",
    );
    const data = await response.json();

    return data;
  }
  getProductDetails(productId: string): Promise<ProductDetailsResponse> {
    return fetchProductDetails(productId);
  }

  async addProductToCart(productId: string): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart",
      {
        body: JSON.stringify({
          productId,
        }),
        headers: this.#headers,
        method: "post",
      },
    );
    const data = await response.json();

    return data;
  }

  async getUserCart(): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart",
      {
        headers: this.#headers,
      },
    );
    const data = await response.json();

    return data;
  }

  async removeProductFromCart(productId: string): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        headers: this.#headers,
        method: "delete",
      },
    );
    const data = await response.json();

    return data;
  }
  async clearProductsFromCart(): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart",
      {
        headers: this.#headers,
        method: "delete",
      },
    );
    const data = await response.json();

    return data;
  }

  async updateProductCount(
    productId: string,
    count: number,
  ): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        body: JSON.stringify({
          count,
        }),
        headers: this.#headers,
        method: "put",
      },
    );
    const data = await response.json();
    return data;
  }

  async Checkout(cartId: string, shippingAddress: any):Promise<CheckoutResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`,
      {
        body: JSON.stringify(shippingAddress),
        headers: this.#headers,
        method: "post",
      },
    );
    const data = await response.json()
    return data
  }
  async Signin(email:string,password:string):Promise<SigninResponse>{
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/v1/auth/signin",{
        method:"post",
        body:JSON.stringify({
            email,
            password
        }),
        // Tells the API the body is JSON. Without it the API can't read email/password
        headers:{
            "content-type":"application/json"
        }
    })
    const data = await response.json()
    return data
  }
}

// "use cache" isn't allowed on class instance methods, so the cached fetch lives here
async function fetchProductDetails(
  productId: string,
): Promise<ProductDetailsResponse> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/products/" + productId,
  );
  const data = await response.json();

  return data;
}

const apiServices = new ApiServices();
export default apiServices;
