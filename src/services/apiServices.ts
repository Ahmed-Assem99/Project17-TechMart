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
import { ApiError } from "@/lib/apiError";
import { getSiteUrl } from "@/lib/siteUrl";
import { unstable_rethrow } from "next/navigation";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  // true -> send the signed-in user's token
  auth?: boolean;
};

// The API describes errors in two shapes:
//   { statusMsg: "fail", message: "Incorrect email or password" }
//   { message: "fail", errors: { msg: "Invalid ID format" } }
type ApiErrorBody = {
  status?: string;
  statusMsg?: string;
  message?: string;
  errors?: { msg?: string };
};

function getApiMessage(body: ApiErrorBody | null): string | undefined {
  if (body?.errors?.msg) return body.errors.msg;
  if (body?.message && body.message !== "fail") return body.message;
}

class ApiServices {
  // The token of whoever is signed in. It was saved in the session by the jwt/session
  // callbacks in src/lib/auth.ts. apiServices is used in two places, and each one reads
  // the session differently:
  async #getToken(): Promise<string> {
    let token: string | undefined;

    if (typeof window === "undefined") {
      // SERVER (e.g. cart/page.tsx, allorders/page.tsx):
      // there is no browser here, so getServerSession reads the
      // NextAuth cookie that came with the page request
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/auth");
      const session = await getServerSession(authOptions);
      token = session?.user?.token;
    } else {
      // BROWSER (e.g. AddToCartBtn, CartItem, checkout page):
      // getSession asks our own /api/auth/session route for the session
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      token = session?.user?.token;
    }
    // await import(...) loads these only when this runs, so the browser never
    // downloads the server-only code and the two files don't import each other at load time

