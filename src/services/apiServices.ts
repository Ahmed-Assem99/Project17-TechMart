import { cacheLife } from "next/cache"
import { ProductDetailsResponse, ProductResponse } from "@/types/response"


class ApiServices{

    async getProducts():Promise<ProductResponse>{
        const response =await fetch (process.env.BASE_URL+"/api/v1/products")
        const data = await response.json()

        return data
    }
    getProductDetails(productId:string):Promise<ProductDetailsResponse>{
        return fetchProductDetails(productId)
    }
}

// "use cache" isn't allowed on class instance methods, so the cached fetch lives here
async function fetchProductDetails(productId:string):Promise<ProductDetailsResponse>{
    "use cache"
    cacheLife("hours")
    const response =await fetch (process.env.BASE_URL+"/api/v1/products/"+productId)
    const data = await response.json()

    return data
}

const apiServices = new ApiServices ()
export default apiServices