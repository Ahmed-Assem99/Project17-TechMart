import {
  AddressesResponse,
  AddressInput,
  AddressResponse,
  BrandResponse,
  CartResponse,
  CashOrderResponse,
  CategoriesResponse,
  CategoryResponse,
  CheckoutResponse,
  ShippingAddress,
  ProductDetailsResponse,
  OrdersResponse,
  ProductResponse,
  ResponseT,
  SigninResponse,
  SubcategoriesResponse,
  VerifyTokenResponse,
} from "@/types/response";
import { BrandI, ProductI } from "@/interfaces/product";
import { getSiteUrl } from "@/lib/siteUrl";

class ApiServices {
  // Builds the headers for every request with the token of whoever is logged in.
  // The token was saved in the session by the jwt/session callbacks in src/lib/auth.ts.
  // apiServices is used in two places, and each one reads the session differently:
  async #getHeaders() {
    let token: string | undefined;

    if (typeof window === "undefined") {
      // SERVER (e.g. cart/page.tsx, allorders/page.tsx):
      // there is no browser here, so getServerSession reads the
      // NextAuth cookie that came with the page request
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/auth");
      const session = await getServerSession(authOptions);
      token = session?.user.token;
    } else {
      // BROWSER (e.g. AddToCartBtn, CartItem, checkout page):
      // getSession asks our own /api/auth/session route for the session
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      token = session?.user.token;
    }

    // await import(...) loads these only when this runs, so the browser never
    // downloads the server-only code and the two files don't import each other at load time
    return {
      token: token ?? "", // logged out -> empty token -> the API answers "please login"
      "content-type": "application/json",
    };
  }

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
        headers: await this.#getHeaders(),
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
        headers: await this.#getHeaders(),
      },
    );
    const data = await response.json();

    return data;
  }

  async removeProductFromCart(productId: string): Promise<CartResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/cart/" + productId,
      {
        headers: await this.#getHeaders(),
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
        headers: await this.#getHeaders(),
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
        headers: await this.#getHeaders(),
        method: "put",
      },
    );
    const data = await response.json();
    return data;
  }

  async Checkout(
    cartId: string,
    shippingAddress: { shippingAddress: ShippingAddress },
  ): Promise<CheckoutResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(getSiteUrl())}`,
      {
        body: JSON.stringify(shippingAddress),
        headers: await this.#getHeaders(),
        method: "post",
      },
    );
    const data = await response.json()
    return data
  }
  // Cash on delivery: creates the order straight away (no Stripe page).
  // The API also empties the user's cart when it succeeds
  async createCashOrder(
    cartId: string,
    shippingAddress: { shippingAddress: ShippingAddress },
  ): Promise<CashOrderResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/orders/" + cartId,
      {
        body: JSON.stringify(shippingAddress),
        headers: await this.#getHeaders(),
        method: "post",
      },
    );
    const data = await response.json();
    return data;
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

  // Step 1: send the token, get back the user it belongs to (decoded.id is the user id)
  async verifyToken(): Promise<VerifyTokenResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/auth/verifyToken",
      {
        headers: await this.#getHeaders(),
      },
    );
    const data = await response.json();
    return data;
  }

  // Step 2: use that user id to get the user's orders
  async getUserOrders(userId: string): Promise<OrdersResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/orders/user/" + userId,
    );
    const data = await response.json();
    return data;
  }

  // ---------- Categories & brands (public, no token needed) ----------

  // The API sends at most 50 items per request (there are 56 products, 54 brands),
  // so this asks for page 1, sees how many pages exist, then gets the rest at the same time
  async #getAllPages<T>(path: string): Promise<T[]> {
    const separator = path.includes("?") ? "&" : "?";
    const getPage = async (page: number): Promise<ResponseT<T>> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${path}${separator}limit=50&page=${page}`,
      );
      return response.json();
    };

    const firstPage = await getPage(1);
    const otherPageNumbers = Array.from(
      { length: (firstPage.metadata?.numberOfPages ?? 1) - 1 },
      (_, index) => index + 2, // [2, 3, ...]
    );
    const otherPages = await Promise.all(otherPageNumbers.map(getPage));

    // [[...page 1], [...page 2]] -> [...all items]
    return [firstPage, ...otherPages].flatMap((page) => page.data ?? []);
  }

  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/categories",
    );
    const data = await response.json();
    return data;
  }

  async getCategory(categoryId: string): Promise<CategoryResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/categories/" + categoryId,
    );
    const data = await response.json();
    return data;
  }

  // Plain /subcategories returns nothing on this API, so we always filter by category
  async getSubcategories(categoryId: string): Promise<SubcategoriesResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/subcategories?category=" + categoryId,
    );
    const data = await response.json();
    return data;
  }

  // All brands from every page
  getBrands(): Promise<BrandI[]> {
    return this.#getAllPages<BrandI>("/api/v1/brands");
  }

  async getBrand(brandId: string): Promise<BrandResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/brands/" + brandId,
    );
    const data = await response.json();
    return data;
  }

  // All products, or only one category's / brand's products
  getAllProducts(filter: { category?: string; brand?: string } = {}): Promise<ProductI[]> {
    let path = "/api/v1/products";
    if (filter.category) path += "?category[in]=" + filter.category;
    else if (filter.brand) path += "?brand=" + filter.brand;
    return this.#getAllPages<ProductI>(path);
  }

  // ---------- Addresses (all need the user's token) ----------

  async getAddresses(): Promise<AddressesResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/addresses",
      {
        headers: await this.#getHeaders(),
      },
    );
    const data = await response.json();
    return data;
  }

  // Returns ONE address by its id
  async getAddress(addressId: string): Promise<AddressResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/addresses/" + addressId,
      {
        headers: await this.#getHeaders(),
      },
    );
    const data = await response.json();
    return data;
  }

  // Returns the FULL list, with the new address at the end
  async addAddress(address: AddressInput): Promise<AddressesResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/addresses",
      {
        body: JSON.stringify(address),
        headers: await this.#getHeaders(),
        method: "post",
      },
    );
    const data = await response.json();
    return data;
  }

  // Returns only the edited address.
  // Careful: the API ignores "name" here, it only updates details/phone/city
  async updateAddress(
    addressId: string,
    address: AddressInput,
  ): Promise<AddressResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/addresses/" + addressId,
      {
        body: JSON.stringify(address),
        headers: await this.#getHeaders(),
        method: "put",
      },
    );
    const data = await response.json();
    return data;
  }

  // Returns the FULL list without the removed address
  async removeAddress(addressId: string): Promise<AddressesResponse> {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/addresses/" + addressId,
      {
        headers: await this.#getHeaders(),
        method: "delete",
      },
    );
    const data = await response.json();
    return data;
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