    if (!token) throw new ApiError("Please sign in to continue.", 401);
    return token;
  }

  // Every API call goes through here, so errors are handled in ONE place.
  // It returns the data, or throws an ApiError.
  async #request<T>(
    path: string,
    { method = "GET", body, auth = false }: RequestOptions = {},
  ): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

    const headers: Record<string, string> = {};
    if (body !== undefined) headers["content-type"] = "application/json";
    if (auth) headers.token = await this.#getToken();

    // 1. Send it. fetch only throws when the server can't be reached
    let response: Response;
    try {
      response = await fetch(baseUrl + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        // A user's private data must never be saved in a cache
        ...(auth && { cache: "no-store" as const }),
      });
    } catch (error) {
      unstable_rethrow(error); // Next.js uses some errors internally: let those pass
      throw new ApiError(
        "We couldn't reach the store. Check your connection and try again.",
        0,
      );
    }

    // 2. Read it. A broken server can answer with HTML instead of JSON -> null
    const data: unknown = await response.json().catch((error: unknown) => {
      unstable_rethrow(error);
      return null;
    });
    const errorBody = data as ApiErrorBody | null;

    // 3. Check it. Some failures arrive with a 200 status, so look at the body too
    const failed =
      !response.ok ||
      data === null ||
      errorBody?.status === "fail" ||
      errorBody?.statusMsg === "fail";
    if (!failed) return data as T;

    if (response.ok || response.status >= 500) {
      // Not the user's fault, so don't show them the server's technical message
      throw new ApiError(
        "The store is having a problem right now. Please try again in a moment.",
        response.ok ? 502 : response.status,
      );
    }
    if (response.status === 401 && auth) {
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
    throw new ApiError(
      getApiMessage(errorBody) ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  // ---------- Products (public, no token needed) ----------

  getProducts(): Promise<ProductResponse> {
    return this.#request("/api/v1/products");
  }

  getProductDetails(productId: string): Promise<ProductDetailsResponse> {
    return this.#request("/api/v1/products/" + productId);
  }

  // ---------- Cart (all need the user's token) ----------

  addProductToCart(productId: string): Promise<CartResponse> {
    return this.#request("/api/v2/cart", { method: "POST", body: { productId }, auth: true });
  }

  async getUserCart(): Promise<CartResponse> {
    try {
      return await this.#request<CartResponse>("/api/v2/cart", { auth: true });
    } catch (error) {
      // 404 = this user never added anything. That's an empty cart, not a problem
      if (error instanceof ApiError && error.status === 404) {
        return { status: "success", message: "", numOfCartItems: 0, cartId: "" };
      }
      throw error;
    }
  }

  removeProductFromCart(productId: string): Promise<CartResponse> {
    return this.#request("/api/v2/cart/" + productId, { method: "DELETE", auth: true });
  }

  clearProductsFromCart(): Promise<CartResponse> {
    return this.#request("/api/v2/cart", { method: "DELETE", auth: true });
  }

  updateProductCount(productId: string, count: number): Promise<CartResponse> {
    return this.#request("/api/v2/cart/" + productId, {
      method: "PUT",
      body: { count },
      auth: true,
    });
  }

  // ---------- Orders ----------

  // Card: creates a Stripe session. `url` is where Stripe sends the customer afterwards
  Checkout(
    cartId: string,
    shippingAddress: { shippingAddress: ShippingAddress },
  ): Promise<CheckoutResponse> {
    return this.#request(
      `/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(getSiteUrl())}`,
      { method: "POST", body: shippingAddress, auth: true },
    );
  }

  // Cash on delivery: creates the order straight away (no Stripe page).
  // The API also empties the user's cart when it succeeds
  createCashOrder(
    cartId: string,
    shippingAddress: { shippingAddress: ShippingAddress },
  ): Promise<CashOrderResponse> {
    return this.#request("/api/v2/orders/" + cartId, {
      method: "POST",
      body: shippingAddress,
      auth: true,
    });
  }

  // Step 1: send the token, get back the user it belongs to (decoded.id is the user id)
  verifyToken(): Promise<VerifyTokenResponse> {
    return this.#request("/api/v1/auth/verifyToken", { auth: true });
  }

  // Step 2: use that user id to get the user's orders
  getUserOrders(userId: string): Promise<OrdersResponse> {
    return this.#request("/api/v1/orders/user/" + userId);
  }

  // ---------- Auth ----------

  Signin(email: string, password: string): Promise<SigninResponse> {
    return this.#request("/api/v1/auth/signin", { method: "POST", body: { email, password } });
  }

  // ---------- Categories & brands (public, no token needed) ----------

  // The API sends at most 50 items per request (there are 56 products, 54 brands),
  // so this asks for page 1, sees how many pages exist, then gets the rest at the same time
  async #getAllPages<T>(path: string): Promise<T[]> {
    const separator = path.includes("?") ? "&" : "?";
    const getPage = (page: number): Promise<ResponseT<T>> =>
      this.#request(`${path}${separator}limit=50&page=${page}`);

    const firstPage = await getPage(1);
    const otherPageNumbers = Array.from(
      { length: Math.max(0, (firstPage.metadata?.numberOfPages ?? 1) - 1) },
      (_, index) => index + 2, // [2, 3, ...]
    );
    const otherPages = await Promise.all(otherPageNumbers.map(getPage));

    // [[...page 1], [...page 2]] -> [...all items]
    return [firstPage, ...otherPages].flatMap((page) => page.data ?? []);
  }

  getCategories(): Promise<CategoriesResponse> {
    return this.#request("/api/v1/categories");
  }

  getCategory(categoryId: string): Promise<CategoryResponse> {
    return this.#request("/api/v1/categories/" + categoryId);
  }

  // Plain /subcategories returns nothing on this API, so we always filter by category
  getSubcategories(categoryId: string): Promise<SubcategoriesResponse> {
    return this.#request("/api/v1/subcategories?category=" + categoryId);
  }

  // All brands from every page
  getBrands(): Promise<BrandI[]> {
    return this.#getAllPages<BrandI>("/api/v1/brands");
  }

  getBrand(brandId: string): Promise<BrandResponse> {
    return this.#request("/api/v1/brands/" + brandId);
  }

  // All products, or only one category's / brand's products
  getAllProducts(filter: { category?: string; brand?: string } = {}): Promise<ProductI[]> {
    let path = "/api/v1/products";
    if (filter.category) path += "?category[in]=" + filter.category;
    else if (filter.brand) path += "?brand=" + filter.brand;
    return this.#getAllPages<ProductI>(path);
  }

  // ---------- Addresses (all need the user's token) ----------

  getAddresses(): Promise<AddressesResponse> {
    return this.#request("/api/v1/addresses", { auth: true });
  }

  // Returns ONE address by its id
  getAddress(addressId: string): Promise<AddressResponse> {
    return this.#request("/api/v1/addresses/" + addressId, { auth: true });
  }

  // Returns the FULL list, with the new address at the end
  addAddress(address: AddressInput): Promise<AddressesResponse> {
    return this.#request("/api/v1/addresses", { method: "POST", body: address, auth: true });
  }

  // Returns only the edited address.
  // Careful: the API ignores "name" here, it only updates details/phone/city
  updateAddress(addressId: string, address: AddressInput): Promise<AddressResponse> {
    return this.#request("/api/v1/addresses/" + addressId, {
      method: "PUT",
      body: address,
      auth: true,
    });
  }

  // Returns the FULL list without the removed address
  removeAddress(addressId: string): Promise<AddressesResponse> {
    return this.#request("/api/v1/addresses/" + addressId, { method: "DELETE", auth: true });
  }
}

const apiServices = new ApiServices();
export default apiServices;
