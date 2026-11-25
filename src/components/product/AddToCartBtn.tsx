"use client"
import { LoaderCircle, ShoppingCart } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Button } from '../ui/button'
import { toast } from '../ui/toast';
import apiServices from '@/services/apiServices';
import { ProductI } from '@/interfaces/product';
import { counterContext } from '@/contexts/counterContext';
import { getErrorMessage } from '@/lib/apiError';

export default function AddToCartBtn(product:ProductI) {
  const {setNumOfCartItems}=useContext(counterContext)
      const [isAdding, setIsAdding] = useState(false);
     async function addProductToCart(){
    setIsAdding(true)
    try {
      const response = await apiServices.addProductToCart(product._id)
      setNumOfCartItems(response.numOfCartItems)
      toast.add({
        type:"success",
        title:"Added to cart",
        description:response.message
      })
    } catch (error) {
      toast.add({
        type:"error",
        title:"Couldn't add to cart",
        description:getErrorMessage(error)
      })
    } finally {
      setIsAdding(false)
    }
  }
  return (
          <Button onClick={addProductToCart} disabled={isAdding} className="w-full h-full py-2 px-2">
            {isAdding ? <LoaderCircle className="animate-spin" /> : <ShoppingCart />}
            {isAdding ? "Adding..." : "Add to cart"}
          </Button>
  )
}
