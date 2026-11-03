import { ProductI } from "@/interfaces/product";

type ResponseT<T> = {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage: number;
    prevPage:number;
  };
  data: T[];
};


export type ProductResponse = ResponseT<ProductI>
export type ProductDetailsResponse = {data:ProductI}

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
