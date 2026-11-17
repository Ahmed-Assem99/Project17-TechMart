import { BrandI, CategoryI, ProductI, SubcategoryI } from "@/interfaces/product";

// The shape every list endpoint returns (products, categories, brands, ...)
export type ResponseT<T> = {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number; // missing on the last page
    prevPage?: number; // missing on the first page
  };
  data: T[];
};


export type ProductResponse = ResponseT<ProductI>
export type ProductDetailsResponse = {data:ProductI}

export type CategoriesResponse = ResponseT<CategoryI>
export type SubcategoriesResponse = ResponseT<SubcategoryI>
export type BrandsResponse = ResponseT<BrandI>

// GET one category/brand by id. A wrong id gives 404 with statusMsg "fail" and no data
export type CategoryResponse = { data?: CategoryI; statusMsg?: string; message?: string }
export type BrandResponse = { data?: BrandI; statusMsg?: string; message?: string }

export type CartResponse = {
  status:         string;
  message:        string;
  numOfCartItems: number;
  cartId:         string;
  data:           Data;
  statusMsg: string;
}

export interface Data {
  _id:            string;
  cartOwner:      string;
  products:       ProductElement[];
  createdAt:      Date;
  updatedAt:      Date;
  __v:            number;
  totalCartPrice: number;
}

export interface ProductElement {
  count:   number;
  _id:     string;
  product: ProductProduct;
  price:   number;
}

export interface ProductProduct {
  subcategory:    Brand[];
  _id:            string;
  title:          string;
  slug:           string;
  quantity:       number;
  imageCover:     string;
  category:       Brand;
  brand:          Brand;
  ratingsAverage: number;
  id:             string;
}

export interface Brand {
  _id:       string;
  name:      string;
  slug:      string;
  image?:    string;
  category?: string;
}

export type CheckoutResponse={
  "status":string;
  "message"?:string; // only on errors
  "statusMsg"?:string; // "fail" on errors
  "session":{
    "url":string,
    "success_url":string,
    "cancel_url":string
  }
}
export type SigninResponse = {
  statusMsg?:string
  message: string;
  user:    User;
  token:   string;
}

export interface User {
  name:  string;
  email: string;
  role:  string;
}

// POST /api/v2/orders/:cartId -> a cash order, created right away (no payment page)
export type CashOrderResponse = {
  status:     string; // "success"
  data?:      OrderI; // the new order
  message?:   string; // only on errors
  statusMsg?: string; // "fail" on errors
}

// GET /api/v1/auth/verifyToken -> who owns this token
export type VerifyTokenResponse = {
  message: string; // "verified" when the token is valid
  statusMsg?: string; // "fail" when the token is invalid
  decoded: {
    id:   string; // the user id we need for the orders API
    name: string;
    role: string;
    iat:  number; // issued at (seconds)
    exp:  number; // expires at (seconds)
  };
}

// GET /api/v1/orders/user/:userId -> returns a plain array of these (no wrapper object)
export type OrdersResponse = OrderI[]

export interface OrderI {
  _id:               string;
  id:                number; // short readable order number
  user:              { _id: string; name: string; email: string; phone: string };
  cartItems:         OrderItem[];
  shippingAddress?:  ShippingAddress; // some old orders don't have one
  taxPrice:          number;
  shippingPrice:     number;
  totalOrderPrice:   number;
  paymentMethodType: "cash" | "card";
  isPaid:            boolean;
  isDelivered:       boolean;
  paidAt?:           string;
  createdAt:         string;
  updatedAt:         string;
}

export interface OrderItem {
  _id:     string;
  count:   number;
  price:   number; // price of ONE piece
  product: {
    _id:            string;
    id:             string;
    title:          string;
    imageCover:     string;
    category:       Brand;
    brand:          Brand;
    subcategory:    Brand[];
    ratingsAverage: number;
    ratingsQuantity: number;
  };
}

// A saved address from /api/v1/addresses
export interface AddressI {
  _id:     string;
  name:    string; // a label the user picks, e.g. "Home" or "Work"
  details: string;
  phone:   string;
  city:    string;
}

// What we send when adding/editing an address (no _id, the API creates it)
export type AddressInput = Omit<AddressI, "_id">

// GET list, POST add, and DELETE all return the user's FULL list of addresses
export type AddressesResponse = {
  status:     string; // "success"
  message?:   string;
  results?:   number;
  data:       AddressI[];
  statusMsg?: string; // "fail" on errors
}

// GET one and PUT edit return just that ONE address
export type AddressResponse = {
  status:     string;
  message?:   string;
  data:       AddressI;
  statusMsg?: string;
}

export interface ShippingAddress {
  details:     string;
  phone:       string;
  city:        string;
  postalCode?: string;
}
