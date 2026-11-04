"use client"
import { LoaderCircle, ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from '../ui/toast';
import apiServices from '@/services/apiServices';
import { ProductI } from '@/interfaces/product';

export default function AddToCartBtn(product:ProductI) {
      const [isAdding, setIsAdding] = useState(false);
     async function addProductToCart(){
    setIsAdding(true)
    try {
      const response = await apiServices.addProductToCart(product._id)
      toast.add({
        title:response.status ?? response.statusMsg,
        description:response.message
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
