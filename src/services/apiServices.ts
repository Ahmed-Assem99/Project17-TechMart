
import { CartResponse, ProductDetailsResponse, ProductResponse } from "@/types/response"


class ApiServices{

    #headers ={
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZTlkN2NhY2ZlYTNkMDAxMzA4Mjk3MyIsIm5hbWUiOiJBaG1lZCBBc3NlbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkzNzEwMDI2LCJleHAiOjE4MDE0ODYwMjZ9.caTLXoHQfobIPc412EJN2yA4Uj0mUMLRO-_U9F6XuvM",
        "content-type":"application/json"
    }

    async getProducts():Promise<ProductResponse>{
        const response =await fetch (process.env.NEXT_PUBLIC_BASE_URL+"/api/v1/products")
        const data = await response.json()

        return data
    }
    getProductDetails(productId:string):Promise<ProductDetailsResponse>{
        return fetchProductDetails(productId)
    }
    
    async addProductToCart(productId:string):Promise<CartResponse>{
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/v2/cart",{
            body:JSON.stringify({
                productId
            }),
            headers:this.#headers,
            method:"post"
        })
        const data = await response.json()

        return data;
    }
}

// "use cache" isn't allowed on class instance methods, so the cached fetch lives here
async function fetchProductDetails(productId:string):Promise<ProductDetailsResponse>{


    const response =await fetch (process.env.NEXT_PUBLIC_BASE_URL+"/api/v1/products/"+productId)
    const data = await response.json()

    return data
}

const apiServices = new ApiServices ()
export default apiServices