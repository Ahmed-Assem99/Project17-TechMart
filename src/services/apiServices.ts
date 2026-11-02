class ApiServices{

    async getProducts(){
        const response =await fetch (process.env.BASE_URL+ "/api/v1/products")
        const {data} = await response.json()

console.log(data)

        return data
    }
}

const apiServices = new ApiServices ()
export default apiServices